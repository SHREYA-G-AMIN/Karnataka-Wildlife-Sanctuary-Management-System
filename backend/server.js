const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
