import { useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import BoxSmall from '../../../components/BoxSmall';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  surplusScorePenalty: number;
  monthsRemainingPenalty: number;
  slopePenalty: number;
  burnRatePenalty: number;
  surplusGapPointsPenalty: number;
  monthsOfRunwayLeftPenalty: number;
};

const ScoreBreakdownModal = ({
  surplusScorePenalty,
  monthsRemainingPenalty,
  slopePenalty,
  burnRatePenalty,
  surplusGapPointsPenalty,
  monthsOfRunwayLeftPenalty,
  ...props
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const totalScore =
    100 +
    surplusScorePenalty +
    monthsRemainingPenalty +
    slopePenalty +
    burnRatePenalty +
    surplusGapPointsPenalty +
    monthsOfRunwayLeftPenalty;
  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }

  return (
    <Modal2
      size="sm"
      title="Score Breakdown"
      animateOut={animateOut}
      {...props}
    >
      <div className='p-3'>
        <BoxSmall>
          <div className="grid grid-cols-[1fr_1fr] gap-4 ml-2 ">
            <div className="text-neutral-700 dark:text-slate-400 font-semibold">
              Category
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-400">
              Deduction
            </div>
            <div className='col-span-2 border-b border-neutral-200 dark:border-slate-600'></div>
            <div className="font-semibold text-neutral-700 dark:text-slate-300">
              Starting Score
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-300">
              100
            </div>
            <div className="text-neutral-700 dark:text-slate-300 ">
              Budget Surplus
            </div>
            <div className="text-neutral-700 dark:text-slate-300 text-end ">
              {surplusScorePenalty}
            </div>
            <div className="text-neutral-700 dark:text-slate-300 ">
              Months Remaining
            </div>
            <div className="text-neutral-700 dark:text-slate-300  text-end ">
              {monthsRemainingPenalty}
            </div>
            <div className="text-neutral-700 dark:text-slate-300">
              Expenditure Slope
            </div>
            <div className="text-neutral-700 dark:text-slate-300  text-end ">
              {slopePenalty}
            </div>
            <div className="text-neutral-700 dark:text-slate-300">
              Spend Rate
            </div>
            <div className="text-neutral-700 dark:text-slate-300  text-end ">
              {burnRatePenalty}
            </div>
            <div className="text-neutral-700 dark:text-slate-300">
              Surplus Gap
            </div>
            <div className="text-neutral-700 dark:text-slate-300  text-end ">
              {surplusGapPointsPenalty}
            </div>
            <div className="text-neutral-700 dark:text-slate-300">
              Months of Runaway
            </div>
            <div className="text-neutral-700 dark:text-slate-300  text-end ">
              {monthsOfRunwayLeftPenalty}
            </div>
            <div className="font-semibold text-neutral-700 dark:text-slate-300">
              Final Score
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-300">
              {totalScore}
            </div>
          </div>
        </BoxSmall>
      </div>

      <div className="flex justify-end gap-3 pb-3 mt-5">
        <Button variation="secondary" onClick={closeModal}>
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default ScoreBreakdownModal;
