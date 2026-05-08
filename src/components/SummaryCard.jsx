import Card from './ui/Card.jsx';
import Icon from './ui/Icon.jsx';

/**
 * SummaryCard — KPI tile used in the dashboard's top row.
 * Props: label, value, delta (e.g. "+12%"), trend ('up'|'down'|'neutral'), icon, accent
 */
export default function SummaryCard({ label, value, delta, trend = 'neutral', icon, accent = 'paper' }) {
  const trendStyles = {
    up:      'text-sage-600 bg-sage-500/10',
    down:    'text-rose-500 bg-rose-500/10',
    neutral: 'text-ink-500 bg-paper-200',
  }[trend];

  const accentBg = {
    paper: 'bg-paper-100 text-ink-700',
    brand: 'bg-brand-50 text-brand-600',
    sage:  'bg-sage-500/10 text-sage-600',
    rose:  'bg-rose-500/10 text-rose-500',
  }[accent];

  return (
    <Card className="hover:shadow-soft-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentBg}`}>
          <Icon name={icon} className="w-[18px] h-[18px]" />
        </div>
        {delta && (
          <span className={`text-[11px] font-medium px-2 py-1 rounded-md inline-flex items-center gap-1 ${trendStyles}`}>
            {trend === 'up' && <Icon name="arrow-up" className="w-3 h-3" />}
            {trend === 'down' && <Icon name="arrow-down" className="w-3 h-3" />}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="text-sm font-medium text-ink-700">{label}</div>
        <div className="num text-2xl md:text-[26px] font-semibold tracking-tight text-ink-900 mt-1">
          {value}
        </div>
      </div>
    </Card>
  );
}
