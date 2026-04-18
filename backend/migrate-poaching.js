const db = require("./db");

console.log("Adding new columns to Poaching_Incidents table...\n");

const alterSql = `
  ALTER TABLE Poaching_Incidents
  ADD COLUMN location VARCHAR(120) DEFAULT 'Unknown',
  ADD COLUMN animal_targeted VARCHAR(120) DEFAULT 'Unknown',
  ADD COLUMN status VARCHAR(50) DEFAULT 'Open'
`;

db.query(alterSql, (err, result) => {
  if (err) {
    console.error("ERROR altering table:", err.code, err.sqlMessage);
    process.exit(1);
  }
  console.log("✓ Added columns: location, animal_targeted, status");

  // Seed some data for the new columns
  const updateSql = `
    UPDATE Poaching_Incidents SET
      location = CASE id
        WHEN 1 THEN 'Zone A - Northern Boundary'
        WHEN 2 THEN 'River Bank Area'
        WHEN 3 THEN 'Buffer Zone - East Side'
        WHEN 4 THEN 'Forest Patrol Route 5'
        WHEN 5 THEN 'Southern Perimeter'
        ELSE 'Unknown'
      END,
      animal_targeted = CASE id
        WHEN 1 THEN 'Tiger'
        WHEN 2 THEN 'Elephant'
        WHEN 3 THEN 'Leopard'
        WHEN 4 THEN 'Deer'
        WHEN 5 THEN 'Wild Boar'
        ELSE 'Unknown'
      END,
      status = CASE id
        WHEN 1 THEN 'Investigating'
        WHEN 2 THEN 'Resolved'
        WHEN 3 THEN 'Open'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Investigating'
        ELSE 'Open'
      END
    WHERE id IN (1,2,3,4,5)
  `;

  console.log("Seeding data for new columns...\n");
  db.query(updateSql, (updateErr, updateResult) => {
    if (updateErr) {
      console.error("ERROR seeding data:", updateErr.code, updateErr.sqlMessage);
      process.exit(1);
    }
    console.log("✓ Seeded data for", updateResult.affectedRows, "existing records");

    // Add a few more poaching incidents
    const insertSql = `
      INSERT INTO Poaching_Incidents (sanctuary_id, date, location, animal_targeted, description, status) VALUES
      (1, '2024-04-20', 'Western Ridge', 'Tiger', 'Suspicious tracks found near waterhole', 'Open'),
      (2, '2024-04-18', 'Dense Forest Area', 'Elephant', 'Illegal ivory trade attempt thwarted', 'Resolved'),
      (3, '2024-04-22', 'Patrol Zone 3', 'Leopard', 'Camera trap captured poacher activity', 'Investigating'),
      (4, '2024-04-25', 'Mountain Trail', 'Deer', 'Poachers arrested with hunting equipment', 'Resolved'),
      (5, '2024-04-28', 'River Crossing', 'Python', 'Snare traps discovered and removed', 'Open')
    `;

    console.log("Adding additional poaching incidents...\n");
    db.query(insertSql, (insertErr, insertResult) => {
      if (insertErr) {
        console.error("ERROR inserting new records:", insertErr.code, insertErr.sqlMessage);
        process.exit(1);
      }
      console.log("✓ Added", insertResult.affectedRows, "new poaching incidents");

      const countSql = `SELECT COUNT(*) as total FROM Poaching_Incidents`;
      db.query(countSql, (countErr, rows) => {
        if (countErr) {
          console.error("ERROR counting records:", countErr);
          process.exit(1);
        }
        console.log("✓ Total poaching incidents in database:", rows[0].total);
        db.end?.();
        process.exit(0);
      });
    });
  });
});
