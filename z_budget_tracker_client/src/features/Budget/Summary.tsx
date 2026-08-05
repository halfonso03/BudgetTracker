import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../app/util';
import { ArrowLeftRight, ChevronDownSquare, DollarSign } from 'lucide-react';
import useBudgetSummary from '../../api/hooks/useBudgetSummary.tsx';
import { Fragment, useState } from 'react';
import MenuIdProvider from '../../contexts/MenuIdContext.tsx';

// const grid_columns = '1fr_.5fr_1fr_1fr_1fr_1fr_.5fr_.3fr';

interface Props {
  year: number;
}
const Summary = ({ year }: Props) => {
  const { data, isLoading } = useBudgetSummary(year);
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  const budgetSummaries: BudgetSummary[] = data.map((b) => {
    return {
      initiative_id: b.initiative_id,
      initiative_name: b.initiative!.name,
      grant_id: b.grant_id,
      grant_name: b.grant!.name,
      year: b.year,
      approved_amount: b.account_balances
        .map((i) => i.amount)
        .reduce((acc, cur) => acc + cur, 0),
      current_amount: b.account_balances
        .map((i) => i.current_amount)
        .reduce((acc, cur) => acc + cur, 0),
      spent_amount: b.account_balances
        .map((i) => i.spent_amount)
        .reduce((acc, cur) => acc + cur, 0),
      remaining_amount: b.account_balances
        .map((i) => i.current_amount + i.spent_amount)
        .reduce((acc, cur) => (acc ?? 0) + (cur ?? 0), 0),
    };
  });

  return (
    <MenuIdProvider>
      <div>
        <div
          className={`entity-label grid grid-cols-[1.2fr_.5fr_1fr_1fr_1fr_1fr_.5fr] font-semibold p-3 gap-4 `}
        >
          <div>Initiative</div>
          <div>Grant</div>
          <div className="text-end">Approved Budget</div>
          <div className="text-end">Current Budget</div>
          <div className="text-end">Spent Amount</div>
          <div className="text-end">Remaining Balance</div>
          {/* <div className="text-center entity-label">Details</div> */}
          <div></div>
        </div>
        {budgetSummaries?.map((budget, index) => (
          <div key={index} className=" border border-neutral-300 mb-5">
            <div
              className={`grid grid-cols-[1.2fr_.5fr_1fr_1fr_1fr_1fr_.5fr] gap-4 p-3`}
            >
              <div className="entity-name">{budget.initiative_name}</div>
              <div className="entity-name">{budget.grant_name}</div>
              <div className="text-end underline underline-offset-3 font-semibold">
                <Link
                  to={`${budget.year}/${budget.initiative_id}/${budget.grant_id}`}
                  className="text-blue-500"
                >
                  {formatCurrency(budget.approved_amount)}
                </Link>
              </div>
              <div className="text-end">
                {formatCurrency(budget.current_amount)}
              </div>
              <div className="text-end">
                {formatCurrency(budget.spent_amount)}
              </div>
              <div className="text-end">
                {formatCurrency(budget.remaining_amount)}
              </div>
              <div className="flex justify-center">
                <ChevronDownSquare
                  className={`text-blue-500 cursor-pointer ${expandedIndexes.some((x) => x == index) ? 'transition-transform duration-300 ease-in-out rotate-180 ' : 'transition-transform duration-300 ease-in-out rotate-0'}`}
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
              <CategorySummary
                initiativeId={budget.initiative_id}
                grantId={budget.grant_id}
                items={
                  data.filter((x) => x.initiative_id == budget.initiative_id)[0]
                    .account_balances
                }
              ></CategorySummary>
            </div>
          </div>
        ))}
      </div>
    </MenuIdProvider>
  );
};

interface CategorySummaryProps {
  initiativeId: number;
  grantId: number;
  items: AccountBalance[];
}

