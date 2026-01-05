const express = require("express");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 CORS (TOP, BEFORE ROUTES)
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://zamzamcomputer.netlify.app",
  credentials: true
}));

// 🔥 HANDLE PREFLIGHT
app.options("*", cors({
  origin: process.env.FRONTEND_URL || "https://zamzamcomputer.netlify.app",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
