const express = require("express");
const router = express.Router();

const db = require("../db");

// GET all analyzed jobs (Admin Dashboard view)
router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, company_name, job_title, uploaded_at FROM resumes ORDER BY uploaded_at DESC";
    const { rows } = await db.query(query);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error("Jobs Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch analyzed jobs" });
  }
});

module.exports = router;
