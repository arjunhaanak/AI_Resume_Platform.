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
      INSERT INTO resumes (filename, ats_score, summary, recommendations)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const queryValues = [
      req.file.filename,
      results.ats_score,
      "AI Generated Summary", // You can expand this if you have a separate summary field
      results.recommendations
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

module.exports = router;
