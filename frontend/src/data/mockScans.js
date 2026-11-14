/**
 * Realistic Synthetic Dataset for ScamShield
 * Covers phishing URLs, legitimate domains, smishing, email scams, and benign messages
 */

export const SAMPLE_URLS = [
  {
    name: 'PayPal Phishing (Subdomain Stacking + .xyz TLD)',
    url: 'https://paypal.com.user-verify.security-notice.xyz/signin',
    category: 'Phishing',
    expectedRisk: 'HIGH_RISK',
    description: 'Uses brand name in subdomain to deceive mobile users while hosted on an untrusted .xyz domain.'
  },
  {
    name: 'Suspicious IP Address Portal',
    url: 'http://185.220.101.5:8080/secure-auth/login.html',
    category: 'Credential Harvesting',
    expectedRisk: 'HIGH_RISK',
    description: 'Direct numeric IP address on non-standard port 8080 serving unencrypted login portal.'
  },
  {
    name: 'Apple ID Punycode Homoglyph',
    url: 'https://xn--appl-43d.com/icloud-unlock/recovery',
    category: 'Homograph Attack',
    expectedRisk: 'HIGH_RISK',
    description: 'Exploits Cyrillic character lookalike for Apple ID credential harvesting.'
  },
  {
    name: 'USPS Delivery Notification Scam',
    url: 'http://usps-track-package-redelivery.buzz/update-address',
    category: 'Delivery Smishing',
    expectedRisk: 'HIGH_RISK',
    description: 'Impersonates United States Postal Service on a disposable .buzz domain.'
  },
  {
    name: 'Legitimate PayPal Sign In',
    url: 'https://www.paypal.com/signin',
    category: 'Benign Official',
    expectedRisk: 'SAFE',
    description: 'Official PayPal login portal over secure TLS encryption.'
  },
  {
    name: 'Legitimate GitHub Repository',
    url: 'https://github.com/features/security',
    category: 'Benign Official',
    expectedRisk: 'SAFE',
    description: 'Standard GitHub HTTPS endpoint with clean reputation.'
  }
];

export const SAMPLE_MESSAGES = [
  {
    name: 'Urgent Bank Suspension Smishing',
    type: 'SMS',
    category: 'Smishing',
    text: 'CHASE BANK ALERT: Unauthorized login attempt detected from Moscow. Your account has been temporarily locked. Visit https://chase-security-alert.xyz/verify within 24 hours to prevent permanent closure.',
    expectedRisk: 'HIGH_RISK',
    description: 'Fabricates urgency and fear of account suspension to steer victim to an embedded phishing site.'
  },
  {
    name: 'International Lottery & Gift Card Fee Scam',
    type: 'Email',
    category: 'Advance Fee Fraud',
    text: 'CONGRATULATIONS! You have won $1,500,000 in the International Sweepstakes Prize. To claim your reward, purchase a $100 Apple Gift Card to cover processing fees and reply with your SSN and routing number.',
    expectedRisk: 'HIGH_RISK',
    description: 'Classic 419 advance-fee fraud asking for untraceable gift cards and personal banking credentials.'
  },
  {
    name: 'Fake Tech Support Alert',
    type: 'Social / Popup',
    category: 'Scareware',
    text: 'CRITICAL ALERT: Microsoft Security Center detected Trojan:Win32/Spyware on your PC. Your network is compromised. Call Windows Support immediately at 1-800-555-0199. Do not restart your computer.',
    expectedRisk: 'HIGH_RISK',
    description: 'Scareware tactic designed to induce panic and force victim to dial an attacker-operated call center.'
  },
  {
    name: 'Legitimate 2FA Code Notification',
    type: 'SMS',
    category: 'Benign Verification',
    text: 'Your Google verification code is 849201. Never share this code with anyone. Google will never call or text you to ask for this code.',
    expectedRisk: 'SAFE',
    description: 'Standard authentication alert with explicit anti-phishing warnings.'
  },
  {
    name: 'Standard Workplace Schedule Email',
    type: 'Email',
    category: 'Benign Routine',
    text: 'Hi Deepak, please find attached the revised project requirements for next week sprint planning. Let us sync on Thursday at 2 PM in the main conference room.',
    expectedRisk: 'SAFE',
    description: 'Standard professional correspondence with zero coercive or fraudulent markers.'
  }
];

