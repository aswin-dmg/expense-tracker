import { useMemo } from 'react';
import Card from './ui/Card.jsx';
import { CATEGORIES } from '../data/mockData.js';

/**
 * CategoryChart — SVG donut chart with leader-line labels next to each slice
 * (arrow-style amount callouts) and a legend pinned to the right.
 */
export default function CategoryChart({ expenses, monthLabel }) {
  const data = useMemo(() => {
    const byCat = {};
    expenses.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
    const total = Object.values(byCat).reduce((s, v) => s + v, 0);
    const slices = CATEGORIES
      .map((c) => ({ cat: c, amount: byCat[c.id] || 0 }))
      .filter((s) => s.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .map((s) => ({
        ...s,
        pct: total > 0 ? (s.amount / total) * 100 : 0,
        color: `oklch(60% 0.13 ${s.cat.hue})`,
      }));
    return { slices, total };
  }, [expenses]);

  // Layout constants
  const W = 560, H = 320;
  const cx = W / 2, cy = H / 2;
  const r = 110;
  const thickness = 30;
  const C = 2 * Math.PI * r;
  const LABEL_PAD = 64;

  const sliceMeta = useMemo(() => {
    let acc = 0;
    return data.slices.map((s) => {
      const startPct = acc;
      acc += s.pct;
      const midPct = startPct + s.pct / 2;
      const angle = (midPct / 100) * Math.PI * 2 - Math.PI / 2;
      return { ...s, startPct, midPct, angle };
    });
  }, [data.slices]);

  return (
    <Card padded={false} className="h-full flex flex-col">
      <div className="flex items-center justify-between p-5 md:p-6 pb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-ink-900">Spending breakdown</h3>
          <p className="text-xs text-ink-500">{monthLabel}</p>
        </div>
      </div>

      {data.slices.length === 0 ? (
        <div className="flex-1 px-5 md:px-6 pb-6 pt-2 flex items-center">
          <div className="w-full rounded-xl border border-dashed border-paper-300 py-12 text-center">
            <div className="text-sm font-medium text-ink-700">No expenses this month</div>
            <div className="text-xs text-ink-500 mt-1">Add one to see your breakdown.</div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-6 px-5 md:px-6 pb-6 pt-2 items-stretch">
          <div className="flex-1 flex items-center justify-center min-w-0">
            <svg
              width="100%"
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ maxWidth: 540 }}
            >
              <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke="oklch(96% 0.005 90)"
                strokeWidth={thickness}
              />
              <g transform={`rotate(-90 ${cx} ${cy})`}>
                {sliceMeta.map((s) => {
                  const len = (C * s.pct) / 100;
                  const offset = (C * s.startPct) / 100;
                  return (
                    <circle
                      key={s.cat.id}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={thickness}
                      strokeDasharray={`${Math.max(0, len - 1.5)} ${C - Math.max(0, len - 1.5)}`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </g>

              <text
                x={cx} y={cy - 6}
                textAnchor="middle"
                style={{ fill: 'oklch(55% 0.012 260)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}
              >
                TOTAL
              </text>
              <text
                x={cx} y={cy + 18}
                textAnchor="middle"
                style={{ fill: 'oklch(20% 0.01 260)', fontSize: 22, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}
              >
                ₹{data.total.toFixed(0)}
              </text>

              {sliceMeta.map((s) => {
                if (s.pct < 5) return null;
                const isRight = Math.cos(s.angle) >= 0;
                const startR = r + thickness / 2 - 1;
                const bendR = r + thickness / 2 + 12;
                const x1 = cx + Math.cos(s.angle) * startR;
                const y1 = cy + Math.sin(s.angle) * startR;
                const x2 = cx + Math.cos(s.angle) * bendR;
                const y2 = cy + Math.sin(s.angle) * bendR;
                const x3 = isRight
                  ? Math.min(W - LABEL_PAD, x2 + 18)
                  : Math.max(LABEL_PAD, x2 - 18);
                const y3 = y2;
                const labelX = isRight ? x3 + 5 : x3 - 5;

                return (
                  <g key={`label-${s.cat.id}`}>
                    <polyline
                      points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                      fill="none"
                      stroke="oklch(78% 0.008 260)"
                      strokeWidth="1"
                    />
                    <circle cx={x3} cy={y3} r="2" fill={s.color} />
                    <text
                      x={labelX} y={y3 - 3}
                      textAnchor={isRight ? 'start' : 'end'}
                      style={{
                        fill: 'oklch(20% 0.01 260)',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      ₹{s.amount.toFixed(0)}
                    </text>
                    <text
                      x={labelX} y={y3 + 12}
                      textAnchor={isRight ? 'start' : 'end'}
                      style={{ fill: 'oklch(55% 0.012 260)', fontSize: 11 }}
                    >
                      {s.pct.toFixed(0)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="md:w-52 shrink-0 md:border-l md:border-paper-200 md:pl-6 flex flex-col justify-center gap-2.5 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">By category</div>
            {data.slices.map((s) => (
              <div key={s.cat.id} className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-sm text-ink-700 flex-1 truncate">{s.cat.label}</span>
                <span className="num text-xs text-ink-500 w-9 text-right">
                  {s.pct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
