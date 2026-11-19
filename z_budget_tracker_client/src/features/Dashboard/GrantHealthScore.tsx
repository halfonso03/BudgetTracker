import { Info } from 'lucide-react';
import React, { useState } from 'react';
import ScoreBreakdownModal from './modals/ScoreBreakdownModal';
import useHealthScore from '../../hooks/useHealthScore';

// Define the shape of the props
export interface GrantHealthScoreProps {
  remainingAmount: number;
  surplusScore: number;
  monthsRemaining: number; // Months left in the grant lifecycle (e.g., 24 - currentMonth)
  slope: number; // Simple Slope value
  burnRate: number; // Current monthly burn rate
  monthsOfRunwayLeft: number; // Calculated runway remaining
  surplusGapPoints: number; // Spend-down efficiency gap
}

export const GrantHealthScoreCard: React.FC<GrantHealthScoreProps> = ({
  surplusScore,
  monthsRemaining,
  slope,
  burnRate,
  monthsOfRunwayLeft,
  surplusGapPoints,
  remainingAmount,
}) => {
  const [scoreBreakdownModalIsOpen, setScoreBreakdownModalIsOpen] =
    useState(false);

  
  const scores = useHealthScore(
    remainingAmount,
    surplusScore,
    monthsRemaining,
    slope,
    burnRate,
    monthsOfRunwayLeft,
    surplusGapPoints,
  );

  const totalScore = scores.totalScore;
  const status = scores.scoreDetails;


  return (
    <div className="flex flex-col gap-2 text-neutral-600 dark:text-slate-900/80  dark:bg-transparent max-w-sm">
      <div className="flex justify-end items-center gap-2 ">
        <span className="font-bold dark:text-slate-400">{totalScore}</span>
        <span className="text-sm font-medium text-neutral-700 dark:text-slate-400">
          / 100
        </span>
        <Info
          size={16}
          className="cursor-pointer animate-repro-fade-in text-neutral-500 dark:text-slate-400"
          onClick={(e) => {
            e.stopPropagation();
            setScoreBreakdownModalIsOpen(true);
          }}
        ></Info>
      </div>
      <div className=" flex justify-center gap-1 ">
        <span
          className={`px-2 text-sm font-medium rounded-sm  ${status.color}`}
        >
          {status.label}
        </span>
      </div>

        <ScoreBreakdownModal
          isOpen={scoreBreakdownModalIsOpen}
          surplusScorePenalty={scores.surplusScorePenalty}
          monthsRemainingPenalty={scores.monthsRemainingPenalty}
          slopePenalty={scores.slopePenalty}
          burnRatePenalty={scores.burnRatePenalty}
          surplusGapPointsPenalty={scores.surplusGapPointsPenalty}
          monthsOfRunwayLeftPenalty={scores.monthsOfRunwayLeftPenalty}
          onCancel={() => {
            setTimeout(() => {
              setScoreBreakdownModalIsOpen(false);
            }, 500);
          }}
        ></ScoreBreakdownModal>
    </div>
  );
};
