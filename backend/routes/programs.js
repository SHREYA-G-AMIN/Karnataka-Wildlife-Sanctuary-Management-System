const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/programs", (req, res) => {
  const { sanctuary_id } = req.query;

  let sql = `
    SELECT
      cp.id,
      cp.name,
      cp.start_date,
      cp.status,
      cp.sanctuary_id,
      s.name AS sanctuary_name
    FROM Conservation_Programs cp
    INNER JOIN Sanctuary s ON cp.sanctuary_id = s.id
  `;
  const params = [];

  if (sanctuary_id) {
    sql += " WHERE cp.sanctuary_id = ?";
    params.push(sanctuary_id);
  }

  sql += " ORDER BY cp.sanctuary_id, cp.start_date DESC";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Programs fetch failed:", err);
      return res.status(500).json({ success: false, message: "Unable to load conservation programs" });
    }

    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
