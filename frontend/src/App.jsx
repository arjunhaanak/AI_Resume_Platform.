import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Upload, FileText, CheckCircle, Briefcase, Zap, Brain, ShieldAlert, Award } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      setAnalyzing(true);
      
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      try {
        const response = await axios.post("http://localhost:5000/api/resume/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (response.data.success) {
          setResults(response.data.data);
        } else {
          alert("Error: " + response.data.error);
        }
      } catch (error) {
        console.error("Upload error", error);
        alert("Failed to analyze resume. Ensure both Node Express (5000) and Python FastAPI (8000) servers are running.");
      } finally {
        setAnalyzing(false);
      }
    } else {
        alert("Please select a resume file first.");
    }
  };


  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans p-6 md:p-12 selection:bg-blue-500/30">
      
      {/* HEADER */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-12 glass-card p-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">NexusAI</h1>
            <p className="text-sm text-slate-400">FAANG-Level Candidate Analytics & Job Pairing</p>
          </div>
        </div>
        <button className="hidden md:flex btn-primary">
          <Award className="w-5 h-5"/> Admin Dashboard
        </button>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO UPLOAD SECTION */}
        {!results && !analyzing && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-6 text-white tracking-tight">
              Unlock Your <span className="text-blue-500">Career Vector</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl text-center mb-10">
              Transform your resume into infinite possibilities. Compare against a target Job Description for AI-powered ChatGPT-like recommendations.
            </p>

            <form onSubmit={handleUpload} className="w-full max-w-2xl flex flex-col gap-6">
              <label className="relative group cursor-pointer w-full">
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.docx,.txt" />
                <div className="glass-card flex flex-col items-center p-12 transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-dark-800">
                  <div className="p-5 bg-blue-500/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {file ? file.name : "Upload Resume"}
                  </h3>
                  <p className="text-slate-400 text-sm">PDF, DOCX up to 5MB</p>
                </div>
              </label>

              <div className="glass-card p-6 flex flex-col">
                <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4"/> Target Job Description (Optional)
                </label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the Job Description here for AI-tailored resume recommendations..."
                  className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 min-h-[120px] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <button type="submit" className="btn-primary py-4 text-lg w-full flex justify-center items-center gap-2">
                <Brain className="w-6 h-6"/> Analyze Match & Get Recommendations
              </button>
            </form>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-500/20 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
              <Brain className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">Extracting Embeddings...</h3>
            <p className="text-slate-500">Running Deep Neural Networks on skills and experience</p>
          </motion.div>
        )}

        {/* RESULTS DASHBOARD */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ATS Score Overview */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-1 glass-card p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold mb-8 text-white w-full text-left">ATS Parse Accuracy</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: results.atsScore }, { value: 100 - results.atsScore }]}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                      startAngle={90} endAngle={-270}
                      dataKey="value" stroke="none"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#1e293b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2">
                <span className="text-4xl font-extrabold text-white">{results.atsScore}%</span>
              </div>
              <p className="mt-6 text-slate-300">Your resume passed the semantic filters with high precision.</p>
            </motion.div>

            {/* Extracted Skills */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass-card p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400"/> Skill Graph Analysis</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.skills} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {results.skills.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Missing Skills / Gap Analysis */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 glass-card p-8 border-t-4 border-t-amber-500"
            >
              <h3 className="text-xl font-bold text-white flex items-center mb-6 gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500"/> Skill Gap Analysis
              </h3>
              <p className="text-slate-400 text-sm mb-6">Based on FAANG job roles mapped to your resume, these skills are highly requested but missing:</p>
              <ul className="space-y-4">
                {results.missingSkills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-3 bg-dark-900 border border-slate-800 p-3 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-semibold">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* AI Recommendations */}
            {results.recommendations && (
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-3 glass-card p-8 border-t-4 border-t-indigo-500"
              >
                <h3 className="text-xl font-bold text-white flex items-center mb-6 gap-2">
                  <Brain className="w-6 h-6 text-indigo-400"/> ChatGPT-Level Career Coach Recommendations
                </h3>
                <div className="bg-dark-900 border border-slate-700 rounded-xl p-8 text-slate-300 font-medium leading-relaxed recommendation-content">
                  <ReactMarkdown>{results.recommendations}</ReactMarkdown>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default App;

