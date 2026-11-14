"""URL Scan Endpoint."""
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.rate_limiter import rate_limit_dependency
from app.core.security import safe_log_message
from app.schemas.scan import URLScanRequest, ScanResponse
from app.services.url_analyzer import analyze_url
from app.services.history_store import history_store

router = APIRouter()
logger = logging.getLogger("scamshield.url_scanner")

@router.post(
    "/scan/url",
    response_model=ScanResponse,
    summary="Analyze Website / URL Threat Level",
    description=(
        "Analyzes target URL for Punycode homoglyphs, brand spoofing, suspicious TLDs, "
        "entropy, internal IP SSRF attempts, and credential harvesting paths. "
        "Does NOT execute or visit the website."
    ),
    dependencies=[Depends(rate_limit_dependency)]
)
async def scan_url_endpoint(payload: URLScanRequest) -> ScanResponse:
    # Safe logging with PII masking and defanged string
    logged_url = safe_log_message(payload.url)
    logger.info("Executing passive URL scan on target: %s", logged_url)
    
    try:
        result = analyze_url(payload.url)
        # Store in historical log
        history_store.add(result)
        logger.info(
            "Completed URL scan: id=%s risk_score=%d threat=%s",
            result.scan_id, result.risk_score, result.threat_classification.value
        )
        return result
    except Exception as exc:
        logger.exception("Unexpected error analyzing URL: %s", logged_url)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Scan execution failed",
                "message": "An internal error occurred while inspecting the URL."
            }
        )

