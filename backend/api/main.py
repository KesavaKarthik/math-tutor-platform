"""FastAPI entry point for Uvicorn.

This module simply re‑exports the FastAPI `app` instance defined in the backend root so that
`uvicorn api.main:app` works as expected.
"""

from main import app
