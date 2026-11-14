"""
Message, SMS, and Email Threat Analyzer.
Detects psychological urgency, financial fraud, credential harvesting,
authority impersonation, and analyzes embedded hyperlinks.
"""
import re
import uuid
from datetime import datetime, timezone

from app.core.security import mask_pii, defang_url
from app.schemas.scan import ThreatLevel, ScanType, Indicator, ScanResponse
from app.services.url_analyzer import analyze_url

# Regex rules for social engineering categories
THREAT_CATEGORIES = [
    {
        'id': 'urgency_coercion',
        'title': 'Urgent or Threatening Language',
        'category': 'Psychological Manipulation',
        'severity': 'high',
        'weight': 30,
        'regex': re.compile(
            r'(\burgent\b|immediate action|account (is|will be|has been) (suspended|locked|terminated|closed)|'
            r'avoid (permanent )?suspension|within \d+ (hours?|hrs?|minutes?|mins?)|act now|final notice|'
            r'urgent response required|arrest warrant|legal action will be taken|law enforcement|immediate response)',
            re.IGNORECASE
        ),
        'description': 'Employs manufactured urgency or fear of adverse consequences to force impulsive compliance without independent verification.'
    },
    {
        'id': 'otp_credential_theft',
        'title': 'Requests for Passwords or OTP Codes',
        'category': 'Credential Harvesting',
        'severity': 'critical',
        'weight': 40,
        'regex': re.compile(
            r'((share|send|provide|enter|submit) (your |the )?(otp|one-time (passcode|code|password)|verification code)|'
            r'(send|share) (back )?(the )?\d+-digit code|confirm (your )?password|'
            r'provide your ssn|social security number|credit card number and cvv|'
            r'atm pin|enter your login details)',
            re.IGNORECASE
        ),
        'description': 'Directly solicits two-factor authentication codes (OTP), passwords, or PINs. Legitimate providers never ask you to send back verification codes.'
    },
    {
        'id': 'suspicious_payment_request',
        'title': 'Suspicious Payment & Non-Standard Transfer Request',
        'category': 'Financial Fraud',
        'severity': 'critical',
        'weight': 35,
        'regex': re.compile(
            r'(gift card|apple gift card|google play card|steam card|'
            r'bitcoin|crypto(currency)?|btc wallet|wire transfer|'
            r'western union|moneygram|zelle transfer|cash app payment|send eth)',
            re.IGNORECASE
        ),
        'description': 'Demands payment via untraceable or irreversible mechanisms (gift cards, cryptocurrency, wire transfers). This is a definitive sign of fraud.'
    },
    {
        'id': 'fake_prize_notification',
        'title': 'Fake Prize & Lottery Notification',
        'category': 'Advance-Fee Fraud',
        'severity': 'high',
        'weight': 30,
        'regex': re.compile(
            r'(congratulations! you (have )?won|lottery winner|'
            r'selected for a \$[0-9,]+ (prize|reward|gift)|inheritance fund|'
            r'claim your (free )?reward|compensation payment|unclaimed jackpot)',
            re.IGNORECASE
        ),
        'description': 'Entices victims with fictitious financial rewards or prizes, requiring advance "processing fees" or credential submission to claim.'
    },
    {
        'id': 'authority_impersonation',
        'title': 'Brand & Authority Impersonation',
        'category': 'Deception & Spoofing',
        'severity': 'medium',
        'weight': 20,
        'regex': re.compile(
            r'(internal revenue service|\birs\b audit|geek squad|'
            r'mcafee|norton 360|amazon (fraud|security|support alert)|'
            r'apple support|usps: missed delivery|chase (fraud|security alert)|wells fargo)',
            re.IGNORECASE
        ),
        'description': 'Impersonates trusted brands, tax authorities, or security vendors to manufacture artificial authority and credibility.'
    },
    {
        'id': 'call_to_action_click_bait',
        'title': 'Aggressive Action Links',
        'category': 'Deception & Obfuscation',
        'severity': 'low',
        'weight': 15,
        'regex': re.compile(
            r'(click here to verify|tap the link below|confirm details at:|login immediately at:)',
            re.IGNORECASE
        ),
        'description': 'Directs the recipient to tap or click an external hyperlink under pretext of urgency.'
    }
]

# Regex to discover embedded URLs inside text messages
URL_EXTRACT_REGEX = re.compile(
    r'(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(?:com|org|net|xyz|top|click|info|co|io|buzz|biz|me)[^\s]*)',
    re.IGNORECASE
)

