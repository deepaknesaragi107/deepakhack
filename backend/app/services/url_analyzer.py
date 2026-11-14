"""
Deep URL Lexical and Syntactic Threat Analyzer.
Adheres strictly to the passive evaluation policy: Never connects to, fetches,
or executes target websites.
"""
import math
import re
import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse, unquote

from app.core.security import defang_url, is_private_or_loopback_ip
from app.schemas.scan import ThreatLevel, ScanType, Indicator, ScanResponse

# High-risk disposable / abuse-correlated TLDs
HIGH_RISK_TLDS = {
    '.xyz', '.top', '.click', '.buzz', '.surf', '.club', '.stream',
    '.gq', '.cf', '.tk', '.ml', '.ga', '.work', '.icu', '.monster',
    '.rest', '.cam', '.country', '.kim', '.fit', '.gdn', '.casa'
}

# Known URL shortener services that hide the true destination
URL_SHORTENERS = {
    'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'ow.ly', 'buff.ly',
    'goo.gl', 'cutt.ly', 'rb.gy', 'shorturl.at', 'rebrand.ly', 'bl.ink'
}

# Targeted Brands commonly impersonated by phishing campaigns
TARGETED_BRANDS = [
    {'name': 'PayPal', 'keyword': 'paypal', 'legit_domains': ['paypal.com', 'paypal.me']},
    {'name': 'Apple', 'keyword': 'apple', 'legit_domains': ['apple.com', 'icloud.com']},
    {'name': 'Chase Bank', 'keyword': 'chase', 'legit_domains': ['chase.com']},
    {'name': 'Bank of America', 'keyword': 'bankofamerica', 'legit_domains': ['bankofamerica.com']},
    {'name': 'Wells Fargo', 'keyword': 'wellsfargo', 'legit_domains': ['wellsfargo.com']},
    {'name': 'Microsoft', 'keyword': 'microsoft', 'legit_domains': ['microsoft.com', 'live.com', 'office.com']},
    {'name': 'Netflix', 'keyword': 'netflix', 'legit_domains': ['netflix.com']},
    {'name': 'Amazon', 'keyword': 'amazon', 'legit_domains': ['amazon.com', 'amazon.co.uk']},
    {'name': 'Google', 'keyword': 'google', 'legit_domains': ['google.com', 'accounts.google.com']},
    {'name': 'USPS', 'keyword': 'usps', 'legit_domains': ['usps.com']},
    {'name': 'DHL', 'keyword': 'dhl', 'legit_domains': ['dhl.com']},
    {'name': 'FedEx', 'keyword': 'fedex', 'legit_domains': ['fedex.com']},
    {'name': 'MetaMask', 'keyword': 'metamask', 'legit_domains': ['metamask.io']},
    {'name': 'Binance', 'keyword': 'binance', 'legit_domains': ['binance.com']},
]

# Authentication and urgency keywords in paths or queries
PHISHING_PATH_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'update', 'account',
    'billing', 'security', 'secure', 'confirm', 'wallet', 'recovery',
    'suspended', 'password', 'authenticate', 're-verify', 'claim'
]

def calculate_shannon_entropy(text: str) -> float:
    """Calculate Shannon Entropy of a string to detect algorithmic domain generation (DGA)."""
    if not text:
        return 0.0
    frequencies = {}
    for char in text:
        frequencies[char] = frequencies.get(char, 0) + 1
    length = len(text)
    entropy = -sum((count / length) * math.log2(count / length) for count in frequencies.values())
    return round(entropy, 2)

