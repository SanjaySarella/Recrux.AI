import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print(f"API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

try:
    for m in genai.list_models():
        if 'embedContent' in m.supported_generation_methods:
            print(f"Embedding Model: {m.name}")
        if 'generateContent' in m.supported_generation_methods:
            print(f"Generative Model: {m.name}")
except Exception as e:
    print(f"Error: {e}")
