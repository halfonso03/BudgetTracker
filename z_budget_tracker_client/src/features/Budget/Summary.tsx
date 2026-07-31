import { Link } from 'react-router-dom';
import { formatCurrency } from '../../app/util';
import { ChevronDownSquare, View } from 'lucide-react';
import useBudgetSummary from '../../api/hooks/useBudgetSummay';
import { useState } from 'react';

interface Props {
  year: number;
}
const Summary = ({ year }: Props) => {
  const { data } = useBudgetSummary(year);

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  return (
    <div>
      <div className="entity-label grid grid-cols-[1fr_1fr_1fr_1fr_1fr_.3fr_.3fr] font-semibold p-3 gap-4 ">
        <div>Initiative</div>
        <div>Grant</div>
        <div className="text-center">Budgeted</div>
        <div className="text-center">Spent</div>
        <div className="text-center">Remaining</div>
        <div className="text-center entity-label">Details</div>
        <div></div>
      </div>
      {data?.map((budget, index) => (
        <div key={index} className="border border-neutral-300 mb-5">
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_.3fr_.3fr]  gap-4 p-3">
            <div className="entity-name">{budget.initiative_name}</div>
            <div className="entity-name">{budget.grant_name}</div>
            <div className="text-center">{formatCurrency(budget.amount)}</div>
            <div className="text-center"></div>
            <div className="text-center"></div>
            <div className="flex justify-center">
              <Link
                to={`${budget.initiative_id}/${budget.grant_id}`}
                className="text-blue-500"
              >
                <View></View>
              </Link>
            </div>
            <div className="flex justify-center">
              <ChevronDownSquare
                className={`text-blue-500 cursor-pointer 
                  ${expandedIndexes.some((x) => x == index) ? 'transition-transform duration-300 ease-in-out rotate-180 ' : 'transition-transform duration-300 ease-in-out rotate-0'}`}
                onClick={() => {
                  if (expandedIndexes.some((x) => x == index)) {
                    setExpandedIndexes((prev) =>
                      prev.filter((x) => x !== index),
                    );
                  } else {
                    setExpandedIndexes((prev) => [...prev, index]);
                  }
                }}
              ></ChevronDownSquare>
            </div>
          </div>

          <div
            className={` pb-0 box ${expandedIndexes.some((x) => x == index) ? ' expanded' : ''}`}
          >
            <div className="p-3 border-t border-t-neutral-200">
              <div className="entity-label mb-2 border-b border-b-neutral-200 pb-2">Category</div>
              <div className="entity-name mb-2">Personnel</div>
              <div className="entity-name mb-2">Fringe</div>
              <div className="entity-name mb-2">Services</div>
              <div className="entity-name mb-2">Supplies</div>
              <div className="entity-name mb-2">Facilities</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Summary;
