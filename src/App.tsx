import React, { useState } from 'react';
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

type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'WELCOME' | 'ONBOARDING' | 'JOBS' | 'RESUME' | 'PROFILE';

export default function App() {
  const [view, setView] = useState<View>('LANDING');

  const navigate = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
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
        return <OnboardingPage onSearchJobs={() => navigate('JOBS')} />;
      case 'JOBS':
        return <DashboardLayout currentView="JOBS" onNavigate={navigate} onSignOut={() => navigate('LANDING')}><JobsPage /></DashboardLayout>;
      case 'RESUME':
        return <DashboardLayout currentView="RESUME" onNavigate={navigate} onSignOut={() => navigate('LANDING')}><ResumePage /></DashboardLayout>;
      case 'PROFILE':
        return <DashboardLayout currentView="PROFILE" onNavigate={navigate} onSignOut={() => navigate('LANDING')}><ProfilePage /></DashboardLayout>;
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
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
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
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
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

function OnboardingPage({ onSearchJobs }: { onSearchJobs: () => void }) {
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
                Scanning your potential.<br />
                <strong>Finding where you belong next.</strong>
              </h1>
              <p className="text-slate-500 text-lg">Upload your resume to start receiving AI-matched job opportunities tailored just for you.</p>
            </div>

            <div className="space-y-10">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">1. Upload your Resume</label>
                <div className="relative group cursor-pointer">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-indigo-600 group-hover:bg-indigo-50/30 transition-all rounded-2xl p-12 bg-slate-50/50">
                    <Upload className="text-indigo-600 w-10 h-10 mb-4" />
                    <p className="text-slate-900 font-semibold mb-1">Drag and drop your file here</p>
                    <p className="text-slate-500 text-sm">PDF, DOCX up to 10MB</p>
                    <button className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all">
                      Browse Files
                    </button>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
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

function DashboardLayout({ children, currentView, onNavigate, onSignOut }: { children: React.ReactNode, currentView: View, onNavigate: (v: View) => void, onSignOut: () => void }) {
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

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function JobsPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <Wand2 className="w-5 h-5" />
          <span className="text-sm font-bold tracking-wide uppercase">AI RECOMMENDATIONS</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Our Agent-Matched Jobs</h1>
        <p className="text-slate-500 mt-2">Based on your recent resume analysis and career preferences.</p>
      </header>

      <div className="mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
          <input className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-sm" placeholder="Search job titles, companies or keywords..." />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Senior UI/UX Designer', company: 'Stellar Cloud Systems', location: 'San Francisco, CA (Remote)', match: '98%', type: 'Full-time', icon: <Globe className="w-6 h-6" />, tags: ['Design Systems', 'Figma', 'Prototyping'] },
          { title: 'Product Designer, FinTech', company: 'NeoBank Global', location: 'London, UK', match: '94%', type: 'Full-time', icon: <Building2 className="w-6 h-6" />, tags: ['FinTech', 'Visual Design', 'User Research'] },
          { title: 'Interface Specialist (Contract)', company: 'Velocity Startups', location: 'Austin, TX', match: '89%', type: 'Contract', icon: <Clock className="w-6 h-6" />, tags: ['Webflow', 'Motion Design'] },
        ].map((job, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-xl border border-indigo-50 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
            <button className="absolute top-6 right-32 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <div className="absolute top-6 right-6 px-3 py-1 bg-indigo-50 rounded-full">
              <span className="text-xs font-bold text-indigo-600 italic">{job.match} Match</span>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                {job.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-600"><Building2 className="w-4 h-4" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  We're looking for a visionary to lead our core product's user experience transformation. Your expertise in design systems and AI-driven workflows aligns perfectly...
                </p>
                <div className="mt-5 flex gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumePage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and select your active resume for job matching</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
          <Upload className="w-5 h-5" />
          <span>Upload New Resume</span>
        </button>
      </div>

      <div className="grid gap-4">
        <div className="relative flex items-center gap-4 p-5 bg-white border-2 border-indigo-600 rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 truncate">Software_Engineer_2024.pdf</h3>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase rounded-md tracking-wider">Active</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated Oct 24, 2023</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> 1.2 MB</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><Eye className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="relative flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <FileText className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">Product_Manager_Draft.pdf</h3>
            <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated Sep 12, 2023</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> 0.8 MB</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Make Active</button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
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

function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200 shrink-0">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Alex Johnson</h1>
            <p className="text-slate-500 font-medium">Senior Product Designer & Frontend Enthusiast</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Open to Work
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </span>
            </div>
          </div>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <User className="w-5 h-5" />
            <h3 className="text-lg text-slate-900">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" defaultValue="Alex Johnson" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" defaultValue="alex.j@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" defaultValue="+1 (555) 000-1234" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Globe className="w-5 h-5" />
            <h3 className="text-lg text-slate-900">Social Links</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn Profile</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" defaultValue="linkedin.com/in/alexjohnson" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Portfolio Website</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm" defaultValue="alexj-design.com" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <FileText className="w-5 h-5" />
            <h3 className="text-lg text-slate-900">Professional Summary</h3>
          </div>
          <textarea 
            className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed" 
            rows={6}
            defaultValue="Senior Product Designer with over 8 years of experience in creating user-centered digital products. Expertise in design systems, UX research, and frontend prototyping. Proven track record of leading cross-functional teams to deliver high-impact solutions for tech startups and enterprise clients."
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Star className="w-5 h-5" />
              <h3 className="text-lg text-slate-900">Key Skills</h3>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Edit Skills</button>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {['UI/UX Design', 'React.js', 'Figma', 'Design Systems', 'Tailwind CSS', 'Product Strategy'].map(skill => (
              <span key={skill} className="px-4 py-2 bg-indigo-50 rounded-full text-sm font-semibold text-slate-700 border border-indigo-100">{skill}</span>
            ))}
            <button className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-full text-sm font-bold text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
              + Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
