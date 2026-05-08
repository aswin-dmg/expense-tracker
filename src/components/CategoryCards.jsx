import { useMemo } from 'react';
import Card from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';
import { CATEGORIES } from '../data/mockData.js';

/**
 * CategoryCards — grid of category tiles, each showing the totalled amount
 * and a slim progress bar relative to the largest category.
 */
export default function CategoryCards({ expenses }) {
  // Aggregate totals by category
  const totals = useMemo(() => {
    const map = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return map;
  }, [expenses]);

  const max = Math.max(1, ...Object.values(totals));

  return (
    <Card padded={false}>
      <div className="flex items-center justify-between p-5 md:p-6 pb-2">
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900">Categories</h3>
          <p className="text-xs text-ink-500">Spend distribution this period</p>
        </div>
        <button className="text-xs font-medium text-brand-600 hover:text-brand-700">View all</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 md:p-6 pt-3">
        {CATEGORIES.map((c) => {
          const total = totals[c.id] || 0;
          const pct = (total / max) * 100;
          return (
            <div
              key={c.id}
              className="rounded-xl border border-paper-200 p-4 hover:border-paper-300 hover:bg-paper-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: `oklch(95% 0.04 ${c.hue})`,
                    color: `oklch(45% 0.13 ${c.hue})`,
                  }}
                >
                  <Icon name={c.icon} className="w-[18px] h-[18px]" />
                </div>
                <div className="text-[13px] font-medium text-ink-900 leading-tight">
                  {c.label}
                </div>
              </div>
              <div className="num text-lg font-semibold text-ink-900 mt-3">
                ₹{total.toFixed(2)}
              </div>
              <div className="mt-2 h-1 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: `oklch(60% 0.13 ${c.hue})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
