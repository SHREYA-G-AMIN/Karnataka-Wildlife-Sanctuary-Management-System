const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
const parksRoutes = require("./routes/parks");
const animalsRoutes = require("./routes/animals");
const speciesRoutes = require("./routes/species");
app.use("/", authRoutes);
app.use("/", parksRoutes);
app.use("/", animalsRoutes);
app.use("/", speciesRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Wildlife API is running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log("Unhandled server error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Routes ready: POST /login, GET /parks, GET /animals, GET /species");
});
