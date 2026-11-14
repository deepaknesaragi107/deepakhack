"""Unit Tests for Message and Social Engineering Threat Analyzer."""
import pytest
from app.services.message_analyzer import analyze_message
from app.core.security import mask_pii
from app.schemas.scan import ThreatLevel, ScanType

def test_urgent_banking_smishing_with_link():
    text = (
        "CHASE BANK ALERT: Immediate action required! Your account will be suspended "
        "within 24 hours. Visit https://chase-security-notice.xyz/verify to unlock."
    )
    res = analyze_message(text)
    assert res.scan_type == ScanType.MESSAGE
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    assert res.risk_score >= 60
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "urgency_coercion" in indicator_ids
    assert "embedded_malicious_link" in indicator_ids or "embedded_suspicious_link" in indicator_ids

def test_otp_theft():
    text = "Security Verification: Send back the 6-digit code sent to your phone immediately to confirm your identity."
    res = analyze_message(text)
    assert res.threat_classification in (ThreatLevel.HIGH_RISK, ThreatLevel.SUSPICIOUS)
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "otp_credential_theft" in indicator_ids

def test_advance_fee_and_gift_card_fraud():
    text = (
        "CONGRATULATIONS! You have won $1,500,000 in the International Sweepstakes! "
        "To claim your reward, send an Apple Gift Card of $100 for processing fees."
    )
    res = analyze_message(text)
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "fake_prize_notification" in indicator_ids
    assert "suspicious_payment_request" in indicator_ids

def test_authority_impersonation_geek_squad():
    text = "Geek Squad renewal notice: Your $499 auto-renewal has been processed. Call Windows support if unauthorized."
    res = analyze_message(text)
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "authority_impersonation" in indicator_ids

def test_benign_message():
    text = "Hi Sarah, can you review the sprint backlog before our team standup tomorrow morning at 10 AM?"
    res = analyze_message(text)
    assert res.threat_classification == ThreatLevel.SAFE
    assert res.risk_score < 25
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "clean_communication" in indicator_ids

def test_pii_masking():
    raw = "My card is 4111-2222-3333-4444 and my SSN is 123-45-6789. Call me at 555-123-4567 or user@example.com."
    masked = mask_pii(raw)
    assert "4111-2222-3333-4444" not in masked
    assert "[REDACTED_CREDIT_CARD]" in masked
    assert "123-45-6789" not in masked
    assert "[REDACTED_SSN]" in masked
    assert "555-123-4567" not in masked
    assert "[REDACTED_PHONE]" in masked
    assert "user@example.com" not in masked
    assert "[REDACTED_EMAIL]" in masked

