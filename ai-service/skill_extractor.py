# A basic tech skill database (In production, you could use a heavier NLP Named Entity Recognizer model)
skills_db = [
    "python", "java", "javascript", "react", "node", "sql", "postgresql",
    "machine learning", "deep learning", "docker", "fastapi", "html", "css",
    "kubernetes", "aws", "git", "mongodb", "nodejs", "express", "django",
    "flask", "c++", "c#", "ruby", "php", "typescript", "golang", "rust",
    "azure", "gcp", "redis", "linux", "graphql", "rest api", "pandas", "numpy",
    "pytorch", "tensorflow", "scikit-learn", "tailwind", "bootstrap", "next.js",
    "vue", "angular", "firebase", "mysql", "sqlite", "oracle", "devops", "cicd"
]

def extract_skills(text):
    text_lower = text.lower()
    found_skills = []
    
    # NLP keyword extraction
    for skill in skills_db:
        if skill in text_lower:
            found_skills.append(skill)
            
    return list(set(found_skills))
