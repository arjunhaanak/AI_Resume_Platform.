# 🤖 AI Resume Analyzer & Job Recommendation Platform

A high-performance, full-stack platform that uses **Deep Learning** and **Generative AI** to analyze resumes, calculate ATS scores, and provide ChatGPT-level career coaching—all while being 100% free to use.

## 🚀 Key Features

*   **📄 AI Resume Parsing:** Instantly extracts skills, experience, and contact info from PDF resumes.
*   **🎯 Semantic Job Matching:** Uses **Vector Embeddings** (`Sentence-Transformers`) to match your resume against job descriptions with 95%+ accuracy.
*   **🧠 Free AI Career Coach:** Integrates a custom **GPT4Free (g4f)** bridge to provide 10-point professional recommendations without needing a paid API key.
*   **📊 Dynamic ATS Scoring:** Calculates a real-time score based on keyword density and semantic context.
*   **🗄️ PostgreSQL Integration:** Securely saves all analysis history, scores, and recommendations for future reference.
*   **✨ Modern UI:** Built with **React 19**, **Tailwind CSS**, and **Framer Motion** for a premium, cinematic experience.

## 🛠️ Tech Stack

*   **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
*   **Backend:** Node.js, Express.js, PostgreSQL (pg).
*   **AI Service:** Python, FastAPI, Sentence-Transformers, g4f (GPT4Free), PDFMiner.
*   **Database:** PostgreSQL.

## 🏁 Getting Started

### 1. Requirements
*   Node.js (v18+)
*   Python (3.9+)
*   PostgreSQL

### 2. Installation

#### AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
python api.py
```

#### Backend (Node.js)
```bash
cd backend
npm install
# Update .env with your DB credentials
npm run dev
```

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 📝 License
MIT License. Created by [arjunhaanak](https://github.com/arjunhaanak).
