import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchPincodes } from "../services/api";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search
  const handleSearch = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchPincodes(value.trim());
        setResults(data);
        setIsOpen(data.length > 0);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelect = (pincode) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    navigate(`/pincode/${pincode}`);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <HiOutlineSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg"
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          type="text"
          className="input-field pl-10 pr-10"
          placeholder="Search by PIN code, office name, or district..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
            onClick={handleClear}
          >
            <HiOutlineX className="text-lg" />
          </button>
        )}
        {loading && (
          <div
            className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-spin"
            style={{
              border: "2px solid var(--color-border)",
              borderTopColor: "var(--color-primary)",
            }}
          />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-xl z-50"
          style={{
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          {results.map((item) => (
            <button
              key={item._id}
              className="w-full px-4 py-3 text-left transition-colors flex items-center gap-4"
              style={{
                borderBottom: "1px solid rgba(51, 65, 85, 0.5)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              onClick={() => handleSelect(item.pincode)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-primary-light)" }}
                >
                  {item.pincode?.slice(0, 3)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.pincode} — {item.officeName}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {item.district}, {item.state}
                </p>
              </div>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background:
                    item.deliveryStatus === "DELIVERY"
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(245, 158, 11, 0.15)",
                  color:
                    item.deliveryStatus === "DELIVERY"
                      ? "#4ade80"
                      : "#fbbf24",
                }}
              >
                {item.deliveryStatus === "DELIVERY" ? "Delivery" : "Non-Delivery"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
