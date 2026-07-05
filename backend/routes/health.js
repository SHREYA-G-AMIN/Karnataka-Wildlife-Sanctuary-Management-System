const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/health", (req, res) => {
  const { sanctuary_id } = req.query;
  let sql = `
    SELECT
      hr.id AS health_id,
      hr.animal_id,
      a.name AS animal_code,
      sp.name AS animal_name,
      s.name AS sanctuary_name,
      hr.checkup_date,
      hr.\`condition\`,
      hr.treatment,
      hr.vet_name
    FROM Health_Records hr
    INNER JOIN Animals a ON hr.animal_id = a.id
    INNER JOIN Species sp ON a.species_id = sp.id
    INNER JOIN Sanctuary s ON a.sanctuary_id = s.id
  `;
  const params = [];
  if (sanctuary_id) {
    sql += " WHERE a.sanctuary_id = ?";
    params.push(sanctuary_id);
  }
  sql += " ORDER BY hr.checkup_date DESC, sp.name";
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Health records fetch failed:", err.message || err);
      return res.status(500).json({ success: false, message: "Unable to load health records" });
    }
    return res.json({ success: true, data: rows || [] });
  });
});

module.exports = router;
