"""Unit Tests for URL Lexical Analyzer and Defanging Engine."""
import pytest
from app.services.url_analyzer import analyze_url, calculate_shannon_entropy
from app.core.security import defang_url, is_private_or_loopback_ip
from app.schemas.scan import ThreatLevel, ScanType

def test_legitimate_url_safe():
    res = analyze_url("https://www.paypal.com/signin")
    assert res.scan_type == ScanType.URL
    assert res.threat_classification == ThreatLevel.SAFE
    assert res.risk_score < 30
    assert any(ind.id == "https_advisory" for ind in res.detected_indicators)

def test_github_legitimate_url():
    res = analyze_url("https://github.com/features/security")
    assert res.threat_classification == ThreatLevel.SAFE
    assert res.risk_score == 0
    assert "github[.]com" in res.input_defanged

def test_brand_spoofing_subdomain_and_tld():
    target = "https://paypal.com.account-verify.notice.xyz/login"
    res = analyze_url(target)
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    assert res.risk_score >= 60
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "brand_spoof_paypal" in indicator_ids
    assert "high_risk_tld" in indicator_ids
    assert "excessive_subdomains" in indicator_ids

def test_raw_ip_address_and_port():
    target = "http://192.168.1.100:8080/bank/login.html"
    res = analyze_url(target)
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "internal_ip_ssrf" in indicator_ids
    assert "non_standard_port" in indicator_ids
    assert "unencrypted_http" in indicator_ids

def test_punycode_homoglyph():
    target = "https://xn--appl-43d.com/icloud/auth"
    res = analyze_url(target)
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "punycode_homoglyph" in indicator_ids

def test_url_shortener():
    target = "https://bit.ly/claim-tax-refund"
    res = analyze_url(target)
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "url_shortener_used" in indicator_ids

def test_authority_at_symbol_trick():
    target = "https://trusted-bank.com@malicious-harvest.xyz/signin"
    res = analyze_url(target)
    assert res.threat_classification == ThreatLevel.HIGH_RISK
    indicator_ids = [ind.id for ind in res.detected_indicators]
    assert "userinfo_at_symbol_spoof" in indicator_ids

def test_url_defanging():
    original = "https://evil.attacker.xyz/payload.exe"
    defanged = defang_url(original)
    assert defanged == "hxxps://evil[.]attacker[.]xyz/payload[.]exe"
    assert "https://" not in defanged
    assert "[.]" in defanged

def test_ssrf_private_ip_detection():
    assert is_private_or_loopback_ip("127.0.0.1") is True
    assert is_private_or_loopback_ip("10.0.0.1") is True
    assert is_private_or_loopback_ip("192.168.1.1") is True
    assert is_private_or_loopback_ip("169.254.169.254") is True
    assert is_private_or_loopback_ip("8.8.8.8") is False
    assert is_private_or_loopback_ip("example.com") is False

def test_shannon_entropy():
    # Low entropy (repetitive)
    low = calculate_shannon_entropy("aaaaaaa")
    # High entropy (random hex or DGA string)
    high = calculate_shannon_entropy("x8q29zklp4mq189b")
    assert high > low
