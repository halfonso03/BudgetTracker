import { Info } from 'lucide-react';
import React, { useState } from 'react';
import ScoreBreakdownModal from './modals/ScoreBreakdownModal';

// Define the shape of the props
export interface GrantHealthScoreProps {
  surplusScore: number;
  monthsRemaining: number; // Months left in the grant lifecycle (e.g., 24 - currentMonth)
  slope: number; // Simple Slope value
  burnRate: number; // Current monthly burn rate
  monthsOfRunwayLeft: number; // Calculated runway remaining
  surplusGapPoints: number; // Spend-down efficiency gap
}

// Helper to determine the rating category and styling based on the score
// Helper to determine the rating category and styling based on the score
const getScoreDetails = (score: number) => {
  if (score >= 96) {
    return {
      label: 'GREAT',
      color: 'text-green-500 ',
    };
  } else if (score >= 80) {
    return {
      label: 'GOOD',
      color: 'text-green-600 dark:text-green-500 ',
    };
  } else if (score >= 60) {
    return {
      label: 'MODERATE',
      color: 'text-yellow-500 dark:text-yellow-500',
    };
  } else if (score >= 36) {
    return {
      label: 'WARNING',
      color: 'text-orange-500 ',
    };
  } else {
    return {
      label: 'BAD',
      color: 'text-red-500 ',
    };
  }
};
export const GrantHealthScoreCard: React.FC<GrantHealthScoreProps> = ({
  surplusScore,
  monthsRemaining,
  slope,
  burnRate,
  monthsOfRunwayLeft,
  surplusGapPoints,
}) => {
  // 1. Replicate the scoring logic in TypeScript

  const [scoreBreakdownModalIsOpen, setScoreBreakdownModalIsOpen] =
    useState(false);
  let totalScore = 100;

  let surplusScorePenalty = 0;
  let monthsRemainingPenalty = 0;
  let slopePenalty = 0;
  let burnRatePenalty = 0;
  let surplusGapPointsPenalty = 0;
  let monthsOfRunwayLeftPenalty = 0;

  // Surplus Penalties
  if (surplusScore <= 35) surplusScorePenalty -= 6;
  else if (surplusScore <= 50) surplusScorePenalty -= 5;
  else if (surplusScore <= 60) surplusScorePenalty -= 4;
  else if (surplusScore <= 70) surplusScorePenalty -= 3;
  else if (surplusScore <= 80) surplusScorePenalty -= 2;
  else if (surplusScore <= 90) surplusScorePenalty -= 1;

  // Months Remaining Penalties / Bonuses
  if (monthsRemaining >= 23) monthsRemainingPenalty += 2;
  else if (monthsRemaining >= 18) monthsRemainingPenalty += 1;
  else if (monthsRemaining <= 2) monthsRemainingPenalty -= 9;
  else if (monthsRemaining <= 3) monthsRemainingPenalty -= 8;
  else if (monthsRemaining <= 5) monthsRemainingPenalty -= 7;
  else if (monthsRemaining <= 7) monthsRemainingPenalty -= 6;
  else if (monthsRemaining <= 9) monthsRemainingPenalty -= 5;
  else if (monthsRemaining <= 11) monthsRemainingPenalty -= 4;
  else if (monthsRemaining <= 13) monthsRemainingPenalty -= 3;
  else if (monthsRemaining >= 14) monthsRemainingPenalty -= 2;
  else if (monthsRemaining <= 15) monthsRemainingPenalty -= 1;

  // Slope Penalties
  if (slope === 0) slopePenalty -= 18;
  else if (slope >= -0.2) slopePenalty -= 16;
  else if (slope >= -0.4) slopePenalty -= 14;
  else if (slope >= -0.6) slopePenalty -= 12;
  else if (slope >= -0.8) slopePenalty -= 10;
  else if (slope >= -1.0) slopePenalty -= 8;
  else if (slope >= -1.2) slopePenalty -= 6;
  else if (slope >= -1.4) slopePenalty -= 4;
  else if (slope >= -1.6) slopePenalty -= 2;

  // Burn Rate Penalties
  if (burnRate <= 0) burnRatePenalty -= 15;
  else if (burnRate < 50.0) burnRatePenalty -= 8;

  // 5. NEW: Spend-Down Efficiency Gap Penalties (#3)
  if (surplusGapPoints > 30.0) surplusGapPointsPenalty -= 10;
  else if (surplusGapPoints > 15.0) surplusGapPointsPenalty -= 6;
  else if (surplusGapPoints > 0.0) surplusGapPointsPenalty -= 3;

  // 6. NEW: Runway vs. Timeline Discrepancy Penalties (#1)
  // If runway exceeds remaining grant months by a wide margin, funds will linger
  if (monthsOfRunwayLeft > monthsRemaining + 3) monthsOfRunwayLeftPenalty -= 8;
  else if (monthsOfRunwayLeft > monthsRemaining) monthsOfRunwayLeftPenalty -= 4;

  // Clamp boundaries between 0 and 100
  if (totalScore > 100) totalScore = 100;
  if (totalScore < 0) totalScore = 0;

  totalScore +=
    surplusScorePenalty +
    monthsRemainingPenalty +
    slopePenalty +
    burnRatePenalty +
    surplusGapPointsPenalty +
    monthsOfRunwayLeftPenalty;
  // Get UI styling details
  const status = getScoreDetails(totalScore);

  return (
    <div className="flex justify-around  items-center text-neutral-600 dark:text-slate-900/80  dark:bg-transparent max-w-sm">
      <div className="flex items-center gap-2 ">
        <span className="font-bold dark:text-slate-400">{totalScore}</span>
        <span className="text-sm font-medium text-neutral-700 dark:text-slate-400">
          / 100
        </span>
      </div>
      <div className="ml-auto flex justify-end gap-1 ">
        <span
          className={`px-2 text-sm font-medium rounded-sm  ${status.color}`}
        >
          {status.label}
        </span>
        <Info
          size={16}
          className="cursor-pointer animate-repro-fade-in text-neutral-500 dark:text-slate-400"
          onClick={() => setScoreBreakdownModalIsOpen(true)}
        ></Info>
      </div>

      <ScoreBreakdownModal
        isOpen={scoreBreakdownModalIsOpen}
        surplusScorePenalty={surplusScorePenalty}
        monthsRemainingPenalty={monthsRemainingPenalty}
        slopePenalty={slopePenalty}
        burnRatePenalty={burnRatePenalty}
        surplusGapPointsPenalty={surplusGapPointsPenalty}
        monthsOfRunwayLeftPenalty={monthsOfRunwayLeftPenalty}
        onCancel={() => {
          setTimeout(() => {
            setScoreBreakdownModalIsOpen(false);
          }, 500);
        }}
      ></ScoreBreakdownModal>
    </div>
  );
};
