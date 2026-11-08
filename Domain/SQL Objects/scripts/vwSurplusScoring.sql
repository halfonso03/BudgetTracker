


alter view vwSurplusScoring
as

WITH Spent  (initiative_id, grant_id, InitiativeName, GrantName, StartDate, TotalSpent)
as (
    -- Step 1: Aggregate actual expenses by month and budget line item
    -- Using DATEADD/DATEDIFF to truncate timestamps to the start of the month in T-SQL
    SELECT 
        i.id,
        g.id,
        i.name,
        g.name,
        CAST ('1/1/' + CAST(g.year AS CHAR(4)) as DATETIME) StartDate,
        SUM(l.amount) AS TotalSpent
    FROM tblDisb d JOIN tblDisbLineItem l ON d.id = l.disb_id
        JOIN tblInitiative i ON i.id  = l.initiative_id
        JOIN tblGrant g ON g.id = l.grant_id
    WHERE d.posted = 1 --AND d.posted_date >= DATEADD(year, DATEDIFF(year, 0, GETDATE()), 0) -- Focus on current fiscal year
    GROUP BY i.id, g.id, i.name, g.name,g.year
),
BudgetContext AS (
    -- Step 2: Calculate running totals and remaining balances
    SELECT 
        ms.InitiativeName, ms.GrantName, ms.initiative_id, ms.grant_id,ms.StartDate BudgetStart,
        b.TotalAllocation total_budget,
        ms.TotalSpent actual_spent_to_date,
        24 AS total_months_duration,
        (b.TotalAllocation - ms.TotalSpent) AS RemainingBalance
    FROM (SELECT initiative_id, grant_id, SUM(amount)  TotalAllocation FROM tblBudget  WHERE item_type IN ('B', 'R')  GROUP BY initiative_id, grant_id) b
    JOIN Spent ms ON ms.initiative_id = b.initiative_id and ms.grant_id = b.grant_id
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
       
        -- Calculate current month in the timeline (Capped at 24, Minimum 1 to avoid division errors)
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
        (remaining_budget / total_budget) * 100.0 AS pct_budget_remaining
    FROM timeline_calc
),
urgency_calc AS (
    SELECT
        *,
        -- The "Surplus Gap": Positive means you have MORE budget left than time left.
        (pct_budget_remaining - (100.0 - PercentTimeElapsed)) AS surplus_gap
    FROM pct_metrics
)
SELECT
    InitiativeName,
    GrantName,
    initiative_id,
    grant_id,
    BudgetStart,
    CurrentMonth           = months_elapsed,
    PercentTimeElapsed        = ROUND(PercentTimeElapsed, 1),
    total_budget,
    cash_left               = ROUND(remaining_budget, 2),
    PercentCashLeft           = ROUND(pct_budget_remaining, 1),
    SurplusGapPoints      = ROUND(surplus_gap, 1),
   
    -- Scoring Range Logic (Prioritizing "Use it or Lose it")
    SurplusScore = CASE
        -- Money is successfully spent near the end of the timeline
        WHEN pct_budget_remaining <= 5.0 THEN 100
       
        -- On track or spending faster than the time wall (Perfect for your goal)
        WHEN surplus_gap <= 0 THEN 95
       
        -- Mild surplus compared to time left
        WHEN surplus_gap BETWEEN 0.01 AND 15.00 THEN 80
       
        -- Heavy surplus / Severe underspending warning
        WHEN surplus_gap BETWEEN 15.01 AND 30.00 THEN 60
       
        -- Critical failure: Time is almost up but you are sitting on too much cash
        WHEN surplus_gap > 30.00 THEN 35
       
        ELSE 0
    END

FROM urgency_calc;
