const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/officers", (req, res) => {
  const { sanctuary_id } = req.query;
  let sql = `
    SELECT
      fo.id AS officer_id,
      fo.name,
      fo.designation,
      fo.experience,
      sa.name AS sanctuary_name
    FROM Forest_Officers fo
    INNER JOIN Sanctuary sa
      ON fo.sanctuary_id = sa.id
  `;
  const params = [];

  if (sanctuary_id) {
    sql += " WHERE fo.sanctuary_id = ?";
    params.push(sanctuary_id);
  }

  sql += " ORDER BY sa.name, fo.name";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.log("Officers fetch failed:", err);
      return res.status(500).json({ success: false, message: "Unable to load officers" });
    }

    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
