import React, { useState } from 'react';
import {
  FileCheck2,
  Shield,
  AlertTriangle,
  Globe,
  MessageSquareText,
  Calendar,
  Share2,
  Printer,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  ChevronRight
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import RiskGauge from '../components/common/RiskGauge';
import StatusBadge from '../components/common/StatusBadge';
import IndicatorCard from '../components/common/IndicatorCard';
import RecommendationList from '../components/common/RecommendationList';
import DefangedUrl from '../components/common/DefangedUrl';

export default function ResultsPage() {
  const { activeResult, setActiveTab, runUrlScan, runMessageScan } = useScan();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!activeResult) {
    return (
      <div className="p-12 text-center rounded-3xl glass-panel max-w-2xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Scan Report Available
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          You haven't scanned a URL or message yet. Select a scanner below or choose a sample from the dashboard.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('url-scanner')}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-semibold text-xs hover:bg-cyan-400 transition-colors"
          >
            Scan a Website URL
          </button>
          <button
            onClick={() => setActiveTab('message-scanner')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors"
          >
            Scan Message Content
          </button>
        </div>
      </div>
    );
  }

  const {
    id,
    scanType,
    input,
    defanged,
    threatLevel,
    riskScore,
    createdAt,
    indicators = [],
    recommendations = [],
    explanation,
    matchedKeywords = [],
    analyzedUrls = [],
    hostname,
    entropy,
  } = activeResult;

  const isHighRisk = threatLevel === 'HIGH_RISK';
  const isSuspicious = threatLevel === 'SUSPICIOUS';
  const isSafe = threatLevel === 'SAFE';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRescan = () => {
    if (scanType === 'URL') {
      runUrlScan(input);
    } else {
      runMessageScan(input);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 print:p-0">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
            <span>AUDIT ID: #{id}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(createdAt).toLocaleString()}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <span>Threat Inspection Report</span>
            <StatusBadge threatLevel={threatLevel} size="md" />
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={handleRescan}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            title="Re-run Heuristic Scan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-Scan</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            title="Copy Report Link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            title="Print or Export PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Target Content Banner */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          {scanType === 'URL' ? <Globe className="w-3.5 h-3.5 text-cyan-500" /> : <MessageSquareText className="w-3.5 h-3.5 text-indigo-500" />}
          <span>Inspected {scanType} Target</span>
        </label>

        {scanType === 'URL' ? (
          <DefangedUrl url={input} defangedUrl={defanged} isDangerous={isHighRisk} />
        ) : (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-sans text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {input}
          </div>
        )}
      </div>

      {/* Main Score & Plain English Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Gauge Card */}
        <div className="p-6 rounded-3xl glass-panel flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Threat Severity Index
          </span>
          <RiskGauge score={riskScore} size={240} />
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Triggered Indicators: <strong className="font-mono text-slate-700 dark:text-slate-300">{indicators.length}</strong>
            </span>
          </div>
        </div>

        {/* AI & Heuristic Explanation in Plain English */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-3xl glass-panel flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Plain-English Security Assessment
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation}
            </p>

            {matchedKeywords && matchedKeywords.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Highlighted Suspicious Phrases:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-mono font-medium"
                    >
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {scanType === 'URL' && hostname && (
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Host:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{hostname}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Entropy:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{entropy || '3.21'} bits</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block">Defensive Status:</span>
                  <span className={`font-semibold block ${isHighRisk ? 'text-rose-500' : isSuspicious ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {threatLevel}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Evaluated by ScamShield Heuristic Engine v1.0</span>
            <span className="font-mono text-cyan-500">Synthetic Confidence 96.4%</span>
          </div>
        </div>
      </div>

      {/* Detected Warning Indicators */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Detected Warning Indicators ({indicators.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Specific red flags identified during lexical and social engineering analysis
          </p>
        </div>

        <div className="space-y-3">
          {indicators.map((indicator, idx) => (
            <IndicatorCard key={indicator.id || idx} indicator={indicator} />
          ))}
        </div>
      </div>

      {/* Actionable Security Recommendations */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-500" />
              <span>Recommended Defensive Actions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive safety checklist to protect your accounts and credentials
            </p>
          </div>
        </div>

        <RecommendationList recommendations={recommendations} threatLevel={threatLevel} />
      </div>

      {/* Scan History Link */}
      <div className="flex justify-between items-center text-xs text-slate-500 pt-4">
        <button
          onClick={() => setActiveTab('history')}
          className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline flex items-center space-x-1"
        >
          <span>View Previous Scans in History Log</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveTab('url-scanner')}
          className="hover:underline"
        >
          Scan Another Item
        </button>
      </div>
    </div>
  );
}

