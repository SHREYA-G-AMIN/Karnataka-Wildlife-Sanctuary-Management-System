const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    async (err, result) => {
      if (err) {
        console.log("Login failed:", err);
        return res.status(500).json({ success: false, message: "Unable to process login" });
      }

      if (result.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      if (!emailUser || !emailPass) {
        console.log("Email not configured: EMAIL_USER/EMAIL_PASS missing");
        return res.json({ success: true });
      }

      try {
        await transporter.sendMail({
          from: emailUser,
          to: email,
          subject: "Login Successful",
          text: "You have successfully logged into the Karnataka Wildlife Sanctuary Management System \u{1F33F}",
        });
      } catch (mailErr) {
        console.log("Email send failed:", mailErr);
      }

      return res.json({ success: true });
    }
  );
});

module.exports = router;

