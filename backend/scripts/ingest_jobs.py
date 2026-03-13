import os
import sys
import pandas as pd
from tqdm import tqdm
import time

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from utils.database import save_jobs_batch
from utils.vector_db import store_job_vectors
from models.schemas import JobListing

CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/postings.csv"))
CHUNK_SIZE = 100 # Reduced for better reliability and memory management
from utils.vector_db import EMBEDDING_PROVIDER

def ingest_jobs():
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV not found at {CSV_PATH}")
        return

    print(f"Starting ingestion from {CSV_PATH} using {EMBEDDING_PROVIDER}...")
    
    # Process in chunks
    for chunk in pd.read_csv(CSV_PATH, chunksize=CHUNK_SIZE):
        job_listings = []
        texts_to_embed = []
        
        for _, row in chunk.iterrows():
            desc = str(row.get('description', ''))
            # Truncate for embedding to stay within context limits (SQL keeps full text)
            truncated_desc = desc[:3000] if len(desc) > 3000 else desc
            
            job = JobListing(
                id=str(row.get('job_id', '')),
                job_title=str(row.get('title', 'Unknown Title')),
                company_name=str(row.get('company_name', 'Unknown Company')),
                location=str(row.get('location', 'Remote')),
                job_description=desc, # Full description for SQL
                salary_range=f"{row.get('max_salary', '')} {row.get('pay_period', '')}".strip(),
                experience_level=str(row.get('formatted_experience_level', '')),
                skills_required=[]
            )
            job_listings.append(job)
            texts_to_embed.append(truncated_desc)
            
        # 1. Save to SQLite (Relational Metadata - Full Text)
        save_jobs_batch(job_listings)
        
        # 2. Save to ChromaDB (Semantic Vector - Truncated Text)
        try:
            # We bypass the standard store_job_vectors here to use our truncated texts
            from utils.vector_db import get_vector_store
            vector_db = get_vector_store("jobs")
            
            metadatas = [{"job_id": job.id, "title": job.job_title} for job in job_listings]
            ids = [job.id for job in job_listings]
            
            vector_db.add_texts(
                texts=texts_to_embed,
                metadatas=metadatas,
                ids=ids
            )
        except Exception as e:
            print(f"Vector storage error: {e}. Skipping vector indexing for this chunk.")
            
        print(f"Processed {len(job_listings)} jobs...")

if __name__ == "__main__":
    ingest_jobs()
