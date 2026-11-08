using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Dashboard
{
    /// <summary>
    /// Represents the combined proactive budget burn-rate predictor and surplus scoring metrics 
    /// for grant initiatives.
    /// </summary>
    public class BudgetSurplusBurnRateDto
    {
        /// <summary>
        /// Name of the specific budget initiative or line item.
        /// </summary>
        public string InitiativeName { get; set; } = string.Empty;

        /// <summary>
        /// Associated Grant or funding source code/name.
        /// </summary>
        public string GrantName { get; set; } = string.Empty;

        /// <summary>
        /// Start date of the budget or grant lifecycle.
        /// </summary>
        public DateTime BudgetStart { get; set; }

        /// <summary>
        /// Current active month index in the lifecycle.
        /// </summary>
        public int CurrentMonth { get; set; }

        /// <summary>
        /// Percentage of total allocated timeline that has elapsed.
        /// </summary>
        public int PercentTimeElapsed { get; set; }

        /// <summary>
        /// Total financial allocation granted.
        /// </summary>
        public decimal TotalAllocation { get; set; }

        /// <summary>
        /// Cumulative funds spent to date.
        /// </summary>
        public decimal CumulativeSpent { get; set; }

        /// <summary>
        /// Remaining financial balance available.
        /// </summary>
        public decimal RemainingBalance { get; set; }

        /// <summary>
        /// Percentage of cash remaining relative to total allocation.
        /// </summary>
        public double PercentCashLeft { get; set; }

        /// <summary>
        /// Average monthly burn rate of funds.
        /// </summary>
        public decimal CurrentMonthlyBurnRate { get; set; }

        /// <summary>
        /// Estimated runway remaining in months.
        /// </summary>
        public double MonthsOfRunwayLeft { get; set; }

        /// <summary>
        /// Projected exact date when funds will be fully exhausted.
        /// </summary>
        public DateTime ProjectedExhaustionDate { get; set; }

        /// <summary>
        /// Surplus gap points calculated for budget health tracking.
        /// </summary>
        public double SurplusGapPoints { get; set; }

        /// <summary>
        /// Final calculated budget surplus score.
        /// </summary>
        public int SurplusScore { get; set; }
    }
}