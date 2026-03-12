import requests
import os

BASE_URL = "http://127.0.0.1:8001/api"

def test_resume_upload():
    print("Testing Resume Upload...")
    url = f"{BASE_URL}/jobs/match"
    
    # Create a dummy text file
    with open("dummy_resume.txt", "w") as f:
        f.write("Experience: 5 years in React and Python. Skills: React, Python, Java.")
    
    with open("dummy_resume.txt", "rb") as f:
        files = {"file": ("dummy_resume.txt", f, "text/plain")}
        data = {"role_name": "Software Engineer"}
        try:
            response = requests.post(url, files=files, data=data)
            print(f"Status: {response.status_code}")
            import json
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except Exception as e:
            print(f"Error: {e}")
    
    # Cleanup
    if os.path.exists("dummy_resume.txt"):
        os.remove("dummy_resume.txt")

if __name__ == "__main__":
    test_resume_upload()
