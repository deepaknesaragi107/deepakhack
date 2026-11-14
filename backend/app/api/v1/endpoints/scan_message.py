"""Message Scan Endpoint."""
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.rate_limiter import rate_limit_dependency
from app.core.security import safe_log_message
from app.schemas.scan import MessageScanRequest, ScanResponse
from app.services.message_analyzer import analyze_message
from app.services.history_store import history_store

router = APIRouter()
logger = logging.getLogger("scamshield.message_scanner")

@router.post(
    "/scan/message",
    response_model=ScanResponse,
    summary="Analyze Message / SMS / Email Threat Level",
    description=(
        "Analyzes text communication for psychological urgency, OTP and password harvesting, "
        "gift card and cryptocurrency extortion, fake prizes, and embedded malicious links."
    ),
    dependencies=[Depends(rate_limit_dependency)]
)
async def scan_message_endpoint(payload: MessageScanRequest) -> ScanResponse:
    # Safe logging with PII scrubbing
    logged_msg = safe_log_message(payload.message)
    logger.info("Executing message analysis: %s", logged_msg)
    
    try:
        result = analyze_message(payload.message)
        # Store in historical log
        history_store.add(result)
        logger.info(
            "Completed message scan: id=%s risk_score=%d threat=%s",
            result.scan_id, result.risk_score, result.threat_classification.value
        )
        return result
    except Exception as exc:
        logger.exception("Unexpected error analyzing message: %s", logged_msg)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Analysis failed",
                "message": "An internal error occurred while parsing the message content."
            }
        )

