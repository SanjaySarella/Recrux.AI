import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

load_dotenv()

# Initialize Embeddings using Gemini models
# gemini-embedding-001 is confirmed available on this API key
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# Define persistent directory for the vector DB
# In production on GCP, this would be swapped for Vertex AI Vector Search or similar
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")

def get_vector_store(collection_name: str):
    """
    Returns a Chroma vector store instance for a specific collection.
    """
    return Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        persist_directory=CHROMA_DB_DIR
    )

def store_resume_vector(resume_id: str, resume_text: str):
    """
    Embeds and stores a resume in the 'resumes' collection.
    """
    vector_db = get_vector_store("resumes")
    vector_db.add_texts(
        texts=[resume_text],
        metadatas=[{"resume_id": resume_id}],
        ids=[resume_id]
    )
    print(f"VectorDB: Resume {resume_id} stored successfully.")

def store_job_vectors(job_listings: list):
    """
    Embeds and stores multiple job descriptions in the 'jobs' collection.
    expecting list of JobListing objects.
    """
    vector_db = get_vector_store("jobs")
    
    texts = [job.job_description for job in job_listings]
    metadatas = [{"job_id": job.id, "title": job.job_title} for job in job_listings]
    ids = [job.id for job in job_listings]
    
    vector_db.add_texts(
        texts=texts,
        metadatas=metadatas,
        ids=ids
    )
    print(f"VectorDB: {len(job_listings)} job descriptions stored successfully.")

def query_similar_jobs(resume_text: str, n_results: int = 5):
    """
    Retrieves top N job descriptions similar to the resume text.
    """
    vector_db = get_vector_store("jobs")
    results = vector_db.similarity_search(resume_text, k=n_results)
    return results
