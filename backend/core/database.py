import pg8000.native
from .config import settings

def get_content_db_connection():
    conn = pg8000.native.Connection(
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_NAME
    )
    return conn

def get_user_db_connection():
    conn = pg8000.native.Connection(
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.USER_DB_NAME
    )
    return conn
