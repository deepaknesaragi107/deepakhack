/**
 * ScamShield Message & Communications Analyzer
 * Performs regex heuristic parsing and psychological trigger detection for SMS, Email, and DMs
 */

import { analyzeUrlHeuristics, defangUrl } from './urlAnalyzer';

const THREAT_PATTERNS = [
  {
    category: 'Urgency & Coercion',
    severity: 'high',
    weight: 25,
    regex: /(immediate action required|account (will be|has been) (suspended|locked|terminated|closed)|within 24 hours|within 12 hours|act now|final notice|urgent response required|expires today)/gi,
    explanation: 'Employs artificial panic and arbitrary deadlines to short-circuit analytical thinking and force reckless action.'
  },
  {
    category: 'Financial Fraud & Non-Standard Payments',
    severity: 'critical',
    weight: 35,
    regex: /(gift card|apple gift card|google play card|steam card|bitcoin|crypto(currency)?|btc wallet|wire transfer|western union|zelle transfer|cash app payment|send eth)/gi,
    explanation: 'Requests payment via untraceable or irreversible mechanisms, a hallmark of impersonation and advance-fee scams.'
  },
  {
    category: 'Credential & OTP Harvesting',
    severity: 'critical',
    weight: 35,
    regex: /(share (your )?(otp|one-time code|verification code)|send back the 6-digit code|confirm your password|ssn|social security number|credit card number and cvv|atm pin)/gi,
    explanation: 'Attempts to steal two-factor authentication codes, passwords, or personal identity numbers.'
  },
  {
    category: 'Prize & Advance-Fee Fraud',
    severity: 'high',
    weight: 30,
    regex: /(congratulations! you (have )?won|lottery winner|selected for a \$[0-9,]+ (prize|reward|gift)|inheritance fund|claim your (free )?reward|compensation payment)/gi,
    explanation: 'Dangles fictitious financial windfalls to entice victims into paying advance processing fees.'
  },
  {
    category: 'Brand / Authority Impersonation',
    severity: 'medium',
    weight: 20,
    regex: /(internal revenue service|irs audit|geek squad renewal|mcafee subscription renewal|amazon security alert|apple support alert|usps: missed delivery|chase fraud alert)/gi,
    explanation: 'Impersonates trusted brands or government institutions to manufacture false authority.'
  },
  {
    category: 'Suspicious Call-To-Action Link',
    severity: 'medium',
    weight: 15,
    regex: /(click here to verify|tap the link below|confirm details at:|login immediately at:|visit:\s*http)/gi,
    explanation: 'Aggressively steers user toward an external hyperlink.'
  }
];

