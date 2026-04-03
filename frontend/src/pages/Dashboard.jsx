import { useState, useEffect } from "react";
import {
  getStats,
  getStateDistribution,
  getDeliveryDistribution,
} from "../services/api";
import StatsCard from "../components/StatsCard";
import { SkeletonCard } from "../components/Loader";
import {
  HiOutlineLocationMarker,
  HiOutlineGlobe,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#6366f1", "#f59e0b", "#06b6d4", "#ef4444", "#22c55e"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [stateDist, setStateDist] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, stateData, deliveryData] = await Promise.all([
          getStats(),
          getStateDistribution(),
          getDeliveryDistribution(),
        ]);
        setStats(statsData);
        setStateDist(stateData);
        setDeliveryDist(deliveryData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="px-4 py-3 rounded-xl"
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid var(--color-border)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: "var(--color-primary-light)" }}>
          {payload[0].value.toLocaleString()} offices
        </p>
      </div>
    );
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="px-4 py-3 rounded-xl"
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid var(--color-border)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          {payload[0].value.toLocaleString()} offices
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Overview of India's PIN code data at a glance
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            icon={HiOutlineLocationMarker}
            label="Total PIN Codes"
            value={stats?.totalPincodes || 0}
            color="indigo"
            delay={0}
          />
          <StatsCard
            icon={HiOutlineGlobe}
            label="States / UTs"
            value={stats?.totalStates || 0}
            color="cyan"
            delay={100}
          />
          <StatsCard
            icon={HiOutlineCheckCircle}
            label="Delivery Offices"
            value={stats?.deliveryOffices || 0}
            color="emerald"
            delay={200}
          />
          <StatsCard
            icon={HiOutlineXCircle}
            label="Non-Delivery Offices"
            value={stats?.nonDeliveryOffices || 0}
            color="amber"
            delay={300}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart — State Distribution */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text)" }}>
            State-wise Distribution
          </h2>
          <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
            Number of post offices per state
          </p>

          {loading ? (
            <div className="skeleton h-72 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stateDist.slice(0, 15)}
                margin={{ top: 5, right: 10, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.4)" />
                <XAxis
                  dataKey="state"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — Delivery Distribution */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text)" }}>
            Delivery Status
          </h2>
          <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
            Delivery vs Non-Delivery
          </p>

          {loading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryDist}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={50}
                  strokeWidth={2}
                  stroke="var(--color-surface)"
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(1)}%`
                  }
                >
                  {deliveryDist.map((entry, i) => (
                    <Cell
                      key={entry.status}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
