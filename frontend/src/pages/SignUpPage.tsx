import React from 'react';
import { Mail, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function SignUpPage({ onLogin, onSignUpSuccess }: { onLogin: () => void, onSignUpSuccess: () => void }) {
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
