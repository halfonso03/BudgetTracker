USE [BudgetTracker_PROD]
GO

/****** Object:  StoredProcedure [dbo].[usp_GetBudgetSurplusBurnRateReport]    Script Date: 11/9/2026 4:20:22 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[usp_GetBudgetSurplusBurnRateReport]
  @hidtaid INT = 47,
    @year INT = 2024
AS
BEGIN

    ;WITH 
    -- ==========================================
    -- PART 1: BURN-RATE & RUNWAY PREDICTOR CTEs
    -- ==========================================
    MonthlySpending AS (
        SELECT 
            i.id initiative_id,
            g.id grant_id,
            i.name AS InitiativeName,
            g.name AS GrantName,
            DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0) AS ExpenseMonth,
            SUM(l.amount) AS MonthlyTotal
        FROM tblDisb d 
        JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblInitiative i ON i.id = l.initiative_id
        JOIN tblGrant g ON g.id = l.grant_id
        WHERE d.posted = 1
        GROUP BY i.id, g.id, i.name, g.name, DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0)
    ),

    CumulativeBurn AS (
        SELECT 
            ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id,
            b.TotalAllocation,
            ms.ExpenseMonth,
            ms.MonthlyTotal,
            SUM(ms.MonthlyTotal) OVER (
                PARTITION BY b.initiative_id, b.grant_id
                ORDER BY ms.ExpenseMonth
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS CumulativeSpent,
            (b.TotalAllocation - SUM(ms.MonthlyTotal) OVER (
                PARTITION BY b.initiative_id, b.grant_id
                ORDER BY ms.ExpenseMonth
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            )) AS RemainingBalance
        FROM (
            SELECT initiative_id, grant_id, SUM(amount) AS TotalAllocation 
            FROM tblBudget  
            WHERE item_type IN ('B', 'R')
            GROUP BY initiative_id, grant_id
        ) b
        JOIN MonthlySpending ms ON ms.initiative_id = b.initiative_id AND ms.grant_id = b.grant_id
    ),

    BurnRateVelocity AS (
        SELECT 
            ms.InitiativeName,
            ms.GrantName,
            ms.initiative_id,
            ms.grant_id,
            AVG(MonthlyTotal) AS AvgMonthlyBurnRate,
            (COUNT(*) * SUM(MonthlyTotal * CAST(MONTH(ExpenseMonth) AS FLOAT)) - SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)) * SUM(MonthlyTotal)) 
            / 
            NULLIF((COUNT(*) * SUM(POWER(CAST(MONTH(ExpenseMonth) AS FLOAT), 2)) - POWER(SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)), 2)), 0) AS SpendingTrajectorySlope
        FROM MonthlySpending ms
        GROUP BY ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id
    ),

    MostRecentStatus AS (
        SELECT 
            cb.*,
            ROW_NUMBER() OVER (PARTITION BY cb.initiative_id, cb.grant_id ORDER BY cb.ExpenseMonth DESC) AS rn
        FROM CumulativeBurn cb
    ),

    BurnRateFinal AS (
        SELECT 
            mrs.InitiativeName,
            mrs.GrantName,
            mrs.initiative_id,
            mrs.grant_id,
            mrs.TotalAllocation,
            mrs.CumulativeSpent,
            mrs.RemainingBalance,
            ROUND(v.AvgMonthlyBurnRate, 2) AS CurrentMonthlyBurnRate,
            CASE 
                WHEN mrs.RemainingBalance <= 0 THEN 0
                WHEN v.AvgMonthlyBurnRate <= 0 THEN 999 
                ELSE ROUND(mrs.RemainingBalance / v.AvgMonthlyBurnRate, 1)
            END AS MonthsOfRunwayLeft,
            CASE 
                WHEN mrs.RemainingBalance <= 0 THEN CAST(GETDATE() AS DATE) 
                WHEN v.AvgMonthlyBurnRate <= 0 THEN NULL 
                ELSE DATEADD(day, CAST((mrs.RemainingBalance / v.AvgMonthlyBurnRate) * 30.0 AS INT), CAST(GETDATE() AS DATE))
            END AS ProjectedExhaustionDate,
            SpendingTrajectorySlope
        FROM MostRecentStatus mrs
        JOIN BurnRateVelocity v ON mrs.initiative_id = v.initiative_id AND mrs.grant_id = v.grant_id
        WHERE mrs.rn = 1
    ),

    -- ==========================================
    -- PART 2: BUDGET SURPLUS SCORING CTEs
    -- ==========================================
    Spent AS (
        SELECT 
            i.id initiative_id,
            g.id grant_id,
            i.name AS InitiativeName,
            g.name AS GrantName, 
            g.start_date StartDate,
            g.end_date EndDate,
            SUM(l.amount) AS TotalSpent
        FROM tblDisb d 
        JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblInitiative i ON i.id = l.initiative_id
        JOIN tblGrant g ON g.id = l.grant_id
        WHERE d.posted = 1 
        GROUP BY i.id, g.id, i.name, g.name, g.start_date, g.end_date
    ),

    BudgetContext AS (
        SELECT 
            ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id, ms.StartDate AS AwardStartDate, ms.EndDate AS AwardEndDate,
            b.TotalAllocation AS total_budget,
            ms.TotalSpent AS actual_spent_to_date,
            24 AS total_months_duration,
            (b.TotalAllocation - ms.TotalSpent) AS RemainingBalance
        FROM (
            SELECT initiative_id, grant_id, SUM(amount) AS TotalAllocation 
            FROM tblBudget  
            WHERE item_type IN ('B', 'R')
            GROUP BY initiative_id, grant_id
        ) b
        JOIN Spent ms ON ms.initiative_id = b.initiative_id AND ms.grant_id = b.grant_id
    ),

    timeline_calc AS (
        SELECT
            InitiativeName,
            GrantName,
            initiative_id,
            grant_id,
            AwardStartDate,
            AwardEndDate,
            total_budget,
            actual_spent_to_date,
            (total_budget - actual_spent_to_date) AS remaining_budget,
            CASE
                --WHEN DATEDIFF(month, AwardStartDate, GETDATE()) > 24 THEN 24
                WHEN DATEDIFF(month, AwardStartDate, GETDATE()) < 1 THEN 1
                ELSE DATEDIFF(month, AwardStartDate, GETDATE())
            END AS months_elapsed,
            DATEDIFF(month, GETDATE(), AwardEndDate) months_remaining
        FROM BudgetContext
    ),

    pct_metrics AS (
        SELECT
            InitiativeName,
            GrantName,
            initiative_id,
            grant_id,
            AwardStartDate,
            AwardEndDate,
            total_budget,
            actual_spent_to_date,
            remaining_budget,
            months_elapsed,
            (months_elapsed / 24.0) * 100.0 AS PercentTimeElapsed,
            ((remaining_budget / NULLIF(total_budget, 0))) * 100.0 AS pct_budget_remaining,
            months_remaining
        FROM timeline_calc
    ),

    urgency_calc AS (
        SELECT
            *,
            (pct_budget_remaining - (100.0 - PercentTimeElapsed)) AS surplus_gap
        FROM pct_metrics
    ),

    SurplusFinal AS (
        SELECT
            InitiativeName,
            GrantName,
            initiative_id,
            grant_id,
            AwardStartDate,
            AwardEndDate,
            months_elapsed AS CurrentMonth,
            months_remaining AS MonthsRemaining,
            ROUND(PercentTimeElapsed, 1) AS PercentTimeElapsed,
            total_budget,
            ROUND(remaining_budget, 2) AS cash_left,
            ROUND(pct_budget_remaining, 1) AS PercentCashLeft,
            ROUND(surplus_gap, 1) AS SurplusGapPoints,
            SurplusScore = CASE
                WHEN pct_budget_remaining <= 5.0 THEN 100
                WHEN surplus_gap <= 0 THEN 95
                WHEN surplus_gap BETWEEN 0.01 AND 15.00 THEN 80
                WHEN surplus_gap BETWEEN 15.01 AND 30.00 THEN 60
                WHEN surplus_gap > 30.00 THEN 35
                ELSE 0
            END,
            CAST((ROUND(pct_budget_remaining, 1) - 100) / ROUND(PercentTimeElapsed, 1) AS NUMERIC(5,2)) SimpleSLope
        FROM urgency_calc
    )

    -- ==========================================
    -- FINAL COMBINED RESULT SET
    -- ==========================================
    SELECT 
        br.InitiativeName,
        br.GrantName, 
        ss.AwardStartDate,
        ss.AwardEndDate,
        DATEDIFF(m, GETDATE(), ss.AwardEndDate),
        ss.CurrentMonth,
        ss.PercentTimeElapsed,
        br.TotalAllocation,
        br.CumulativeSpent,
        br.RemainingBalance,
        br.MonthsOfRunwayLeft,
        ss.PercentCashLeft,
        ss.SimpleSLope,
        br.CurrentMonthlyBurnRate,
        br.ProjectedExhaustionDate,        
        ss.SurplusGapPoints, 
        ss.SurplusScore      
    FROM BurnRateFinal br 
    JOIN SurplusFinal ss 
      ON br.initiative_id = ss.initiative_id 
     AND br.grant_id = ss.grant_id
     Order by CurrentMonthlyBurnRate
END
GO




[dbo].[usp_GetBudgetSurplusBurnRateReport]