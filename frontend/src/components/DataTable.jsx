import { useNavigate } from "react-router-dom";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";

export default function DataTable({ data, total, page, limit, onPageChange }) {
  const navigate = useNavigate();
  const totalPages = Math.ceil(total / limit);

  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          No PIN code data found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const isDelivery = status === "DELIVERY";
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{
          background: isDelivery
            ? "rgba(34, 197, 94, 0.15)"
            : "rgba(245, 158, 11, 0.15)",
          color: isDelivery ? "#4ade80" : "#fbbf24",
          border: `1px solid ${
            isDelivery
              ? "rgba(34, 197, 94, 0.25)"
              : "rgba(245, 158, 11, 0.25)"
          }`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full mr-1.5"
          style={{
            background: isDelivery ? "#4ade80" : "#fbbf24",
          }}
        />
        {isDelivery ? "Delivery" : "Non-Delivery"}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(99, 102, 241, 0.08)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}>
                  PIN Code
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}>
                  Office Name
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell"
                  style={{ color: "var(--color-text-muted)" }}>
                  District
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden lg:table-cell"
                  style={{ color: "var(--color-text-muted)" }}>
                  State
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell"
                  style={{ color: "var(--color-text-muted)" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={item._id || i}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    borderBottom: "1px solid rgba(51, 65, 85, 0.4)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(99, 102, 241, 0.06)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onClick={() => navigate(`/pincode/${item.pincode}`)}
                >
                  <td className="px-5 py-3.5">
                    <span
                      className="font-mono font-semibold"
                      style={{ color: "var(--color-primary-light)" }}
                    >
                      {item.pincode}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium">
                    {item.officeName}
                  </td>
                  <td
                    className="px-5 py-3.5 hidden md:table-cell"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.district}
                  </td>
                  <td
                    className="px-5 py-3.5 hidden lg:table-cell"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.state}
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {getStatusBadge(item.deliveryStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Showing{" "}
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>
            {(page - 1) * limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>
            {Math.min(page * limit, total)}
          </span>{" "}
          of{" "}
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>
            {total.toLocaleString()}
          </span>{" "}
          results
        </p>

        <div className="flex items-center gap-2">
          <button
            className="btn-secondary !px-3 !py-2"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            style={{ opacity: page <= 1 ? 0.4 : 1 }}
          >
            <HiOutlineChevronLeft className="text-base" />
            Prev
          </button>

          <div className="flex items-center gap-1">
            {generatePageNumbers(page, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`dots-${i}`}
                  className="px-2 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background:
                      p === page
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "transparent",
                    color: p === page ? "white" : "var(--color-text-muted)",
                    border:
                      p === page
                        ? "none"
                        : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (p !== page)
                      e.currentTarget.style.background =
                        "rgba(51, 65, 85, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    if (p !== page)
                      e.currentTarget.style.background = "transparent";
                  }}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            className="btn-secondary !px-3 !py-2"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            style={{ opacity: page >= totalPages ? 0.4 : 1 }}
          >
            Next
            <HiOutlineChevronRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}

function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
