// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🏠 Property Management System API",
    version: "1.0.0",
    currency: "KES",
    status: "Server is running successfully!",
    endpoints: {
      auth: "/api/auth",
      properties: "/api/properties", 
      units: "/api/units",
      tenants: "/api/tenants",
      payments: "/api/payments",
      maintenance: "/api/maintenance",
      reports: "/api/reports",
      dashboard: "/api/dashboard"
    }
  });
});

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    currency: "KES"
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💰 Currency: KES (Kenyan Shilling)`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
});