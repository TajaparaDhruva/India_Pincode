import { HiMapPin } from "react-icons/hi2";
import { HiOutlineHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer
      className="mt-auto py-6"
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              <HiMapPin className="text-white text-sm" />
            </div>
            <span
              className="text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #818cf8, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PIN Explorer
            </span>
          </div>

          <p
            className="text-xs flex items-center gap-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Built with <HiOutlineHeart className="text-rose-400" /> using React
            + Express + MongoDB
          </p>

          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
