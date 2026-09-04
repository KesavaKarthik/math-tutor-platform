from fastapi import APIRouter, HTTPException, Depends
from typing import List
from schemas.content_schemas import Chapter, Concept, Example
from core.database import get_content_db_connection
from services.auth_service import get_optional_user
from typing import Optional

router = APIRouter(prefix="/api/content", tags=["content"])

@router.get("/chapters", response_model=List[Chapter])
def get_chapters(current_user: Optional[int] = Depends(get_optional_user)):
    conn = get_content_db_connection()
    try:
        rows = conn.run("SELECT id, chapter_name FROM chapters ORDER BY id ASC")
        return [{"id": r[0], "name": r[1].replace(".txt", "").replace("_", " ")} for r in rows]
    finally:
        conn.close()

@router.get("/chapters/{chapter_id}/concepts", response_model=List[Concept])
def get_chapter_concepts(chapter_id: int, current_user: Optional[int] = Depends(get_optional_user)):
    conn = get_content_db_connection()
    try:
        rows = conn.run("SELECT id, section_number, title, content, content_explaination FROM chapter_concepts WHERE chapter_id = :cid ORDER BY section_number ASC", cid=chapter_id)
        return [{"id": r[0], "section_number": r[1], "title": r[2], "content": r[3], "content_explaination": r[4]} for r in rows]
    finally:
        conn.close()

@router.get("/chapters/{chapter_id}/examples", response_model=List[Example])
def get_chapter_examples(chapter_id: int, current_user: Optional[int] = Depends(get_optional_user)):
    conn = get_content_db_connection()
    try:
        # Intentionally ONLY fetching question_text, not solution_text, so students can't cheat!
        rows = conn.run("SELECT id, example_number, title, question_text FROM chapter_examples WHERE chapter_id = :cid ORDER BY example_number ASC", cid=chapter_id)
        return [{"id": r[0], "example_number": r[1], "title": r[2], "question_text": r[3]} for r in rows]
    finally:
        conn.close()
