import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  PieChart,
  ShieldAlert,
  Download,
} from 'lucide-react';
import useBudgetSurplusBurnRate from '../../api/hooks/dashboard/useBudgetSurplusBurnRate';
import { GrantHealthScoreCard } from './GrantHealthScore';
import { format } from 'date-fns';
import BudgetBurnRateModal from './modals/BudgetBurnRateModal';

// Exact Dataset provided from Book2.xlsx analysis

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // ALL, HIGH_RISK, LOW_RISK
  const [sortField, setSortField] = useState('monthsOfRunwayLeft');
  const [sortAsc, setSortAsc] = useState(true);
  const [year, setYear] = useState(2025);
  const [budgetBurnRateModalIsOpen, setBudgetBurnRateModalIsOpen] =
    useState(false);

  const [selectedInitiativeId, setselectedInitiativeId] = useState(0);
  const [selectedGrantId, setSelectedGrantId] = useState(0);

  const { data: burnRateData, isLoading } = useBudgetSurplusBurnRate();

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    if (isLoading) return [];

    return (
      burnRateData &&
      burnRateData
        .filter((x) => x.grantYear === year)
        .filter((item) => {
          const matchesSearch =
            item.grantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.initiativeName
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          if (!matchesSearch) return false;

          if (riskFilter === 'HIGH_RISK') {
            //  .filter((x) => x.monthsRemaining <= 6 && x.pct > 90)
            return item.monthsRemaining <= 6 || item.percentCashLeft > 90;
          }
          if (riskFilter === 'LOW_RISK') {
            return item.monthsOfRunwayLeft >= 4.0 && item.remainingBalance > 0;
          }

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
  }, [
    isLoading,
    burnRateData,
    year,
    searchQuery,
    riskFilter,
    sortField,
    sortAsc,
  ]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const years = useMemo(() => {
    let result: number[] = [];
    if (isLoading) return [];
    if (burnRateData) {
      const step1 = burnRateData.map((x) => x.grantYear);
      const step2 = [...new Set(step1)];
      result = [...step2];
    }
    return result;
  }, [burnRateData, isLoading]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Get Risk Badge Styles
  // const getRiskBadge = (status, runway) => {
  //   if (status.includes('CRITICAL') || runway <= 0) {
  //     return (
  //       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dark:text-sm font-semibold bg-rose-500/10 text-rose-700 border border-rose-200">
  //         <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
  //         CRITICAL: EXHAUSTED
  //       </span>
  //     );
  //   }
  //   if (status.includes('HIGH RISK') || runway < 4.0) {
  //     return (
  //       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dark:text-sm  font-semibold bg-amber-500/10 text-amber-800 border border-amber-300">
  //         <Clock className="w-3.5 h-3.5 text-amber-600" />
  //         HIGH RISK: Depleting
  //       </span>
  //     );
  //   }
  //   return (
  //     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dark:text-sm  font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-200">
  //       <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
  //       LOW RISK: Stable
  //     </span>
  //   );
  // };

  const totalAllocated =
    burnRateData
      ?.filter((x) => x.grantYear === year)
      .map((x) => x.totalAllocation)
      .reduce((acc, cur) => acc + cur, 1) ?? 0;

  const totalSpent =
    burnRateData
      ?.filter((x) => x.grantYear === year)
      .map((x) => x.cumulativeSpent)
      .reduce((acc, cur) => acc + cur, 1) ?? 0;

  const budgetsInTrouble =
    burnRateData
      ?.filter((x) => x.grantYear === year)
      ?.map((x) => ({
        i: x.initiativeName,
        g: x.grantName,
        monthsRemaining: x.monthsRemaining,
        pct: x.percentCashLeft,
        remaining: x.totalAllocation - x.cumulativeSpent,
      }))
      .filter((x) => x.monthsRemaining <= 6 && x.pct > 90) ?? null;

  const combinedMonthlySpend =
    burnRateData
      ?.filter((x) => x.grantYear === year)
      .map((x) => x.currentMonthlyBurnRate)
      .reduce((acc, cur) => acc + cur, 1) ?? 0;
  console.log('burnRateData', burnRateData);

  const pctBudgetConsumed = (
    (1 - (totalAllocated - totalSpent) / totalAllocated) *
    100
  ).toFixed(2);

  return (
    <div className="min-h-screen dark:bg-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8  antialiased">
      <div className=" mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-700 dark:text-white mt-1">
              Budget Spend-Rate Analyzer
            </h1>
            {/* <p className="dark:text-sm dark:text-slate-400 mt-1">
              Linear regression velocity forecasting & fund exhaustion
              trajectory analysis.
            </p> */}
          </div>

          <div className="flex items-center gap-3 ">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 cursor-pointer dark:border-slate-700 px-3.5 py-2 rounded-md border border-neutral-300 text-neutral-700  dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-neutral-600 dark:text-slate-400" />
              Export Brief
            </button>
          </div>
        </div>

        {/* Executive KPI Cards Grid */}

        <div className="flex gap-2">
          {years.map((y) => (
            <button
              className={`cursor-pointer border border-neutral-300/70 dark:border-slate-700/80 rounded-sm dark:text-neutral-300 font-medium text-neutral-500 px-4 py-1 ${year === y ? 'text-neutral-900 bg-neutral-100 dark:bg-slate-800/80 dark:text-white' : ''}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Card 1: Total Allocated */}
          <div className="bg-neutral-100 border-neutral-300/30 dark:bg-slate-800/80  border dark:border-slate-700/60 rounded-md p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-700 dark:text-slate-400">
              <span className="dark:text-sm font-semibold uppercase tracking-wider">
                Total Budgeted
              </span>
              <div className="p-2 rounded-lg dark:bg-indigo-500/20 text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-white mt-3 font-mono">
              {burnRateData && formatCurrency(totalAllocated)}
              <div className="dark:text-indigo-400 text-indigo-400 text-[1rem] mt-5">
                Fiscal Year {year}
              </div>
            </div>
          </div>

          {/* Card 2: Cumulative Spent */}
          <div className="bg-neutral-100 border-neutral-300/30 dark:bg-slate-800/80  border dark:border-slate-700/60 rounded-md p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between dark:text-slate-400">
              <span className="text-neutral-700 dark:text-slate-400 dark:text-sm font-semibold uppercase tracking-wider">
                Total Spent YTD
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-white mt-3 font-mono">
              {burnRateData && formatCurrency(totalSpent)}
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-3 overflow-hidden ">
              <div
                className="bg-blue-500 h-full rounded-full text-neutral-700"
                style={{ width: pctBudgetConsumed + '%' }}
              ></div>
            </div>
            <div className="flex flex-col gap-1 justify-between text-[1.2rem] mt-3 text-neutral-700 dark:text-slate-400 ">
              <div className="text-[1rem]">
                {pctBudgetConsumed} % Budget Consumed
              </div>
              <div className="text-[1rem] font-mono  dark:text-blue-400">
                {formatCurrency(totalAllocated - totalSpent)} Left
              </div>
            </div>
          </div>

          {/* Card 3: Monthly Burn Rate */}
          <div className="bg-neutral-100 border-neutral-300/30 dark:bg-slate-800/80  border dark:border-slate-700/60 rounded-md p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between dark:text-slate-400">
              <span className="text-neutral-700 dark:text-slate-400  dark:text-sm font-semibold uppercase tracking-wider">
                Avg Monthly Spend
              </span>
              <div className="p-2 rounded-lg dark:bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-neutral-800 text-2xl sm:text-3xl font-bold dark:text-white mt-3 font-mono">
              {formatCurrency(combinedMonthlySpend)}
              <span className="dark:text-sm font-normal dark:text-slate-400">
                /mo
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-neutral-700 dark:text-sm dark:text-purple-300">
              <span>Combined Draindown Velocity</span>
            </div>
          </div>

          {/* Card 4: Action Items */}
          <div
            className={`${budgetsInTrouble?.length === 0 && 'opacity-50'} bg-neutral-100 border-neutral-300/30 dark:bg-slate-800/80  border dark:border-slate-700/60 rounded-md p-5 shadow-sm relative overflow-hidden`}
          >
            <div className="flex items-center justify-between dark:text-slate-400">
              <span className="dark:text-sm font-semibold uppercase tracking-wider text-red-500 dark:text-rose-400">
                High Priority
              </span>
              <div className="p-2 rounded-lg dark:bg-rose-500/10 text-red-500 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4 " />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-red-500 dark:text-rose-400 mt-3 font-mono">
              {budgetsInTrouble && (
                <span>{budgetsInTrouble.length} Budgets</span>
              )}
            </div>
            <div className="flex  gap-3 mt-2 text-red-500 dark:text-rose-300/80">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0" />
              <span>
                &lt; 6.0 Months Runway Remaining and over 90% of their total
                budget remains
              </span>
              <div></div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="border border-neutral-300 dark:bg-slate-800/90 dark:border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search Box */}
          <div className="relative  w-full sm:w-80">
            <Search className=" w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search by Grant ID or Initiative..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-neutral-300 w-full dark:bg-slate-900  dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 dark:text-sm dark:text-slate-100 placeholder-neutral-400/80 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-baseline dark:text-sm font-medium dark:text-slate-400 gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-neutral-600 dark:text-slate-400" />{' '}
              <span className="text-neutral-600 dark:text-slate-400">
                Risk Filter:
              </span>
            </div>
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg dark:text-sm font-medium transition-colors shrink-0 text-neutral-600 ${
                riskFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'dark:bg-slate-900 dark:text-slate-400 hover:dark:text-slate-200 border border-neutral-400 dark:border-slate-700'
              }`}
            >
              All Budgets (
              {burnRateData?.filter((x) => x.grantYear === year).length})
            </button>
            <button
              onClick={() => setRiskFilter('HIGH_RISK')}
              className={`px-3 py-1.5 rounded-lg dark:text-sm font-medium transition-colors shrink-0 text-neutral-600 ${
                riskFilter === 'HIGH_RISK'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'dark:bg-slate-900 dark:text-slate-400 hover:dark:text-slate-200 border border-neutral-300 dark:border-slate-700'
              }`}
            >
              Critical / High Risk ({' '}
              {budgetsInTrouble && (
                <span>{budgetsInTrouble.length} Budgets</span>
              )}
              )
            </button>
            <button
              onClick={() => setRiskFilter('LOW_RISK')}
              className={`px-3 py-1.5 rounded-lg dark:text-sm font-medium transition-colors shrink-0 text-neutral-600 ${
                riskFilter === 'LOW_RISK'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'dark:bg-slate-900 dark:text-slate-400 hover:dark:text-slate-200 border border-neutral-300 dark:border-slate-700'
              }`}
            >
              Low Risk (
              {budgetsInTrouble &&
                burnRateData &&
                burnRateData.filter((x) => x.grantYear === year).length -
                  budgetsInTrouble.length}
              )
            </button>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="border-neutral-300 dark:bg-slate-800/90 border dark:border-slate-700/60 rounded-xl overflow-hidden shadow-sm ">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[.9rem]">
              <thead>
                <tr className="bg-neutral-200 dark:bg-slate-900/80 dark:text-slate-400 uppercase text-neutral-600 border-b border-b-neutral-300/40 dark:border-slate-700/80">
                  <th className="py-3.5 px-4 font-semibold">Grant Code</th>
                  <th
                    className=" py-3.5 px-4 font-semibold  cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('initiativeName')}
                  >
                    <div className="flex items-center gap-1 ">
                      Initiative Name <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('totalAllocation')}
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
                    onClick={() => handleSort('remainingBalance')}
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
                    onClick={() => handleSort('currentMonthlyBurnRate')}
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
                        onClick={() => {
                          setBudgetBurnRateModalIsOpen(true);
                          setselectedInitiativeId(row.initiativeId);
                          setSelectedGrantId(row.grantId);
                        }}
                        className="cursor-pointer dark:hover:bg-slate-700/30 transition-colors text-[1rem] text-neutral-800"
                      >
                        {/* Grant Code */}
                        <td className="py-4 px-4 font-mono font-bold text-indigo-500 dark:text-indigo-300">
                          <div className="flex gap-2 justify-between">
                            <div>{row.grantName}</div>

                            <div className="flex items-center gap-2 text-neutral-600 dark:text-slate-500 text-sm">
                              <span>{format(row.awardStartDate, 'M/yy')}</span>-
                              <span>{format(row.awardEndDate, 'M/yy')}</span>
                            </div>
                          </div>

                          <div className="flex flex-col text-neutral-600 dark:text-slate-500 text-sm">
                            <span>
                              {row.monthsRemaining} month
                              {row.monthsRemaining > 1 ? 's' : ''} remaining
                            </span>
                          </div>
                        </td>

                        {/* Initiative Name */}
                        <td className="py-4 px-4 font-medium dark:text-slate-100">
                          {row.initiativeName}
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
              of {burnRateData?.filter((x) => x.grantYear == year).length}{' '}
              Budget Lines
            </div>
          </div>
        </div>
      </div>
      <BudgetBurnRateModal
        isOpen={budgetBurnRateModalIsOpen}
        onCancel={() => {
          setTimeout(() => setBudgetBurnRateModalIsOpen(false), 500);
        }}
        initiativeId={selectedInitiativeId}
        grantId={selectedGrantId}
        initiativeName={
          burnRateData?.filter(
            (x) => x.initiativeId === selectedInitiativeId,
          )[0]?.initiativeName ?? ''
        }
        grantName={
          burnRateData?.filter(
            (x) => x.grantId === selectedGrantId,
          )[0]?.grantName ?? ''
        }
      ></BudgetBurnRateModal>
    </div>
  );
}

// const INITIAL_BUDGET_DATA = [
//   {
//     id: 1,
//     grant: 'G25001',
//     initiative: 'Training',
//     totalAllocation: 400.0,
//     cumulativeSpent: 400.0,
//     remainingBalance: 0.0,
//     currentMonthlyBurnRate: 80.0,
//     monthsOfRunwayLeft: 0.0,
//     projectedExhaustionDate: '2026-11-07',
//     budgetRiskStatus: 'CRITICAL: EXHAUSTED',
//     trajectorySlope: 15.0, // Spending accelerated recently
//   },
//   {
//     id: 2,
//     grant: 'G26001',
//     initiative: 'Management & Coordination',
//     totalAllocation: 14700.0,
//     cumulativeSpent: 7526.0,
//     remainingBalance: 7174.0,
//     currentMonthlyBurnRate: 1881.5,
//     monthsOfRunwayLeft: 3.8,
//     projectedExhaustionDate: '2027-03-01',
//     budgetRiskStatus: 'HIGH RISK: Rapid depletion or accelerating fast',
//     trajectorySlope: 340.5,
//   },
//   {
//     id: 3,
//     grant: 'G26001',
//     initiative: 'Training',
//     totalAllocation: 86600.0,
//     cumulativeSpent: 17937.0,
//     remainingBalance: 68663.0,
//     currentMonthlyBurnRate: 2989.5,
//     monthsOfRunwayLeft: 23.0,
//     projectedExhaustionDate: '2028-09-26',
//     budgetRiskStatus: 'LOW RISK: Stable',
//     trajectorySlope: -45.2,
//   },
//   {
//     id: 4,
//     grant: 'G25001',
//     initiative: 'TAG',
//     totalAllocation: 803.0,
//     cumulativeSpent: 11.0,
//     remainingBalance: 792.0,
//     currentMonthlyBurnRate: 3.67,
//     monthsOfRunwayLeft: 216.0,
//     projectedExhaustionDate: '2044-08-04',
//     budgetRiskStatus: 'LOW RISK: Stable',
//     trajectorySlope: 0.1,
//   },
//   {
//     id: 5,
//     grant: 'G25001',
//     initiative: 'Management & Coordination',
//     totalAllocation: 2506.0,
//     cumulativeSpent: 20.0,
//     remainingBalance: 2486.0,
//     currentMonthlyBurnRate: 3.33,
//     monthsOfRunwayLeft: 745.8,
//     projectedExhaustionDate: '2088-02-09',
//     budgetRiskStatus: 'LOW RISK: Stable',
//     trajectorySlope: 0.05,
//   },
// ];
