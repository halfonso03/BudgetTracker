USE [BudgetTracker_PROD]
GO

/****** Object:  StoredProcedure [dbo].[usp_GetBudgetSurplusBurnRateReport]    Script Date: 11/9/2026 4:20:22 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


create PROCEDURE [dbo].[usp_GetBudgetSurplusBurnRateReportByAccount]
    @initiativeId INT = 6,
    @grantId INT = 1
AS
BEGIN

    ;WITH 
    -- ==========================================
    -- PART 1: BURN-RATE & RUNWAY PREDICTOR CTEs
    -- ==========================================
    MonthlySpending AS (
        SELECT 
            c.id category_id,
            a.id account_id,
            c.name CategoryName,
            a.name AccountName,
            DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0) AS ExpenseMonth,
            SUM(l.amount) AS MonthlyTotal,
            g.year grant_year
        FROM tblDisb d 
        JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblGrant g ON g.id = l.grant_id
        JOIN tblAccount a ON a.id = l.account_id
        JOIN tblCategory c ON c.id = a.category_id
        WHERE d.posted = 1
            AND l.initiative_id = @initiativeId
            AND l.grant_id = @grantId
        GROUP BY c.id, a.id, c.name, a.name, DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0), g.year
    ),

    CumulativeBurn AS (
        SELECT 
            ms.CategoryName, ms.AccountName, ms.category_id, ms.account_id,
            b.TotalAllocation,
            ms.ExpenseMonth,
            ms.MonthlyTotal,
            ms.grant_year AS GrantYear,
            SUM(ms.MonthlyTotal) OVER (
                PARTITION BY b.category_id, b.account_id
                ORDER BY ms.ExpenseMonth
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS CumulativeSpent,
            (b.TotalAllocation - SUM(ms.MonthlyTotal) OVER (
                PARTITION BY b.category_id, b.account_id
                ORDER BY ms.ExpenseMonth
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            )) AS RemainingBalance
        FROM (
            SELECT category_id, account_id, SUM(amount) AS TotalAllocation 
            FROM tblBudget b JOIN tblAccount a ON b.account_id = a.id JOIN tblCategory c ON c.id = a.category_id
            WHERE item_type IN ('B', 'R')
                AND b.initiative_id = @initiativeId
                AND b.grant_id = @grantId
            GROUP BY category_id, account_id
        ) b
        RIGHT OUTER JOIN MonthlySpending ms ON ms.category_id = b.category_id AND ms.account_id = b.account_id
    ),

    BurnRateVelocity AS (
        SELECT 
            ms.CategoryName,
            ms.AccountName,
            ms.category_id,
            ms.account_id,
            ms.grant_year GrantYear,
            AVG(MonthlyTotal) AS AvgMonthlyBurnRate,
            (COUNT(*) * SUM(MonthlyTotal * CAST(MONTH(ExpenseMonth) AS FLOAT)) - SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)) * SUM(MonthlyTotal)) 
            / 
            NULLIF((COUNT(*) * SUM(POWER(CAST(MONTH(ExpenseMonth) AS FLOAT), 2)) - POWER(SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)), 2)), 0) AS SpendingTrajectorySlope
        FROM MonthlySpending ms
        GROUP BY ms.CategoryName, ms.AccountName, ms.category_id, ms.account_id, ms.grant_year
    ),

    MostRecentStatus AS (
        SELECT 
            cb.*,
            ROW_NUMBER() OVER (PARTITION BY cb.category_id, cb.account_id ORDER BY cb.ExpenseMonth DESC) AS rn
        FROM CumulativeBurn cb
    ),

    BurnRateFinal AS (
        SELECT 
            mrs.CategoryName,
            mrs.AccountName,
            mrs.category_id,
            mrs.account_id,
            mrs.TotalAllocation,
            mrs.CumulativeSpent,
            mrs.RemainingBalance,
            mrs.GrantYear,
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
        JOIN BurnRateVelocity v ON mrs.category_id = v.category_id AND mrs.account_id = v.account_id
        WHERE mrs.rn = 1
    ),

    -- ==========================================
    -- PART 2: BUDGET SURPLUS SCORING CTEs
     BudgetContext AS (
            SELECT a.name AccountName, 
                c.name CategoryName, 
                category_id, 
                account_id, 
                g.name grant_name, 
                g.start_date AwardStartDate, 
                g.end_date AwardEndDate, 
                SUM(amount) AS total_budget,
                DATEDIFF(month, g.end_date, g.start_date) total_months_duration,
                g.year AS GrantYear
            FROM tblBudget b JOIN tblAccount a ON b.account_id = a.id JOIN tblCategory c ON c.id = a.category_id
                JOIN tblGrant g ON g.id = b.grant_id
            WHERE item_type IN ('B', 'R')
                AND b.initiative_id = @initiativeId
                AND b.grant_id = @grantId
            GROUP BY category_id, account_id, g.name, g.start_date, g.end_date, a.name, c.name, g.year
    ),
    Spent AS (
        SELECT 
            c.id category_id,
            a.id account_id,
            SUM(l.amount) actual_spent_to_date
        FROM tblDisb d 
            JOIN tblDisbLineItem l ON d.id = l.disb_id
            JOIN tblAccount a ON a.id = l.account_id
            JOIN tblCategory c ON c.id = a.category_id
            JOIN tblGrant g ON g.id = l.grant_id
        WHERE d.posted = 1 
            AND l.initiative_id = @initiativeId AND l.grant_id = @grantId 
        GROUP BY c.id, a.id
    ),
    BudgetAgainstSpent AS (
        SELECT CategoryName,
            AccountName,
            b.category_id,
            b.account_id,
            b.GrantYear,
            AwardStartDate,
            AwardEndDate,
            total_budget,
            ISNULL(actual_spent_to_date, 0) actual_spent_to_date
        FROM BudgetContext b LEFT OUTER JOIN Spent s ON b.account_id = s.account_id
    ),
    timeline_calc AS (
        SELECT
            CategoryName,
            AccountName,
            category_id,
            account_id,
            AwardStartDate,
            AwardEndDate,
            total_budget,
            GrantYear,
            actual_spent_to_date,
            (total_budget - actual_spent_to_date) AS remaining_budget,
            CASE
                --WHEN DATEDIFF(month, AwardStartDate, GETDATE()) > 24 THEN 24
                WHEN DATEDIFF(month, AwardStartDate, GETDATE()) < 1 THEN 1
                ELSE DATEDIFF(month, AwardStartDate, GETDATE())
            END AS months_elapsed,
            DATEDIFF(month, GETDATE(), AwardEndDate) months_remaining
        FROM BudgetAgainstSpent
    ),

    pct_metrics AS (
        SELECT
            CategoryName,
            AccountName,
            category_id,
            account_id,
            AwardStartDate,
            AwardEndDate,
            total_budget TotalAllocation,
            actual_spent_to_date,
            remaining_budget,
            months_elapsed,
            GrantYear,
            ((CAST(months_elapsed AS NUMERIC(5,2)) / DATEDIFF(month, AwardStartDate, AwardEndDate ))) * 100.0 AS PercentTimeElapsed,
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
            CategoryName,
            AccountName,
            category_id,
            account_id,
            GrantYear,
            AwardStartDate,
            AwardEndDate,
            months_elapsed AS CurrentMonth,
            months_remaining AS MonthsRemaining,
            ROUND(PercentTimeElapsed, 1) AS PercentTimeElapsed,
            TotalAllocation,
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
            CAST((ROUND(pct_budget_remaining, 1) - 100) / ROUND(PercentTimeElapsed, 1) AS NUMERIC(5,2)) SimpleSlope
        FROM urgency_calc
    )

    -- ==========================================
    -- FINAL COMBINED RESULT SET
    -- ==========================================
    SELECT 
        ss.CategoryName,
        ss.AccountName, 
        ss.GrantYear,
        ss.AwardStartDate,
        ss.AwardEndDate,
        ss.CurrentMonth,
        DATEDIFF(month, GETDATE(), ss.AwardEndDate) MonthsRemaining,
        ss.PercentTimeElapsed,
        ss.TotalAllocation,
        ISNULL(br.CumulativeSpent, 0) CumulativeSpent,
        ss.TotalAllocation -  ISNULL(br.CumulativeSpent, 0) RemainingBalance ,
        br.MonthsOfRunwayLeft,
        ss.PercentCashLeft,
        ss.SimpleSlope,
        CASE WHEN ISNULL(br.CumulativeSpent, 0)  = 0 THEN 0 ELSE br.CurrentMonthlyBurnRate END CurrentMonthlyBurnRate,
        br.ProjectedExhaustionDate,
        ss.SurplusGapPoints, 
        ss.SurplusScore
    FROM SurplusFinal ss 
    LEFT OUTER JOIN BurnRateFinal br ON 
        br.category_id = ss.category_id 
        AND br.account_id = ss.account_id
     Order by CurrentMonthlyBurnRate
END
GO




[dbo].[usp_GetBudgetSurplusBurnRateReportByAccount] 