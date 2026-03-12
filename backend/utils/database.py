import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "recrux.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            resume_text TEXT,
            parsed_skills TEXT,
            ats_score INTEGER,
            role_name TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_profile(profile_id, resume_text, skills, ats_score, role_name):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO profiles (id, resume_text, parsed_skills, ats_score, role_name)
        VALUES (?, ?, ?, ?, ?)
    ''', (profile_id, resume_text, json.dumps(skills), ats_score, role_name))
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
            "resume_text": row[1],
            "skills": json.loads(row[2]),
            "ats_score": row[3],
            "role_name": row[4]
        }
    return None

# Initialize on import
init_db()
