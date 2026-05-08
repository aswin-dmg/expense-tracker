import { useMemo, useState } from 'react';
import Topbar from '../components/Topbar.jsx';
import CategoryCards from '../components/CategoryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import TransactionList from '../components/TransactionList.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import AddExpenseModal from '../components/AddExpenseModal.jsx';
import SetLimitModal from '../components/SetLimitModal.jsx';
import Card from '../components/ui/Card.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import { CATEGORIES } from '../data/mockData.js';

/**
 * Dashboard — full-width (no sidebar). Hero with prominent Add Expense.
 *
 * Layout:
 *  - Topbar (brand + search + profile dropdown w/ Settings & Logout)
 *  - Hero row: greeting + big "Add expense" CTA
 *  - Summary row: This Month (with limit progress + month switcher) + Highest Category
 *  - Spending breakdown donut + Recent Transactions
 *  - Category tile grid
 *  - Full expenses table
 */
export default function Dashboard({ expenses, onAddExpense, onDeleteExpense, onLogout, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState(20000); // INR

  // Selected month (YYYY-MM-01). Defaults to current month.
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const isCurrentMonth =
    selectedMonth.getFullYear() === today.getFullYear() &&
    selectedMonth.getMonth() === today.getMonth();

  const goPrevMonth = () =>
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  const goNextMonth = () => {
    if (isCurrentMonth) return;
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  // Expenses scoped to the selected month
  const monthExpenses = useMemo(() => {
  return expenses.filter((e) => {
    const [year, month] = e.date.split('-').map(Number);
    return (
      year === selectedMonth.getFullYear() &&
      month - 1 === selectedMonth.getMonth()
    );
  });
}, [expenses, selectedMonth]);

  const stats = useMemo(() => {
    const monthTotal = monthExpenses.reduce(
  (s, e) => s + Number(e.amount),
  0
);

    const byCat = {};
    monthExpenses.forEach((e) => {byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount);
});
    const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    const topCat = top ? CATEGORIES.find((c) => c.id === top[0]) : null;
    const grandTotal = sorted.reduce((s, [, v]) => s + v, 0);
    const topThree = sorted.slice(0, 3).map(([id, amt]) => ({
      cat: CATEGORIES.find((c) => c.id === id),
      amount: amt,
      pct: grandTotal > 0 ? (amt / grandTotal) * 100 : 0,
    }));

    return {
      monthTotal,
      topCategory: topCat,
      topCategoryAmount: top ? top[1] : 0,
      topCategoryPct: grandTotal > 0 && top ? (top[1] / grandTotal) * 100 : 0,
      topThree,
    };
  }, [monthExpenses]);

  const monthLabel = selectedMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const pct = Math.min(100, (stats.monthTotal / monthlyLimit) * 100);
  const overLimit = stats.monthTotal > monthlyLimit;
  const barColor = overLimit
    ? 'bg-rose-500'
    : pct > 80
      ? 'bg-brand-500'
      : 'bg-sage-500';

  return (
    <div className="min-h-screen bg-paper-100">
      <Topbar
        user={user}
        query={query}
        onQueryChange={setQuery}
        onLogout={onLogout}
        onOpenSettings={() => setLimitOpen(true)}
      />

      <main className="route-fade max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6">
        {/* Hero — greeting + prominent Add Expense */}
        <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink-900 mt-1">
              Hi, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              {isCurrentMonth
                ? "Here's where your money's going this month."
                : `Viewing your spending for ${monthLabel}.`}
            </p>
          </div>
          <Button
            size="lg"
            variant="primary"
            onClick={() => setModalOpen(true)}
            iconLeft={<Icon name="plus" className="w-5 h-5" />}
            className="self-start sm:self-end px-6 shadow-soft-lg"
          >
            Add expense
          </Button>
        </section>

        {/* Summary row — This Month + Highest Category */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 hover:shadow-soft-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon name="calendar" className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-700">
                      {isCurrentMonth ? 'This month spending' : `${monthLabel} spending`}
                    </div>
                    <div className="text-xs text-ink-500">
                      {isCurrentMonth ? monthLabel : 'Past month — read only'}
                    </div>
                  </div>
                </div>
                <div className="num text-3xl md:text-4xl font-semibold tracking-tight text-ink-900 mt-4">
                  ₹{stats.monthTotal.toFixed(2)}
                </div>
                <div className="text-sm text-ink-500 mt-1">
                  of <span className="num font-medium text-ink-700">₹{monthlyLimit.toLocaleString('en-IN')}</span> monthly limit
                </div>
              </div>

              {/* Right side controls — month switcher + (conditional) edit limit */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <div className="inline-flex items-center bg-paper-100 border border-paper-200 rounded-lg h-9 overflow-hidden">
                  <button
                    onClick={goPrevMonth}
                    className="w-9 h-full flex items-center justify-center text-ink-700 hover:bg-paper-200"
                    aria-label="Previous month"
                  >
                    <Icon name="arrow-down" className="w-4 h-4 rotate-90" />
                  </button>
                  <div className="px-2.5 text-xs font-medium text-ink-900 min-w-[6.25rem] text-center">
                    {monthLabel}
                  </div>
                  <button
                    onClick={goNextMonth}
                    disabled={isCurrentMonth}
                    className="w-9 h-full flex items-center justify-center text-ink-700 hover:bg-paper-200 disabled:text-ink-300 disabled:hover:bg-transparent"
                    aria-label="Next month"
                  >
                    <Icon name="arrow-down" className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
                {isCurrentMonth && (
                  <button
                    onClick={() => setLimitOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 h-8 rounded-lg border border-paper-300 text-ink-700 hover:bg-paper-100 transition-colors"
                  >
                    <Icon name="settings" className="w-3.5 h-3.5" />
                    Edit limit
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className={overLimit ? 'text-rose-500 font-medium' : 'text-ink-700 font-medium'}>
                  {pct.toFixed(0)}% used
                </span>
                <span className="num text-ink-500">
                  ₹{Math.max(0, monthlyLimit - stats.monthTotal).toFixed(2)} left
                </span>
              </div>
            </div>
          </Card>

          {/* Highest Category */}
          <Card className="hover:shadow-soft-lg transition-shadow flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={
                  stats.topCategory
                    ? {
                        background: `oklch(95% 0.04 ${stats.topCategory.hue})`,
                        color: `oklch(45% 0.13 ${stats.topCategory.hue})`,
                      }
                    : { background: 'oklch(95% 0.005 90)' }
                }
              >
                <Icon name={stats.topCategory ? stats.topCategory.icon : 'chart'} className="w-[18px] h-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink-700">Highest category</div>
                <div className="text-base font-semibold text-ink-900 truncate">
                  {stats.topCategory ? stats.topCategory.label : '—'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="num text-base font-semibold text-ink-900">
                  ₹{stats.topCategoryAmount.toFixed(0)}
                </div>
                <div className="text-xs text-ink-500">{stats.topCategoryPct.toFixed(0)}% of total</div>
              </div>
            </div>

            {/* Top 3 mini breakdown */}
            <div className="mt-4 pt-4 border-t border-paper-200 flex flex-col gap-2.5">
              {stats.topThree.length === 0 && (
                <div className="text-xs text-ink-500">No expenses yet.</div>
              )}
              {stats.topThree.map(({ cat, amount, pct }) => (
                <div key={cat.id} className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: `oklch(60% 0.13 ${cat.hue})` }}
                  />
                  <span className="text-sm text-ink-700 truncate flex-1">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-paper-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: `oklch(60% 0.13 ${cat.hue})`,
                        }}
                      />
                    </div>
                    <span className="num text-xs text-ink-500 w-14 text-right">
                      ₹{amount.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Chart + Recent */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CategoryChart expenses={monthExpenses} monthLabel={monthLabel} />
          </div>
          <div className="xl:col-span-1">
            <TransactionList expenses={monthExpenses} limit={5} />
          </div>
        </section>

        {/* Categories tile grid */}
        <section>
          <CategoryCards expenses={monthExpenses} />
        </section>

        {/* Full table */}
        <section id="all-expenses" className="scroll-mt-24">
          <ExpenseTable
            expenses={monthExpenses}
            query={query}
            onDelete={onDeleteExpense}
          />
        </section>

        <div className="text-xs text-ink-400 text-center py-4">
          -------
        </div>
      </main>

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={onAddExpense}
      />
      <SetLimitModal
        open={limitOpen}
        current={monthlyLimit}
        onClose={() => setLimitOpen(false)}
        onSave={setMonthlyLimit}
      />
    </div>
  );
}
