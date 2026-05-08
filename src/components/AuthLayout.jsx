import Icon from './ui/Icon.jsx';

/**
 * AuthLayout — shared shell for Login + Signup.
 * Two-column: left form, right brand panel (hidden on mobile).
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full flex bg-paper-100 route-fade">
      {/* Left — form */}
      <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-16 py-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ink-900 text-paper-50 flex items-center justify-center">
            <Icon name="money" className="w-5 h-5" />
          </div>
          <span className="font-semibold tracking-tight text-ink-900">Track It</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[400px]">
            <h1 className="text-[28px] leading-tight font-bold text-ink-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-ink-500 mt-2">{subtitle}</p>
            )}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-ink-500">{footer}</div>}
          </div>
        </div>

        <div className="text-xs text-ink-400">
          © 2026 Track It. Crafted for clarity.
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden border-l border-paper-200">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 60% at 30% 20%, oklch(95% 0.04 255) 0%, oklch(98% 0.005 90) 60%)',
          }}
        />
        <div className="relative max-w-md p-10">
          {/* Stylized "card stack" preview */}
          <div className="relative h-[260px]">
            <div className="absolute inset-x-6 top-10 h-32 rounded-2xl bg-white shadow-soft-lg border border-paper-200 p-5">
              <div className="text-[11px] uppercase tracking-wider text-ink-400">This month</div>
              <div className="num text-3xl font-semibold text-ink-900 mt-1">₹2,418.50</div>
              <div className="mt-3 flex gap-1.5 items-end h-10">
                {[40, 70, 55, 80, 35, 90, 60].map((h, i) => (
                  <div key={i}
                    className="flex-1 rounded-md bg-brand-500/80"
                    style={{ height: `${h}%`, opacity: 0.45 + (h / 200) }} />
                ))}
              </div>
            </div>
            <div className="absolute left-2 top-2 right-12 h-20 rounded-2xl bg-paper-100 border border-paper-300 -rotate-2"></div>
            <div className="absolute right-0 bottom-0 w-44 rounded-2xl bg-white shadow-soft border border-paper-200 p-4">
              <div className="text-[11px] text-ink-400">Latest</div>
              <div className="font-medium text-sm mt-1">Blue Bottle</div>
              <div className="num text-sm text-ink-700">−₹6.75</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-ink-900 tracking-tight mt-8">
            Spend with intention.
          </h2>
          <p className="text-sm text-ink-500 mt-2 max-w-sm">
            A clean tracker for everyday expenses. Track, categorize, and notice
            patterns — no spreadsheets required.
          </p>
        </div>
      </div>
    </div>
  );
}
