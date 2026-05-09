import { useState } from 'react';
import Card from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';
import { CATEGORIES } from '../data/mockData.js';
import { fmtDate } from './TransactionList.jsx';

/**
 * ExpenseTable — sortable table with category filter chips.
 * Receives full list and an optional search query (filters name/note).
 */
export default function ExpenseTable({ expenses, query = '', onDelete }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });

  const filtered = expenses
    .filter((e) => filter === 'all' || e.category === filter)
    .filter((e) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return e.name.toLowerCase().includes(q) || (e.note || '').toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (sort.key === 'amount') return (a.amount - b.amount) * dir;
      return (new Date(a.date) - new Date(b.date)) * dir;
    });

  const toggleSort = (key) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <Card padded={false}>
      <div className="p-5 md:p-6 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900">All expenses</h3>
          <p className="text-xs text-ink-500">{filtered.length} entries</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-ink-500 border-y border-paper-200 bg-paper-100/50">
              <th className="text-left font-medium px-5 md:px-6 py-2.5">Name</th>
              <th className="text-left font-medium py-2.5">Category</th>
              <th className="text-left font-medium py-2.5">
                <SortBtn onClick={() => toggleSort('date')} active={sort.key === 'date'} dir={sort.dir}>
                  Date
                </SortBtn>
              </th>
              <th className="text-right font-medium py-2.5 px-5 md:px-6">
                <SortBtn onClick={() => toggleSort('amount')} active={sort.key === 'amount'} dir={sort.dir}>
                  Amount
                </SortBtn>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-200">
            {filtered.map((tx) => {
              const cat = CATEGORIES.find((c) => c.id === tx.category) || CATEGORIES.find((c) => c.id === 'other');
              return (
                <tr key={tx.id} className="group hover:bg-paper-100 transition-colors">
                  <td className="px-5 md:px-6 py-3">
                    <div className="font-medium text-ink-900">{tx.name}</div>
                    {tx.note && <div className="text-xs text-ink-500 truncate max-w-[260px]">{tx.note}</div>}
                  </td>
                  <td className="py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md"
                      style={{
                        background: `oklch(96% 0.03 ${cat.hue})`,
                        color: `oklch(40% 0.12 ${cat.hue})`,
                      }}
                    >
                      <Icon name={cat.icon} className="w-3 h-3" />
                      {tx.category === 'other' && tx.customCategory ? tx.customCategory : cat.label}
                    </span>
                  </td>
                  <td className="py-3 text-ink-700">{fmtDate(tx.date)}</td>
                  <td className="px-5 md:px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="num font-semibold text-ink-900">−₹{tx.amount.toFixed(2)}</span>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(tx.id)}
                          className="opacity-0 group-hover:opacity-100 text-ink-400 hover:text-rose-500 transition-opacity"
                          aria-label="Delete"
                        >
                          <Icon name="bin" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-sm text-ink-500 py-10">
                  No expenses match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 h-7 rounded-md transition-colors ${
        active
          ? 'bg-ink-900 text-paper-50'
          : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
      }`}
    >
      {children}
    </button>
  );
}

function SortBtn({ active, dir, onClick, children }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 ${active ? 'text-ink-900' : ''}`}>
      {children}
      <Icon name={active && dir === 'asc' ? 'arrow-up' : 'arrow-down'} className="w-3 h-3" />
    </button>
  );
}
