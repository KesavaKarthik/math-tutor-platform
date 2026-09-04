from core.database import get_user_db_connection

def create_conversation(user_id: int, mode: str, context_id: int = None):
    conn = get_user_db_connection()
    try:
        res = conn.run(
            "INSERT INTO conversations (user_id, mode, context_id) VALUES (:uid, :mode, :cid) RETURNING id",
            uid=user_id, mode=mode, cid=context_id
        )
        return res[0][0] # return the newly created ID
    finally:
        conn.close()

def save_message(conversation_id: int, role: str, content: str):
    conn = get_user_db_connection()
    try:
        # Generate title for new conversation
        if role == "user":
            msgs = conn.run("SELECT COUNT(*) FROM messages WHERE conversation_id = :cid", cid=conversation_id)
            if msgs[0][0] == 0:
                words = content.split()
                title = " ".join(words[:3]) + ("..." if len(words) > 3 else "")
                conn.run("UPDATE conversations SET title = :title WHERE id = :cid", title=title, cid=conversation_id)

        conn.run(
            "INSERT INTO messages (conversation_id, role, content) VALUES (:cid, :role, :content)",
            cid=conversation_id, role=role, content=content
        )
        conn.run(
            "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = :cid",
            cid=conversation_id
        )
    finally:
        conn.close()

def get_conversation_history(conversation_id: int, user_id: int, limit: int = 6):
    conn = get_user_db_connection()
    try:
        # Verify ownership
        conv = conn.run("SELECT id, mode, context_id FROM conversations WHERE id = :cid AND user_id = :uid", 
                        cid=conversation_id, uid=user_id)
        if not conv:
            return None
        
        messages = conn.run(
            "SELECT role, content FROM ("
            "  SELECT id, role, content FROM messages WHERE conversation_id = :cid ORDER BY id DESC LIMIT :limit"
            ") sub ORDER BY id ASC", 
            cid=conversation_id, limit=limit
        )
        return {
            "id": conv[0][0],
            "mode": conv[0][1],
            "context_id": conv[0][2],
            "messages": [{"role": r[0], "content": r[1]} for r in messages]
        }
    finally:
        conn.close()

def get_user_conversations(user_id: int):
    conn = get_user_db_connection()
    try:
        rows = conn.run("SELECT id, mode, updated_at, title FROM conversations WHERE user_id = :uid ORDER BY updated_at DESC", uid=user_id)
        return [{"id": r[0], "mode": r[1], "updated_at": r[2], "title": r[3]} for r in rows]
    finally:
        conn.close()

def update_conversation_title(conversation_id: int, user_id: int, title: str):
    conn = get_user_db_connection()
    try:
        res = conn.run("UPDATE conversations SET title = :title WHERE id = :cid AND user_id = :uid RETURNING id", title=title, cid=conversation_id, uid=user_id)
        return bool(res)
    finally:
        conn.close()

def delete_conversation(conversation_id: int, user_id: int):
    conn = get_user_db_connection()
    try:
        res = conn.run("SELECT id FROM conversations WHERE id = :cid AND user_id = :uid", cid=conversation_id, uid=user_id)
        if not res:
            return False
        conn.run("DELETE FROM messages WHERE conversation_id = :cid", cid=conversation_id)
        conn.run("DELETE FROM conversations WHERE id = :cid", cid=conversation_id)
        return True
    finally:
        conn.close()
