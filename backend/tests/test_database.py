import pytest
import sqlite3
import os
import json
from utils.database import init_db, save_profile, get_profile, DB_PATH

@pytest.fixture(autouse=True)
def setup_test_db(monkeypatch, tmp_path):
    # Use a temporary database for testing
    test_db = tmp_path / "test_recrux.db"
    monkeypatch.setattr("utils.database.DB_PATH", str(test_db))
    init_db()
    yield

def test_save_and_get_profile():
    profile_id = "test_user_123"
    resume_text = "Sample resume content"
    skills = ["Python", "Docker"]
    ats_score = 85
    role_name = "Backend Engineer"
    
    save_profile(profile_id, resume_text, skills, ats_score, role_name)
    
    profile = get_profile(profile_id)
    assert profile is not None
    assert profile["id"] == profile_id
    assert profile["resume_text"] == resume_text
    assert profile["skills"] == skills
    assert profile["ats_score"] == ats_score
    assert profile["role_name"] == role_name

def test_get_nonexistent_profile():
    profile = get_profile("nonexistent")
    assert profile is None
