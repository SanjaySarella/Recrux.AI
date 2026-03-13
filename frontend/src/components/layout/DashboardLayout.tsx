import React from 'react';
import { LogOut, Briefcase, FileText, User as UserIcon, RefreshCw } from 'lucide-react';
import { View, ResumeData } from '../../types';
import ChatWidget from '../shared/ChatWidget';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (v: View) => void;
  onSignOut: () => void;
  resumeData: ResumeData | null;
}

export default function DashboardLayout({ children, currentView, onNavigate, onSignOut, resumeData }: DashboardLayoutProps) {
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
                <UserIcon className="w-5 h-5" />
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
