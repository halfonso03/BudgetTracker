import { Link } from 'react-router-dom';
import { formatCurrency } from '../../app/util';
import { Glasses } from 'lucide-react';
import useBudgetSummary from '../../api/hooks/useBudgetSummay';

interface Props {
  year: number;
}
const Summary = ({ year }: Props) => {
  const { data } = useBudgetSummary(year);

  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] font-semibold p-3 gap-4">
        <div>Initiative</div>
        <div>Grant</div>
        <div>Budgted Amount</div>
        <div>Spent</div>
        <div>Remaining</div>
        <div className="text-center">Actions</div>
      </div>
      {data?.map((budget, index) => (
        <div key={index}>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr]  gap-4 mb-5 border border-neutral-300 p-3">
            <div>{budget.initiative_name}</div>
            <div>{budget.grant_name}</div>
            <div>{formatCurrency(budget.amount)}</div>
            <div></div>
            <div></div>
            <div className="flex justify-center">
              <Link
                to={`${budget.initiative_id}/${budget.grant_id}`}
                className="text-blue-600"
              >
                <Glasses></Glasses>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Summary;
