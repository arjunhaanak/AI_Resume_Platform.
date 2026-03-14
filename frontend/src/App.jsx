import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Upload, FileText, CheckCircle, Briefcase, Zap, Brain, ShieldAlert, Award, History, X, Clock } from 'lucide-react';
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
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminJobs, setAdminJobs] = useState([]);
  const [view, setView] = useState("home"); // "home" or "admin"

  const fetchAdminJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs");
      if (response.data.success) {
        setAdminJobs(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin jobs", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resume/history");
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const selectHistoryItem = (item) => {
    let extraData = {};
    try {
      extraData = JSON.parse(item.summary);
    } catch (e) {
      console.error("Error parsing history item data", e);
    }

    setResults({
      atsScore: parseFloat(item.ats_score),
      recommendations: item.recommendations,
      skills: extraData.skills || [],
      missingSkills: extraData.missingSkills || [],
      matches: extraData.matches || []
    });
    setShowHistory(false);
  };

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent underline decoration-blue-500/20 underline-offset-8">NexusAI</h1>
            <p className="text-sm text-slate-400">FAANG-Level Candidate Analytics & Job Pairing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setShowHistory(true); fetchHistory(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-dark-800 hover:bg-dark-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <History className="w-5 h-5 text-blue-400"/> Scan History
          </button>
          <button 
                onClick={() => {
                    if (view === "admin") setView("home");
                    else {
                        const pass = prompt("Enter Admin Password:");
                        if (pass === "admin123") {
                            setIsAdmin(true);
                            setView("admin");
                            fetchAdminJobs();
                        } else {
                            alert("Invalid Password");
                        }
                    }
                }}
                className={`hidden md:flex btn-primary ${view === "admin" ? "bg-indigo-600" : ""}`}
            >
            <Award className="w-5 h-5"/> {view === "admin" ? "Exit Dashboard" : "Admin Dashboard"}
          </button>
        </div>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto space-y-12">
        
        {/* ADMIN ANALYTICS VIEW */}
        {view === "admin" && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Analyzed Job Descriptions</h2>
                    <div className="bg-blue-600/20 px-4 py-2 rounded-lg border border-blue-500/30 text-blue-400 font-bold">
                        Total Scans: {adminJobs.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {adminJobs.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-slate-500 glass-card">
                            No job description analysis data recorded yet.
                        </div>
                    ) : (
                        adminJobs.map((job) => (
                            <motion.div 
                                key={job.id}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 border-l-4 border-l-blue-500 hover:bg-dark-800 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Briefcase className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <span className="text-xs text-slate-500 bg-dark-900 px-2 py-1 rounded border border-slate-800">
                                        {new Date(job.uploaded_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-1">{job.company_name}</h4>
                                <p className="text-slate-400 text-sm mb-4">{job.job_title}</p>
                                <div className="flex items-center gap-2 text-xs text-blue-500 font-bold tracking-wider opacity-60">
                                    <Clock className="w-3 h-3" /> SCANNED ON {new Date(job.uploaded_at).toLocaleTimeString()}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        )}

        {/* HERO UPLOAD SECTION */}
        {view === "home" && !results && !analyzing && (
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

        {/* HISTORY MODAL / OVERLAY */}
        {showHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-dark-900/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-dark-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-dark-900">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <History className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analysis History</h2>
                    <p className="text-slate-400">Access your previously scanned resumes</p>
                  </div>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <FileText className="w-20 h-20 mb-4" />
                    <p className="text-xl">No scans found in database</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => selectHistoryItem(item)}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-dark-900/50 border border-slate-800 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all hover:bg-dark-900"
                    >
                      <div className="flex items-center gap-5 mb-4 md:mb-0">
                        <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                          <FileText className="w-7 h-7 text-slate-400 group-hover:text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{item.filename}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(item.uploaded_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 font-semibold text-blue-500/80 tracking-widest">{item.ats_score}% Match Score</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-5 py-2 bg-slate-800 rounded-xl text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm font-bold">
                        View Analysis
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

