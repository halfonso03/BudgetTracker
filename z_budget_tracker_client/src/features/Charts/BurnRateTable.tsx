import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  PieChart,
  ShieldAlert,
  Info,
  Download,
  Layers,
} from 'lucide-react';

// Exact Dataset provided from Book2.xlsx analysis
const INITIAL_BUDGET_DATA = [
  {
    id: 1,
    grant: 'G25001',
    initiative: 'Training',
    totalAllocation: 400.0,
    cumulativeSpent: 400.0,
    remainingBalance: 0.0,
    currentMonthlyBurnRate: 80.0,
    monthsOfRunwayLeft: 0.0,
    projectedExhaustionDate: '2026-11-07',
    budgetRiskStatus: 'CRITICAL: EXHAUSTED',
    trajectorySlope: 15.0, // Spending accelerated recently
  },
  {
    id: 2,
    grant: 'G26001',
    initiative: 'Management & Coordination',
    totalAllocation: 14700.0,
    cumulativeSpent: 7526.0,
    remainingBalance: 7174.0,
    currentMonthlyBurnRate: 1881.5,
    monthsOfRunwayLeft: 3.8,
    projectedExhaustionDate: '2027-03-01',
    budgetRiskStatus: 'HIGH RISK: Rapid depletion or accelerating fast',
    trajectorySlope: 340.5,
  },
  {
    id: 3,
    grant: 'G26001',
    initiative: 'Training',
    totalAllocation: 86600.0,
    cumulativeSpent: 17937.0,
    remainingBalance: 68663.0,
    currentMonthlyBurnRate: 2989.5,
    monthsOfRunwayLeft: 23.0,
    projectedExhaustionDate: '2028-09-26',
    budgetRiskStatus: 'LOW RISK: Stable',
    trajectorySlope: -45.2,
  },
  {
    id: 4,
    grant: 'G25001',
    initiative: 'TAG',
    totalAllocation: 803.0,
    cumulativeSpent: 11.0,
    remainingBalance: 792.0,
    currentMonthlyBurnRate: 3.67,
    monthsOfRunwayLeft: 216.0,
    projectedExhaustionDate: '2044-08-04',
    budgetRiskStatus: 'LOW RISK: Stable',
    trajectorySlope: 0.1,
  },
  {
    id: 5,
    grant: 'G25001',
    initiative: 'Management & Coordination',
    totalAllocation: 2506.0,
    cumulativeSpent: 20.0,
    remainingBalance: 2486.0,
    currentMonthlyBurnRate: 3.33,
    monthsOfRunwayLeft: 745.8,
    projectedExhaustionDate: '2088-02-09',
    budgetRiskStatus: 'LOW RISK: Stable',
    trajectorySlope: 0.05,
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL'); // ALL, RISK_ONLY, LOW_RISK
  const [sortField, setSortField] = useState('monthsOfRunwayLeft');
  const [sortAsc, setSortAsc] = useState(true);

  // Currency Formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Filter & Sort Logic
  const filteredData = useMemo(() => {
    return INITIAL_BUDGET_DATA.filter((item) => {
      const matchesSearch =
        item.grant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.initiative.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (riskFilter === 'RISK_ONLY') {
        return item.monthsOfRunwayLeft < 4.0 || item.remainingBalance <= 0;
      }
      if (riskFilter === 'LOW_RISK') {
        return item.monthsOfRunwayLeft >= 4.0 && item.remainingBalance > 0;
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [searchQuery, riskFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Get Risk Badge Styles
  const getRiskBadge = (status, runway) => {
    if (status.includes('CRITICAL') || runway <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-rose-500/10 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          CRITICAL: EXHAUSTED
        </span>
      );
    }
    if (status.includes('HIGH RISK') || runway < 4.0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm  font-semibold bg-amber-500/10 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          HIGH RISK: Depleting
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm  font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        LOW RISK: Stable
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8  antialiased">
      <div className=" mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Grant & Initiative Burn-Rate Predictor
            </h1>
            {/* <p className="text-sm text-slate-400 mt-1">
              Linear regression velocity forecasting & fund exhaustion
              trajectory analysis.
            </p> */}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Brief
            </button>
          </div>
        </div>

        {/* Executive KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Allocated */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Total Allocated
              </span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-3 font-mono">
              $105,009.00
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-400">
              <Layers className="w-3.5 h-3.5" />
              Across 5 Active Grant Initiatives
            </div>
          </div>

          {/* Card 2: Cumulative Spent */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Total Spent YTD
              </span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-3 font-mono">
              $25,894.00
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: '24.7%' }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
              <span>24.7% Budget Consumed</span>
              <span className="font-mono text-slate-300">$79,115.00 Left</span>
            </div>
          </div>

          {/* Card 3: Monthly Burn Rate */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-semibold uppercase tracking-wider">
                Avg Monthly Burn
              </span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mt-3 font-mono">
              $4,958.00
              <span className="text-sm font-normal text-slate-400">/mo</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-purple-300">
              <span>Combined Draindown Velocity</span>
            </div>
          </div>

          {/* Card 4: Action Items */}
          <div className="bg-slate-800/80 backdrop-blur border border-rose-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-semibold uppercase tracking-wider text-rose-400">
                High Priority Risk
              </span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400 mt-3 font-mono">
              2 Initiatives
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-rose-300/80">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>&lt; 4.0 Months Runway Remaining</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-800/90 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Grant ID or Initiative..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-sm font-medium text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Risk Filter:
            </span>
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                riskFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              All Grants (5)
            </button>
            <button
              onClick={() => setRiskFilter('RISK_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                riskFilter === 'RISK_ONLY'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              Critical / High Risk (2)
            </button>
            <button
              onClick={() => setRiskFilter('LOW_RISK')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                riskFilter === 'LOW_RISK'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              Low Risk (3)
            </button>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-slate-800/90 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-700/80">
                  <th className="py-3.5 px-4 font-semibold">Grant Code</th>
                  <th className="py-3.5 px-4 font-semibold">Initiative Name</th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('totalAllocation')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Allocation <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Consumption
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('remainingBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Remaining <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('currentMonthlyBurnRate')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Monthly Burn <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 font-semibold text-center cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('monthsOfRunwayLeft')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Runway <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Exhaustion Date</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-lg">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => {
                    const consumedPct = Math.min(
                      100,
                      (row.cumulativeSpent / row.totalAllocation) * 100,
                    );
                    const isExhausted = row.remainingBalance <= 0;
                    const isHighRisk = row.monthsOfRunwayLeft < 4.0;

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        {/* Grant Code */}
                        <td className="py-4 px-4 font-mono font-bold text-indigo-300">
                          {row.grant}
                        </td>

                        {/* Initiative Name */}
                        <td className="py-4 px-4 font-medium text-slate-100">
                          {row.initiative}
                        </td>

                        {/* Total Allocation */}
                        <td className="py-4 px-4 text-right font-mono text-slate-200">
                          {formatCurrency(row.totalAllocation)}
                        </td>

                        {/* Consumption Progress bar */}
                        <td className="py-4 px-4 text-right min-w-35">
                          <div className="flex flex-col items-end gap-1">
                            <span className=" font-mono text-slate-300">
                              {consumedPct.toFixed(1)}%
                            </span>
                            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  consumedPct >= 100
                                    ? 'bg-red-500'
                                    : consumedPct > 50
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${consumedPct}%` }}
                              ></div>
                            </div>
                            <span className="text-[14px] text-slate-400 font-mono">
                              Spent: {formatCurrency(row.cumulativeSpent)}
                            </span>
                          </div>
                        </td>

                        {/* Remaining Balance */}
                        <td className="py-4 px-4 text-right font-mono font-semibold">
                          <span
                            className={
                              isExhausted ? 'text-rose-400' : 'text-slate-100'
                            }
                          >
                            {formatCurrency(row.remainingBalance)}
                          </span>
                        </td>

                        {/* Monthly Burn Rate */}
                        <td className="py-4 px-4 text-right font-mono text-slate-300">
                          {formatCurrency(row.currentMonthlyBurnRate)}/mo
                        </td>

                        {/* Runway Months */}
                        <td className="py-4 px-4 text-center font-mono">
                          <span
                            className={`px-2.5 py-1 rounded font-bold  ${
                              isExhausted
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : isHighRisk
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {row.monthsOfRunwayLeft.toFixed(1)} mos
                          </span>
                        </td>

                        {/* Projected Exhaustion Date */}
                        <td className="py-4 px-4 font-mono text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {row.projectedExhaustionDate}
                          </div>
                        </td>

                        {/* Risk Status Badge */}
                        <td className="py-4 px-4">
                          {getRiskBadge(
                            row.budgetRiskStatus,
                            row.monthsOfRunwayLeft,
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-8 text-center text-slate-400 text-sm"
                    >
                      No matching grant initiatives found for your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-slate-900/60 px-4 py-3 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Burn rate calculated using standard least-squares velocity
                trajectory across fiscal months.
              </span>
            </div>
            <div>
              Showing{' '}
              <span className="text-slate-200 font-bold">
                {filteredData.length}
              </span>{' '}
              of 5 Budget Lines
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
