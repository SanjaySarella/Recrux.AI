export type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'WELCOME' | 'ONBOARDING' | 'JOBS' | 'RESUME' | 'PROFILE';

export interface ResumeData {
  skills: string[];
  ats_score: number;
  raw_text?: string;
}

export interface JobListing {
  id: string;
  job_title: string;
  company_name: string;
  job_description: string;
  job_listing_link: string;
  location?: string;
  match_score?: number;
  reasoning?: string;
}
