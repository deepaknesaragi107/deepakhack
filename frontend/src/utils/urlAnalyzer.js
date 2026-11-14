/**
 * ScamShield URL Analysis & Defanging Utilities
 * Provides deterministic client-side heuristic inspection
 */

export function defangUrl(url) {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//i, (match) => match.toLowerCase().startsWith('https') ? 'hxxps://' : 'hxxp://')
    .replace(/\./g, '[.]')
    .replace(/@/g, '[@]');
}

export function refangUrl(url) {
  if (!url) return '';
  return url
    .replace(/^hxxps?:\/\//i, (match) => match.toLowerCase().startsWith('hxxps') ? 'https://' : 'http://')
    .replace(/\[\.\]/g, '.')
    .replace(/\[@\]/g, '@');
}

export function calculateEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(2));
}

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.buzz', '.surf', '.club', '.stream',
  '.gq', '.cf', '.tk', '.ml', '.ga', '.work', '.icu', '.monster',
  '.rest', '.cam', '.country', '.kim'
];

const TARGETED_BRANDS = [
  { name: 'PayPal', keyword: 'paypal', legitDomain: 'paypal.com' },
  { name: 'Apple', keyword: 'apple', legitDomain: 'apple.com' },
  { name: 'Chase Bank', keyword: 'chase', legitDomain: 'chase.com' },
  { name: 'Bank of America', keyword: 'bankofamerica', legitDomain: 'bankofamerica.com' },
  { name: 'Wells Fargo', keyword: 'wellsfargo', legitDomain: 'wellsfargo.com' },
  { name: 'Microsoft', keyword: 'microsoft', legitDomain: 'microsoft.com' },
  { name: 'Netflix', keyword: 'netflix', legitDomain: 'netflix.com' },
  { name: 'Amazon', keyword: 'amazon', legitDomain: 'amazon.com' },
  { name: 'MetaMask', keyword: 'metamask', legitDomain: 'metamask.io' },
  { name: 'Binance', keyword: 'binance', legitDomain: 'binance.com' },
  { name: 'USPS', keyword: 'usps', legitDomain: 'usps.com' },
  { name: 'DHL', keyword: 'dhl', legitDomain: 'dhl.com' }
];

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'update', 'account',
  'billing', 'security', 'secure', 'confirm', 'wallet', 'recovery',
  'suspended', 'password', 'authenticate', 'free', 'bonus', 'claim'
];

