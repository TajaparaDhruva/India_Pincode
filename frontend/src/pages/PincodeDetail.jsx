import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPincodeDetail } from "../services/api";
import Loader from "../components/Loader";
import {
  HiOutlineArrowLeft,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineGlobe,
  HiOutlineCheckCircle,
  HiOutlineTag,
} from "react-icons/hi";

const fields = [
  { key: "pincode", label: "PIN Code", icon: HiOutlineTag, color: "#818cf8" },
  {
    key: "officeName",
    label: "Office Name",
    icon: HiOutlineOfficeBuilding,
    color: "#22d3ee",
  },
  {
    key: "district",
    label: "District",
    icon: HiOutlineLocationMarker,
    color: "#4ade80",
  },
  { key: "state", label: "State", icon: HiOutlineGlobe, color: "#fbbf24" },
  {
    key: "taluk",
    label: "Taluk",
    icon: HiOutlineLocationMarker,
    color: "#fb7185",
  },
  {
    key: "deliveryStatus",
    label: "Delivery Status",
    icon: HiOutlineCheckCircle,
    color: "#a78bfa",
  },
  {
    key: "branchType",
    label: "Branch Type",
    icon: HiOutlineOfficeBuilding,
    color: "#38bdf8",
  },
  {
    key: "divisionName",
    label: "Division",
    icon: HiOutlineGlobe,
    color: "#34d399",
  },
  {
    key: "regionName",
    label: "Region",
    icon: HiOutlineGlobe,
    color: "#f472b6",
  },
  {
    key: "circleName",
    label: "Circle",
    icon: HiOutlineGlobe,
    color: "#c084fc",
  },
];

export default function PincodeDetail() {
  const { pincode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPincodeDetail(pincode);
        setData(Array.isArray(result) ? result : [result]);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "PIN code not found"
            : "Failed to fetch details"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [pincode]);

  if (loading) return <Loader text={`Loading PIN code ${pincode}...`} />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-12">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
            {error}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            The PIN code <strong>{pincode}</strong> could not be found in our database.
          </p>
          <button className="btn-primary" onClick={() => navigate("/explore")}>
            <HiOutlineArrowLeft className="text-base" />
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button + Header */}
      <div className="animate-fade-in-up">
        <button
          className="btn-secondary mb-4"
          onClick={() => navigate(-1)}
        >
          <HiOutlineArrowLeft className="text-base" />
          Go Back
        </button>

        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">PIN Code {pincode}</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {data.length} office{data.length > 1 ? "s" : ""} found under this PIN
          code
        </p>
      </div>

      {/* Office Cards */}
      {data.map((office, index) => (
        <div
          key={office._id || index}
          className="glass-card p-6 animate-fade-in-up relative overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Decorative gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: "linear-gradient(90deg, #6366f1, #06b6d4, #8b5cf6)",
            }}
          />

          <h2 className="text-lg font-bold mb-5 mt-2" style={{ color: "var(--color-text)" }}>
            {office.officeName || "Unknown Office"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => {
              const Icon = field.icon;
              const value = office[field.key];
              if (!value && field.key !== "pincode") return null;

              return (
                <div
                  key={field.key}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid rgba(51, 65, 85, 0.4)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = `${field.color}40`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(51, 65, 85, 0.4)")
                  }
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${field.color}15`,
                      border: `1px solid ${field.color}30`,
                    }}
                  >
                    <Icon className="text-lg" style={{ color: field.color }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {field.label}
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text)" }}>
                      {value || "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
