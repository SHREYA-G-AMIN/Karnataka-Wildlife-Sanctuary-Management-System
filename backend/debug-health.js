const db = require("./db");

const sql = `
  SELECT
    hr.id AS health_id,
    hr.animal_id,
    a.name AS animal_name,
    hr.checkup_date,
    hr.\`condition\`,
    hr.treatment,
    hr.vet_name
  FROM health_records hr
  INNER JOIN animals a ON hr.animal_id = a.id
  ORDER BY hr.checkup_date DESC, a.name
`;

console.log("Testing health query...\n");
db.query(sql, (err, rows) => {
  if (err) {
    console.error("ERROR:", {
      code: err.code,
      sqlMessage: err.sqlMessage,
      errno: err.errno,
    });
    console.log("\nQuery was:");
    console.log(sql);
  } else {
    console.log("SUCCESS - Found", rows.length, "rows");
    console.log("\nResults:");
    console.log(rows);
  }
  db.end?.();
  process.exit(err ? 1 : 0);
});
