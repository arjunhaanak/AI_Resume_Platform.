const express = require("express");
const router = express.Router();

// Placeholder for Login
router.post("/login", (req, res) => {
  res.json({ message: "Login successful", token: "mock_jwt_token" });
});

// Placeholder for Register
router.post("/register", (req, res) => {
  res.json({ message: "Registration successful" });
});

module.exports = router;
