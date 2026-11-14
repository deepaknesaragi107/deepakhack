import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  MessageSquareText,
  Cpu,
  Lock,
  ArrowRight,
  Eye,
  AlertTriangle,
  Zap,
  CheckCircle2,
  FileSearch,
  Sparkles
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { SAMPLE_URLS, SAMPLE_MESSAGES } from '../data/mockScans';

export default function LandingPage() {
  const { setActiveTab, runUrlScan, runMessageScan } = useScan();

  const handleQuickUrlSample = (url) => {
    runUrlScan(url);
  };

  const handleQuickMessageSample = (text) => {
    runMessageScan(text);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 md:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Glow backdrop */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-cyan-500/10 dark:bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-6 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>Next-Gen Cybersecurity Defense System</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Spot Phishing & Digital Scams{' '}
          <span className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Before You Click
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ScamShield inspects suspect web addresses, SMS alerts, fraudulent emails, and social media communications with deep lexical heuristics and intelligent scam pattern analysis.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Open Security Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('url-scanner')}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
          >
            <Globe className="w-4 h-4 text-cyan-500" />
            <span>Scan a Website URL</span>
          </button>
        </div>

        {/* Quick Test Samples Bar */}
        <div className="mt-10 p-4 rounded-2xl glass-panel max-w-3xl mx-auto text-left">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Try an Instant One-Click Threat Sample:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickUrlSample(SAMPLE_URLS[0].url)}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-mono transition-colors"
            >
              🚨 PayPal Phishing URL
            </button>
            <button
              onClick={() => handleQuickUrlSample(SAMPLE_URLS[1].url)}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-mono transition-colors"
            >
              ⚠️ IP-Address Portal
            </button>
            <button
              onClick={() => handleQuickMessageSample(SAMPLE_MESSAGES[0].text)}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-mono transition-colors"
            >
              📱 Urgent Bank SMS
            </button>
            <button
              onClick={() => handleQuickUrlSample(SAMPLE_URLS[4].url)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono transition-colors"
            >
              ✅ Legitimate PayPal
            </button>
          </div>
        </div>
      </section>

      {/* What is Phishing & Digital Scams */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-3xl glass-panel relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400">
              Cybersecurity Fundamentals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Understanding Digital Scams & Phishing Threats
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Phishing</strong> is a form of social engineering where cybercriminals deceive individuals into revealing sensitive credentials, financial accounts, or private data by impersonating trustworthy organizations. In recent years, attackers have evolved beyond crude emails into multi-vector attacks:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <Globe className="w-5 h-5 text-cyan-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">URL Deception</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Punycode homoglyphs, sub-domain cloaking, and disposable TLDs masking fake login portals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <MessageSquareText className="w-5 h-5 text-indigo-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Smishing (SMS)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Urgent SMS texts claiming bank locks, package delivery holds, or unauthorized transactions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <ShieldAlert className="w-5 h-5 text-amber-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Social Engineering</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manufactured panic, lottery advance fees, and demands for gift cards or cryptocurrency transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Features */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400">
            Protection Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Engineered for Comprehensive Digital Defense
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Deep URL Lexical Analysis
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Checks for Shannon entropy anomalies, Punycode homoglyphs, IP address hostnames, non-standard staging ports, and brand keyword spoofing.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('url-scanner')}
              className="mt-4 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Launch URL Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                NLP Social Engineering Detection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Flags artificial panic phrases, credential harvesting demands, gift card requests, cryptocurrency fraud, and embedded deceptive links.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('message-scanner')}
              className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Launch Message Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Risk Scoring & Defanging
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculates transparent 0–100 threat scores, provides clear non-technical rationales, and defangs malicious URLs to prevent accidental clicks.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How the Detection System Works */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-600 dark:text-cyan-400">
              Under The Hood
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              How ScamShield Inspects Potential Threats
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Input Sanitization</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                URL defanging, protocol normalization, and regex tokenization of incoming communication strings.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Heuristic Evaluation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation against known suspicious TLDs, Punycode character tables, and urgency triggers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Risk Scoring</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mathematical aggregation into a standardized 0 to 100 Risk Score with weighted severity indicators.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Defensive Checklist</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable step-by-step mitigation advice and one-click incident reporting links for quick remediation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

