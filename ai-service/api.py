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

    # 🧠 SMARTER EXTRACTION FOR DASHBOARD
    jd_text = (request.job_description or "").strip()
    company_name = "Not Specified"
    job_title = "Target Role"
    
    if jd_text:
        jd_lines = jd_text.split('\n')
        first_line = jd_lines[0].lower()
        
        # Look for "at [Company]" or "[Company] is hiring"
        import re
        company_matches = re.findall(r"(?:at|for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)", jd_text)
        if company_matches:
            company_name = company_matches[0]
        elif len(jd_lines) > 0:
            # Fallback: Check first line for common patterns
            company_name = jd_lines[0].split('-')[0].split('|')[0].strip()

        # Look for Job Title patterns
        title_matches = re.findall(r"(?:Role|Position|Title|Hiring for)\s*[:\-]?\s*([A-Za-z\s]+)", jd_text, re.IGNORECASE)
        if title_matches:
            job_title = title_matches[0].strip()
        else:
            job_title = jd_lines[0][:50].strip() # Use first line snippet as title

    return {
        "text_snippet": text[:200] + "..." if len(text) > 200 else text,
        "skills": skills_for_chart,
        "ats_score": match_data["atsScore"],
        "missingSkills": missing,
        "matches": match_data["matches"],
        "recommendations": recommendations,
        "company_name": company_name,
        "job_title": job_title
    }

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
