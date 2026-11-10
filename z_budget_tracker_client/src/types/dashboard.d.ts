type BudgetSurplusBurnRate = {
  /** Name of the specific budget initiative or line item. */
  initiativeName: string;

  /** Associated Grant or funding source code/name. */
  grantName: string;

  /** Start date of the budget or grant lifecycle. */
  awardStartDate: Date; // ISO date string (e.g., '2023-01-01')

  /** End date of the budget or grant lifecycle. */
  awardEndDate: Date; // ISO date string (e.g., '2023-01-01')

  /** Current active month index in the lifecycle. */
  currentMonth: number;

  /** Percentage of total allocated timeline that has elapsed. */
  percentTimeElapsed: number;

  /** Total financial allocation granted. */
  totalAllocation: number;

  /** Cumulative funds spent to date. */
  cumulativeSpent: number;

  /** Remaining financial balance available. */
  remainingBalance: number;

  /** Percentage of cash remaining relative to total allocation. */
  percentCashLeft: number;

  /** Average monthly burn rate of funds. */
  currentMonthlyBurnRate: number;

  /** Estimated runway remaining in months. */
  monthsOfRunwayLeft: number;

  /** Projected exact date when funds will be fully exhausted. */
  projectedExhaustionDate: string; // ISO date string (e.g., '2026-11-08')

  /** Surplus gap points calculated for budget health tracking. */
  surplusGapPoints: number;

  /** Final calculated budget surplus score. */
  surplusScore: number;

  monthsRemaining: number

  simpleSlope: number
};