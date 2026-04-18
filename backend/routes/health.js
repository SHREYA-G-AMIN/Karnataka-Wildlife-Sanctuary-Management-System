const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/health", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql = `
    SELECT
      hr.id AS health_id,
      hr.animal_id,
      a.name AS animal_name,
      hr.checkup_date,
      hr.\`condition\`,
      hr.treatment,
      hr.vet_name
    FROM Health_Records hr
    INNER JOIN Animals a ON hr.animal_id = a.id
  `;

  const params = [];
  if (sanctuary_id) {
    sql += " WHERE a.sanctuary_id = ?";
    params.push(sanctuary_id);
  }

  sql += " ORDER BY hr.checkup_date DESC, a.name";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Health records fetch failed:", err.message || err);
      console.log("SQL:", sql);
      return res.status(500).json({ success: false, message: "Unable to load health records" });
    }

    return res.json({ success: true, data: rows || [] });
  });
});

module.exports = router;
