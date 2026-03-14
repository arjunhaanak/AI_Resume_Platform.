const express = require("express");
const router = express.Router();

// GET all jobs
router.get("/", (req, res) => {
  res.json([
    { id: 1, title: "Frontend Developer", required_skills: ["React", "JavaScript"] },
    { id: 2, title: "Backend Developer", required_skills: ["Node.js", "PostgreSQL"] },
  ]);
});

// POST add new job
router.post("/", (req, res) => {
  res.json({ message: "Job created" });
});

module.exports = router;
