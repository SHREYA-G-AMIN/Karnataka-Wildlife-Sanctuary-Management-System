const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/parks", (req, res) => {
  db.query("SELECT * FROM parks", (err, rows) => {
    if (err) {
      console.log("Parks fetch failed:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }

    const data = rows.map((row) => {
      let activity = [];
      if (row.activity) {
        try {
          activity = JSON.parse(row.activity);
        } catch (parseErr) {
          activity = [];
        }
      }

      return {
        id: row.id,
        name: row.name,
        location: row.location,
        area: row.area,
        famous: row.famous,
        image: row.image,
        animals: row.animals,
        species: row.species,
        endangered: row.endangered,
        poaching: row.poaching,
        activity,
      };
    });

    return res.json({ success: true, data });
  });
});

module.exports = router;
