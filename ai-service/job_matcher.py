try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    import logging
    logging.error(f"Error loading sentence_transformers or model: {e}")
    model = None

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Mock FAANG jobs to show semantic vector matching dynamically
FAANG_JOBS = [
    {
        "id": 1,
        "title": "Senior Frontend Engineer",
        "company": "Google",
        "salary": "$160k - $210k",
        "description": "Expert in React, JavaScript, HTML, CSS. Experience with frontend performance optimization and modern web frameworks.",
        "required_skills": ["react", "javascript", "html", "css", "typescript"]
    },
    {
        "id": 2,
        "title": "Backend Software Engineer",
        "company": "Stripe",
        "salary": "$150k - $190k",
        "description": "Strong experience with Node.js, Python, PostgreSQL, REST APIs. Designing scalable microservices.",
        "required_skills": ["node", "python", "postgresql", "rest api", "docker"]
    },
    {
        "id": 3,
        "title": "Machine Learning Engineer",
        "company": "Meta",
        "salary": "$170k - $220k",
        "description": "Deep learning, PyTorch, Python, Docker, Kubernetes. Experience deploying AI models to production.",
        "required_skills": ["python", "machine learning", "deep learning", "docker", "kubernetes"]
    },
    {
         "id": 4,
         "title": "Cloud DevOps Engineer",
         "company": "Amazon AWS",
         "salary": "$140k - $180k",
         "description": "Expertise in AWS, Kubernetes, Docker, Linux, CI/CD pipelines.",
         "required_skills": ["aws", "kubernetes", "docker", "linux"]
    }
]

if model:
    job_descriptions = [job["description"] for job in FAANG_JOBS]
    job_embeddings = model.encode(job_descriptions)

def match_jobs(resume_text, extracted_skills, custom_job_description=None):
    if not resume_text or not model:
        return {"matches": [], "atsScore": 0, "missingSkills": []}

    # 1. Convert candidate resume into a Vector Embedding
    resume_embedding = model.encode([resume_text])
    
    # Custom Job Description flow
    if custom_job_description and len(custom_job_description.strip()) > 10:
        custom_job_embedding = model.encode([custom_job_description])
        similarity = cosine_similarity(resume_embedding, custom_job_embedding)[0][0]
        score = float(similarity) * 100
        
        # Super primitive fake "required skills" for the custom job by extracting from it
        # Actually, let's just cheat and lowercase split for common tech
        common_tech = {"react", "javascript", "html", "css", "node", "python", "java", "sql", "aws", "docker", "machine learning"}
        jd_words = custom_job_description.lower().split()
        custom_required_skills = [s for s in common_tech if s in jd_words or s.replace(" ", "") in jd_words]
        
        missing_skills = list(set(custom_required_skills) - set(extracted_skills))
        
        # Calculate dynamic ATS score for the custom JD
        keyword_score = min(len(extracted_skills) * 4, 30) 
        ats_score = round((score * 0.70) + keyword_score, 1)
        if ats_score > 100: ats_score = 100
        elif ats_score < 0: ats_score = 0
        
        return {
            "matches": [{
                "title": "Custom Job Analysis",
                "company": "Target Company",
                "salary": "N/A",
                "match": round(score, 1),
                "required_skills": custom_required_skills
            }],
            "atsScore": ats_score,
            "missingSkills": missing_skills
        }
    
    # Default behavior (FAANG Mock Jobs)
    # 2. Compare resume vector against all job description vectors (Cosine Similarity)
    similarities = cosine_similarity(resume_embedding, job_embeddings)[0]
    
    matches = []
    for i, job in enumerate(FAANG_JOBS):
        score = float(similarities[i]) * 100
        matches.append({
            "title": job["title"],
            "company": job["company"],
            "salary": job["salary"],
            "match": round(score, 1),
            "required_skills": job["required_skills"]
        })
        
    # Sort by highest match to find the best fit
    matches = sorted(matches, key=lambda x: x["match"], reverse=True)
    best_match = matches[0] if matches else None
    
    if best_match:
        # Calculate skill gap based on the BEST job fit for this specific user
        missing_skills = list(set(best_match["required_skills"]) - set(extracted_skills))
        # ATS Algorithm: 70% semantic context + 30% keyword hit rate
        keyword_score = min(len(extracted_skills) * 4, 30) 
        ats_score = round((best_match["match"] * 0.70) + keyword_score, 1)
        if ats_score > 100: ats_score = 100
        elif ats_score < 0: ats_score = 0
    else:
        missing_skills = []
        ats_score = 0
    
    return {
        "matches": matches[:3], # Top 3 jobs
        "atsScore": ats_score,
        "missingSkills": missing_skills
    }
