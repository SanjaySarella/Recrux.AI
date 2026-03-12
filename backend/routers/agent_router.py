from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from models.schemas import ResumeParseOutput, JobSearchOutput, JobMatchScoreOutput, GraphWorkflowOutput, ChatRequest, ChatResponse
from agents.graph import app_graph
from agents.chat_agent import ask_assistant

from agents.resume_agent import process_resume
from agents.job_search_agent import search_jobs
from agents.job_match_agent import score_jobs
from utils.file_parser import extract_text_from_file
from utils.database import save_profile, get_profile

router = APIRouter()

@router.post("/jobs/match", response_model=GraphWorkflowOutput, tags=["Orchestrator"])
async def run_full_workflow(file: UploadFile = File(...), role_name: str = Form("General Role")):
    """
    Complete LangGraph workflow:
    1. Parse Resume
    2. Search for Jobs
    3. Score the matches
    Returns all results in one go.
    """
    try:
        # 1. Extract raw text
        text = await extract_text_from_file(file)
        
        # 2. Run the LangGraph
        initial_state = {
            "resume_text": text,
            "role_name": role_name
        }
        
        # Execute graph
        final_state = await app_graph.ainvoke(initial_state)
        
        # 3. Persist to DB
        parsed = final_state["parsed_resume"]
        save_profile(
            profile_id="current_user", # Static for now
            resume_text=text,
            skills=parsed.skills,
            ats_score=parsed.ats_score,
            role_name=role_name
        )
        
        return GraphWorkflowOutput(
            parsed_resume=final_state["parsed_resume"],
            job_listings=final_state["job_listings"],
            scored_jobs=final_state["scored_jobs"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resume/parse", response_model=ResumeParseOutput, tags=["Agents"])
async def parse_resume(file: UploadFile = File(...)):
    """
    Endpoint to process a resume file (PDF/docx), extract skills and calculate an ATS score limit.
    """
    try:
        # Extract text using file parser utility
        text = await extract_text_from_file(file)
        
        # Pass to Resume Agent
        result = await process_resume(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jobs/search", response_model=JobSearchOutput, tags=["Agents"])
async def find_jobs(role_name: str = Form(...), skills: str = Form(None)):
    """
    Endpoint taking role_name and optional skills list (comma separated string) to fetch matching jobs.
    """
    try:
        # Convert comma separated string to list if provided
        skills_list = []
        if skills:
            skills_list = [s.strip() for s in skills.split(",") if s.strip()]
        
        # Pass to Job Search Agent
        jobs = await search_jobs(skills_list, role_name)
        return JobSearchOutput(jobs=jobs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jobs/score", response_model=JobMatchScoreOutput, tags=["Agents"])
async def calculate_scores(
    resume_text: str = Form(...),
    job_descriptions: List[str] = Form(...),
    job_ids: List[str] = Form(...)
):
    """
    Endpoint to score job descriptions against a given resume.
    """
    if len(job_descriptions) != len(job_ids):
        raise HTTPException(status_code=400, detail="Length of job_descriptions and job_ids must be equal.")
        
    try:
        scores = await score_jobs(resume_text, job_descriptions, job_ids)
        return JobMatchScoreOutput(scores=scores)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse, tags=["AI Assistant"])
async def chat_with_assistant(request: ChatRequest):
    """
    Chat with the Recrux AI Assistant using RAG context.
    """
    try:
        response = await ask_assistant(request.message, request.user_context)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/profile/{profile_id}", tags=["User Profile"])
async def fetch_user_profile(profile_id: str):
    """
    Fetch a stored user profile from SQLite.
    """
    profile = get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
