const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const pincodeRoutes = require("./routes/pincodeRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", pincodeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PIN Code Explorer API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
