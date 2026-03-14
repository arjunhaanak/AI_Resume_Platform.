const express = require("express");
const router = express.Router();

// GET job matches for a specific user ID
router.get("/:userId", (req, res) => {
  res.json({
    user_id: req.params.userId,
    matches: [
      { job_id: 1, title: "Frontend Developer", score: 92.5 },
      { job_id: 2, title: "Backend Developer", score: 75.0 }
    ]
  });
});

module.exports = router;
