from fastapi import APIRouter, HTTPException, Depends
from schemas.chat_schemas import ChatRequest, ChatResponse, RenameRequest
from services.memory_service import create_conversation, save_message, get_conversation_history, get_user_conversations, update_conversation_title, delete_conversation
from services.llm_service import ask_learning_mode, ask_socratic_mode, ask_global_mode
from services.retrieval_service import get_tutor_context
from core.database import get_content_db_connection
from services.auth_service import get_optional_user, get_current_user
from typing import Optional

router = APIRouter(prefix="/api/chat", tags=["chat"])

def handle_chat_history(request: ChatRequest, user_id: int, mode: str):
    if request.conversation_id:
        history = get_conversation_history(request.conversation_id, user_id)
        if not history or history["mode"] != mode:
            raise HTTPException(status_code=400, detail="Invalid conversation ID")
        conversation_id = request.conversation_id
        messages = history["messages"]
    else:
        conversation_id = create_conversation(user_id, mode, request.context_id) if user_id else None
        messages = []
        
    # Save the new user message
    if conversation_id and user_id:
        save_message(conversation_id, "user", request.query)
    return conversation_id, messages

@router.get("/conversations")
def list_conversations(current_user: int = Depends(get_current_user)):
    return get_user_conversations(current_user)

@router.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: int, current_user: int = Depends(get_current_user)):
    history = get_conversation_history(conversation_id, current_user)
    if not history:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return history

@router.put("/conversations/{conversation_id}/title")
def rename_conversation(conversation_id: int, request: RenameRequest, current_user: int = Depends(get_current_user)):
    success = update_conversation_title(conversation_id, current_user, request.title)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Success"}

@router.delete("/conversations/{conversation_id}")
def remove_conversation(conversation_id: int, current_user: int = Depends(get_current_user)):
    success = delete_conversation(conversation_id, current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Success"}

@router.post("/learning")
def chat_learning(request: ChatRequest, current_user: Optional[int] = Depends(get_optional_user)):
    if not request.context_id:
        raise HTTPException(status_code=400, detail="context_id (concept_id) is required")
        
    conn = get_content_db_connection()
    try:
        row = conn.run("SELECT content FROM chapter_concepts WHERE id = :cid", cid=request.context_id)
        if not row:
            raise HTTPException(status_code=404, detail="Concept not found")
        concept_text = row[0][0]
    finally:
        conn.close()
        
    conversation_id, history = handle_chat_history(request, current_user, "learning")
    
    ai_response = ask_learning_mode(request.query, concept_text, history)
    
    if conversation_id and current_user:
        save_message(conversation_id, "ai", ai_response)
    
    return ChatResponse(
        conversation_id=conversation_id,
        message={"role": "ai", "content": ai_response}
    )

@router.post("/socratic")
def chat_socratic(request: ChatRequest, current_user: Optional[int] = Depends(get_optional_user)):
    if not request.context_id:
        raise HTTPException(status_code=400, detail="context_id (example_id) is required")
        
    conn = get_content_db_connection()
    try:
        row = conn.run("SELECT question_text, solution_text FROM chapter_examples WHERE id = :cid", cid=request.context_id)
        if not row:
            raise HTTPException(status_code=404, detail="Example not found")
        q_text, s_text = row[0]
    finally:
        conn.close()
        
    conversation_id, history = handle_chat_history(request, current_user, "socratic")
    
    ai_response = ask_socratic_mode(request.query, q_text, s_text, history)
    
    if conversation_id and current_user:
        save_message(conversation_id, "ai", ai_response)
    
    return ChatResponse(
        conversation_id=conversation_id,
        message={"role": "ai", "content": ai_response}
    )

@router.post("/global")
def chat_global(request: ChatRequest, current_user: Optional[int] = Depends(get_optional_user)):
    # Create or load history
    conversation_id, history = handle_chat_history(request, current_user, "global")
    
    # We pass the context to the retrieval engine if they are in a specific chapter
    session_context = {"chapter_id": request.context_id} if request.context_id else None
    
    # Run RAG retrieval (Hybrid Search + RRF)
    retrieved_context = get_tutor_context(request.query, session_context, history=history)
    
    # Prompt LLM
    ai_response = ask_global_mode(request.query, retrieved_context, history)
    
    if conversation_id and current_user:
        save_message(conversation_id, "ai", ai_response)
    
    return ChatResponse(
        conversation_id=conversation_id,
        message={"role": "ai", "content": ai_response}
    )
