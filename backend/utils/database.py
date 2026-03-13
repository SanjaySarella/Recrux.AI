import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "recrux.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Profiles table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            links TEXT,
            professional_summary TEXT,
            skills TEXT,
            experience TEXT,
            projects TEXT,
            education TEXT,
            ats_score INTEGER,
            raw_text TEXT,
            role_name TEXT
        )
    ''')
    
    # Jobs table (Source of Truth for large dataset)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            job_title TEXT,
            company_name TEXT,
            location TEXT,
            job_description TEXT,
            salary_range TEXT,
            job_listing_link TEXT,
            remote_allowed INTEGER,
            experience_level TEXT,
            skills_required TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def save_profile(profile_data: dict, role_name: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Ensure all list/dict fields are JSONified
    profile_id = profile_data.get("id", "current_user")
    cursor.execute('''
        INSERT OR REPLACE INTO profiles (
            id, full_name, email, phone, links, 
            professional_summary, skills, experience, 
            projects, education, ats_score, raw_text, role_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        profile_id,
        profile_data.get("full_name"),
        profile_data.get("email"),
        profile_data.get("phone"),
        json.dumps(profile_data.get("links", [])),
        profile_data.get("professional_summary"),
        json.dumps(profile_data.get("skills", [])),
        json.dumps(profile_data.get("experience", [])),
        json.dumps(profile_data.get("projects", [])),
        json.dumps(profile_data.get("education", [])),
        profile_data.get("ats_score", 0),
        profile_data.get("raw_text"),
        role_name
    ))
    conn.commit()
    conn.close()

def save_jobs_batch(job_listings: list):
    """
    Saves a list of JobListing objects to SQLite.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    for job in job_listings:
        cursor.execute('''
            INSERT OR REPLACE INTO jobs (
                id, job_title, company_name, location, 
                job_description, salary_range, job_listing_link, 
                remote_allowed, experience_level, skills_required
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            job.id,
            job.job_title,
            job.company_name,
            job.location,
            job.job_description,
            job.salary_range,
            job.job_listing_link,
            1 if job.remote_allowed else 0,
            job.experience_level,
            json.dumps(job.skills_required)
        ))
    
    conn.commit()
    conn.close()

def get_profile(profile_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM profiles WHERE id = ?', (profile_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "full_name": row[1],
            "email": row[2],
            "phone": row[3],
            "links": json.loads(row[4] or "[]"),
            "professional_summary": row[5],
            "skills": json.loads(row[6] or "[]"),
            "experience": json.loads(row[7] or "[]"),
            "projects": json.loads(row[8] or "[]"),
            "education": json.loads(row[9] or "[]"),
            "ats_score": row[10],
            "raw_text": row[11],
            "role_name": row[12]
        }
    return None

# Initialize on import
init_db()
