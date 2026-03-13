import React from 'react';
import { Wand2, Search, RefreshCw, Briefcase, Building2, MapPin, Bookmark } from 'lucide-react';
import { JobListing } from '../../types';

interface JobsPageProps {
  jobs: JobListing[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export default function JobsPage({ jobs, searchTerm, setSearchTerm, onSearch, isSearching }: JobsPageProps) {
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
