export type View = 'LANDING' | 'LOGIN' | 'SIGNUP' | 'WELCOME' | 'ONBOARDING' | 'JOBS' | 'RESUME' | 'PROFILE';

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectEntry {
  title: string;
  technologies: string[];
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
}

export interface ResumeData {
  full_name: string;
  email?: string;
  phone?: string;
  links: string[];
  professional_summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  ats_score: number;
  raw_text?: string;
}

export interface JobListing {
  id: string;
  job_title: string;
  company_name: string;
  location?: string;
  job_description: string;
  salary_range?: string;
  job_listing_link: string;
  remote_allowed: boolean;
  experience_level?: string;
  skills_required: string[];
  match_score?: number;
  reasoning?: string;
}
