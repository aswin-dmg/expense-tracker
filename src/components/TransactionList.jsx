import Card from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';
import { CATEGORIES } from '../data/mockData.js';

/**
 * Format an ISO date as "May 8".
 */
export function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * TransactionList — compact, recent-first list (5 items by default).
 * Smooth-scrolls to #all-expenses on "View all" unless onViewAll is provided.
 */
export default function TransactionList({ expenses, limit = 5, onViewAll }) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  const handleViewAll = () => {
    if (onViewAll) { onViewAll(); return; }
    const target = document.getElementById('all-expenses');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Card padded={false} className="h-full flex flex-col">
      <div className="flex items-center justify-between p-5 md:p-6 pb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900">Recent transactions</h3>
          <p className="text-xs text-ink-500">{recent.length} most recent</p>
        </div>
        <button
          onClick={handleViewAll}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View all
        </button>
      </div>

      <ul className="divide-y divide-paper-200 flex-1">
        {recent.map((tx) => {
          const cat = CATEGORIES.find((c) => c.id === tx.category);
          return (
            <li
              key={tx.id}
              className="flex items-center gap-3 px-5 md:px-6 py-3 hover:bg-paper-100 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `oklch(95% 0.04 ${cat.hue})`,
                  color: `oklch(45% 0.13 ${cat.hue})`,
                }}
              >
                <Icon name={cat.icon} className="w-[18px] h-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink-900 truncate">{tx.name}</div>
                <div className="text-xs text-ink-500 truncate">
                  {tx.category === 'other' && tx.customCategory ? tx.customCategory : cat.label} · {fmtDate(tx.date)}
                </div>
              </div>
              <div className="num text-sm font-semibold text-ink-900 shrink-0">
                −₹{tx.amount.toFixed(2)}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