function CategorySummary({
  initiativeId,
  grantId,
  items,
}: CategorySummaryProps) {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupedData = items.reduce(
    (accumulator: any, currentItem: AccountBalance) => {
      const key: string = currentItem.category!.name!;

      // Initialize the array if the key doesn't exist yet
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      // Push the current object into the group
      accumulator[key].push(currentItem);

      return accumulator;
    },
    {},
  ); // Empty object is the initial value

  const categoryTotals: {
    category: string;
    amount: number;
    current_amount: number;
    spent_amount: number;
  }[] = Object.entries(groupedData).map(([category, value]) => {
    const items = value as AccountBalance[];
    const budgetTotal = items.reduce((acc, cur) => acc + cur.amount, 0);
    const currentTotal = items.reduce(
      (acc, cur) => acc + cur.current_amount,
      0,
    );
    const spentTotal = items.reduce((acc, cur) => acc + cur.spent_amount, 0);

    return {
      category,
      amount: budgetTotal,
      current_amount: currentTotal,
      spent_amount: spentTotal,
    };
  });

  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  return (
    <div className=" border-t border-t-neutral-300">
      <div className="entity-label mb-2 border-b border-b-neutral-300 p-3 pt-3">
        Category
      </div>
      {categoryTotals.map((c, index) => (
        <div
          className=" relative z-6 border-b border-b-slate-300 last:border-0"
          key={index}
        >
          <div
            className={`py-2 grid grid-cols-[1.2fr_.5fr_1fr_1fr_1fr_1fr_.5fr] gap-4 px-3 mt-2 items-center`}
            key={index}
          >
            <div className="entity-name pl-2 " key={index}>
              {c.category}
            </div>
            <div></div>
            <div className="text-end">{formatCurrency(c.amount)}</div>
            <div className="text-end">{formatCurrency(c.current_amount)}</div>
            <div className="text-end">{formatCurrency(c.spent_amount)}</div>

            <div></div>

            <div className="flex justify-center items-center">
              <ChevronDownSquare
                className={`text-neutral-500 cursor-pointer 
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
            className={`pb-0  box ${expandedIndexes.some((x) => x == index) ? ' expanded' : ''}  mt-1  `}
          >
            <div className=" pl-6 pb-0 font-semibold entity-label">Account</div>
            <div className="relative z-11 grid grid-cols-[1.2fr_.5fr_1fr_1fr_1fr_1fr_.5fr] gap-4 p-3 mt-1 bg-neutral-50 border-t border-t-neutral-300">
              {items
                .filter((x) => x.category?.name == c.category)
                .sort((a, b) => a.account_name.localeCompare(b.account_name))
                .map((i) => (
                  <Fragment key={i.account_id}>
                    <div className="italic pl-3 text-neutral-700">
                      {i.account_name}
                    </div>
                    <div></div>

                    <div className="text-end italic text-neutral-700">
                      {formatCurrency(i.amount)}
                    </div>
                    <div className="text-end italic text-neutral-700">
                      {formatCurrency(i.current_amount)}
                    </div>
                    <div className="text-end italic text-neutral-700">
                      {i.spent_amount !== 0 && formatCurrency(i.spent_amount)}
                    </div>
                    <div></div>
                    <div className="flex justify-around text-blue-500 text-[.9rem] cursor-pointer">
                      <ArrowLeftRight
                        onClick={() => {
                          navigate(
                            `/reprogramming/create/${initiativeId}/${grantId}/${i.account_id}`,
                          );
                        }}
                      ></ArrowLeftRight>
                      <DollarSign
                        onClick={() => {
                          navigate(
                            `/disbusersement/create/${initiativeId}/${grantId}/${i.account_id}`,
                          );
                        }}
                      ></DollarSign>
                      {/* <Menus>
                        <Menus.Toggler id={i.account_id.toString()}>
                          <div className="text-center text-blue-500 text-[.9rem] flex gap-2 justify-around">
                            Actions
                          </div>
                        </Menus.Toggler>
                        <Menus.List id={i.account_id.toString()}>
                          <Menus.MenuItem
                            onClick={() => {
                              navigate(
                                `/reprogramming/create/${initiativeId}/${grantId}/${i.account_id}`,
                              );
                            }}
                          >
                            <span className="text-[.95rem] text-neutral-800">
                              Reprogram Funds
                            </span>
                          </Menus.MenuItem>
                          <Menus.MenuItem
                            onClick={() => {
                              navigate(
                                `/disbusersement/create/${initiativeId}/${grantId}/${i.account_id}`,
                              );
                            }}
                          >
                            <span className="text-[.95rem] text-neutral-800">
                              Disburse Funds
                            </span>
                          </Menus.MenuItem>
                        </Menus.List>
                      </Menus> */}
                    </div>
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Summary;
