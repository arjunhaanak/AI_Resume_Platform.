import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure the API key if available
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_recommendations(resume_text, job_description, missing_skills):
    """
    Generate recommendations acting as a ChatGPT-like AI model 
    advising a candidate on how to improve their resume.
    """
    if not job_description or len(job_description.strip()) < 10:
        return "Please provide a more detailed Job Description for tailored ChatGPT-like AI recommendations."

    prompt = f"""
    Act as an expert Technical Recruiter and Career Coach. 
    Analyze the following resume against the provided job description.
    
    Job Description:
    {job_description}
    
    Candidate Resume Text:
    {resume_text}
    
    Missing Key Skills Identified by our ATS:
    {', '.join(missing_skills) if missing_skills else 'None'}
    
    Provide actionable, highly specific recommendations on how to improve this resume for this exact job description.
    Focus on impact, quantifying achievements, and bridging specific skill gaps.
    
    Structure the response into exactly this 10-point format:
    
    Based on your resume and the requirements of [Target Job Title - Target Company], your profile is [Assessment], but a few small improvements can significantly increase your chances.
    I reviewed your resume content. Here are targeted recommendations specifically for this job.

    1️⃣ Update Your Summary to Match the Job Role
    (Suggest a 4-bullet point specialized summary tailored to the JD)

    2️⃣ Highlight the Correct Tech Stack (Important)
    (Provide a categorized list: Languages, Frontend, Backend, Tools, etc.)

    3️⃣ Add One Bullet Showing Problem Solving
    (Suggest a bullet point about DSA/Logic)

    4️⃣ Improve Internship Impact Statements
    (Give a "Before" vs "Better" comparison)

    5️⃣ Add GitHub Projects (Very Important)
    (Suggest specific projects to showcase)

    6️⃣ Add One AI/ML Project (Optional but Powerful)
    (Suggest an AI project if relevant to the JD)

    7️⃣ Add Git Workflow Experience
    (Suggest a collaboration bullet)

    8️⃣ Slight Resume Formatting Fix
    (Suggest a layout tweak like 'Project Name | Tech Stack')

    9️⃣ Strength of Your Resume for This Job
    (List the top 3-5 existing strengths)

    🔟 One Line You Should Definitely Add
    (A final call-to-action line for the end of the resume)

    Keep the tone professional, objective, and highly actionable. Use Markdown for clear visual separation.
    """
    
    # 1. Try Gemini if API key is provided
    if api_key:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error calling Gemini AI: {e}", flush=True)
            
    # 2. Try G4F (GPT4Free) Free AI
    try:
        from g4f.client import Client
        client = Client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content + "\n\n*(Powered by Free AI / GPT4Free)*"
    except Exception as e:
        print(f"Error calling Free AI: {e}", flush=True)

    # 3. Fallback to offline mock logic if all else fails
    return _mock_recommendations(missing_skills)

def _mock_recommendations(missing_skills):
    skills_text = ", ".join(missing_skills) if missing_skills else 'any obvious gaps'
    return f"""Based on your resume and the requirements of the job, your profile is already quite aligned, but a few small improvements can significantly increase your chances.
I reviewed your resume content. Here are targeted recommendations specifically for this job.

1️⃣ **Update Your Summary to Match the Job Role**
You can modify it like this:
- Software Development Engineer with strong foundations in Data Structures and Full-Stack Development.
- Experienced in building scalable web applications using the tech stack required in the JD.
- Skilled in backend architecture, API design, and database optimization.
- Passionate about problem solving and building high-performance software systems.

2️⃣ **Highlight the Correct Tech Stack (Important)**
- **Languages:** Python, JavaScript, Java (Basic)
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, FastAPI, SQL
- **Database:** PostgreSQL, MongoDB
- **Tools:** Git, Docker, Postman

3️⃣ **Add One Bullet Showing Problem Solving**
- "Solved 150+ Data Structures and Algorithms problems on coding platforms, strengthening problem-solving and algorithmic thinking."

4️⃣ **Improve Internship Impact Statements**
- **Current:** Integrated frontend components with Python backend.
- **Better:** "**Architected** modular UI components and integrated them with Python backend services via REST APIs, improving application maintainability by **30%**."

5️⃣ **Add GitHub Projects (Very Important)**
- Ensure your GitHub includes: AI Resume Analyzer, Full-Stack E-commerce, and a REST API Project.

6️⃣ **Add One AI/ML Project (Optional but Powerful)**
- "Built an expense prediction model using Scikit-learn integrated with a React dashboard for real-time financial insights."

7️⃣ **Add Git Workflow Experience**
- "Experienced with Git version control, branching strategies, and collaborative development workflows."

8️⃣ **Slight Resume Formatting Fix**
- Change project headers to: **Project Name | Tech Stack: Python, React, SQL**

9️⃣ **Strength of Your Resume for This Job**
✔ Strong internship background
✔ Relevant full-stack projects
✔ Experience with REST APIs and databases

🔟 **One Line You Should Definitely Add**
"Actively seeking Software Development Engineer (SDE) roles – Passionate about building scalable, AI-integrated solutions."

*(Note: Provide a GEMINI_API_KEY in the ai-service .env file or rely on internet connectivity for free AI analysis)*
"""
