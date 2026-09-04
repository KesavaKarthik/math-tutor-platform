from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes_auth import router as auth_router
from api.routes_content import router as content_router
from api.routes_history import router as history_router
from api.routes_chat import router as chat_router

app = FastAPI(title="AI Math Tutor Backend", version="1.0")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(content_router)
app.include_router(history_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Math Tutor Backend!"}
