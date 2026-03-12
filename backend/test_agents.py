import requests
import json
import os

BASE_URL = "http://127.0.0.1:8001/api"

def create_dummy_resume():
    # Create a small dummy text file to act as a resume
    with open("dummy_resume.txt", "w") as f:
        f.write("John Doe\\nSoftware Engineer\\nSkills: Python, FastAPI, React, Node.js\\nExperience: 5 years building web applications.")
    return "dummy_resume.txt"

def test_resume_agent(file_path):
    print("\\n--- Testing Resume Parser Agent ---")
    url = f"{BASE_URL}/resume/parse"
    
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, "text/plain")}
        try:
            response = requests.post(url, files=files)
            response.raise_for_status()
            result = response.json()
            print("Successfully parsed resume!")
            print(f"Extracted Skills: {result.get('skills')}")
            print(f"ATS Score: {result.get('ats_score')}")
            return result
        except Exception as e:
            print(f"Error testing Resume Agent: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(e.response.text)
            return None

def test_job_search_agent(skills, role_name):
    print("\\n--- Testing Job Search Agent ---")
    url = f"{BASE_URL}/jobs/search"
    
    skills_string = ", ".join(skills) if skills else "Python, React"
    
    data = {
        "skills": skills_string,
        "role_name": role_name
    }
    
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        result = response.json()
        jobs = result.get("jobs", [])
        print(f"Successfully found {len(jobs)} jobs!")
        if jobs:
            print(f"First Job Title: {jobs[0].get('job_title')}")
            print(f"First Job Company: {jobs[0].get('company_name')}")
        return jobs
    except Exception as e:
        print(f"Error testing Job Search Agent: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(e.response.text)
        return None

def test_job_match_agent(resume_text, jobs):
    print("\\n--- Testing Job Match Score Agent ---")
    if not jobs:
        print("No jobs provided to score against.")
        return
        
    url = f"{BASE_URL}/jobs/score"
    
    # We will score the first 2 jobs to save time/API calls
    jobs_to_score = jobs[:2]
    
    data = {
        "resume_text": resume_text,
        "job_descriptions": [job.get("job_description") for job in jobs_to_score],
        "job_ids": [job.get("id") for job in jobs_to_score]
    }
    
    try:
        response = requests.post(url, data=data)
        response.raise_for_status()
        result = response.json()
        scores = result.get("scores", [])
        print(f"Successfully scored {len(scores)} jobs!")
        for score in scores:
            print(f"Job ID: {score.get('job_id')} - Score: {score.get('match_score')}/100")
            print(f"Reasoning: {score.get('reasoning')}")
        return scores
    except Exception as e:
        print(f"Error testing Job Match Agent: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(e.response.text)
        return None


def test_orchestrator(file_path):
    print("\n--- Testing Full Orchestrator Workflow (/jobs/match) ---")
    url = f"{BASE_URL}/jobs/match"
    
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, "text/plain")}
        data = {"role_name": "Software Engineer"}
        try:
            response = requests.post(url, files=files, data=data)
            response.raise_for_status()
            result = response.json()
            print("Orchestrator Success!")
            print(f"Skills Extracted: {result['parsed_resume']['skills']}")
            print(f"Jobs Found: {len(result['job_listings'])}")
            print(f"Scored Jobs: {len(result['scored_jobs'])}")
            return result
        except Exception as e:
            print(f"Error testing Orchestrator: {e}")
            return None

def test_chat():
    print("\n--- Testing AI Assistant (/chat) ---")
    url = f"{BASE_URL}/chat"
    data = {
        "message": "Can you summarize my skills?",
        "user_context": "Skills: Python, React, Cloud Computing"
    }
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        result = response.json()
        print(f"AI Response: {result['response']}")
    except Exception as e:
        print(f"Error testing Chat: {e}")

if __name__ == "__main__":
    print("Starting Agent Tests...")
    
    # Check if backend is running
    try:
        requests.get("http://127.0.0.1:8001/") # Root endpoint exists
    except requests.exceptions.ConnectionError:
        print("ERROR: FastAPI server is not running or not accessible at http://127.0.0.1:8001/")
        exit(1)
        
    resume_file = create_dummy_resume()
    
    # New Orchestrator Test
    test_orchestrator(resume_file)
    
    # New Chat Test
    test_chat()
            
    # Cleanup
    if os.path.exists(resume_file):
        os.remove(resume_file)
        
    print("\nAll tests completed!")