export function analyzeMessageText(text) {
  if (!text || !text.trim()) {
    return {
      isValid: false,
      error: 'Message content cannot be empty.',
    };
  }

  const rawText = text.trim();
  const indicators = [];
  let riskScore = 0;
  const matchedKeywordsList = [];

  // 1. Evaluate against rule categories
  for (const pattern of THREAT_PATTERNS) {
    const matches = rawText.match(pattern.regex);
    if (matches && matches.length > 0) {
      const uniqueMatches = [...new Set(matches.map(m => m.trim()))];
      matchedKeywordsList.push(...uniqueMatches);
      riskScore += pattern.weight;

      indicators.push({
        id: pattern.category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        title: pattern.category,
        category: 'Psychological & Social Engineering',
        severity: pattern.severity,
        matches: uniqueMatches,
        description: pattern.explanation,
        scoreImpact: pattern.weight
      });
    }
  }

  // 2. Extract Embedded URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(?:com|org|net|xyz|top|click|info|co|io|buzz)\b[^\s]*)/gi;
  const foundUrls = rawText.match(urlRegex) || [];
  const analyzedUrls = [];

  if (foundUrls.length > 0) {
    for (const url of foundUrls) {
      const urlAnalysis = analyzeUrlHeuristics(url);
      if (urlAnalysis.isValid) {
        analyzedUrls.push(urlAnalysis);
        if (urlAnalysis.threatLevel === 'HIGH_RISK') {
          riskScore += 35;
          indicators.push({
            id: 'embedded_malicious_url',
            title: 'Embedded Phishing Hyperlink',
            category: 'Malicious Content',
            severity: 'critical',
            description: `Contains a high-risk external link (${defangUrl(url)}) with known phishing anomalies.`,
            scoreImpact: 35
          });
        } else if (urlAnalysis.threatLevel === 'SUSPICIOUS') {
          riskScore += 20;
          indicators.push({
            id: 'embedded_suspicious_url',
            title: 'Embedded Suspicious Link',
            category: 'Malicious Content',
            severity: 'medium',
            description: `Contains a link (${defangUrl(url)}) flagged with suspicious domain characteristics.`,
            scoreImpact: 20
          });
        }
      }
    }
  }

  // 3. Excessive Capitalization / Shouty Phrasing
  const capsCount = (rawText.match(/[A-Z]/g) || []).length;
  const totalLetters = (rawText.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 20 && (capsCount / totalLetters) > 0.45) {
    riskScore += 10;
    indicators.push({
      id: 'high_caps_density',
      title: 'Aggressive Capitalization (Shouting)',
      category: 'Stylistic Anomaly',
      severity: 'low',
      description: 'Abnormal ratio of uppercase letters detected, commonly used in spam and panic-inducing scareware communications.',
      scoreImpact: 10
    });
  }

  // Normalize final score (0 to 100)
  const finalScore = Math.min(100, Math.max(0, riskScore));

  let threatLevel = 'SAFE';
  let badgeColor = 'emerald';
  if (finalScore >= 60) {
    threatLevel = 'HIGH_RISK';
    badgeColor = 'rose';
  } else if (finalScore >= 25) {
    threatLevel = 'SUSPICIOUS';
    badgeColor = 'amber';
  }

  if (indicators.length === 0) {
    indicators.push({
      id: 'clean_message',
      title: 'No Coercive Markers Found',
      category: 'Baseline Integrity',
      severity: 'safe',
      description: 'Text does not contain recognizable social engineering triggers, gift card demands, fake urgency, or phishing links.',
      scoreImpact: 0
    });
  }

  // Security Recommendations
  const recommendations = [];
  if (threatLevel === 'HIGH_RISK') {
    recommendations.push('Do NOT reply to this message, call back any listed numbers, or click any links.');
    recommendations.push('Legitimate organizations NEVER request gift card codes, cryptocurrency, or one-time verification passwords.');
    recommendations.push('Forward SMS scams to 7726 (SPAM) to alert mobile carrier defense networks.');
    recommendations.push('Block the sender immediately on your device.');
  } else if (threatLevel === 'SUSPICIOUS') {
    recommendations.push('Do not share personal, banking, or login details.');
    recommendations.push('If this claims to be from a company you do business with, log into your account directly via their official app or website.');
    recommendations.push('Call the customer service number listed on your physical card or official website statement.');
  } else {
    recommendations.push('The message shows low scam indicators, but remember never to share passwords or security codes.');
    recommendations.push('Stay mindful of unsolicited communications.');
  }

  return {
    isValid: true,
    rawText,
    charCount: rawText.length,
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
    threatLevel,
    riskScore: finalScore,
    badgeColor,
    matchedKeywords: [...new Set(matchedKeywordsList)],
    analyzedUrls,
    indicators,
    recommendations,
    scannedAt: new Date().toISOString(),
    isMock: true,
    plainEnglishExplanation: threatLevel === 'HIGH_RISK'
      ? `This message displays prominent social engineering patterns commonly seen in financial fraud. It applies pressure tactics or asks for sensitive actions that reputable companies never demand over text or unverified email.`
      : threatLevel === 'SUSPICIOUS'
      ? `This communication exhibits several cautionary phrases. While it might be a marketing notice or automated alert, proceed with elevated vigilance.`
      : `No significant scam patterns detected. The message content adheres to routine communication standards.`
  };
}

