-- Core Entity: Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120),
    email VARCHAR(120) UNIQUE,
    password TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Entity: Resumes (includes vector embeddings for FAANG-level matching)
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resume_file TEXT,
    parsed_text TEXT,
    parsed_skills JSONB,
    experience_years INT,
    education TEXT,
    -- Store embedding vector as JSON/Array (if using pgvector, this would be vector(384) or similar)
    embedding_vector JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Entity: Jobs 
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    description TEXT,
    required_skills JSONB,
    location VARCHAR(120),
    salary_range VARCHAR(120),
    job_embedding JSONB, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Tracking
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    match_score FLOAT, -- ATS Score %
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
