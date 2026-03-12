import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  FileText,
  User,
  LogOut,
  Search,
  Upload,
  ChevronRight,
  Mail,
  Lock,
  ShieldCheck,
  Globe,
  MapPin,
  Plus,
  Eye,
  Download,
  Trash2,
  MoreVertical,
  Wand2,
  Bookmark,
  Building2,
  Clock,
  RefreshCw,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE = "http://127.0.0.1:8001/api";

type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'WELCOME' | 'ONBOARDING' | 'JOBS' | 'RESUME' | 'PROFILE';

interface ResumeData {
  skills: string[];
  ats_score: number;
  raw_text?: string;
}

interface JobListing {
  id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  job_listing_link: string;
  location?: string;
  match_score?: number;
  reasoning?: string;
}

export default function App() {
  const [view, setView] = useState<View>('LANDING');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [roleName, setRoleName] = useState('Software Engineer');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile/current_user`);
        if (response.ok) {
          const data = await response.json();
          setResumeData({
            skills: data.skills,
            ats_score: data.ats_score,
            raw_text: data.resume_text
          });
          setRoleName(data.role_name);
        }
      } catch (e) {
        console.log("No previous profile found.");
      }
    };
    loadProfile();
  }, []);

  const navigate = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role_name', roleName);

    try {
      // We use the orchestral match endpoint to get everything at once
      const response = await fetch(`${API_BASE}/jobs/match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze resume');

      const data = await response.json();
      
      // Update state with AI results
      setResumeData(data.parsed_resume);
      
      // Combine jobs with their scores
      const matchedJobs = data.job_listings.map((job: JobListing) => {
        const scoreEntry = data.scored_jobs.find((s: any) => s.job_id === job.id);
        return {
          ...job,
          match_score: scoreEntry?.match_score || 0,
          reasoning: scoreEntry?.reasoning || 'No analysis available.'
        };
      });

      setJobs(matchedJobs);
      navigate('JOBS');
    } catch (error) {
      console.error('API Error:', error);
      alert('Error analyzing resume. Please check if the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearchOnly = async (customRole?: string) => {
    setIsAnalyzing(true);
    const targetRole = customRole || roleName;
    const formData = new FormData();
    formData.append('role_name', targetRole);
    
    try {
      const response = await fetch(`${API_BASE}/jobs/search`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      const newJobs = data.jobs.map((job: any) => ({
        ...job,
        match_score: 0,
        reasoning: `Search result based on ${targetRole}.`
      }));
      
      setJobs(newJobs);
      setRoleName(targetRole); // Sync role name
      setSearchTerm('');
      navigate('JOBS');
    } catch (error) {
       alert("Error searching for jobs. Please check backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'LANDING':
        return <LandingPage onLogin={() => navigate('LOGIN')} onSignUp={() => navigate('SIGNUP')} />;
      case 'LOGIN':
        return <LoginPage onSignUp={() => navigate('SIGNUP')} onLogin={() => navigate('JOBS')} />;
      case 'SIGNUP':
        return <SignUpPage onLogin={() => navigate('LOGIN')} onSignUpSuccess={() => navigate('WELCOME')} />;
      case 'WELCOME':
        return <WelcomePage onNext={() => navigate('ONBOARDING')} />;
      case 'ONBOARDING':
        return <OnboardingPage onSearchJobs={handleSearchOnly} onUpload={handleFileUpload} isAnalyzing={isAnalyzing} roleName={roleName} setRoleName={setRoleName} />;
      case 'JOBS':
        return <DashboardLayout currentView="JOBS" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
          <JobsPage 
            jobs={jobs} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onSearch={() => handleSearchOnly(searchTerm)}
            isSearching={isAnalyzing}
          />
        </DashboardLayout>;
      case 'RESUME':
        return <DashboardLayout currentView="RESUME" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
          <ResumePage 
            atsScore={resumeData?.ats_score} 
            fileName={uploadedFileName} 
            onUpload={handleFileUpload}
          />
        </DashboardLayout>;
      case 'PROFILE':
        return <DashboardLayout currentView="PROFILE" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
          <ProfilePage skills={resumeData?.skills} roleName={roleName} />
        </DashboardLayout>;
      default:
        return <LandingPage onLogin={() => navigate('LOGIN')} onSignUp={() => navigate('SIGNUP')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

function LandingPage({ onLogin, onSignUp }: { onLogin: () => void, onSignUp: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-indigo-600">
              RECRUX<span className="text-slate-900">.AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8 text-sm font-semibold">
            <button onClick={onLogin} className="text-slate-600 hover:text-indigo-600 transition-colors">Login</button>
            <button onClick={onSignUp} className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">Sign up</button>
          </div>
        </nav>
      </header>

      <main className="relative flex-1 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Office"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6">
              Next-Gen Career Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 md:mb-8 leading-tight">
              Autonomous. <br />
              Relentless. <br />
              <span className="text-indigo-600">Hired.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              Tired of endlessly scrolling job boards? RECRUX.AI uses cutting-edge AI to surface the roles that actually fit you — based on your skills, goals, and potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onSignUp} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl shadow-indigo-200 transition-all text-lg">
                Get Started for Free
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-4 px-10 rounded-xl transition-all text-lg shadow-sm">
                How it works
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginPage({ onSignUp, onLogin }: { onSignUp: () => void, onLogin: () => void }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600">
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=2000"
          alt="Office"
          className="absolute inset-0 object-cover w-full h-full opacity-40"
        />
        <div className="relative z-20 flex flex-col justify-between p-12 w-full text-white">
          <span className="text-2xl font-bold tracking-tight">RECRUX.AI</span>
          <div className="max-w-md">
            <h1 className="text-5xl font-black leading-tight mb-6">
              No guesswork.<br />No bias.<br />
              <span className="text-indigo-200">Just results.</span>
            </h1>
          </div>
          <div className="text-sm opacity-60">© 2024 RECRUX.AI</div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 sm:p-12 md:p-24 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <div className="space-y-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-500">Or continue with email</span></div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" placeholder="name@company.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</button>
                </div>
                <input type="password" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 outline-none transition" placeholder="••••••••" />
              </div>
              <button onClick={onLogin} className="w-full rounded-lg bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Sign in to your account
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-slate-600">
            Don't have an account? <button onClick={onSignUp} className="font-bold text-indigo-600 hover:underline">Create an account</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignUpPage({ onLogin, onSignUpSuccess }: { onLogin: () => void, onSignUpSuccess: () => void }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000"
          alt="Office"
          className="absolute inset-0 object-cover w-full h-full opacity-40"
        />
        <div className="relative z-20 flex flex-col justify-center p-20 text-white">
          <span className="absolute top-12 left-12 text-2xl font-black tracking-tight">RECRUX.AI</span>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            The future of job search is smarter.<br />
            Start your journey today.
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-20 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your account</h2>
            <p className="text-slate-500 mt-2">Start your 14-day free trial today. No credit card required.</p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-50 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign up with Google
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-4 text-slate-400 font-medium tracking-widest">Or continue with</span></div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition" placeholder="name@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input type="password" className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition" placeholder="Min. 8 characters" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                <input type="password" className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition" placeholder="Repeat your password" />
              </div>
            </div>
            <button onClick={onSignUpSuccess} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
              Create Account
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500">
            Already have an account? <button onClick={onLogin} className="text-indigo-600 font-bold hover:underline">Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function WelcomePage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6 cursor-pointer" onClick={onNext}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-600 tracking-tight mb-4">
          Welcome to Recrux.ai
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-light">
          Redefining how the world discovers opportunities.
        </p>
        <div className="mt-12 text-slate-400 text-sm animate-pulse">Click anywhere to continue</div>
      </motion.div>
    </div>
  );
}

function OnboardingPage({ onSearchJobs, onUpload, isAnalyzing, roleName, setRoleName }: { 
  onSearchJobs: () => void, 
  onUpload: (e: any) => void, 
  isAnalyzing: boolean,
  roleName: string,
  setRoleName: (val: string) => void
}) {
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

function DashboardLayout({ children, currentView, onNavigate, onSignOut, resumeData }: { children: React.ReactNode, currentView: View, onNavigate: (v: View) => void, onSignOut: () => void, resumeData: ResumeData | null }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <header className="w-full h-16 bg-white border-b border-indigo-50 px-6 flex items-center justify-between z-10 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-indigo-600">RECRUX.AI</h2>
        <button onClick={onSignOut} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r border-indigo-50 bg-white flex flex-col">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <div className="mb-8">
              <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
              <button
                onClick={() => onNavigate('JOBS')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === 'JOBS' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'}`}
              >
                <Briefcase className="w-5 h-5" />
                Jobs
              </button>
              <button
                onClick={() => onNavigate('RESUME')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-1 ${currentView === 'RESUME' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'}`}
              >
                <FileText className="w-5 h-5" />
                Resume
              </button>
              <button
                onClick={() => onNavigate('PROFILE')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-1 ${currentView === 'PROFILE' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50'}`}
              >
                <User className="w-5 h-5" />
                Profile
              </button>
            </div>

            <div className="pt-4 border-t border-indigo-50">
              <p className="px-3 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Filters</p>
              <div className="px-3 space-y-3">
                <p className="text-sm font-medium text-slate-700">Job Type</p>
                {['Full-time', 'Contract', 'Part-time', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked={type === 'Full-time'} />
                    <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </nav>
          <div className="p-4 mt-auto">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold text-sm transition-all shadow-md shadow-indigo-200">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative">
          {children}
          <ChatWidget userContext={resumeData?.raw_text} />
        </main>
      </div>
    </div>
  );
}

function JobsPage({ jobs, searchTerm, setSearchTerm, onSearch, isSearching }: { jobs: JobListing[], searchTerm: string, setSearchTerm: (val: string) => void, onSearch: () => void, isSearching: boolean }) {
  const filteredJobs = jobs.filter(job => 
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.reasoning && job.reasoning.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <Wand2 className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wide uppercase">AI RECOMMENDATIONS</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Our Agent-Matched Jobs</h1>
        <p className="text-slate-500 mt-2">Based on your recent resume analysis and {jobs.length > 0 ? jobs[0].job_title : 'career'} preferences.</p>
      </header>

      <div className="mb-8 flex gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm" 
            placeholder="Filter jobs or type a new role to search..." 
          />
        </div>
        <button 
          onClick={onSearch}
          disabled={isSearching}
          className="px-8 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          SEARCH
        </button>
      </div>

      <div className="space-y-4">
        {filteredJobs.length > 0 ? filteredJobs.map((job, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-xl border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
            <button className="absolute top-6 right-32 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-50 rounded-full">
              <span className="text-xs font-bold text-indigo-600 italic">{job.match_score}% Match</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.job_title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600"><Building2 className="w-4 h-4" /> {job.company_name}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {job.reasoning}
                </p>
                <div className="mt-5 flex gap-2">
                   <a href={job.job_listing_link} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">View Listing</a>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">{jobs.length === 0 ? "No jobs found. Try uploading a resume first!" : "No jobs match your search."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResumePage({ atsScore, fileName, onUpload }: { atsScore?: number, fileName: string | null, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and select your active resume for job matching</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            id="resume-upload-dash" 
            className="hidden" 
            accept=".pdf,.docx,.txt"
            onChange={onUpload}
          />
          <label 
            htmlFor="resume-upload-dash"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span>Upload New Resume</span>
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {fileName ? (
          <div className="relative flex items-center gap-4 p-5 bg-white border-2 border-indigo-600 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 truncate">{fileName}</h3>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase rounded-md tracking-wider">Active</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just Uploaded</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center px-4 border-l border-slate-100">
                  <span className="text-xl font-black text-indigo-600">{atsScore || 0}%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ATS Score</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
             <p className="text-slate-500">No active resume. Upload one to see analysis.</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">AI Optimization</h4>
            <p className="text-sm text-slate-500 mt-1">Your active resume has an 85% match rate for current "Senior Dev" listings. Consider adding "Kubernetes" to improve matches.</p>
          </div>
        </div>
        <button className="shrink-0 text-indigo-600 text-sm font-bold hover:underline">View Recommendations</button>
      </div>
    </div>
  );
}

function ProfilePage({ skills, roleName }: { skills?: string[], roleName: string }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200 shrink-0">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Career Profile</h1>
            <p className="text-slate-500 font-medium">Aspiring {roleName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Star className="w-5 h-5" />
              <h3 className="text-lg text-slate-900">Extracted Skills</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills && skills.length > 0 ? skills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-indigo-50 rounded-full text-sm font-semibold text-slate-700 border border-indigo-100 animate-in fade-in zoom-in duration-300">{skill}</span>
            )) : (
              <p className="text-slate-400 italic">No skills extracted yet. Upload a resume to see AI analysis.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatWidget({ userContext }: { userContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setChatLog([...chatLog, { role: 'user', text: userMsg }]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, user_context: userContext })
      });
      const data = await response.json();
      setChatLog(prev => [...prev, { role: 'assistant', text: data.response }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting to the brain right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                <span className="font-bold">Recrux Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatLog.length === 0 && (
                <div className="text-center py-10">
                   <p className="text-slate-400 text-sm">Ask me anything about your career or job matches!</p>
                </div>
              )}
              {chatLog.map((log, i) => (
                <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${log.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none animate-pulse">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" 
              />
              <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        {isOpen ? <ChevronRight className="w-6 h-6 rotate-90" /> : <Wand2 className="w-6 h-6" />}
      </button>
    </div>
  );
}
