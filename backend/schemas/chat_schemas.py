from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    query: str
    context_id: Optional[int] = None # chapter_id, concept_id, or example_id
    conversation_id: Optional[int] = None # If continuing an existing conversation

class MessageResponse(BaseModel):
    role: str
    content: str
    
class ChatResponse(BaseModel):
    conversation_id: Optional[int] = None
    message: MessageResponse
    
class ConversationHistory(BaseModel):
    id: int
    mode: str
    context_id: Optional[int]
    messages: List[MessageResponse]

class ConversationListItem(BaseModel):
    id: int
    mode: str
    updated_at: str
    title: Optional[str] = None

class RenameRequest(BaseModel):
    title: str
