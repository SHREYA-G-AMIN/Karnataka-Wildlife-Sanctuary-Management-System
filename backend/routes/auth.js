const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
    console.log(req.body);
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      res.json({
        message: "Login success",
        role: result[0].role
      });
    }
  );
});

module.exports = router;