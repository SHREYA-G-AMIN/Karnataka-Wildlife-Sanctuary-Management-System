const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/species", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql = `
    SELECT DISTINCT
      sp.id AS species_id,
      sp.name AS species_name,
      sp.category,
      sp.image_url
    FROM Species sp
  `;
  const params = [];

  if (sanctuary_id) {
    sql += `
      INNER JOIN Animals a ON a.species_id = sp.id
      WHERE a.sanctuary_id = ?
    `;
    params.push(sanctuary_id);
  }

  sql += `
    ORDER BY sp.name
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
