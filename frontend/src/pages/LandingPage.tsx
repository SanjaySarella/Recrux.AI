import React from 'react';

export default function LandingPage({ onLogin, onSignUp }: { onLogin: () => void, onSignUp: () => void }) {
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
