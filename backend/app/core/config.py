"""Application Configuration Module."""
import os
from typing import List

class Settings:
    PROJECT_NAME: str = "ScamShield Detection API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DESCRIPTION: str = (
        "Educational & Defensive Cybersecurity API for URL & Message Threat Analysis."
    )
    
    # CORS Origins (allow frontend dev server)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    
    # Rate Limiting: Max requests per window
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Max payload sizes
    MAX_URL_LENGTH: int = 2048
    MAX_MESSAGE_LENGTH: int = 15000

settings = Settings()