export function analyzeUrlHeuristics(rawInput) {
  let cleaned = rawInput.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  let parsed;
  try {
    parsed = new URL(cleaned);
  } catch (err) {
    return {
      isValid: false,
      error: 'Invalid URL format. Please provide a standard web address (e.g., https://example.com).',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();
  const fullUrl = parsed.href;

  const indicators = [];
  let riskPoints = 0;

  // 1. IP Address as Hostname
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    riskPoints += 45;
    indicators.push({
      id: 'ip_hostname',
      title: 'Raw IP Address Host',
      category: 'Network Infrastructure',
      severity: 'high',
      description: `The URL uses a direct IP address (${hostname}) instead of a verified domain name. Legitimate corporate services rarely use raw IPs for consumer logins.`,
      scoreImpact: 45
    });
  }

  // 2. Punycode & Non-ASCII Homoglyphs
  if (hostname.includes('xn--')) {
    riskPoints += 40;
    indicators.push({
      id: 'punycode_homoglyph',
      title: 'Punycode / Homoglyph Detected',
      category: 'Deception & Spoofing',
      severity: 'critical',
      description: 'The domain uses Punycode ("xn--") encoding, a technique frequently used in Internationalized Domain Name (IDN) homograph attacks to impersonate well-known brand names.',
      scoreImpact: 40
    });
  }

  // 3. Suspicious or Free TLDs
  const matchedTld = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
  if (matchedTld) {
    riskPoints += 25;
    indicators.push({
      id: 'suspicious_tld',
      title: `High-Risk TLD (${matchedTld})`,
      category: 'Domain Reputation',
      severity: 'medium',
      description: `Domains ending in ${matchedTld} have an elevated statistical correlation with disposable phishing campaigns and malware distribution.`,
      scoreImpact: 25
    });
  }

  // 4. Excessive Subdomains (Domain Cloaking)
  const parts = hostname.split('.');
  if (parts.length > 4 && !ipv4Regex.test(hostname)) {
    riskPoints += 20;
    indicators.push({
      id: 'deep_subdomain',
      title: 'Excessive Subdomain Stacking',
      category: 'Structural Anomaly',
      severity: 'medium',
      description: `Detected ${parts.length - 2} subdomain levels. Attackers often stack subdomains (e.g. paypal.com.user-verify.target.com) to visually mimic legitimate hostnames on mobile viewports.`,
      scoreImpact: 20
    });
  }

  // 5. Brand Impersonation in Non-Official Domain
  let impersonatedBrand = null;
  for (const brand of TARGETED_BRANDS) {
    if (hostname.includes(brand.keyword)) {
      // Check if it's the real brand domain
      const isOfficial = hostname === brand.legitDomain || hostname.endsWith('.' + brand.legitDomain);
      if (!isOfficial) {
        impersonatedBrand = brand;
        riskPoints += 45;
        indicators.push({
          id: `brand_spoof_${brand.keyword}`,
          title: `Brand Impersonation (${brand.name})`,
          category: 'Brand Abuse',
          severity: 'critical',
          description: `The URL contains the brand trademark "${brand.name}", but the registered host is not "${brand.legitDomain}". This is a textbook indicator of credential harvesting.`,
          scoreImpact: 45
        });
        break;
      }
    }
  }

  // 6. Suspicious Phishing Keywords in Path or Query
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(kw => 
    (pathname.includes(kw) || search.includes(kw)) && !hostname.includes(kw)
  );
  if (matchedKeywords.length > 0 && impersonatedBrand) {
    riskPoints += 15;
    indicators.push({
      id: 'credential_harvest_intent',
      title: 'Credential Harvesting Pattern',
      category: 'Threat Intent',
      severity: 'high',
      description: `Path includes high-urgency authentication keywords: [${matchedKeywords.slice(0, 3).join(', ')}].`,
      scoreImpact: 15
    });
  }

  // 7. Non-standard Port
  if (parsed.port && !['80', '443'].includes(parsed.port)) {
    riskPoints += 20;
    indicators.push({
      id: 'non_standard_port',
      title: `Non-Standard Port (${parsed.port})`,
      category: 'Network Protocol',
      severity: 'medium',
      description: `Target binds to non-standard HTTP port :${parsed.port}. Attackers frequently host malicious staging servers on unusual ports to evade basic perimeter filters.`,
      scoreImpact: 20
    });
  }

  // 8. Shannon Entropy of Hostname
  const domainEntropy = calculateEntropy(hostname);
  if (domainEntropy > 3.8 && !ipv4Regex.test(hostname)) {
    riskPoints += 15;
    indicators.push({
      id: 'high_entropy',
      title: `High Domain Entropy (${domainEntropy})`,
      category: 'Algorithmic Anomaly',
      severity: 'low',
      description: 'The domain name exhibits high character randomness, characteristic of Domain Generation Algorithms (DGA) used by botnets and transient phishing kits.',
      scoreImpact: 15
    });
  }

  // 9. HTTP vs HTTPS
  if (parsed.protocol === 'http:') {
    riskPoints += 15;
    indicators.push({
      id: 'unencrypted_http',
      title: 'Unencrypted HTTP Protocol',
      category: 'Transport Security',
      severity: 'low',
      description: 'Communication is transmitted in cleartext without TLS encryption, making it vulnerable to interception and credential sniffing.',
      scoreImpact: 15
    });
  }

  // Cap risk score at 99 max (or 100) and 0 min
  const finalScore = Math.min(100, Math.max(0, riskPoints));

  let threatLevel = 'SAFE';
  let badgeColor = 'emerald';
  if (finalScore >= 65) {
    threatLevel = 'HIGH_RISK';
    badgeColor = 'rose';
  } else if (finalScore >= 30) {
    threatLevel = 'SUSPICIOUS';
    badgeColor = 'amber';
  }

  // Default clean indicator if score is low
  if (indicators.length === 0) {
    indicators.push({
      id: 'clean_heuristics',
      title: 'Standard Lexical Structure',
      category: 'Baseline Integrity',
      severity: 'safe',
      description: 'No known brand impersonation, high-risk TLDs, Punycode tricks, or IP-based hosting detected in the domain path.',
      scoreImpact: 0
    });
  }

  // Actionable security recommendations
  const recommendations = [];
  if (threatLevel === 'HIGH_RISK') {
    recommendations.push('Do NOT open this link or enter passwords, 2FA codes, or card details.');
    recommendations.push('Never download or run executable files or browser extensions from this domain.');
    recommendations.push('If you already entered credentials, immediately change your password on the legitimate provider website and revoke active sessions.');
    recommendations.push('Report this URL to Google Safe Browsing and your organization security team.');
  } else if (threatLevel === 'SUSPICIOUS') {
    recommendations.push('Exercise caution. Verify the sender identity through a secondary, independent communication channel.');
    recommendations.push('Check the domain name character by character for subtle misspellings (typosquatting).');
    recommendations.push('Do not proceed if the website prompts for sensitive financial or personal information.');
  } else {
    recommendations.push('The URL appears structurally legitimate, but always confirm the browser address bar matches the intended service.');
    recommendations.push('Ensure Multi-Factor Authentication (MFA) is enabled on your accounts as standard defense.');
  }

  return {
    isValid: true,
    inputUrl: rawInput,
    parsedUrl: fullUrl,
    defangedUrl: defangUrl(fullUrl),
    hostname,
    protocol: parsed.protocol,
    threatLevel,
    riskScore: finalScore,
    badgeColor,
    entropy: domainEntropy,
    indicators,
    recommendations,
    scannedAt: new Date().toISOString(),
    isMock: true,
    plainEnglishExplanation: threatLevel === 'HIGH_RISK'
      ? `This URL has multiple red flags indicating an active phishing attack. It attempts to deceive visitors by mimicking trusted branding on an unauthorized domain.`
      : threatLevel === 'SUSPICIOUS'
      ? `This URL displays characteristics commonly associated with deceptive websites, such as an uncommon top-level domain or unusual URL structure.`
      : `This URL conforms to standard legitimate domain patterns without deceptive lexical anomalies.`
  };
}

