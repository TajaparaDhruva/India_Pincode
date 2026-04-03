import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineChartBar,
  HiOutlineSearch,
  HiOutlineInformationCircle,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { HiMapPin } from "react-icons/hi2";

const navLinks = [
  { to: "/", label: "Dashboard", icon: HiOutlineChartBar },
  { to: "/explore", label: "Explore", icon: HiOutlineSearch },
  { to: "/about", label: "About", icon: HiOutlineInformationCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99, 102, 241, 0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
              }}
            >
              <HiMapPin className="text-white text-lg" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #818cf8, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PIN Explorer
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-300"
                  style={{
                    color: isActive ? "#818cf8" : "#94a3b8",
                    background: isActive
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(99, 102, 241, 0.2)"
                      : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#e2e8f0";
                      e.currentTarget.style.background =
                        "rgba(51, 65, 85, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <Icon className="text-base" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{
              color: "#94a3b8",
              background: "rgba(51, 65, 85, 0.5)",
              border: "1px solid var(--color-border)",
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <HiOutlineX className="text-xl" />
            ) : (
              <HiOutlineMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4"
          style={{
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-300"
                  style={{
                    color: isActive ? "#818cf8" : "#94a3b8",
                    background: isActive
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="text-lg" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
