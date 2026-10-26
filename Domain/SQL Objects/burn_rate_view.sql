-- =========================================================================
-- SYSTEM: PROACTIVE BUDGET BURN-RATE & FUND EXHAUSTION PREDICTOR
-- LANGUAGE: Pure SQL (No AI Engine Dependencies)
-- PURPOSE: Calculates historical velocity and projects exact run-out dates.
-- =========================================================================

WITH MonthlySpending AS (
    -- Step 1: Aggregate actual expenses by month and budget line item
    SELECT 
        e.BudgetId,
        DATE_TRUNC('month', e.TransactionDate) AS ExpenseMonth,
        SUM(e.Amount) AS MonthlyTotal
    FROM Expenses e
    WHERE e.TransactionDate >= DATE_TRUNC('year', CURRENT_DATE) -- Focus on current fiscal year
    GROUP BY e.BudgetId, DATE_TRUNC('month', e.TransactionDate)
),

CumulativeBurn AS (
    -- Step 2: Calculate running totals and remaining balances
    SELECT 
        b.BudgetId,
        b.BudgetCode,
        b.Description,
        b.TotalAllocation,
        ms.ExpenseMonth,
        ms.MonthlyTotal,
        -- Running total of all expenses this fiscal year
        SUM(ms.MonthlyTotal) OVER (
            PARTITION BY b.BudgetId 
            ORDER BY ms.ExpenseMonth
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS CumulativeSpent,
        -- Remaining budget available
        (b.TotalAllocation - SUM(ms.MonthlyTotal) OVER (
            PARTITION BY b.BudgetId 
            ORDER BY ms.ExpenseMonth
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )) AS RemainingBalance
    FROM Budgets b
    JOIN MonthlySpending ms ON b.BudgetId = ms.BudgetId
),

BurnRateVelocity AS (
    -- Step 3: Calculate the spending trajectory (slope) using linear regression
    -- This determines the average monthly burn acceleration/deceleration
    SELECT 
        BudgetId,
        -- Average monthly amount being drained
        AVG(MonthlyTotal) AS AvgMonthlyBurnRate,
        -- Statistical slope tracking if spending is increasing or decreasing over time
        REGR_SLOPE(MonthlyTotal, EXTRACT(MONTH FROM ExpenseMonth)) AS SpendingTrajectorySlope
    FROM MonthlySpending
    GROUP BY BudgetId
),

MostRecentStatus AS (
    -- Step 4: Isolate the most recent month's data for current runway calculations
    SELECT 
        cb.*,
        ROW_NUMBER() OVER (PARTITION BY cb.BudgetId ORDER BY cb.ExpenseMonth DESC) as rn
    FROM CumulativeBurn cb
)

-- Final Step: Generate the manager's predictive burn dashboard
SELECT 
    mrs.BudgetCode,
    mrs.Description,
    mrs.TotalAllocation,
    mrs.CumulativeSpent,
    mrs.RemainingBalance,
    ROUND(v.AvgMonthlyBurnRate, 2) AS CurrentMonthlyBurnRate,
    
    -- Calculate Months Remaining (Runway)
    CASE 
        WHEN mrs.RemainingBalance <= 0 THEN 0
        WHEN v.AvgMonthlyBurnRate <= 0 THEN 999 -- Funds aren't depleting
        ELSE ROUND(mrs.RemainingBalance / v.AvgMonthlyBurnRate, 1)
    END AS MonthsOfRunwayLeft,

    -- Project Exact Fund Exhaustion Date
    CASE 
        WHEN mrs.RemainingBalance <= 0 THEN CURRENT_DATE -- Already exhausted
        WHEN v.AvgMonthlyBurnRate <= 0 THEN NULL -- Will never run out at current rate
        ELSE CAST(CURRENT_DATE + (INTERVAL '1 month' * (mrs.RemainingBalance / v.AvgMonthlyBurnRate)) AS DATE)
    END AS ProjectedExhaustionDate,

    -- Risk Level categorization for your manager
    CASE 
        WHEN mrs.RemainingBalance <= 0 THEN 'CRITICAL: EXHAUSTED'
        WHEN (mrs.RemainingBalance / v.AvgMonthlyBurnRate) < 2.0 THEN 'HIGH RISK: Out of funds in < 60 days'
        WHEN (mrs.RemainingBalance / v.AvgMonthlyBurnRate) < 4.0 THEN 'MEDIUM RISK: Running tight'
        ELSE 'LOW RISK: Stable'
    END AS BudgetRiskStatus

FROM MostRecentStatus mrs
JOIN BurnRateVelocity v ON mrs.BudgetId = v.BudgetId
WHERE mrs.rn = 1 -- Only pull the active, up-to-date trajectory
ORDER BY MonthsOfRunwayLeft ASC;
