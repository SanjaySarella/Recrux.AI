from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from models.schemas import ResumeParseOutput

# Initialize the Gemini model for parsing
# Using gemini-3.1-flash-lite-preview
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=0.1)

# Using structured output feature to guarantee pydantic validation
structured_llm = llm.with_structured_output(ResumeParseOutput)

prompt_template = """
You are an expert ATS (Applicant Tracking System) parser.
Your task is to thoroughly analyze the provided resume text and extract the following:
1. A comprehensive list of technical and soft skills (return as a list of strings).
2. An estimated ATS score out of 100 based on the resume's clarity, structure, and keyword richness.

Here is the resume text:
{resume_text}

Analyze it and provide the structured output.
"""

prompt = PromptTemplate(
    input_variables=["resume_text"],
    template=prompt_template
)

chain = prompt | structured_llm

async def process_resume(resume_text: str) -> ResumeParseOutput:
    """
    Takes raw resume text and uses Gemini to extract skills and an ATS score.
    Returns a ResumeParseOutput object.
    """
    try:
        # Invoke the chain
        result = await chain.ainvoke({"resume_text": resume_text})
        # Add the raw text to the result object
        result.raw_text = resume_text
        
        # --- VECTOR DB INTEGRATION ---
        # Automatically embed and store in Vector DB
        from utils.vector_db import store_resume_vector
        # For now we use a default ID, in production this would be the user's resume ID
        store_resume_vector("current_user_resume", resume_text)
        
        return result
    except Exception as e:
        print(f"Error parsing resume with Gemini: {e}")
        # Return fallback on failure
        return ResumeParseOutput(
            skills=[],
            ats_score=0,
            raw_text=resume_text
        )
