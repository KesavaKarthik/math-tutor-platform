from pydantic import BaseModel
from typing import Optional

class Chapter(BaseModel):
    id: int
    name: str

class Concept(BaseModel):
    id: int
    section_number: str
    title: str
    content: str
    content_explaination: Optional[str] = None
    
class Example(BaseModel):
    id: int
    example_number: int
    title: str
    question_text: str
    # Note: solution_text is intentionally NOT included in this schema!
