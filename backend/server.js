const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost on common development ports
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }

    // Allow the configured CLIENT_URL
    const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
    if (origin === allowedOrigin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const ensureImageUrlColumn = () => {
  db.query("SHOW COLUMNS FROM Species LIKE 'image_url'", (err, rows) => {
    if (err) {
      console.log("Species schema check failed:", err);
      return;
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      db.query("ALTER TABLE Species ADD COLUMN image_url TEXT", (alterErr) => {
        if (alterErr) {
          console.log("Could not add Species.image_url column:", alterErr);
        } else {
          console.log("Added missing Species.image_url column.");
        }
      });
    }
  });
};

const ensureHealthRecordsTable = () => {
  db.query("SHOW TABLES LIKE 'health_records'", (err, rows) => {
    if (err) {
      console.log("health_records schema check failed:", err);
      return;
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      const createSql = `
        CREATE TABLE health_records (
          id INT AUTO_INCREMENT PRIMARY KEY,
          animal_id INT NOT NULL,
          checkup_date DATE NOT NULL,
          \`condition\` VARCHAR(120) NOT NULL,
          treatment VARCHAR(255) NOT NULL,
          vet_name VARCHAR(120) NOT NULL,
          FOREIGN KEY (animal_id) REFERENCES animals(id)
        )
      `;
      db.query(createSql, (createErr) => {
        if (createErr) {
          console.log("Could not create health_records table:", createErr);
        } else {
          console.log("Created missing health_records table.");
          
          const insertSql = `
            INSERT INTO health_records (animal_id, checkup_date, \`condition\`, treatment, vet_name) VALUES
            (1, '2024-03-05', 'Routine checkup', 'Vaccination and dietary supplement', 'Dr. Meera Rao'),
            (7, '2024-04-10', 'Minor injury', 'Wound cleaning and antibiotics', 'Dr. Arun Patel'),
            (12, '2024-04-14', 'Respiratory issues', 'Nebulizer therapy', 'Dr. Neha Singh')
          `;
          db.query(insertSql, (insertErr) => {
            if (insertErr) {
              console.log("Could not seed health_records:", insertErr);
            } else {
              console.log("Seeded health_records with initial data.");
            }
          });
        }
      });
    }
  });
};

ensureImageUrlColumn();
ensureHealthRecordsTable();

// routes
const authRoutes = require("./routes/auth");
const parksRoutes = require("./routes/parks");
const animalsRoutes = require("./routes/animals");
const speciesRoutes = require("./routes/species");
const officersRoutes = require("./routes/officers");
const healthRoutes = require("./routes/health");
const poachingRoutes = require("./routes/poaching");
app.use("/", authRoutes);
app.use("/", parksRoutes);
app.use("/", animalsRoutes);
app.use("/", speciesRoutes);
app.use("/", officersRoutes);
app.use("/", healthRoutes);
app.use("/", poachingRoutes);

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
  console.log("Routes ready: POST /login, GET /parks, GET /animals, GET /species, GET /officers, GET /health, GET /poaching");
});
