import {
  HiOutlineInformationCircle,
  HiOutlineLightningBolt,
  HiOutlineDatabase,
  HiOutlineCode,
} from "react-icons/hi";

const features = [
  {
    icon: HiOutlineLightningBolt,
    title: "Blazing Fast Search",
    desc: "Instantly search across 150,000+ PIN codes with debounced input and regex-powered matching.",
    color: "#fbbf24",
  },
  {
    icon: HiOutlineDatabase,
    title: "Comprehensive Data",
    desc: "Complete dataset of all India POST offices with state, district, taluk, and delivery information.",
    color: "#4ade80",
  },
  {
    icon: HiOutlineCode,
    title: "Modern Stack",
    desc: "Built with React, Tailwind CSS, Node.js, Express, and MongoDB for a seamless experience.",
    color: "#818cf8",
  },
];

const techStack = [
  { name: "React", type: "Frontend" },
  { name: "Tailwind CSS", type: "Styling" },
  { name: "Vite", type: "Build Tool" },
  { name: "Recharts", type: "Charts" },
  { name: "Node.js", type: "Runtime" },
  { name: "Express.js", type: "Backend" },
  { name: "MongoDB", type: "Database" },
  { name: "Mongoose", type: "ODM" },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)",
          }}
        >
          <HiOutlineInformationCircle className="text-3xl text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          <span className="gradient-text">About PIN Explorer</span>
        </h1>
        <p
          className="text-base max-w-2xl mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          A production-level full-stack web application to explore, search, and
          analyze India's postal PIN code data. Browse 150,000+ post offices
          with powerful filtering, analytics, and CSV export.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="glass-card p-6 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                }}
              >
                <Icon className="text-xl" style={{ color: f.color }} />
              </div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--color-text)" }}>
          Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map((t, i) => (
            <div
              key={i}
              className="p-4 rounded-xl text-center transition-all duration-300"
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                {t.name}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                {t.type}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--color-text)" }}>
          API Endpoints
        </h2>
        <div className="space-y-2">
          {[
            { method: "GET", url: "/api/states", desc: "Get all distinct states" },
            { method: "GET", url: "/api/states/:state/districts", desc: "Districts per state" },
            { method: "GET", url: "/api/states/:state/districts/:district/taluks", desc: "Taluks per district" },
            { method: "GET", url: "/api/pincodes?state=&district=&page=&limit=", desc: "Filtered PIN codes with pagination" },
            { method: "GET", url: "/api/search?q=", desc: "Partial text search" },
            { method: "GET", url: "/api/pincode/:pincode", desc: "Single PIN code details" },
            { method: "GET", url: "/api/stats", desc: "Aggregate statistics" },
            { method: "GET", url: "/api/stats/state-distribution", desc: "Count per state" },
            { method: "GET", url: "/api/stats/delivery-distribution", desc: "Delivery vs non-delivery" },
            { method: "GET", url: "/api/export", desc: "CSV export" },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="flex items-start sm:items-center gap-3 p-3 rounded-lg flex-col sm:flex-row"
              style={{
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(51, 65, 85, 0.3)",
              }}
            >
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-md flex-shrink-0"
                style={{
                  background: "rgba(34, 197, 94, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                }}
              >
                {endpoint.method}
              </span>
              <code className="text-xs font-mono" style={{ color: "var(--color-primary-light)" }}>
                {endpoint.url}
              </code>
              <span
                className="text-xs ml-auto hidden sm:block"
                style={{ color: "var(--color-text-muted)" }}
              >
                {endpoint.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
