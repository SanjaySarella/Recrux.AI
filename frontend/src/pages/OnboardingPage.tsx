import React from 'react';
import { RefreshCw, Upload, ChevronRight, Lock } from 'lucide-react';

interface OnboardingPageProps {
  onSearchJobs: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAnalyzing: boolean;
  roleName: string;
  setRoleName: (val: string) => void;
}

export default function OnboardingPage({ onSearchJobs, onUpload, isAnalyzing, roleName, setRoleName }: OnboardingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <span className="text-indigo-600 text-xl font-bold tracking-tight">RECRUX<span className="text-slate-900">.AI</span></span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                {isAnalyzing ? "Analyzing your potential..." : "Scanning your potential."}<br />
                <strong>{isAnalyzing ? "Our agents are thinking..." : "Finding where you belong next."}</strong>
              </h1>
              <p className="text-slate-500 text-lg">
                {isAnalyzing ? "We are extracting your skills and finding the best matches using Gemini 3 Flash." : "Upload your resume to start receiving AI-matched job opportunities tailored just for you."}
              </p>
            </div>

            <div className={`space-y-10 ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">1. Upload your Resume</label>
                <div className="relative group cursor-pointer">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-indigo-600 group-hover:bg-indigo-50/30 transition-all rounded-2xl p-12 bg-slate-50/50">
                    {isAnalyzing ? (
                      <RefreshCw className="text-indigo-600 w-10 h-10 mb-4 animate-spin" />
                    ) : (
                      <Upload className="text-indigo-600 w-10 h-10 mb-4" />
                    )}
                    <p className="text-slate-900 font-semibold mb-1">{isAnalyzing ? "Processing..." : "Drag and drop your file here"}</p>
                    <p className="text-slate-500 text-sm">PDF, DOCX up to 10MB</p>
                    <button className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all">
                      Browse Files
                    </button>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onUpload} disabled={isAnalyzing} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">2. What role are you looking for?</label>
                <input 
                  type="text" 
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all shadow-sm font-semibold"
                  placeholder="e.g. Frontend Developer, Data Scientist..."
                />
              </div>

              <div className="pt-8 space-y-4">
                <button onClick={onSearchJobs} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-sm">
                  <span>SEARCH JOBS</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="text-center">
                  <button onClick={onSearchJobs} className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest transition-colors">
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Your data is secure and encrypted
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
