"""Integration and Functional Tests for FastAPI Endpoint Handlers."""
import asyncio
import pytest
from app.api.v1.endpoints.health import check_health
from app.api.v1.endpoints.scan_url import scan_url_endpoint
from app.api.v1.endpoints.scan_message import scan_message_endpoint
from app.api.v1.endpoints.history import get_history_endpoint
from app.schemas.scan import (
    URLScanRequest,
    MessageScanRequest,
    ThreatLevel,
    ScanType,
    HealthResponse,
    ScanResponse,
    HistoryResponse
)
from app.services.history_store import history_store

def test_health_check_endpoint():
    res = asyncio.run(check_health())
    assert isinstance(res, HealthResponse)
    assert res.status == "healthy"
    assert res.version == "1.0.0"
    assert "Active" in res.engine

def test_scan_url_endpoint_phishing():
    payload = URLScanRequest(url="https://paypal.com.account-update.notice.xyz/signin")
    res = asyncio.run(scan_url_endpoint(payload))
    assert isinstance(res, ScanResponse)
    assert res.scan_type == ScanType.URL
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    assert res.risk_score >= 60
    assert len(res.detected_indicators) > 0
    assert "paypal" in res.input_defanged
    assert res.processing_status == "completed"

def test_scan_url_endpoint_safe():
    payload = URLScanRequest(url="https://www.paypal.com/signin")
    res = asyncio.run(scan_url_endpoint(payload))
    assert isinstance(res, ScanResponse)
    assert res.threat_classification == ThreatLevel.SAFE
    assert res.risk_score < 30

def test_scan_message_endpoint_phishing():
    payload = MessageScanRequest(
        message="URGENT: Your Wells Fargo account is locked. Send your OTP code immediately to avoid suspension."
    )
    res = asyncio.run(scan_message_endpoint(payload))
    assert isinstance(res, ScanResponse)
    assert res.scan_type == ScanType.MESSAGE
    assert res.threat_classification in (ThreatLevel.HIGH_RISK, ThreatLevel.SUSPICIOUS)
    assert len(res.detected_indicators) > 0

def test_scan_message_endpoint_safe():
    payload = MessageScanRequest(
        message="Hi team, the product roadmap review is scheduled for 3 PM on Thursday. See you there!"
    )
    res = asyncio.run(scan_message_endpoint(payload))
    assert isinstance(res, ScanResponse)
    assert res.threat_classification == ThreatLevel.SAFE
    assert res.risk_score < 25

def test_history_endpoint():
    history_store.clear()
    payload = URLScanRequest(url="https://example.com/test")
    asyncio.run(scan_url_endpoint(payload))
    
    hist: HistoryResponse = asyncio.run(get_history_endpoint(limit=10))
    assert hist.total >= 1
    assert len(hist.items) >= 1
    assert hist.items[0].scan_type == ScanType.URL
