"""Pydantic Request and Response Schemas."""
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ThreatLevel(str, Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_RISK = "HIGH_RISK"

class ScanType(str, Enum):
    URL = "URL"
    MESSAGE = "MESSAGE"

class Indicator(BaseModel):
    id: str = Field(..., description="Unique machine-readable indicator identifier")
    title: str = Field(..., description="Human-readable title of the indicator")
    category: str = Field(..., description="Threat category")
    severity: str = Field(..., description="Severity level: critical, high, medium, low, safe")
    description: str = Field(..., description="Detailed explanation of the risk mechanism")
    score_impact: int = Field(0, description="Points added to overall risk score")
    matches: Optional[List[str]] = Field(default=None, description="Matched tokens or substrings")

class URLScanRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=3,
        max_length=2048,
        description="Target web address or domain to analyze",
        examples=["https://paypal.com.user-verify.security-notice.xyz/signin"]
    )

class MessageScanRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=15000,
        description="SMS, email content, or social media communication to analyze",
        examples=["CHASE BANK ALERT: Unauthorized login attempt detected. Visit https://chase-security-alert.xyz/verify within 24 hours."]
    )

class ScanResponse(BaseModel):
    scan_id: str = Field(..., description="Unique audit tracking ID for this scan")
    scan_type: ScanType = Field(..., description="Type of scan executed: URL or MESSAGE")
    input_defanged: str = Field(..., description="Sanitized/defanged input safe for display")
    risk_score: int = Field(..., ge=0, le=100, description="Computed risk score from 0 (Safe) to 100 (Severe)")
    threat_classification: ThreatLevel = Field(..., description="Overall threat classification")
    detected_indicators: List[Indicator] = Field(default_factory=list, description="List of identified threat indicators")
    explanation: str = Field(..., description="Plain-English assessment of the potential threat")
    security_recommendations: List[str] = Field(default_factory=list, description="Actionable defensive security checklist")
    processing_status: str = Field("completed", description="Execution status: completed or error")
    details: Dict[str, Any] = Field(default_factory=dict, description="Technical diagnostics (entropy, host, protocol)")
    scanned_at: str = Field(..., description="ISO 8601 UTC timestamp of inspection")

class HealthResponse(BaseModel):
    status: str = Field("healthy", description="Service health state")
    version: str = Field(..., description="API Version")
    timestamp: str = Field(..., description="Server timestamp")
    engine: str = Field(..., description="Analysis engine state")

class HistoryResponse(BaseModel):
    total: int = Field(..., description="Total count of scan entries")
    items: List[ScanResponse] = Field(default_factory=list, description="List of historical scan reports")

