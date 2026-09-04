import sys
import os

# Add the parent directory to sys.path so we can import core.database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import get_user_db_connection

def init_db():
    conn = get_user_db_connection()
    try:
        print("Creating users table...")
        conn.run("""
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        print("Creating conversations table...")
        conn.run("""
        CREATE TABLE IF NOT EXISTS conversations (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
            mode VARCHAR(50) NOT NULL, -- 'learning', 'socratic', 'global'
            context_id BIGINT, -- e.g., chapter_id, concept_id, or example_id depending on mode
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        print("Creating messages table...")
        conn.run("""
        CREATE TABLE IF NOT EXISTS messages (
            id BIGSERIAL PRIMARY KEY,
            conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
            role VARCHAR(50) NOT NULL, -- 'user' or 'ai'
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        print("Chat database tables created successfully!")
    except Exception as e:
        print("Error creating tables:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