def analyze_message(raw_message: str) -> ScanResponse:
    """
    Perform deep content, psychological trigger, and embedded link analysis
    on user-provided communications (SMS, Email, DM).
    """
    clean_text = raw_message.strip()
    indicators: list[Indicator] = []
    risk_score = 0
    matched_keywords_summary: list[str] = []

    # 1. Pattern matching across threat categories
    for cat in THREAT_CATEGORIES:
        matches = cat['regex'].findall(clean_text)
        if matches:
            # Flatten matched tuples or strings
            flat_matches = []
            for m in matches:
                if isinstance(m, tuple):
                    flat_matches.extend([elem for elem in m if elem and len(elem) > 3])
                elif isinstance(m, str):
                    flat_matches.append(m)
            
            unique_matches = list(set(flat_matches))[:5]
            matched_keywords_summary.extend(unique_matches)
            risk_score += cat['weight']

            indicators.append(Indicator(
                id=cat['id'],
                title=cat['title'],
                category=cat['category'],
                severity=cat['severity'],
                description=cat['description'],
                score_impact=cat['weight'],
                matches=unique_matches if unique_matches else None
            ))

    # 2. Embedded Hyperlink Extraction & URL Analysis
    found_urls = URL_EXTRACT_REGEX.findall(clean_text)
    analyzed_links: list[dict] = []

    if found_urls:
        for url_str in set(found_urls):
            # Clean trailing punctuation from URL match
            clean_url = re.sub(r'[.,;!?)>]+$', '', url_str)
            sub_scan = analyze_url(clean_url)
            
            analyzed_links.append({
                "url": clean_url,
                "defanged": sub_scan.input_defanged,
                "risk_score": sub_scan.risk_score,
                "threat_level": sub_scan.threat_classification.value
            })

            if sub_scan.threat_classification == ThreatLevel.HIGH_RISK:
                risk_score += 35
                indicators.append(Indicator(
                    id="embedded_malicious_link",
                    title="Contains High-Risk Phishing Link",
                    category="Malicious Payload",
                    severity="critical",
                    description=f"Contains an embedded link ({sub_scan.input_defanged}) that triggered severe phishing indicators.",
                    score_impact=35
                ))
            elif sub_scan.threat_classification == ThreatLevel.SUSPICIOUS:
                risk_score += 20
                indicators.append(Indicator(
                    id="embedded_suspicious_link",
                    title="Contains Suspicious Link",
                    category="Malicious Payload",
                    severity="medium",
                    description=f"Contains an embedded link ({sub_scan.input_defanged}) with cautionary domain indicators.",
                    score_impact=20
                ))

    # 3. Excessive Capitalization (Shouting / Panic Tactics)
    alpha_chars = [c for c in clean_text if c.isalpha()]
    if len(alpha_chars) > 20:
        uppercase_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
        if uppercase_ratio > 0.45:
            risk_score += 10
            indicators.append(Indicator(
                id="excessive_capitalization",
                title="Excessive Uppercase Text (Aggressive Tone)",
                category="Stylistic Anomaly",
                severity="low",
                description="The communication uses an unusually high proportion of uppercase letters, commonly used in scareware to induce alarm.",
                score_impact=10
            ))

    # Normalize final score (0 - 100)
    final_score = min(100, max(0, risk_score))

    # Threat Classification
    if final_score >= 60:
        threat_level = ThreatLevel.HIGH_RISK
    elif final_score >= 25:
        threat_level = ThreatLevel.SUSPICIOUS
    else:
        threat_level = ThreatLevel.SAFE

    # If clean, insert baseline integrity indicator
    if not any(ind.severity in ('critical', 'high', 'medium') for ind in indicators):
        indicators.insert(0, Indicator(
            id="clean_communication",
            title="Standard Communication Patterns",
            category="Baseline Integrity",
            severity="safe",
            description="No high-pressure coercion, gift card demands, OTP solicitations, or deceptive links detected.",
            score_impact=0
        ))

    # Actionable Recommendations
    recommendations: list[str] = []
    if threat_level == ThreatLevel.HIGH_RISK:
        recommendations.append("Do NOT reply to this message, click embedded links, or call numbers listed in the text.")
        recommendations.append("Never share one-time passcodes (OTP), passwords, or PINs under any circumstances.")
        recommendations.append("Remember: No legitimate company demands payment in gift cards, crypto, or wire transfers.")
        recommendations.append("Forward suspicious SMS messages to 7726 (SPAM) to alert cellular security systems.")
        recommendations.append("Block and report the sender on your mobile device or email provider.")
    elif threat_level == ThreatLevel.SUSPICIOUS:
        recommendations.append("Exercise elevated caution. Do not reveal personal or financial details.")
        recommendations.append("Verify the claim independently by contacting the organization through their official website or phone number.")
        recommendations.append("Check the sender email address or phone number for subtle impersonation characters.")
    else:
        recommendations.append("The message exhibits low scam indicators, but remain vigilant with any unsolicited communications.")
        recommendations.append("Never provide sensitive credentials over SMS or unencrypted email.")

    # Plain-English Explanation
    if threat_level == ThreatLevel.HIGH_RISK:
        explanation = (
            "This communication displays textbook social engineering tactics designed to defraud recipients. "
            "It combines manufactured urgency, requests for sensitive authentication codes or untraceable payments, "
            "or deceptive external links to exploit trust."
        )
    elif threat_level == ThreatLevel.SUSPICIOUS:
        explanation = (
            "This message contains cautionary wording or links that warrant careful scrutiny before taking action. "
            "Proceed with vigilance and verify the sender independently."
        )
    else:
        explanation = (
            "The message does not trigger typical scam or social engineering signatures and conforms to normal communication patterns."
        )

    # Safe display string (mask sensitive PII if any user mistakenly pasted real credentials)
    masked_display = mask_pii(clean_text)

    return ScanResponse(
        scan_id=f"sc-{uuid.uuid4().hex[:8]}",
        scan_type=ScanType.MESSAGE,
        input_defanged=masked_display,
        risk_score=final_score,
        threat_classification=threat_level,
        detected_indicators=indicators,
        explanation=explanation,
        security_recommendations=recommendations,
        processing_status="completed",
        details={
            "character_count": len(clean_text),
            "word_count": len(clean_text.split()),
            "embedded_urls_found": len(found_urls),
            "analyzed_links": analyzed_links,
            "matched_keywords": list(set(matched_keywords_summary))
        },
        scanned_at=datetime.now(timezone.utc).isoformat()
    )
