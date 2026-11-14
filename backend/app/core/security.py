"""Security, Defanging, PII Masking, and SSRF Prevention Module."""
import re
import ipaddress
from typing import Optional

# Regex for PII Masking
CREDIT_CARD_REGEX = re.compile(r'\b(?:\d{4}[ -]?){3}\d{4}\b')
SSN_REGEX = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
PHONE_REGEX = re.compile(r'\b(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')

def defang_url(url: str) -> str:
    """Neutralize a potentially malicious URL so it cannot be directly clicked."""
    if not url:
        return ""
    
    # Replace protocols
    defanged = re.sub(r'^https://', 'hxxps://', url, flags=re.IGNORECASE)
    defanged = re.sub(r'^http://', 'hxxp://', defanged, flags=re.IGNORECASE)
    
    # Replace dots and at-symbols in host/authority
    defanged = defanged.replace('.', '[.]').replace('@', '[@]')
    return defanged

def mask_pii(text: str) -> str:
    """Redact sensitive user data (Cards, SSNs, Phones, Emails) for safe logging."""
    if not text:
        return ""
    masked = CREDIT_CARD_REGEX.sub('[REDACTED_CREDIT_CARD]', text)
    masked = SSN_REGEX.sub('[REDACTED_SSN]', masked)
    masked = PHONE_REGEX.sub('[REDACTED_PHONE]', masked)
    masked = EMAIL_REGEX.sub('[REDACTED_EMAIL]', masked)
    return masked

def safe_log_message(msg: str, max_len: int = 120) -> str:
    """Prepare a string for logging: sanitize control characters and mask PII."""
    if not msg:
        return "<empty>"
    clean = re.sub(r'[\r\n\t]+', ' ', msg).strip()
    masked = mask_pii(clean)
    if len(masked) > max_len:
        return masked[:max_len] + "..."
    return masked

def is_private_or_loopback_ip(host_or_ip: str) -> bool:
    """
    Check if a given string represents a loopback, RFC1918 private,
    link-local (cloud metadata), or reserved IP address.
    Strictly used to prevent SSRF vulnerabilities.
    """
    clean_host = host_or_ip.strip('[]').split(':')[0]
    try:
        ip = ipaddress.ip_address(clean_host)
        return (
            ip.is_loopback or
            ip.is_private or
            ip.is_link_local or
            ip.is_multicast or
            ip.is_reserved or
            ip.is_unspecified
        )
    except ValueError:
        # Not a raw IP address (it's a domain name)
        return False

