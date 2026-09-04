from fastapi import APIRouter, HTTPException, Depends
from schemas.auth_schemas import UserCreate, UserLogin, Token, UserResponse
from services.auth_service import get_password_hash, verify_password, create_access_token, get_current_user
from core.database import get_user_db_connection

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate):
    conn = get_user_db_connection()
    try:
        # Check if exists
        existing = conn.run("SELECT id FROM users WHERE username = :uname", uname=user.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered")
            
        hashed_password = get_password_hash(user.password)
        res = conn.run(
            "INSERT INTO users (username, password_hash, class_level, board) VALUES (:uname, :pwd, :class_level, :board) RETURNING id, username, class_level, board",
            uname=user.username, pwd=hashed_password, class_level=user.class_level, board=user.board
        )
        return {"id": res[0][0], "username": res[0][1], "class_level": res[0][2], "board": res[0][3]}
    finally:
        conn.close()

@router.post("/login", response_model=Token)
def login_user(user: UserLogin):
    conn = get_user_db_connection()
    try:
        row = conn.run("SELECT id, password_hash FROM users WHERE username = :uname", uname=user.username)
        if not row:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
            
        user_id, hashed_password = row[0]
        if not verify_password(user.password, hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect username or password")
            
        access_token = create_access_token(data={"sub": str(user_id)})
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        conn.close()

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user_id: int = Depends(get_current_user)):
    conn = get_user_db_connection()
    try:
        row = conn.run("SELECT id, username, class_level, board FROM users WHERE id = :uid", uid=current_user_id)
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return {"id": row[0][0], "username": row[0][1], "class_level": row[0][2], "board": row[0][3]}
    finally:
        conn.close()
