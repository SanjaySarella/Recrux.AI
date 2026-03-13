import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Types
import { View, ResumeData, JobListing } from './types';

// Services
import { API_BASE } from './services/api';

// Components
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import JobsPage from './pages/dashboard/JobsPage';
import ResumePage from './pages/dashboard/ResumePage';
import ProfilePage from './pages/dashboard/ProfilePage';

export default function App() {
  const [view, setView] = useState<View>('LANDING');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [roleName, setRoleName] = useState('Software Engineer');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile/current_user`);
        if (response.ok) {
          const data = await response.json();
          setResumeData({
            skills: data.skills,
            ats_score: data.ats_score,
            raw_text: data.resume_text
          });
          setRoleName(data.role_name);
        }
      } catch (e) {
        console.log("No previous profile found.");
      }
    };
    loadProfile();
  }, []);

  const navigate = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role_name', roleName);

    try {
      const response = await fetch(`${API_BASE}/jobs/match`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze resume');

      const data = await response.json();
      setResumeData(data.parsed_resume);
      
      const matchedJobs = data.job_listings.map((job: JobListing) => {
        const scoreEntry = data.scored_jobs.find((s: any) => s.job_id === job.id);
        return {
          ...job,
          match_score: scoreEntry?.match_score || 0,
          reasoning: scoreEntry?.reasoning || 'No analysis available.'
        };
      });

      setJobs(matchedJobs);
      navigate('JOBS');
    } catch (error) {
      console.error('API Error:', error);
      alert('Error analyzing resume. Please check if the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearchOnly = async (customRole?: string) => {
    setIsAnalyzing(true);
    const targetRole = customRole || roleName;
    const formData = new FormData();
    formData.append('role_name', targetRole);
    
    try {
      const response = await fetch(`${API_BASE}/jobs/search`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      const newJobs = data.jobs.map((job: any) => ({
        ...job,
        match_score: 0,
        reasoning: `Search result based on ${targetRole}.`
      }));
      
      setJobs(newJobs);
      setRoleName(targetRole);
      setSearchTerm('');
      navigate('JOBS');
    } catch (error) {
       alert("Error searching for jobs. Please check backend.");
    } finally {
      setIsAnalyzing(false);
    }
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
        return <OnboardingPage onSearchJobs={handleSearchOnly} onUpload={handleFileUpload} isAnalyzing={isAnalyzing} roleName={roleName} setRoleName={setRoleName} />;
      case 'JOBS':
        return (
          <DashboardLayout currentView="JOBS" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
            <JobsPage 
              jobs={jobs} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              onSearch={() => handleSearchOnly(searchTerm)}
              isSearching={isAnalyzing}
            />
          </DashboardLayout>
        );
      case 'RESUME':
        return (
          <DashboardLayout currentView="RESUME" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
            <ResumePage 
              atsScore={resumeData?.ats_score} 
              fileName={uploadedFileName} 
              onUpload={handleFileUpload}
            />
          </DashboardLayout>
        );
      case 'PROFILE':
        return (
          <DashboardLayout currentView="PROFILE" onNavigate={navigate} onSignOut={() => navigate('LANDING')} resumeData={resumeData}>
            <ProfilePage skills={resumeData?.skills} roleName={roleName} />
          </DashboardLayout>
        );
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
