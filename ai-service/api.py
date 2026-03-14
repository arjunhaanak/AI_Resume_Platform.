from fastapi import FastAPI, UploadFile, File
import uvicorn
from pydantic import BaseModel
from typing import Optional
from resume_parser import parse_resume
from skill_extractor import extract_skills
from job_matcher import match_jobs
from recommendation_engine import generate_recommendations

app = FastAPI(title="AI Resume Processing Service", version="1.0")

class ParseRequest(BaseModel):
    file_path: str
    job_description: Optional[str] = None

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Service API is live!"}

@app.post("/parse-resume")
async def parse(request: ParseRequest):
    # 1. Extact text dynamically from uploaded file
    text = parse_resume(request.file_path)
    
    # 2. Extract NLP skill tags
    raw_skills = extract_skills(text)
    
    # 3. Process Vector Similarity for Jobs and ATS Score
    match_data = match_jobs(text, raw_skills, request.job_description)
    
    # 4. Generate AI Recommendations (ChatGPT-like)
    missing = [s.title() for s in match_data["missingSkills"]]
    recommendations = generate_recommendations(text, request.job_description, missing)
    
    # Structure skills dynamically for React Recharts
    skills_for_chart = [{"name": s.title(), "score": 80 + (len(s) % 20)} for s in raw_skills]
    if not skills_for_chart:
        skills_for_chart = [{"name": "No Tech Skills Found", "score": 0}]

    return {
        "text_snippet": text[:200] + "..." if len(text) > 200 else text,
        "skills": skills_for_chart,
        "ats_score": match_data["atsScore"],
        "missingSkills": missing,
        "matches": match_data["matches"],
        "recommendations": recommendations
    }

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
