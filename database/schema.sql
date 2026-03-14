-- 🚀 AI Resume Platform - Database Schema
-- Run this in pgAdmin Query Tool to set up your database

-- 1. Create Users Table (For authentication and profile management)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Resumes Table (Stores analysis results, scan history, and admin tracking)
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Optional: links resume to a specific user
    filename VARCHAR(255) NOT NULL,
    ats_score DECIMAL(5,2),
    summary TEXT,           -- Stores JSON-stringified: {skills, missingSkills, matches}
    recommendations TEXT,    -- Stores the full 10-point AI career coach message
    company_name VARCHAR(255) DEFAULT 'Unknown Company',
    job_title VARCHAR(255) DEFAULT 'Software Engineer',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💡 Pro Tip: To reset your database during development, you can run:
-- DROP TABLE resumes;
-- DROP TABLE users;
