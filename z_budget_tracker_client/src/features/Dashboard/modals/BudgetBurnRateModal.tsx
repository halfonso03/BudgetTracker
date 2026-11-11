import { useMemo, useState } from 'react';
import Button from '../../../components/Button';
import Modal2 from '../../../components/Modal2';
import useBudgetSurplusBurnRateByAccount from '../../../api/hooks/dashboard/useBudgetSurplusBurnRateByAccount';
import { ArrowUpDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { GrantHealthScoreCard } from '../GrantHealthScore';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  initiativeId: number;
  grantId: number;
  initiativeName: string;
  grantName: string;
};

const BudgetBurnRateModal = ({
  initiativeId,
  grantId,
  initiativeName,
  grantName,
  ...props
}: Props) => {
  const [animateOut, setAnimateOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [sortField, setSortField] = useState('monthsOfRunwayLeft');

  const { data: burnRateData, isLoading } = useBudgetSurplusBurnRateByAccount(
    initiativeId,
    grantId,
  );

  function closeModal() {
    props.onCancel();
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
    }, 500);
  }
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // const totalAllocated =
  //   burnRateData
  //     ?.map((x) => x.totalAllocation)
  //     .reduce((acc, cur) => acc + cur, 1) ?? 0;

  // const totalSpent =
  //   burnRateData
  //     ?.map((x) => x.cumulativeSpent)
  //     .reduce((acc, cur) => acc + cur, 1) ?? 0;

  // const budgetsInTrouble =
  //   burnRateData
  //     ?.map((x) => ({
  //       i: x.categoryName,
  //       g: x.accountName,
  //       monthsRemaining: x.monthsRemaining,
  //       pct: x.percentCashLeft,
  //       remaining: x.totalAllocation - x.cumulativeSpent,
  //     }))
  //     .filter((x) => x.monthsRemaining <= 6 && x.pct > 90) ?? null;

  // const combinedMonthlySpend =
  //   burnRateData
  //     ?.map((x) => x.currentMonthlyBurnRate)
  //     .reduce((acc, cur) => acc + cur, 1) ?? 0;
  // console.log('burnRateData', burnRateData);

  // const pctBudgetConsumed = (
  //   (1 - (totalAllocated - totalSpent) / totalAllocated) *
  //   100
  // ).toFixed(2);

  const filteredData = useMemo(() => {
    if (isLoading) return [];

    return (
      burnRateData &&
      burnRateData
        .filter((item) => {
          const matchesSearch =
            item.categoryName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.accountName.toLowerCase().includes(searchQuery.toLowerCase());

          if (!matchesSearch) return false;

          // if (riskFilter === 'HIGH_RISK') {
          //   //  .filter((x) => x.monthsRemaining <= 6 && x.pct > 90)
          //   return item.monthsRemaining <= 6 || item.percentCashLeft > 90;
          // }
          // if (riskFilter === 'LOW_RISK') {
          //   return item.monthsOfRunwayLeft >= 4.0 && item.remainingBalance > 0;
          // }

          return true;
        })
        .sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];

          if (typeof aVal === 'string') {
            return sortAsc
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          return sortAsc ? aVal - bVal : bVal - aVal;
        })
    );
  }, [isLoading, burnRateData, searchQuery, sortField, sortAsc]);

  return (
    <Modal2
      size="2xl"
      title="Category & Account Spend-Rate Details "
      animateOut={animateOut}
      {...props}
    >
      <div>
        <div className="flex gap-1 mt-4 mb-2">
          <div className="w-1/12 text-neutral-700 dark:text-slate-400 text-2xl">Intiative</div>
          <div className=" text-nuetral-800 dark:text-white  text-2xl">
            {initiativeName}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1/12 text-neutral-700 dark:text-slate-400  text-2xl">Grant</div>
          <div className="text-nuetral-800 dark:text-white  text-2xl">{grantName}</div>
        </div>

        <div></div>
        <div className="my-8 border-neutral-300 dark:bg-slate-800/90 border dark:border-slate-700/60 rounded-xl overflow-hidden shadow-sm ">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[.9rem]">
              <thead>
                <tr className="bg-neutral-200 dark:bg-slate-900/80 dark:text-slate-400 uppercase text-neutral-600 border-b border-b-neutral-300/40 dark:border-slate-700/80">
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th
                    className=" py-3.5 px-4 font-semibold  cursor-pointer hover:text-white transition-colors w-[15%]"
                    // onClick={() => handleSort('initiativeName')}
                  >
                    <div className="flex items-center gap-1 ">
                      Account <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    // onClick={() => handleSort('totalAllocation')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Budgeted <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Spent
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    // onClick={() => handleSort('remainingBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Remaining <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  {/* <th className="py-3.5 px-4 font-semibold text-right">
                    Months Left
                  </th> */}
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    // onClick={() => handleSort('currentMonthlyBurnRate')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Monthly Spend <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    Exhaustion Date
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    Surplus Scrore
                  </th>
                  {/*       <th
                    className="py-3.5 px-4 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('monthsOfRunwayLeft')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Runway <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                 
                  <th className="py-3.5 px-4 font-semibold">Risk Status</th>*/}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300 dark:divide-slate-700/50 text-lg">
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((row, index) => {
                    const consumedPct = Math.min(
                      100,
                      (row.cumulativeSpent / row.totalAllocation) * 100,
                    );
                    const isExhausted = row.remainingBalance <= 0;
                    // const isHighRisk = row.monthsOfRunwayLeft < 4.0;

                    return (
                      <tr
                        key={index}
                        className="cursor-pointer dark:hover:bg-slate-700/30 transition-colors text-[1rem] text-neutral-800"
                      >
                        {/* Grant Code */}
                        <td className="py-4 px-4 font-mono font-bold text-indigo-500 dark:text-indigo-300">
                          <div className="flex gap-2 justify-between">
                            <div>
                              {index == 0
                                ? row.categoryName
                                : filteredData[index - 1].categoryName ===
                                    row.categoryName
                                  ? ''
                                  : row.categoryName}
                            </div>
                          </div>
                        </td>

                        {/* Initiative Name */}
                        <td className="py-4 px-4 font-medium dark:text-slate-100">
                          {row.accountName}
                        </td>

                        {/* Total Allocation */}
                        <td className="py-4 px-4 text-right font-mono dark:text-slate-200">
                          {formatCurrency(row.totalAllocation)}
                        </td>

                        {/* Consumption Progress bar */}
                        <td className="py-4 px-4 text-right min-w-35">
                          <div className="flex flex-col items-end gap-1">
                            <span className=" font-mono dark:text-slate-300">
                              {consumedPct.toFixed(1)}%
                            </span>
                            <div
                              className={`w-full dark:bg-slate-700 rounded-full h-1.5 overflow-hidden border ${
                                consumedPct >= 90
                                  ? 'border-green-500'
                                  : consumedPct > 45
                                    ? 'border-yellow-500'
                                    : 'border-orange-500'
                              }`}
                            >
                              <div
                                className={`h-full rounded-full ${
                                  consumedPct >= 90
                                    ? 'bg-green-500'
                                    : consumedPct > 50
                                      ? 'bg-yellow-500'
                                      : 'bg-orange-500'
                                }`}
                                style={{ width: `${consumedPct}%` }}
                              ></div>
                            </div>
                            <span className=" dark:text-slate-400 font-mono">
                              Spent: {formatCurrency(row.cumulativeSpent)} {}
                            </span>
                          </div>
                        </td>

                        {/* Remaining Balance */}
                        <td className="py-4 px-4 text-right font-mono font-semibold">
                          <div>
                            <div
                              className={
                                isExhausted
                                  ? 'text-green-400'
                                  : 'dark:text-slate-100'
                              }
                            >
                              {formatCurrency(row.remainingBalance)}
                            </div>
                            <div></div>
                          </div>
                        </td>
                        {/* <td className="py-4 px-4 text-right font-mono font-semibold dark:text-slate-300">
                          {row.monthsRemaining}
                        </td> */}
                        {/* Monthly Burn Rate */}
                        <td className="py-4 px-4 text-center font-mono dark:text-slate-300">
                          {formatCurrency(row.currentMonthlyBurnRate)}/mo
                        </td>
                        <td className="py-4 px-4 font-mono dark:text-slate-300">
                          <div className="flex justify-center items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 dark:text-slate-400 shrink-0" />
                            {format(row.projectedExhaustionDate, 'M/d/yy')}
                          </div>
                        </td>
                        <td className="py-4 px-4 flex justify-center">
                          <GrantHealthScoreCard
                            surplusScore={row.surplusScore}
                            monthsRemaining={row.monthsRemaining}
                            slope={row.simpleSlope}
                            burnRate={row.currentMonthlyBurnRate}
                            monthsOfRunwayLeft={row.monthsOfRunwayLeft}
                            surplusGapPoints={row.surplusGapPoints}
                          ></GrantHealthScoreCard>
                        </td>
                        {/* Runway Months */}
                        {/* <td className="py-4 px-4 text-center font-mono">
                          <span
                            className={`px-2.5 py-1 rounded font-bold  ${
                              isExhausted
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isHighRisk
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {row.monthsOfRunwayLeft.toFixed(1)} mos
                          </span>
                        </td> */}

                        {/* Projected Exhaustion Date */}

                        {/* Risk Status Badge */}
                        {/* <td className="py-4 px-4">
                          {getRiskBadge(
                            row.budgetRiskStatus,
                            row.monthsOfRunwayLeft,
                          )}
                        </td>*/}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-8 text-center dark:text-slate-400 dark:text-sm">
                      No matching grant initiatives found for your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="dark:bg-slate-900/60 px-4 py-3 border-t border-neutral-300 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between  dark:text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              {/* <Info className="w-4 h-4 dark:text-slate-400 shrink-0" /> */}
              {/* <span>
                Spend rate calculated using standard least-squares velocity
                trajectory across fiscal months.
              </span> */}
            </div>
            <div className="text-neutral-500 dark:text-slate-200 text-sm">
              Showing{' '}
              <span className="dark:text-slate-200 font-bold">
                {filteredData !== undefined && filteredData.length && (
                  <span>{filteredData.length}</span>
                )}
              </span>{' '}
              of {burnRateData?.length} Budget Lines
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pb-3">
        <Button variation="secondary" onClick={closeModal}>
          Close
        </Button>
      </div>
    </Modal2>
  );
};
export default BudgetBurnRateModal;
