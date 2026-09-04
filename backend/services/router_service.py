import json
import google.generativeai as genai
from core.config import settings
from pydantic import BaseModel, Field
from typing import Optional

genai.configure(api_key=settings.GEMINI_API_KEY)

class QueryIntent(BaseModel):
    intent: str = Field(description="One of: EXACT, CONCEPT, EXAMPLE, BOTH, BROAD")
    chapter_name: Optional[str] = Field(description="The name of the chapter if mentioned (e.g. 'banking'), else null")
    section_number: Optional[str] = Field(description="The section number (e.g. '1.2') if mentioned, else null")
    example_number: Optional[str] = Field(description="The example number if mentioned, else null")
    standalone_query: Optional[str] = Field(description="The user's query rewritten to be standalone, resolving any pronouns or references using conversation history, else null")

def route_query(query: str, session_context: dict = None, history: list = None) -> QueryIntent:
    """
    Uses a lightweight LLM to classify the user's query and extract metadata.
    """
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-3-flash-preview', generation_config={"response_mime_type": "application/json"})
    
    history_text = "No history"
    if history:
        # User requested a sliding window of the last 3 messages (both prompt and solution) -> 6 turns
        recent_history = history[-6:]
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in recent_history])
        
    prompt = f"""
    You are an intelligent query router for a high school mathematics AI tutor.
    Analyze the user's query and extract metadata.
    
    INTENTS:
    - EXACT: The user explicitly asks for a specific example or section (e.g. "Show me Example 14").
    - CONCEPT: The user asks for a theoretical explanation, definition, formula, or proof (e.g. "Explain the discriminant").
    - EXAMPLE: The user asks for a worked problem or demonstration without specifying an exact number (e.g. "Show me an example using the quadratic formula").
    - BOTH: The user asks for both an explanation and a demonstration (e.g. "Explain the quadratic formula and give an example").
    - BROAD: The user asks for chapter summaries, revision plans, or high-level context (e.g. "Give me a revision plan for this chapter").
    
    Current Session Context (Use this to fill in missing chapter/section if the user says 'this chapter' or 'this example'):
    {session_context or dict()}
    
    Conversation History (Last 3 Turns):
    {history_text}
    
    User Query: "{query}"
    
    INSTRUCTIONS:
    1. First, rewrite the User Query to be a "standalone_query" by resolving any pronouns or references (like "that problem", "it", "the first example") using the Conversation History. If no rewrite is needed, the standalone_query should just be the User Query.
    2. Then, extract the intent and metadata based on this standalone_query.
    
    Respond STRICTLY with a JSON object matching this schema:
    {{
        "intent": "EXACT|CONCEPT|EXAMPLE|BOTH|BROAD",
        "chapter_name": "banking", // or null
        "section_number": "1.2", // or null
        "example_number": "14", // or null
        "standalone_query": "Rewritten query here"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        return QueryIntent(**result)
    except Exception as e:
        print(f"Routing failed: {e}. Raising exception to prevent bad retrieval.")
        raise RuntimeError(f"Router LLM failed: {e}")

if __name__ == "__main__":
    print("Testing Router...")
    q1 = "Show me Example 14 from Chapter 5."
    print(f"Q: {q1} -> {route_query(q1)}")

    q2 = "What is the discriminant?"
    print(f"Q: {q2} -> {route_query(q2)}")
