import React from 'react';
import { Upload, FileText, Clock, Wand2 } from 'lucide-react';

interface ResumePageProps {
  atsScore?: number;
  fileName: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumePage({ atsScore, fileName, onUpload }: ResumePageProps) {
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
