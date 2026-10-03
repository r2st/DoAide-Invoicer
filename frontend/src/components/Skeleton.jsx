function Bars({ count, className }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={className} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3, label = "Loading" }) {
  return (
    <div className="py-2" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{label}...</span>
      <Bars count={lines} className="skeleton h-3.5 my-2 rounded" />
    </div>
  );
}

export function SkeletonStats({ count = 4, label = "Loading summary" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{label}...</span>
      {Array.from({ length: count }, (_, i) => (
        <div className="stat-card" key={i} aria-hidden="true">
          <div className="skeleton h-3 w-[45%] my-2 rounded" />
          <div className="skeleton h-6 w-[70%] my-2 rounded" />
          <div className="skeleton h-3 w-[45%] my-2 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, label = "Loading table" }) {
  return (
    <div className="panel" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{label}...</span>
      <div aria-hidden="true">
        {Array.from({ length: rows }, (_, r) => (
          <div className="grid gap-3 py-2.5 border-b border-line" key={r} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }, (_, c) => (
              <div className="skeleton h-3 rounded" key={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonPanel({ lines = 4, label = "Loading" }) {
  return (
    <div className="panel" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{label}...</span>
      <Bars count={lines} className="skeleton h-3.5 my-2 rounded" />
    </div>
  );
}

export function Spinner({ label = "Working" }) {
  return (
    <span className="spinner" aria-live="polite">
      <span className="visually-hidden">{label}...</span>
    </span>
  );
}
