const db = require("./db");

const createSql = `
  CREATE TABLE IF NOT EXISTS health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    checkup_date DATE NOT NULL,
    \`condition\` VARCHAR(120) NOT NULL,
    treatment VARCHAR(255) NOT NULL,
    vet_name VARCHAR(120) NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES animals(id)
  )
`;

console.log("Creating health_records table...\n");
db.query(createSql, (err) => {
  if (err) {
    console.error("ERROR creating table:", err.code, err.sqlMessage);
    process.exit(1);
  }
  console.log("✓ Table created (or already exists)");

  const insertSql = `
    INSERT IGNORE INTO health_records (id, animal_id, checkup_date, \`condition\`, treatment, vet_name) VALUES
    (1, 1, '2024-03-05', 'Routine checkup', 'Vaccination and dietary supplement', 'Dr. Meera Rao'),
    (2, 7, '2024-04-10', 'Minor injury', 'Wound cleaning and antibiotics', 'Dr. Arun Patel'),
    (3, 12, '2024-04-14', 'Respiratory issues', 'Nebulizer therapy', 'Dr. Neha Singh')
  `;
  
  console.log("Seeding sample data...\n");
  db.query(insertSql, (insertErr, result) => {
    if (insertErr) {
      console.error("ERROR seeding data:", insertErr.code, insertErr.sqlMessage);
      process.exit(1);
    }
    console.log("✓ Seed data inserted:", result.affectedRows, "rows");

    const testSql = `
      SELECT
        hr.id, hr.animal_id, a.name AS animal_name, 
        hr.checkup_date, hr.\`condition\`, hr.treatment, hr.vet_name
      FROM health_records hr
      INNER JOIN animals a ON hr.animal_id = a.id
      ORDER BY hr.checkup_date DESC
    `;

    console.log("\nTesting query...\n");
    db.query(testSql, (testErr, rows) => {
      if (testErr) {
        console.error("ERROR querying:", testErr.code, testErr.sqlMessage);
        process.exit(1);
      }
      console.log("✓ Query successful! Found", rows.length, "records:");
      console.log(rows);
      db.end?.();
      process.exit(0);
    });
  });
});
