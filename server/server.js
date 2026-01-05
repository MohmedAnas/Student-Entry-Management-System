// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");

const app = express();

// 1. Basic middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. CORS for Netlify frontend + credentials
const allowedOrigins = [
  "https://zamzamcomputer.netlify.app",
  // optionally local dev:
  "http://localhost:5173",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, cb) {
    // allow non-browser tools (curl, Postman) where origin is undefined
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 3. Global CORS + preflight for all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 4. Routes
app.get("/", (req, res) => res.send("Backend running"));
app.use("/api/auth", authRoutes);

// 5. 404 handler AFTER all routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// 6. Error handler (including CORS errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server listening on", PORT));
