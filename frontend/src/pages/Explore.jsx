import { useState, useCallback } from "react";
import FilterPanel from "../components/FilterPanel";
import SearchBar from "../components/SearchBar";
import DataTable from "../components/DataTable";
import { SkeletonTable } from "../components/Loader";
import { getPincodes, exportData } from "../services/api";
import { HiOutlineDownload } from "react-icons/hi";

export default function Explore() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [exporting, setExporting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchData = useCallback(
    async (filterParams = {}, pageNum = 1) => {
      setLoading(true);
      try {
        const params = { ...filterParams, page: pageNum, limit };
        const result = await getPincodes(params);
        setData(result.data);
        setTotal(result.total);
        setPage(result.page);
        setHasSearched(true);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const handleApply = useCallback(
    (newFilters) => {
      // Remove empty filter values
      const cleanFilters = {};
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v) cleanFilters[k] = v;
      });
      setFilters(cleanFilters);
      fetchData(cleanFilters, 1);
    },
    [fetchData]
  );

  const handleReset = useCallback(() => {
    setFilters({});
    setData([]);
    setTotal(0);
    setPage(1);
    setHasSearched(false);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      fetchData(filters, newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, fetchData]
  );

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await exportData(filters);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Explore PIN Codes</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Search, filter, and explore India's postal network
          </p>
        </div>

        {hasSearched && total > 0 && (
          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={exporting}
            style={{ opacity: exporting ? 0.6 : 1 }}
          >
            <HiOutlineDownload className="text-base" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <FilterPanel onApply={handleApply} onReset={handleReset} />
      </div>

      {/* Results */}
      <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        {loading ? (
          <SkeletonTable rows={10} cols={5} />
        ) : hasSearched ? (
          <DataTable
            data={data}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="glass-card p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              Start Exploring
            </h3>
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              Use the search bar to find specific PIN codes, or select filters
              and click &quot;Apply Filters&quot; to browse data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
