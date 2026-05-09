import { useEffect, useState } from 'react';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Icon from './ui/Icon.jsx';
import { CATEGORIES } from '../data/mockData.js';

/**
 * AddExpenseModal — controlled modal that pushes a new expense onto state.
 * Fields: name, amount, category (with optional customCategory when "Other"),
 * date, note.
 */
export default function AddExpenseModal({ open, onClose, onAdd }) {
const blank = () => ({
  name: '',
  amount: '',
  category: 'food',
  date: new Date().toISOString().slice(0, 10),
  note: '',
});
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) { setForm(blank()); setErrors({}); }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));


  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter an amount > 0';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onAdd({
  name: form.name.trim(),
  amount: parseFloat(form.amount),
  category: isOther && form.customCategory.trim() ? form.customCategory.trim().toLowerCase() : form.category,
  date: form.date,
  note: form.note.trim(),
});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-xl2 shadow-soft-lg border border-paper-200 route-fade max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-paper-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Add expense</h2>
            <p className="text-xs text-ink-500">Log a purchase to Track It</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-paper-100">
            <Icon name="x" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          <Input
            id="name"
            label="Expense name"
            placeholder="e.g. Blue Bottle Coffee"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="amount"
              label="Amount (INR)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              error={errors.amount}
            />
            <Input
              id="date"
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-700">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const active = form.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update('category', c.id)}
                    className={`flex items-center gap-2 px-3 h-10 rounded-lg border text-xs transition-colors ${
                      active
                        ? 'border-ink-900 bg-ink-900 text-paper-50'
                        : 'border-paper-300 hover:bg-paper-100 text-ink-700'
                    }`}
                  >
                    <Icon name={c.icon} className="w-4 h-4 shrink-0" />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* When "Other" is selected, let the user type a free-form label. */}
            
          </div>

          <Input
            id="note"
            label="Note (optional)"
            placeholder="What was it for?"
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" className="flex-1" type="submit">Save expense</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
