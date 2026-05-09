import { useEffect, useRef, useState } from 'react';
import Icon from './ui/Icon.jsx';

/**
 * Topbar — title + search + profile dropdown.
 */
export default function Topbar({ user, query, onQueryChange, onLogout, onOpenSettings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-paper-50/80 backdrop-blur border-b border-paper-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ink-900 text-paper-50 flex items-center justify-center">
            <Icon name="money" className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-ink-900">Track It</span>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-white border border-paper-300 rounded-xl px-3 h-10 w-64 md:w-72 focus-within:border-brand-500 focus-within:shadow-ring transition-all">
          <Icon name="search" className="w-4 h-4 text-ink-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search transactions"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-400"
          />
        </div>

        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-700 hover:bg-paper-200 relative"
          aria-label="Notifications"
        >

        {/* Profile dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 h-10 rounded-full hover:bg-paper-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
              {user.initials}
            </div>
            <span className="hidden md:block text-sm text-ink-900">{user.name.split(' ')[0]}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-paper-200 rounded-xl shadow-soft-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-paper-200">
                <div className="text-sm font-semibold text-ink-900">{user.name}</div>
                <div className="text-xs text-ink-500 truncate">{user.email}</div>
              </div>
              <button
                onClick={() => { setOpen(false); onOpenSettings(); }}
                className="w-full flex items-center gap-3 px-4 h-11 text-sm text-ink-700 hover:bg-paper-100 transition-colors"
              >
                <Icon name="settings" className="w-[18px] h-[18px]" />
                Settings
              </button>
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-4 h-11 text-sm text-ink-700 hover:bg-paper-100 transition-colors border-t border-paper-200"
              >
                <Icon name="logout" className="w-[18px] h-[18px]" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
