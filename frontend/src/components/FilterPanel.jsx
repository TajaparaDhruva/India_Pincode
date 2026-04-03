import { useState, useEffect, useCallback } from "react";
import { getStates, getDistricts, getTaluks } from "../services/api";
import { HiOutlineFilter, HiOutlineRefresh } from "react-icons/hi";

export default function FilterPanel({ onApply, onReset }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluksList] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingTaluks, setLoadingTaluks] = useState(false);

  // Load states on mount
  useEffect(() => {
    setLoadingStates(true);
    getStates()
      .then(setStates)
      .catch(console.error)
      .finally(() => setLoadingStates(false));
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict("");
      setTaluksList([]);
      setSelectedTaluk("");
      return;
    }

    setLoadingDistricts(true);
    setSelectedDistrict("");
    setTaluksList([]);
    setSelectedTaluk("");

    getDistricts(selectedState)
      .then(setDistricts)
      .catch(console.error)
      .finally(() => setLoadingDistricts(false));
  }, [selectedState]);

  // Load taluks when district changes
  useEffect(() => {
    if (!selectedState || !selectedDistrict) {
      setTaluksList([]);
      setSelectedTaluk("");
      return;
    }

    setLoadingTaluks(true);
    setSelectedTaluk("");

    getTaluks(selectedState, selectedDistrict)
      .then(setTaluksList)
      .catch(console.error)
      .finally(() => setLoadingTaluks(false));
  }, [selectedState, selectedDistrict]);

  const handleApply = useCallback(() => {
    onApply({
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
    });
  }, [selectedState, selectedDistrict, selectedTaluk, onApply]);

  const handleReset = useCallback(() => {
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedTaluk("");
    onReset();
  }, [onReset]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <HiOutlineFilter className="text-lg" style={{ color: "var(--color-primary-light)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
          Filters
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* State */}
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            State
          </label>
          <select
            className="select-field"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            disabled={loadingStates}
          >
            <option value="">
              {loadingStates ? "Loading..." : "All States"}
            </option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            District
          </label>
          <select
            className="select-field"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState || loadingDistricts}
          >
            <option value="">
              {loadingDistricts
                ? "Loading..."
                : !selectedState
                ? "Select state first"
                : "All Districts"}
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Taluk */}
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            Taluk
          </label>
          <select
            className="select-field"
            value={selectedTaluk}
            onChange={(e) => setSelectedTaluk(e.target.value)}
            disabled={!selectedDistrict || loadingTaluks}
          >
            <option value="">
              {loadingTaluks
                ? "Loading..."
                : !selectedDistrict
                ? "Select district first"
                : "All Taluks"}
            </option>
            {taluks.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn-primary" onClick={handleApply}>
          <HiOutlineFilter className="text-base" />
          Apply Filters
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          <HiOutlineRefresh className="text-base" />
          Reset
        </button>
      </div>
    </div>
  );
}
