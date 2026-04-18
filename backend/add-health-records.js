const db = require("./db");

const newRecords = `
  INSERT INTO health_records (animal_id, checkup_date, \`condition\`, treatment, vet_name) VALUES
  (2, '2024-02-15', 'Dental issues', 'Professional cleaning', 'Dr. Rajesh Kumar'),
  (3, '2024-03-20', 'Healthy', 'Regular physical exam', 'Dr. Meera Rao'),
  (4, '2024-04-01', 'Digestive disorder', 'Specialized diet plan', 'Dr. Arun Patel'),
  (5, '2024-03-28', 'Weight management', 'Exercise and diet monitoring', 'Dr. Neha Singh'),
  (6, '2024-04-05', 'Skin infection', 'Antifungal treatment', 'Dr. Rajesh Kumar'),
  (8, '2024-04-12', 'Joint pain', 'Physical therapy and supplements', 'Dr. Meera Rao'),
  (9, '2024-03-15', 'Healthy', 'Annual checkup', 'Dr. Arun Patel'),
  (10, '2024-04-08', 'Eye inflammation', 'Antibiotic eye drops', 'Dr. Neha Singh'),
  (11, '2024-04-11', 'Healthy', 'Quarterly monitoring', 'Dr. Rajesh Kumar'),
  (13, '2024-04-16', 'Parasitic infection', 'Deworming medication', 'Dr. Meera Rao'),
  (14, '2024-03-25', 'Behavioral stress', 'Environmental enrichment', 'Dr. Arun Patel'),
  (15, '2024-04-02', 'Healthy', 'Vaccination update', 'Dr. Neha Singh')
`;

console.log("Adding more health records...\n");
db.query(newRecords, (err, result) => {
  if (err) {
    console.error("ERROR inserting records:", err.code, err.sqlMessage);
    process.exit(1);
  }
  console.log("✓ Added", result.affectedRows, "new health records!");

  const countSql = `SELECT COUNT(*) as total FROM health_records`;
  db.query(countSql, (countErr, rows) => {
    if (countErr) {
      console.error("ERROR counting records:", countErr);
      process.exit(1);
    }
    console.log("✓ Total health records in database:", rows[0].total);

    const listSql = `
      SELECT hr.id, hr.animal_id, a.name, hr.checkup_date, hr.\`condition\`, hr.vet_name
      FROM health_records hr
      INNER JOIN animals a ON hr.animal_id = a.id
      ORDER BY hr.checkup_date DESC
      LIMIT 20
    `;
    
    console.log("\nRecent health records:");
    db.query(listSql, (listErr, rows) => {
      if (listErr) {
        console.error("ERROR listing records:", listErr);
        process.exit(1);
      }
      console.table(rows);
      db.end?.();
      process.exit(0);
    });
  });
});
