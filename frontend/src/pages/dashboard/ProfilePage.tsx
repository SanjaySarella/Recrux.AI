import React from 'react';
import { User, Star } from 'lucide-react';

interface ProfilePageProps {
  skills?: string[];
  roleName: string;
}

export default function ProfilePage({ skills, roleName }: ProfilePageProps) {
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
