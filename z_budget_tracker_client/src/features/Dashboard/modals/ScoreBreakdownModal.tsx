import { useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import ScoreCardExplanationExpander from './ScoreCardExplanation';

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
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

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
      <div className="p-2">
        <>
          <div className="grid grid-cols-[1fr_1fr] gap-2 ml-2 ">
            <div className="text-neutral-700 dark:text-slate-300 font-semibold">
              Category
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-300">
              Deduction
            </div>
            <div className="col-span-2 border-b border-neutral-200 dark:border-slate-600"></div>
            <div className="font-semibold text-neutral-700 dark:text-slate-100 my-1">
              Starting Score
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-100">
              100
            </div>
            <div className="flex gap-2 items-center text-neutral-700 dark:text-slate-100 ">
              Surplus Score
              <ScoreCardExplanationExpander
                index={1}
                expandIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                  setExpandedIndexes((prev) => [...prev, index]);
                }}
                collapseIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                }}
              ></ScoreCardExplanationExpander>
            </div>

            <div className="text-neutral-700 dark:text-slate-100 text-end ">
              {surplusScorePenalty}
            </div>
            <div
              className={`col-span-2 pl-3 w-full dark:text-slate-300 italic box ${expandedIndexes.filter((x) => x === 1).length > 0 ? ' expanded ' : ''} `}
            >
              Evaluates how closely your remaining funds aligns with the
              remaining time in the grant lifecycle.
            </div>
            <div className="flex items-center gap-2 text-neutral-700 dark:text-slate-100 ">
              Months Remaining
              <ScoreCardExplanationExpander
                index={2}
                expandIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                  setExpandedIndexes((prev) => [...prev, index]);
                }}
                collapseIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                }}
              ></ScoreCardExplanationExpander>
            </div>
            <div className="text-neutral-700 dark:text-slate-100  text-end ">
              {monthsRemainingPenalty}
            </div>
            <div
              className={`col-span-2 pl-3 w-full dark:text-slate-300 italic box ${expandedIndexes.filter((x) => x === 2).length > 0 ? ' expanded ' : ''} `}
            >
              Establishes your absolute execution deadline. Penalties scale up
              sharply in the final quarters (especially under 6 months
              remaining) when procurement and disbursement windows narrow
            </div>
            <div className="flex items-center gap-2  text-neutral-700 dark:text-slate-100">
              Expenditure Slope
              <ScoreCardExplanationExpander
                index={3}
                expandIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                  setExpandedIndexes((prev) => [...prev, index]);
                }}
                collapseIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                }}
              ></ScoreCardExplanationExpander>
            </div>
            <div className="text-neutral-700 dark:text-slate-100  text-end ">
              {slopePenalty}
            </div>
            <div
              className={`col-span-2 pl-3 w-full dark:text-slate-300 italic box ${expandedIndexes.filter((x) => x === 3).length > 0 ? ' expanded ' : ''} `}
            >
              Expenditure Slope shows the speed and direction of your grant
              spending compared to how much time has passed. A flat slope means
              funds are sitting idle, while a steep downward slope shows your
              funds are actively being put to use.
            </div>
            <div className="flex items-center gap-2 text-neutral-700 dark:text-slate-100">
              Spend Rate
              <ScoreCardExplanationExpander
                index={4}
                expandIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                  setExpandedIndexes((prev) => [...prev, index]);
                }}
                collapseIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                }}
              ></ScoreCardExplanationExpander>
            </div>
            <div className=" text-neutral-700 dark:text-slate-100  text-end ">
              {burnRatePenalty}
            </div>
            <div
              className={`col-span-2 pl-3 w-full dark:text-slate-300 italic box ${expandedIndexes.filter((x) => x === 4).length > 0 ? ' expanded ' : ''} `}
            >
              Your average monthly dollar outflow across active disbursement
              months
            </div>

            <div className="flex items-center gap-2 text-neutral-700 dark:text-slate-100">
              Months of Runaway
              <ScoreCardExplanationExpander
                index={5}
                expandIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                  setExpandedIndexes((prev) => [...prev, index]);
                }}
                collapseIndex={(index: number) => {
                  setExpandedIndexes((prev) => prev.filter((x) => x !== index));
                }}
              ></ScoreCardExplanationExpander>
            </div>
            <div className="text-neutral-700 dark:text-slate-100  text-end ">
              {monthsOfRunwayLeftPenalty}
            </div>
            <div
              className={`col-span-2 pl-3 w-full dark:text-slate-300 italic box ${expandedIndexes.filter((x) => x === 5).length > 0 ? ' expanded ' : ''} `}
            >
              Estimates how long your remaining grant funds will last if you
              continue spending at your current monthly pace. Comparing this
              against the time left in the grant tells you whether you are on
              track to use all your funding or risk leaving unspent money
              behind.
            </div>
            <div className="font-semibold text-neutral-700 dark:text-slate-100">
              Final Score
            </div>
            <div className="font-semibold text-end text-neutral-700 dark:text-slate-100">
              {totalScore}
            </div>
          </div>
        </>
      </div>

      <div className="flex justify-end gap-3 pb-3 mt-5">
        <Button
          variation="secondary"
          onClick={() => {
            setExpandedIndexes([]);
            closeModal();
          }}
        >
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default ScoreBreakdownModal;

//  <div className="text-neutral-700 dark:text-slate-100">
//             Surplus Gap
//           </div>
//           <div className="text-neutral-700 dark:text-slate-100  text-end ">
//             {surplusGapPointsPenalty}
//           </div>
