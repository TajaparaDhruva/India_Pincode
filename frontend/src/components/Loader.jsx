export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "3px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full animate-spin"
          style={{
            border: "3px solid transparent",
            borderTopColor: "var(--color-accent)",
            animationDirection: "reverse",
            animationDuration: "0.8s",
          }}
        />
      </div>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {text}
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6">
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-40" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
      <div className="p-4 space-y-3">
        {/* Header skeleton */}
        <div className="flex gap-4 pb-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="skeleton h-4 flex-1" />
          ))}
        </div>
        {/* Row skeletons */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="skeleton h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
