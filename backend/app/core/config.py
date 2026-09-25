import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
REPORTS_DIR = BASE_DIR / "reports_output"
MODEL_DIR = BASE_DIR / "app" / "ml" / "models"

UPLOAD_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "PRAVAAH (CryptoScope)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "pravaah_secret_key_sih2026_ntro_super_secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/pravaah.db"
    SYNC_DATABASE_URL: str = f"sqlite:///{BASE_DIR}/pravaah.db"
    
    # Directories
    BASE_DIR: Path = BASE_DIR
    UPLOAD_DIR: Path = UPLOAD_DIR
    REPORTS_DIR: Path = REPORTS_DIR
    MODEL_DIR: Path = MODEL_DIR
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