def analyze_url(raw_url: str) -> ScanResponse:
    """
    Perform deep lexical, structural, and syntactic analysis on a user-provided URL.
    Returns a standardized ScanResponse object.
    """
    url_cleaned = raw_url.strip()
    # Normalize scheme for parsing
    if not re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*://', url_cleaned):
        url_cleaned = 'https://' + url_cleaned

    try:
        parsed = urlparse(url_cleaned)
    except Exception:
        # Malformed URL
        return ScanResponse(
            scan_id=f"sc-{uuid.uuid4().hex[:8]}",
            scan_type=ScanType.URL,
            input_defanged=defang_url(raw_url),
            risk_score=95,
            threat_classification=ThreatLevel.HIGH_RISK,
            detected_indicators=[
                Indicator(
                    id="malformed_url_syntax",
                    title="Malformed URL Syntax",
                    category="Syntax & Parsing",
                    severity="high",
                    description="The provided input cannot be parsed as a standard RFC 3986 URI.",
                    score_impact=95
                )
            ],
            explanation="The URL has invalid formatting, commonly utilized in parser-evasion attacks.",
            security_recommendations=["Do not attempt to load this malformed address in any web browser."],
            processing_status="completed",
            details={},
            scanned_at=datetime.now(timezone.utc).isoformat()
        )

    hostname = (parsed.hostname or "").lower()
    netloc = (parsed.netloc or "").lower()
    pathname = parsed.path.lower()
    query = parsed.query.lower()
    full_url = parsed.geturl()

    indicators: list[Indicator] = []
    risk_score = 0

    # 1. URL Length Analysis
    url_len = len(full_url)
    if url_len > 120:
        risk_score += 20
        indicators.append(Indicator(
            id="excessive_url_length",
            title="Excessive URL Length",
            category="Structure & Length",
            severity="medium",
            description=f"URL is unusually long ({url_len} characters). Phishers frequently pad URLs to push the real domain off-screen on mobile devices.",
            score_impact=20
        ))
    elif url_len > 75:
        risk_score += 10
        indicators.append(Indicator(
            id="elevated_url_length",
            title="Elevated URL Length",
            category="Structure & Length",
            severity="low",
            description=f"URL length ({url_len} characters) is above standard navigational benchmarks.",
            score_impact=10
        ))

    # 2. IP Address as Hostname & SSRF Guard Check
    ipv4_regex = re.compile(r'^(\d{1,3}\.){3}\d{1,3}$')
    is_raw_ip = bool(ipv4_regex.match(hostname))
    
    if is_raw_ip:
        is_private = is_private_or_loopback_ip(hostname)
        if is_private:
            risk_score += 50
            indicators.append(Indicator(
                id="internal_ip_ssrf",
                title="Internal / Loopback IP Address (SSRF Target)",
                category="Network Infrastructure",
                severity="critical",
                description=f"The URL targets a private/loopback RFC 1918 or link-local address ({hostname}). This indicates a Server-Side Request Forgery attempt.",
                score_impact=50
            ))
        else:
            risk_score += 45
            indicators.append(Indicator(
                id="raw_ip_hostname",
                title="Direct IP Address Host",
                category="Network Infrastructure",
                severity="high",
                description=f"The URL targets a raw IP address ({hostname}) rather than a registered domain name. Legitimate consumer services virtually never use raw IPs.",
                score_impact=45
            ))

    # 3. URL Shortener Detection
    if hostname in URL_SHORTENERS:
        risk_score += 25
        indicators.append(Indicator(
            id="url_shortener_used",
            title="URL Shortener Masking",
            category="Deception & Obfuscation",
            severity="medium",
            description=f"Domain {hostname} is a known URL shortening redirect service. Shorteners conceal the ultimate destination domain and are heavily favored in SMS phishing campaigns.",
            score_impact=25
        ))

    # 4. Embedded Userinfo / @ Symbol Trick (RFC 3986 Authority Masking)
    if '@' in netloc:
        risk_score += 45
        indicators.append(Indicator(
            id="userinfo_at_symbol_spoof",
            title="Deceptive Authority '@' Symbol",
            category="Deception & Obfuscation",
            severity="critical",
            description="The URL contains an '@' symbol in the authority component. Browsers discard everything before the '@' as userinfo, directing the user to a completely different destination host.",
            score_impact=45
        ))

    # 5. Punycode & IDN Homoglyph Detection
    if hostname.startswith('xn--') or '.xn--' in hostname:
        risk_score += 65
        indicators.append(Indicator(
            id="punycode_homoglyph",
            title="Punycode (IDN Homoglyph) Encoding",
            category="Deception & Spoofing",
            severity="critical",
            description="The domain uses Punycode ('xn--') encoding, which allows attackers to use lookalike Cyrillic/Greek characters that visually simulate trusted Latin brand names.",
            score_impact=65
        ))

    # 6. Brand Impersonation in Hostname or Subdomain
    impersonated_brand = None
    for brand in TARGETED_BRANDS:
        if brand['keyword'] in hostname:
            is_legit = any(
                hostname == legit or hostname.endswith('.' + legit)
                for legit in brand['legit_domains']
            )
            if not is_legit:
                impersonated_brand = brand
                risk_score += 45
                indicators.append(Indicator(
                    id=f"brand_spoof_{brand['keyword']}",
                    title=f"Brand Impersonation ({brand['name']})",
                    category="Brand Abuse",
                    severity="critical",
                    description=f"Hostname references the brand trademark '{brand['name']}', but is NOT hosted on their official registered domains ({', '.join(brand['legit_domains'])}).",
                    score_impact=45
                ))
                break

    # 7. Subdomain Stacking / Cloaking
    domain_parts = hostname.split('.')
    if len(domain_parts) > 4 and not is_raw_ip:
        risk_score += 25
        subdomain_count = len(domain_parts) - 2
        indicators.append(Indicator(
            id="excessive_subdomains",
            title="Subdomain Stacking (Domain Cloaking)",
            category="Structural Anomaly",
            severity="high",
            description=f"Domain has {subdomain_count} nested subdomain layers. Attackers stack subdomains to trick mobile viewers where browser address bars truncate long domains.",
            score_impact=25
        ))

    # 8. High-Risk TLD Reputation
    matched_tld = next((tld for tld in HIGH_RISK_TLDS if hostname.endswith(tld)), None)
    if matched_tld:
        risk_score += 25
        indicators.append(Indicator(
            id="high_risk_tld",
            title=f"High-Risk Top Level Domain ({matched_tld})",
            category="Domain Reputation",
            severity="medium",
            description=f"The '{matched_tld}' TLD exhibits high statistical correlation with transient phishing kits, spam campaigns, and low-cost registration abuse.",
            score_impact=25
        ))

    # 9. Suspicious URL Encoding & Hex Obfuscation
    hex_encoded_matches = re.findall(r'%[0-9a-fA-F]{2}', parsed.path + parsed.query)
    if len(hex_encoded_matches) > 3:
        risk_score += 20
        indicators.append(Indicator(
            id="suspicious_hex_encoding",
            title="Excessive URL Percent-Encoding",
            category="Deception & Obfuscation",
            severity="medium",
            description=f"Contains {len(hex_encoded_matches)} percent-encoded byte sequences, often used to bypass basic pattern matching and web application firewalls.",
            score_impact=20
        ))

    # 10. Non-Standard Staging Ports
    if parsed.port and parsed.port not in (80, 443):
        risk_score += 25
        indicators.append(Indicator(
            id="non_standard_port",
            title=f"Non-Standard Staging Port (:{parsed.port})",
            category="Network Protocol",
            severity="medium",
            description=f"The URL specifies a custom port (:{parsed.port}). Legitimate consumer portals operate strictly on standard HTTP (80) or HTTPS (443) ports.",
            score_impact=25
        ))

    # 11. Shannon Entropy of Hostname (DGA Check)
    entropy_val = calculate_shannon_entropy(hostname)
    if entropy_val > 3.8 and not is_raw_ip:
        risk_score += 15
        indicators.append(Indicator(
            id="high_shannon_entropy",
            title=f"High Domain Entropy ({entropy_val})",
            category="Algorithmic Anomaly",
            severity="low",
            description="The domain exhibits character distribution randomness characteristic of Domain Generation Algorithms (DGAs) used by botnets and bulletproof hosting.",
            score_impact=15
        ))

    # 12. Phishing Path Keywords & Credential Intent
    matched_path_keywords = [
        kw for kw in PHISHING_PATH_KEYWORDS
        if kw in pathname or kw in query
    ]
    if matched_path_keywords and (impersonated_brand or matched_tld or is_raw_ip):
        risk_score += 15
        indicators.append(Indicator(
            id="credential_harvesting_path",
            title="Credential Harvesting Path Indicators",
            category="Threat Intent",
            severity="high",
            description=f"Path or query contains high-risk authentication keywords: {', '.join(matched_path_keywords[:4])}.",
            score_impact=15,
            matches=matched_path_keywords[:4]
        ))

    # 13. Protocol Analysis & HTTPS Clarification
    # RULE: Do NOT claim that HTTPS guarantees a website is safe.
    if parsed.scheme.lower() == 'http':
        risk_score += 15
        indicators.append(Indicator(
            id="unencrypted_http",
            title="Unencrypted Cleartext HTTP Protocol",
            category="Transport Security",
            severity="low",
            description="The URL uses unencrypted HTTP. Data sent over this link is vulnerable to interception and credential sniffing.",
            score_impact=15
        ))
    else:
        # HTTPS is present: Explicit educational notice
        indicators.append(Indicator(
            id="https_advisory",
            title="HTTPS Encryption Active (Advisory)",
            category="Transport Security",
            severity="safe",
            description="HTTPS encrypts communication between the client and server. Note: HTTPS does NOT guarantee website legitimacy, as malicious phishing sites routinely obtain free SSL certificates.",
            score_impact=0
        ))

    # 14. Consecutive Hyphens and Dots in Hostname
    if '--' in hostname or '..' in hostname:
        risk_score += 15
        indicators.append(Indicator(
            id="consecutive_symbols_hostname",
            title="Consecutive Symbol Padding",
            category="Deception & Spoofing",
            severity="low",
            description="Domain name includes consecutive hyphens or dots, a common technique to mimic legitimate domains while registering available variants.",
            score_impact=15
        ))

    # Final Risk Score Normalization (0 - 100)
    final_score = min(100, max(0, risk_score))

    # Threat Classification
    if final_score >= 60:
        threat_level = ThreatLevel.HIGH_RISK
    elif final_score >= 25:
        threat_level = ThreatLevel.SUSPICIOUS
    else:
        threat_level = ThreatLevel.SAFE

    # If clean, add baseline indicator
    if not any(ind.severity in ('critical', 'high', 'medium') for ind in indicators):
        indicators.insert(0, Indicator(
            id="clean_lexical_profile",
            title="Conforms to Standard Lexical Profile",
            category="Baseline Integrity",
            severity="safe",
            description="No suspicious TLDs, Punycode tricks, brand spoofing, or abnormal structural characteristics detected.",
            score_impact=0
        ))

    # Dynamic Actionable Recommendations
    recommendations: list[str] = []
    if threat_level == ThreatLevel.HIGH_RISK:
        recommendations.append("Do NOT visit this link or enter passwords, 2FA codes, or payment card details.")
        recommendations.append("Never download software, browser extensions, or documents from this location.")
        recommendations.append("If credentials were submitted, immediately reset passwords on the genuine service website and terminate active sessions.")
        recommendations.append("Report this domain to Google Safe Browsing and your organization's security team.")
    elif threat_level == ThreatLevel.SUSPICIOUS:
        recommendations.append("Exercise extreme caution. Manually verify the web address character-by-character.")
        recommendations.append("Do not provide personal, banking, or sensitive organizational data.")
        recommendations.append("Confirm the authenticity of the link through an established, independent communication channel.")
    else:
        recommendations.append("The URL appears structurally legitimate. Always check that the browser address bar matches your intended destination.")
        recommendations.append("Ensure Multi-Factor Authentication (MFA) is active on your accounts as standard hygiene.")

    # Plain-English Explanation
    if threat_level == ThreatLevel.HIGH_RISK:
        explanation = (
            f"This URL exhibits severe red flags indicative of an active phishing or malicious campaign. "
            f"It displays structural anomalies such as "
            f"{'brand impersonation, ' if impersonated_brand else ''}"
            f"{'direct IP hosting, ' if is_raw_ip else ''}"
            f"deceptive encoding, or high-risk domain reputation designed to mislead visitors."
        )
    elif threat_level == ThreatLevel.SUSPICIOUS:
        explanation = (
            f"This URL shows cautionary attributes often correlated with deceptive practices, "
            f"such as an unusual domain structure, high entropy, or a disposable top-level domain."
        )
    else:
        explanation = (
            "The analyzed address complies with standard domain naming conventions and does not trigger "
            "known deceptive brand impersonation or structural phishing indicators."
        )

    return ScanResponse(
        scan_id=f"sc-{uuid.uuid4().hex[:8]}",
        scan_type=ScanType.URL,
        input_defanged=defang_url(full_url),
        risk_score=final_score,
        threat_classification=threat_level,
        detected_indicators=indicators,
        explanation=explanation,
        security_recommendations=recommendations,
        processing_status="completed",
        details={
            "hostname": hostname,
            "entropy": entropy_val,
            "url_length": url_len,
            "protocol": parsed.scheme,
            "port": parsed.port or (443 if parsed.scheme == 'https' else 80),
            "is_raw_ip": is_raw_ip
        },
        scanned_at=datetime.now(timezone.utc).isoformat()
    )
