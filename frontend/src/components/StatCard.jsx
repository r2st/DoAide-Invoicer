export default function StatCard({ label, value, sub, tone = "neutral", icon }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-ink-soft">{label}</div>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <div className="text-2xl font-bold mt-1 mb-0.5 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-ink-soft">{sub}</div>}
    </div>
  );
}
