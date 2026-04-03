export default function StatsCard({ icon: Icon, label, value, color, delay = 0 }) {
  const colorMap = {
    indigo: {
      bg: "rgba(99, 102, 241, 0.1)",
      border: "rgba(99, 102, 241, 0.25)",
      icon: "#818cf8",
      glow: "rgba(99, 102, 241, 0.15)",
    },
    cyan: {
      bg: "rgba(6, 182, 212, 0.1)",
      border: "rgba(6, 182, 212, 0.25)",
      icon: "#22d3ee",
      glow: "rgba(6, 182, 212, 0.15)",
    },
    emerald: {
      bg: "rgba(34, 197, 94, 0.1)",
      border: "rgba(34, 197, 94, 0.25)",
      icon: "#4ade80",
      glow: "rgba(34, 197, 94, 0.15)",
    },
    amber: {
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.25)",
      icon: "#fbbf24",
      glow: "rgba(245, 158, 11, 0.15)",
    },
    rose: {
      bg: "rgba(244, 63, 94, 0.1)",
      border: "rgba(244, 63, 94, 0.25)",
      icon: "#fb7185",
      glow: "rgba(244, 63, 94, 0.15)",
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="glass-card p-6 animate-fade-in-up relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl"
        style={{ background: c.glow }}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
          }}
        >
          {Icon && <Icon className="text-xl" style={{ color: c.icon }} />}
        </div>
      </div>
    </div>
  );
}
