"""Application settings.

Values are read from the environment, falling back to `backend/.env` for local
development. Secrets have no defaults on purpose: a missing one fails loudly at
startup instead of silently running on a committed placeholder.

Copy `.env.example` to `.env` and fill it in to get started.
"""

from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Database -------------------------------------------------------
    DB_USER: str = "postgres"
    DB_PASSWORD: str
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "content_db"
    USER_DB_NAME: str = "user_information"

    # --- Auth -----------------------------------------------------------
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # --- Generated artifacts ---------------------------------------------
    # Where matplotlib plots produced by the tutor tools are written.
    PLOT_OUTPUT_DIR: Path = BACKEND_DIR / "generated"

    # --- LLM ------------------------------------------------------------
    # Accepts either GEMINI_API_KEY or the SDK's conventional GOOGLE_API_KEY.
    GEMINI_API_KEY: str = Field(
        validation_alias=AliasChoices("GEMINI_API_KEY", "GOOGLE_API_KEY"),
    )


def _load_settings() -> Settings:
    try:
        return Settings()
    except Exception as exc:  # pragma: no cover - startup guard
        raise RuntimeError(
            f"Invalid or incomplete configuration.\n{exc}\n\n"
            f"Copy {BACKEND_DIR / '.env.example'} to {ENV_FILE} and fill in the "
            "required values, or set them as environment variables."
        ) from exc


settings = _load_settings()
