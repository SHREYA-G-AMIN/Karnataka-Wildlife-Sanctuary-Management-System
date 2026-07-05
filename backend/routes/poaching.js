const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/poaching", (req, res) => {
  const { sanctuary_id } = req.query;
  let sql = `
    SELECT
      pi.id AS incident_id,
      s.name AS sanctuary_name,
      pi.date,
      pi.description
    FROM Poaching_Incidents pi
    INNER JOIN Sanctuary s ON pi.sanctuary_id = s.id
  `;
  const params = [];
  if (sanctuary_id) {
    sql += " WHERE pi.sanctuary_id = ?";
    params.push(sanctuary_id);
  }
  sql += " ORDER BY pi.date DESC";
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Poaching incidents fetch failed:", err.message || err);
      return res.status(500).json({ success: false, message: "Unable to load poaching incidents" });
    }
    return res.json({ success: true, data: rows || [] });
  });
});

module.exports = router;
