const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/parks", (req, res) => {
  const sql = `
    SELECT
      s.id,
      s.name,
      s.location,
      s.area,
      COALESCE(p.famous, "Wildlife") AS famous,
      COALESCE(p.image, "") AS image,
      COUNT(DISTINCT a.id) AS animals,
      COUNT(DISTINCT a.species_id) AS species,
      COUNT(DISTINCT CASE WHEN a.health_status <> 'Healthy' THEN a.id END) AS endangered,
      COUNT(DISTINCT pi.id) AS poaching,
      COALESCE(p.activity, "[]") AS activity
    FROM Sanctuary s
    LEFT JOIN parks p
      ON LOWER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(TRIM(p.name), 'National Park', ''),
                '(',
                ''
              ),
              ')',
              ''
            ),
            ' ',
            ''
          ),
          'kali',
          ''
        )
      ) = LOWER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(TRIM(s.name), 'National Park', ''),
                '(',
                ''
              ),
              ')',
              ''
            ),
            ' ',
            ''
          ),
          'kali',
          ''
        )
      )
    LEFT JOIN Animals a
      ON a.sanctuary_id = s.id
    LEFT JOIN Poaching_Incidents pi
      ON pi.sanctuary_id = s.id
    GROUP BY s.id, s.name, s.location, s.area, p.famous, p.image, p.activity
    ORDER BY s.id
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Parks fetch failed:", err);
      return res.status(500).json({ success: false, message: "Unable to load parks" });
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
        animals: Number(row.animals) || 0,
        species: Number(row.species) || 0,
        endangered: Number(row.endangered) || 0,
        poaching: Number(row.poaching) || 0,
        activity,
      };
    });

    return res.json({ success: true, data });
  });
});

module.exports = router;
