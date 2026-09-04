from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas.chat_schemas import ConversationHistory
from services.auth_service import get_current_user
from services.memory_service import get_user_conversations, get_conversation_history

router = APIRouter(prefix="/api/history", tags=["history"])

@router.get("/conversations")
def get_conversations(current_user: int = Depends(get_current_user)):
    return get_user_conversations(current_user)

@router.get("/conversations/{conversation_id}", response_model=ConversationHistory)
def get_conversation(conversation_id: int, current_user: int = Depends(get_current_user)):
    history = get_conversation_history(conversation_id, current_user)
    if not history:
        raise HTTPException(status_code=404, detail="Conversation not found or unauthorized")
    return history
