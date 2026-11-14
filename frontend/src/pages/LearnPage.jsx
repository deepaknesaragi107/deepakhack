import React from 'react';
import {
  BookOpen,
  ShieldAlert,
  AlertTriangle,
  Globe,
  MessageSquareText,
  QrCode,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  Lock,
  Flame,
  Award
} from 'lucide-react';

export default function LearnPage() {
  const threatCategories = [
    {
      title: 'URL Homoglyph & Typosquatting',
      icon: Globe,
      color: 'text-cyan-500',
      description:
        'Attackers register domain names that visually mimic legitimate brands by replacing Latin letters with lookalike Cyrillic or Greek symbols (e.g. replacing Latin "a" with Cyrillic "а"). Punycode browsers display these as "xn--".',
      defense: 'Always inspect the domain root carefully and rely on bookmarks for sensitive financial portals.'
    },
    {
      title: 'Smishing (SMS Phishing)',
      icon: MessageSquareText,
      color: 'text-indigo-500',
      description:
        'Fraudulent text messages purporting to come from banks, couriers (USPS, FedEx), or toll agencies claiming immediate payment or authentication is required to release a held parcel or unlock an account.',
      defense: 'Never tap hyperlinks in unexpected SMS. Forward suspect texts directly to 7726 (SPAM).'
    },
    {
      title: 'Advance-Fee & Gift Card Scams',
      icon: Flame,
      color: 'text-rose-500',
      description:
        'Victims are told they won a lottery, inherited foreign assets, or received a job offer, but must first purchase gift cards (Apple, Steam, Google Play) or send wire transfers to cover "processing fees".',
      defense: 'No legitimate entity or contest ever requires an advance fee or gift card payment to claim legitimate winnings.'
    },
    {
      title: 'Quishing (QR Code Phishing)',
      icon: QrCode,
      color: 'text-amber-500',
      description:
        'Malicious QR codes pasted over legitimate parking meter or restaurant codes, or sent in fake IT emails. Scanning directs victims to credential-harvesting mobile websites.',
      defense: 'Preview the destination URL in your camera application before confirming navigation.'
    },
    {
      title: 'Vishing (Voice Call Scams)',
      icon: PhoneCall,
      color: 'text-purple-500',
      description:
        'Fraudsters spoof caller ID numbers to pretend to be bank fraud departments, the IRS, or tech support, demanding remote computer access or 2FA codes over the phone.',
      defense: 'Hang up immediately and call back using the verified number on the back of your debit or credit card.'
    }
  ];

  const redFlags = [
    'Artificial deadlines ("Within 24 hours", "Immediate action required")',
    'Demands for untraceable payment methods (Gift Cards, Crypto, Zelle)',
    'Requests to share 6-digit one-time authentication codes (OTP)',
    'Generic greetings like "Dear Customer" from supposed close vendors',
    'Discrepancies between the sender name and the actual domain address',
    'Unsolicited attachments with double extensions (.pdf.exe, .docm)',
    'Odd domains with suspicious extensions (.xyz, .top, .buzz, .click)'
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Cybersecurity Resource</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Scam & Phishing Encyclopedia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Learn how attackers construct social engineering campaigns and how to recognize red flags before interacting with suspicious content.
        </p>
      </div>

      {/* Anatomy of Modern Threats */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Anatomy of Common Scam Vectors
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl glass-panel space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
                <div className="p-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-300">
                  <strong>Defensive Habit:</strong> {cat.defense}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7 Critical Red Flags */}
      <section className="p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center space-x-2 text-rose-500 font-bold text-sm uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5" />
          <span>The 7 Golden Red Flags of Social Engineering</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          If any unsolicited message or webpage meets 2 or more of these conditions, treat it as hostile until independently verified:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {redFlags.map((flag, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">{flag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Official Reporting Agencies */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Where to Report Phishing & Cybercrime
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://www.ic3.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between group"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
                <span>FBI IC3 Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Official federal cyber fraud and financial extortion reporting channel.
              </p>
            </div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-3">ic3.gov →</span>
          </a>

          <a
            href="https://reportfraud.ftc.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between group"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
                <span>FTC Fraud Report</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Federal Trade Commission portal for consumer fraud, impersonation, and identity theft.
              </p>
            </div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-3">reportfraud.ftc.gov →</span>
          </a>

          <a
            href="https://safebrowsing.google.com/safebrowsing/report_phish/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between group"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors flex items-center justify-between">
                <span>Google Safe Browsing</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Submit malicious links to protect billions of Chrome, Firefox, and Safari users worldwide.
              </p>
            </div>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold mt-3">safebrowsing.google.com →</span>
          </a>
        </div>
      </section>
    </div>
  );
}

