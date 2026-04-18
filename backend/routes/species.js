const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/species", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql = `
    SELECT
      sp.id AS species_id,
      sp.name AS species_name,
      sp.category,
      sa.id AS sanctuary_id,
      sa.name AS sanctuary_name,
      COUNT(a.id) AS animal_count,
      SUM(CASE WHEN a.health_status <> 'Healthy' THEN 1 ELSE 0 END) AS under_care
    FROM Species sp
    LEFT JOIN Animals a
      ON a.species_id = sp.id
    LEFT JOIN Sanctuary sa
      ON sa.id = a.sanctuary_id
  `;
  const params = [];

  if (sanctuary_id) {
    sql += " WHERE sa.id = ?";
    params.push(sanctuary_id);
  }

  sql += `
    GROUP BY sp.id, sp.name, sp.category, sa.id, sa.name
    HAVING COUNT(a.id) > 0
    ORDER BY sa.id, sp.name
  `;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Species fetch failed:", err);
      return res.status(500).json({ success: false, message: "Unable to load species" });
    }

    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
