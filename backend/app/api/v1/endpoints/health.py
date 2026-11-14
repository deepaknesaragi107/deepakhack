"""Health Check Endpoint."""
import logging
from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.scan import HealthResponse

router = APIRouter()
logger = logging.getLogger("scamshield.health")

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Backend Health Status",
    description="Returns the operational status, version, and timestamp of the ScamShield detection engine."
)
async def check_health() -> HealthResponse:
    logger.info("Health check queried")
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
        engine="Lexical Heuristics, Punycode Guard & Social Engineering NLP Active"
    )