export const INITIAL_HISTORY = [
  {
    id: 'sc-9021',
    scanType: 'URL',
    input: 'https://paypal.com.user-verify.security-notice.xyz/signin',
    defanged: 'hxxps://paypal[.]com[.]user-verify[.]security-notice[.]xyz/signin',
    threatLevel: 'HIGH_RISK',
    riskScore: 92,
    badgeColor: 'rose',
    primaryThreat: 'Brand Spoofing & High-Risk TLD',
    createdAt: '2026-11-14T09:42:00Z',
    indicatorsCount: 4,
    explanation: 'Detected unauthorized brand impersonation of PayPal on high-risk domain with 4 subdomain layers.'
  },
  {
    id: 'sc-9020',
    scanType: 'MESSAGE',
    input: 'CHASE BANK ALERT: Unauthorized login attempt detected. Visit https://chase-security-alert.xyz/verify within 24 hours.',
    defanged: 'CHASE BANK ALERT: Unauthorized login attempt detected. Visit hxxps://chase-security-alert[.]xyz/verify within 24 hours.',
    threatLevel: 'HIGH_RISK',
    riskScore: 88,
    badgeColor: 'rose',
    primaryThreat: 'Urgency Coercion & Phishing Link',
    createdAt: '2026-11-14T08:15:00Z',
    indicatorsCount: 3,
    explanation: 'Fabricated urgency combined with embedded deceptive banking domain.'
  },
  {
    id: 'sc-9019',
    scanType: 'URL',
    input: 'https://www.paypal.com/signin',
    defanged: 'hxxps://www[.]paypal[.]com/signin',
    threatLevel: 'SAFE',
    riskScore: 5,
    badgeColor: 'emerald',
    primaryThreat: 'Clean Lexical Reputation',
    createdAt: '2026-11-14T07:22:00Z',
    indicatorsCount: 1,
    explanation: 'Verified legitimate corporate domain with valid HTTPS protocol.'
  },
  {
    id: 'sc-9018',
    scanType: 'URL',
    input: 'http://185.220.101.5:8080/secure-auth/login.html',
    defanged: 'hxxp://185[.]220[.]101[.]5:8080/secure-auth/login[.]html',
    threatLevel: 'HIGH_RISK',
    riskScore: 95,
    badgeColor: 'rose',
    primaryThreat: 'Raw IP Host & Non-Standard Port',
    createdAt: '2026-11-13T22:10:00Z',
    indicatorsCount: 4,
    explanation: 'Unencrypted portal served from raw IP address on port 8080 with credential harvesting paths.'
  },
  {
    id: 'sc-9017',
    scanType: 'MESSAGE',
    input: 'Your package delivery was rescheduled for tomorrow morning. No action required.',
    defanged: 'Your package delivery was rescheduled for tomorrow morning. No action required.',
    threatLevel: 'SAFE',
    riskScore: 4,
    badgeColor: 'emerald',
    primaryThreat: 'No Threat Detected',
    createdAt: '2026-11-13T19:40:00Z',
    indicatorsCount: 1,
    explanation: 'Standard informational notice without financial requests or external links.'
  },
  {
    id: 'sc-9016',
    scanType: 'MESSAGE',
    input: 'CONGRATULATIONS! You won $1,500,000. Send a $100 Apple Gift Card to claim your reward.',
    defanged: 'CONGRATULATIONS! You won $1,500,000. Send a $100 Apple Gift Card to claim your reward.',
    threatLevel: 'HIGH_RISK',
    riskScore: 94,
    badgeColor: 'rose',
    primaryThreat: 'Advance Fee & Gift Card Demand',
    createdAt: '2026-11-13T16:11:00Z',
    indicatorsCount: 3,
    explanation: 'Requests untraceable gift card payment in exchange for fictitious lottery prize.'
  },
  {
    id: 'sc-9015',
    scanType: 'URL',
    input: 'https://secure-auth-login-portal-service.xyz/dashboard',
    defanged: 'hxxps://secure-auth-login-portal-service[.]xyz/dashboard',
    threatLevel: 'SUSPICIOUS',
    riskScore: 55,
    badgeColor: 'amber',
    primaryThreat: 'High Entropy & Suspicious TLD',
    createdAt: '2026-11-13T11:05:00Z',
    indicatorsCount: 2,
    explanation: 'Generic security keywords packed into high-risk .xyz TLD.'
  },
  {
    id: 'sc-9014',
    scanType: 'URL',
    input: 'https://github.com/features/security',
    defanged: 'hxxps://github[.]com/features/security',
    threatLevel: 'SAFE',
    riskScore: 0,
    badgeColor: 'emerald',
    primaryThreat: 'Clean Lexical Reputation',
    createdAt: '2026-11-12T14:30:00Z',
    indicatorsCount: 1,
    explanation: 'Verified corporate domain with high domain trust.'
  }
];

export const ACTIVITY_TREND_DATA = [
  { day: 'Mon', safe: 145, suspicious: 42, highRisk: 28 },
  { day: 'Tue', safe: 182, suspicious: 51, highRisk: 39 },
  { day: 'Wed', safe: 165, suspicious: 38, highRisk: 31 },
  { day: 'Thu', safe: 198, suspicious: 64, highRisk: 47 },
  { day: 'Fri', safe: 210, suspicious: 72, highRisk: 53 },
  { day: 'Sat', safe: 130, suspicious: 29, highRisk: 19 },
  { day: 'Sun', safe: 115, suspicious: 22, highRisk: 14 },
];

export const THREAT_DISTRIBUTION_DATA = [
  { name: 'Safe & Verified', value: 892, color: '#10b981' },
  { name: 'Suspicious (Elevated Risk)', value: 314, color: '#f59e0b' },
  { name: 'High-Risk Threats', value: 222, color: '#ef4444' },
];

