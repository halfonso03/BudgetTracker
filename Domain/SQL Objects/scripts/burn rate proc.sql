create PROCEDURE dbo.usp_GetBudgetSurplusBurnRateReport
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
            CASE 
                WHEN mrs.RemainingBalance <= 0 THEN 'CRITICAL: EXHAUSTED'
                WHEN (mrs.RemainingBalance / NULLIF(v.AvgMonthlyBurnRate, 0)) < 2.0 OR v.SpendingTrajectorySlope > 1000 
                    THEN 'HIGH RISK: Rapid depletion or accelerating fast'
                WHEN (mrs.RemainingBalance / NULLIF(v.AvgMonthlyBurnRate, 0)) < 4.0 
                    THEN 'MEDIUM RISK: Running tight'
                ELSE 'LOW RISK: Stable'
            END AS BudgetRiskStatus
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
            CAST ('1/1/' + CAST(g.year AS CHAR(4)) AS DATETIME) AS StartDate,
            SUM(l.amount) AS TotalSpent
        FROM tblDisb d 
        JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblInitiative i ON i.id = l.initiative_id
        JOIN tblGrant g ON g.id = l.grant_id
        WHERE d.posted = 1 
        GROUP BY i.id, g.id, i.name, g.name, g.year
    ),

    BudgetContext AS (
        SELECT 
            ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id, ms.StartDate AS BudgetStart,
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
            BudgetStart,
            total_budget,
            actual_spent_to_date,
            (total_budget - actual_spent_to_date) AS remaining_budget,
            CASE
                WHEN DATEDIFF(month, BudgetStart, GETDATE()) > 24 THEN 24
                WHEN DATEDIFF(month, BudgetStart, GETDATE()) < 1 THEN 1
                ELSE DATEDIFF(month, BudgetStart, GETDATE())
            END AS months_elapsed
        FROM BudgetContext
    ),

    pct_metrics AS (
        SELECT
            InitiativeName,
            GrantName,
            initiative_id,
            grant_id,
            BudgetStart,
            total_budget,
            actual_spent_to_date,
            remaining_budget,
            months_elapsed,
            (months_elapsed / 24.0) * 100.0 AS PercentTimeElapsed,
            ((remaining_budget / NULLIF(total_budget, 0))) * 100.0 AS pct_budget_remaining
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
            BudgetStart,
            months_elapsed AS CurrentMonth,
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
            END
        FROM urgency_calc
    )

    -- ==========================================
    -- FINAL COMBINED RESULT SET
    -- ==========================================
    SELECT 
        br.InitiativeName,
        br.GrantName, 
        ss.BudgetStart,
        ss.CurrentMonth,
        ss.PercentTimeElapsed,
        br.TotalAllocation,
        br.CumulativeSpent,
        br.RemainingBalance,
        ss.PercentCashLeft,
        br.CurrentMonthlyBurnRate,
        br.MonthsOfRunwayLeft,
        br.ProjectedExhaustionDate,
        ss.SurplusGapPoints, 
        ss.SurplusScore
    FROM BurnRateFinal br 
    JOIN SurplusFinal ss 
      ON br.initiative_id = ss.initiative_id 
     AND br.grant_id = ss.grant_id;

END
go