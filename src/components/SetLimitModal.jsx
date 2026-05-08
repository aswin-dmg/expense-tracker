import { useEffect, useState } from 'react';
import Button from './ui/Button.jsx';
import Input from './ui/Input.jsx';
import Icon from './ui/Icon.jsx';

/**
 * SetLimitModal — edit the user's monthly spending limit.
 */
export default function SetLimitModal({ open, current, onClose, onSave }) {
  const [value, setValue] = useState(current);

  useEffect(() => { if (open) setValue(current); }, [open, current]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const n = parseFloat(value);
    if (!isNaN(n) && n > 0) onSave(n);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-xl2 shadow-soft-lg border border-paper-200 route-fade">
        <div className="flex items-center justify-between p-5 border-b border-paper-200">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Monthly limit</h2>
            <p className="text-xs text-ink-500">We'll track progress against this each month.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-paper-100">
            <Icon name="x" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          <Input
            id="limit"
            label="Spending limit (INR)"
            type="number"
            step="100"
            min="0"
            placeholder="3000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" className="flex-1" type="submit">Save limit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
