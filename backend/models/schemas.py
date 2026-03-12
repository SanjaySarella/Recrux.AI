from pydantic import BaseModel, Field
from typing import List, Optional

# --- Resume Models ---

class ResumeParseOutput(BaseModel):
    skills: List[str] = Field(description="List of technical and soft skills extracted from the resume.")
    ats_score: Optional[int] = Field(default=None, description="Estimated ATS score out of 100 based on the resume formatting and content.")
    raw_text: Optional[str] = Field(default=None, description="The raw scraped text of the resume.")

# --- Job Search Models ---

class JobMatchInput(BaseModel):
    skills: List[str]
    role_name: str

class JobListing(BaseModel):
    id: str
    job_title: str
    company_name: str
    job_description: str
    job_listing_link: str
    location: Optional[str] = None
    
class JobSearchOutput(BaseModel):
    jobs: List[JobListing]

# --- Job Scoring Models ---

class JobScore(BaseModel):
    job_id: str
    match_score: int = Field(description="Score out of 100 representing how well the resume matches the job description.")
    reasoning: Optional[str] = Field(default=None, description="Brief explanation of the score.")

class JobMatchScoreOutput(BaseModel):
    scores: List[JobScore]

# --- Orchestrator Output ---

class GraphWorkflowOutput(BaseModel):
    parsed_resume: ResumeParseOutput
    job_listings: List[JobListing]
    scored_jobs: List[JobScore]

# --- Chat Models ---

class ChatRequest(BaseModel):
    message: str
    user_context: Optional[str] = Field(default=None, description="Additional context like resume text or job details.")

class ChatResponse(BaseModel):
    response: str
