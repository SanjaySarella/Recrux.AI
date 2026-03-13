import React from 'react';

export default function LoginPage({ onSignUp, onLogin }: { onSignUp: () => void, onLogin: () => void }) {
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
