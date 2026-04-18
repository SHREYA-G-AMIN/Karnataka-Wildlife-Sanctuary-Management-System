const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/animals", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql = `
    SELECT
      a.id AS animal_id,
      a.name AS animal_name,
      s.id AS species_id,
      s.name AS species_name,
      s.category AS species_category,
      sa.id AS sanctuary_id,
      sa.name AS sanctuary_name,
      sa.location AS sanctuary_location,
      a.age,
      a.gender,
      a.health_status
    FROM Animals a
    INNER JOIN Species s ON a.species_id = s.id
    INNER JOIN Sanctuary sa ON a.sanctuary_id = sa.id
  `;
  const params = [];

  if (sanctuary_id) {
    sql += " WHERE a.sanctuary_id = ?";
    params.push(sanctuary_id);
  }

  sql += " ORDER BY sa.id, s.name, a.name";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Animals fetch failed:", err);
      return res.status(500).json({ success: false, message: "Unable to load animals" });
    }

    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
