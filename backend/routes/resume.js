const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const db = require('../db'); // Database Connection

// File Upload Config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// POST Upload Resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const jobDescription = req.body.jobDescription || "";

    // Call the dynamic Python AI Pipeline
    const aiResponse = await axios.post("http://localhost:8000/parse-resume", { 
      file_path: filePath,
      job_description: jobDescription
    });
    
    const results = aiResponse.data;

    // 💾 SAVE TO DATABASE
    const queryText = `
      INSERT INTO resumes (filename, ats_score, summary, recommendations, company_name, job_title)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const queryValues = [
      req.file.filename,
      results.ats_score,
      JSON.stringify({
        skills: results.skills,
        missingSkills: results.missingSkills,
        matches: results.matches
      }),
      results.recommendations,
      results.company_name || "Unknown Company",
      results.job_title || "Software Engineer"
    ];

    await db.query(queryText, queryValues);
    console.log('✅ Analysis results saved to PostgreSQL!');

    // Relay dynamic vector analysis back to React Dashboard
    res.json({
      success: true,
      message: "Resume Dynamically Analyzed",
      data: {
        skills: results.skills,
        atsScore: results.ats_score,
        missingSkills: results.missingSkills,
        matches: results.matches,
        recommendations: results.recommendations
      }
    });

  } catch (error) {
    console.error("Pipeline Communication Error: ", error.message);
    res.status(500).json({ error: "Failed to process resume dynamically." });
  }
});

// GET Resume History
router.get("/history", async (req, res) => {
  try {
    const queryText = "SELECT * FROM resumes ORDER BY uploaded_at DESC";
    const { rows } = await db.query(queryText);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error("History Fetch Error:", error.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
