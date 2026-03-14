const db = require('./db'); // This will log "Connected to the PostgreSQL database" to your terminal
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Test Database Connection on Startup
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database Connection Error:', err.message);
    console.log('👉 Make sure you created the database "resume_platform" and updated .env with your password.');
  } else {
    console.log('✅ Database Connection Verified at:', res.rows[0].now);
  }
});

app.use(cors());
app.use(express.json());

// Routes setup
app.use("/api/auth", require("./routes/auth"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/match", require("./routes/match"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway & Backend serving on port ${PORT}`);
});
