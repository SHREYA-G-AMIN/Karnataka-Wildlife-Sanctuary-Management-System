const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/animals", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql =
    "SELECT a.id AS animal_id, a.name AS animal_name, s.name AS species_name, sa.name AS sanctuary_name, a.age, a.gender, a.health_status " +
    "FROM Animals a " +
    "JOIN Species s ON a.species_id = s.id " +
    "JOIN Sanctuary sa ON a.sanctuary_id = sa.id";
  const params = [];

  if (sanctuary_id) {
    sql += " WHERE a.sanctuary_id = ?";
    params.push(sanctuary_id);
  }

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Animals fetch failed:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }

    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
