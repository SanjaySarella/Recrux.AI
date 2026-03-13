import requests
import os
import json
import io
import asyncio
from typing import Dict, Any

# Ensure we are hitting the correct backend port
BASE_URL = "http://127.0.0.1:8000/api"

def print_header(title: str):
    print(f"\n{'='*20} {title} {'='*20}")

def test_resume_parser_formats():
    print_header("Testing Resume Parser Formats")
    
    # 1. Plain Text Test
    print("Test 1: Plain Text")
    with open("test_resume.txt", "w") as f:
        f.write("Skills: Python, Java, SQL. Experience: 3 years as a developer.")
    
    with open("test_resume.txt", "rb") as f:
        files = {"file": ("test_resume.txt", f, "text/plain")}
        resp = requests.post(f"{BASE_URL}/resume/parse", files=files)
        if resp.status_code == 200:
            print("Row Text Parsed Successfully:", resp.json().get("skills"))
        else:
            print(f"Failed Plain Text: {resp.text}")

    # 2. Unsupported format check
    print("\nTest 2: Unsupported Format (.zip)")
    with open("test_bad.zip", "w") as f:
        f.write("fake zip content")
    
    with open("test_bad.zip", "rb") as f:
        files = {"file": ("test_bad.zip", f, "application/zip")}
        resp = requests.post(f"{BASE_URL}/resume/parse", files=files)
        # We expect a 500 or 400 based on our implementation in agent_router.py
        print(f"Status for .zip (Expect fail): {resp.status_code}")
        if resp.status_code != 200:
            print("Graceful failure confirmed:", resp.json().get("detail"))

    # Cleanup
    for f in ["test_resume.txt", "test_bad.zip"]:
        if os.path.exists(f): os.remove(f)

def test_job_search_scenarios():
    print_header("Testing Job Search Scenarios")
    
    # 1. Specific Role Search
    print("Test 1: Specific Role (Data Scientist)")
    data = {"role_name": "Data Scientist", "skills": "Python, PyTorch"}
    resp = requests.post(f"{BASE_URL}/jobs/search", data=data)
    if resp.status_code == 200:
        jobs = resp.json().get("jobs", [])
        print(f"Found {len(jobs)} jobs. First job: {jobs[0]['job_title']} at {jobs[0]['company_name']}")
    else:
        print(f"Failed Data Scientist Search: {resp.text}")

    # 2. Gibberish Search (Fallback Check)
    print("\nTest 2: Niche/Gibberish Role (Fallback)")
    data = {"role_name": "Quantum Bread Baker Extraterrestrial"}
    resp = requests.post(f"{BASE_URL}/jobs/search", data=data)
    if resp.status_code == 200:
        jobs = resp.json().get("jobs", [])
        print(f"Fallback triggered. Found {len(jobs)} jobs (likely dummy).")
    else:
        print(f"Failed Fallback Search: {resp.text}")

def test_job_match_accuracy():
    print_header("Testing Job Match Accuracy")
    
    resume_text = "Experienced Python Developer with expertise in FastAPI, React, and AWS."
    jds = [
        "We are looking for a Python Developer proficient in FastAPI and React. AWS experience is a plus.",
        "Art Director needed for a fashion magazine. Must know Photoshop and Illustrator."
    ]
    ids = ["job_tech_1", "job_art_2"]

    data = {
        "resume_text": resume_text,
        "job_descriptions": jds,
        "job_ids": ids
    }
    
    resp = requests.post(f"{BASE_URL}/jobs/score", data=data)
    if resp.status_code == 200:
        scores = resp.json().get("scores", [])
        for s in scores:
            print(f"Job {s['job_id']}: Score {s['match_score']} - Reasoning: {s['reasoning']}")
    else:
        print(f"Failed Match Scoring: {resp.text}")

def test_chat_rag():
    print_header("Testing Chat RAG Integration")
    
    # 1. Career Advice
    print("Test 1: General Advice")
    data = {"message": "How can I make my resume better?"}
    resp = requests.post(f"{BASE_URL}/chat", json=data)
    if resp.status_code == 200:
        print("AI Response:", resp.json().get("response")[:200], "...")
    
    # 2. Vector Context check (if stored)
    print("\nTest 2: Contextual Query")
    data = {
        "message": "Based on my skills in Python and React, what jobs are best?",
        "user_context": "Resume: Expert in Python, React, and Fast API."
    }
    resp = requests.post(f"{BASE_URL}/chat", json=data)
    if resp.status_code == 200:
        print("AI Contextual Response:", resp.json().get("response")[:200], "...")

def test_full_orchestrator():
    print_header("Testing Full Orchestrator Workflow")
    
    with open("dummy_resume.pdf", "w", encoding="utf-8") as f:
        f.write("DUMMY PDF CONTENT: Software Engineer skilled in Python and React.")
    
    # Note: We name it .pdf so the parser tries PDF logic, 
    # but since it's just text it might fall back or fail if fitz isn't happy.
    # For a real test, use a valid binary PDF if possible.
    
    with open("dummy_resume.pdf", "rb") as f:
        files = {"file": ("resume.pdf", f, "application/pdf")}
        data = {"role_name": "Fullstack Developer"}
        resp = requests.post(f"{BASE_URL}/jobs/match", files=files, data=data)
        
        if resp.status_code == 200:
            result = resp.json()
            print("Workflow Success!")
            print("Skills:", result["parsed_resume"]["skills"])
            print("Jobs Found:", len(result["job_listings"]))
            print("Jobs Scored:", len(result["scored_jobs"]))
        else:
            print("Workflow Failed:", resp.text)
            
    if os.path.exists("dummy_resume.pdf"): os.remove("dummy_resume.pdf")

if __name__ == "__main__":
    print(">>> Starting Comprehensive Recrux Agent Tests <<<")
    
    # Pre-check: server running?
    try:
        requests.get(f"http://127.0.0.1:8001/")
    except:
        print("ERROR: Backend server not found at port 8001. Please run 'uvicorn main:app --port 8001' first.")
        exit(1)

    test_resume_parser_formats()
    test_job_search_scenarios()
    test_job_match_accuracy()
    test_chat_rag()
    test_full_orchestrator()
    
    print("\n>>> All Tests Completed! <<<")
