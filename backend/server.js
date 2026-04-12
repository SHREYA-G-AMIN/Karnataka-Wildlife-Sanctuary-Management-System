const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
const parksRoutes = require("./routes/parks");
app.use("/", authRoutes);
app.use("/", parksRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("Routes ready: POST /login, GET /parks");
});
