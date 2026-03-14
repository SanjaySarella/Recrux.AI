import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

load_dotenv()

def get_llm(temperature=0.1):
    """
    Factory function to get the configured LLM based on .env
    """
    provider = os.getenv("LLM_PROVIDER", "gemini-3.1-flash-lite").lower()
    
    if "gemini-3.1-flash-lite" in provider:
        return ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=temperature)
    elif "gemini-2.5-flash-lite" in provider:
        return ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=temperature)
    elif provider == "ollama":
        from langchain_ollama import ChatOllama
        model = os.getenv("OLLAMA_MODEL", "gemma:2b")
        return ChatOllama(model=model, temperature=temperature)
    elif provider == "groq":
        from langchain_groq import ChatGroq
        api_key = os.getenv("GROQ_API_KEY")
        model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        return ChatGroq(groq_api_key=api_key, model_name=model, temperature=temperature)
    else:
        # Fallback
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=temperature)

def get_embeddings():
    """
    Factory function to get the configured Embeddings based on .env
    """
    provider = os.getenv("EMBEDDING_PROVIDER", "gemini").lower()
    
    if "gemini" in provider:
        # Use a specific embedding model if defined, else fallback to gemini-embedding-001
        model_name = os.getenv("GEMINI_EMBED_MODEL", "models/gemini-embedding-001")
        return GoogleGenerativeAIEmbeddings(model=model_name)
    elif provider == "ollama":
        from langchain_ollama import OllamaEmbeddings
        model = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
        return OllamaEmbeddings(model=model)
    else:
        # Fallback
        return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
