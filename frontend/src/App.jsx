import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import PincodeDetail from "./pages/PincodeDetail";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--color-surface)" }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/pincode/:pincode" element={<PincodeDetail />} />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h1 className="text-2xl font-bold mb-2 gradient-text">
                    Page Not Found
                  </h1>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
