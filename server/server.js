// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

const app = express();

// 1. Simple request logger (first)
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookies (if you need them)
app.use(cookieParser());

// 4. CORS for Netlify frontend + local dev
const allowedOrigins = [
  "https://zamzamcomputer.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin(origin, cb) {
    // allow tools like curl/Postman where origin is undefined
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// 5. Global CORS + preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 6. Routes
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRoutes);
const studentRoutes = require("./routes/studentroute");  // your file name
app.use("/api/students", studentRoutes);

// 7. 404 handler AFTER all routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// 8. Error handler (including CORS errors)
app.use((err, req, res, next) => {
  console.error("Error handler:", err.message || err);
  res.status(500).json({ message: "Internal Server Error" });
});

// 9. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server listening on", PORT);
});
