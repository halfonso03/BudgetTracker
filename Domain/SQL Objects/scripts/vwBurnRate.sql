USE [BudgetTracker]
GO

/****** Object:  View [dbo].[vwBurnRate]    Script Date: 11/8/2026 11:25:19 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =========================================================================
-- SYSTEM: PROACTIVE BUDGET BURN-RATE & FUND EXHAUSTION PREDICTOR
-- LANGUAGE: T-SQL (Microsoft SQL Server)
-- PURPOSE: Calculates historical velocity and projects exact run-out dates.
-- =========================================================================
CREATE view [dbo].[vwBurnRate]
as
WITH MonthlySpending  (initiative_id, grant_id, InitiativeName, GrantName, ExpenseMonth, MonthlyTotal)
as (
    -- Step 1: Aggregate actual expenses by month and budget line item
    -- Using DATEADD/DATEDIFF to truncate timestamps to the start of the month in T-SQL
    SELECT 
        i.id,
        g.id,
        i.name,
        g.name,
        DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0) AS ExpenseMonth,
        SUM(l.amount) AS MonthlyTotal
    FROM tblDisb d JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblInitiative i ON i.id  = l.initiative_id
        JOIN tblGrant g ON g.id = l.grant_id
    WHERE d.posted = 1 --AND d.posted_date >= DATEADD(year, DATEDIFF(year, 0, GETDATE()), 0) -- Focus on current fiscal year
    GROUP BY i.id, g.id, i.name, g.name, DATEADD(month, DATEDIFF(month, 0, d.posted_date), 0)
),
CumulativeBurn AS (
    -- Step 2: Calculate running totals and remaining balances
    SELECT 
        ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id,
        b.TotalAllocation,
        ms.ExpenseMonth,
        ms.MonthlyTotal,
        -- Running total of all expenses this fiscal year
        SUM(ms.MonthlyTotal) OVER (
            PARTITION BY b.initiative_id, b.grant_id
            ORDER BY ms.ExpenseMonth
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS CumulativeSpent,
        -- Remaining budget available
        (b.TotalAllocation - SUM(ms.MonthlyTotal) OVER (
            PARTITION BY b.initiative_id , b.grant_id
            ORDER BY ms.ExpenseMonth
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )) AS RemainingBalance
    FROM (SELECT initiative_id, grant_id, SUM(amount)  TotalAllocation FROM tblBudget  WHERE item_type IN ('B', 'R')  GROUP BY initiative_id, grant_id) b
    JOIN MonthlySpending ms ON ms.initiative_id = b.initiative_id and ms.grant_id = b.grant_id
),
BurnRateVelocity AS (
    -- Step 3: Calculate the spending trajectory (slope) using standard T-SQL least-squares formula
    -- Slope formula: (N*SUM(xy) - SUM(x)*SUM(y)) / (N*SUM(x^2) - (SUM(x))^2)
    SELECT 
        ms.InitiativeName,
        ms.GrantName,
        ms.initiative_id,
        ms.grant_id,
        -- Average monthly amount being drained
        AVG(MonthlyTotal) AS AvgMonthlyBurnRate,
        -- Statistical slope tracking if spending is increasing or decreasing over time
        (COUNT(*) * SUM(MonthlyTotal * CAST(MONTH(ExpenseMonth) AS FLOAT)) - SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)) * SUM(MonthlyTotal)) 
        / 
        NULLIF((COUNT(*) * SUM(POWER(CAST(MONTH(ExpenseMonth) AS FLOAT), 2)) - POWER(SUM(CAST(MONTH(ExpenseMonth) AS FLOAT)), 2)), 0) AS SpendingTrajectorySlope
    FROM MonthlySpending ms
    GROUP BY ms.InitiativeName,
        ms.GrantName, ms.initiative_id, ms.grant_id
),MostRecentStatus AS (
    -- Step 4: Isolate the most recent month's data for current runway calculations
    SELECT 
        cb.*,
        ROW_NUMBER() OVER (PARTITION BY cb.initiative_id, cb.grant_id ORDER BY cb.ExpenseMonth DESC) as rn
    FROM CumulativeBurn cb
)

-- Final Step: Generate the manager's predictive burn dashboard
SELECT 
    mrs.InitiativeName,
    mrs.GrantName,
    mrs.initiative_id,
    mrs.grant_id,
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

    -- Project Exact Fund Exhaustion Date (converting fractional months into days)
    CASE 
        WHEN mrs.RemainingBalance <= 0 THEN CAST(GETDATE() AS DATE) -- Already exhausted
        WHEN v.AvgMonthlyBurnRate <= 0 THEN NULL -- Will never run out at current rate
        ELSE DATEADD(day, CAST((mrs.RemainingBalance / v.AvgMonthlyBurnRate) * 30.0 AS INT), CAST(GETDATE() AS DATE))
    END AS ProjectedExhaustionDate,

    -- Risk Level categorization for your manager
    CASE 
        WHEN mrs.RemainingBalance <= 0 THEN 'CRITICAL: EXHAUSTED'
        WHEN (mrs.RemainingBalance / NULLIF(v.AvgMonthlyBurnRate, 0)) < 2.0 OR v.SpendingTrajectorySlope > 1000 
            THEN 'HIGH RISK: Rapid depletion or accelerating fast'
        WHEN (mrs.RemainingBalance / NULLIF(v.AvgMonthlyBurnRate, 0)) < 4.0 
            THEN 'MEDIUM RISK: Running tight'
        ELSE 'LOW RISK: Stable'
    END AS BudgetRiskStatus

FROM MostRecentStatus mrs
JOIN BurnRateVelocity v ON mrs.initiative_id = v.initiative_id and mrs.grant_id = v.grant_id
WHERE mrs.rn = 1 -- Only pull the active, up-to-date trajectory

GO

