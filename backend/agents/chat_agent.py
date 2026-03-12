from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from utils.vector_db import query_similar_jobs

# Initialize Gemini
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=0.7)

system_prompt = """
You are the Recrux.AI Career Assistant. Your goal is to help users land their dream job.
You can answer questions about their resume, job matches, and career advice.
Use the provided Context to give specific answers. If you don't know the answer, just say you don't know.

Context:
{context}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{question}"),
])

async def ask_assistant(question: str, user_context: str = None) -> str:
    """
    Asks the Gemini assistant a question, using RAG context if available.
    """
    # 1. Try to get semantic context from Vector DB (recent jobs)
    semantic_context = ""
    try:
        # We query for similar jobs based on the question itself to see if they are asking about roles
        similar_jobs = query_similar_jobs(question, n_results=3)
        if similar_jobs:
            semantic_context = "\nRelevant Jobs found in Vector DB:\n" + "\n".join([doc.page_content for doc in similar_jobs])
    except Exception:
        pass # Fallback if Vector DB is empty or fails
        
    # 2. Combine with user provided context (like their resume text)
    full_context = f"{user_context or ''}\n{semantic_context}"
    
    # 3. Fire the LLM
    chain = prompt | llm
    response = await chain.ainvoke({"context": full_context, "question": question})
    
    return response.content
