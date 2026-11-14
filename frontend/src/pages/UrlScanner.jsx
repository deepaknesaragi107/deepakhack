import React, { useState } from 'react';
import {
  Globe,
  Search,
  AlertCircle,
  Loader2,
  Shield,
  Zap,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { SAMPLE_URLS } from '../data/mockScans';
import RiskGauge from '../components/common/RiskGauge';
import StatusBadge from '../components/common/StatusBadge';
import IndicatorCard from '../components/common/IndicatorCard';
import RecommendationList from '../components/common/RecommendationList';
import DefangedUrl from '../components/common/DefangedUrl';

export default function UrlScanner() {
  const { runUrlScan, isScanning } = useScan();
  const [urlInput, setUrlInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setValidationError('Please enter a website address to scan.');
      return;
    }
    setValidationError('');
    const res = await runUrlScan(urlInput.trim());
    if (!res.success) {
      setValidationError(res.error);
    }
  };

  const loadSample = (sampleUrl) => {
    setUrlInput(sampleUrl);
    setValidationError('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-Time Lexical & Domain Heuristics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Website & URL Threat Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspect target URLs for Punycode homoglyphs, brand spoofing, suspicious TLDs, entropy anomalies, and credential harvesting patterns.
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Target Website or Domain
          </label>

          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="https://example.com/login or paste a link"
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-sm font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  validationError
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 focus:ring-cyan-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99] shrink-0"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting Heuristics...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze URL</span>
                </>
              )}
            </button>
          </div>

          {validationError && (
            <div className="flex items-center space-x-2 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Synthetic Demonstration Preset Library */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Threat Scenarios (Click to test):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample.url)}
                className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500 transition-colors">
                    {sample.name}
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded font-mono ${
                    sample.expectedRisk === 'HIGH_RISK'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {sample.expectedRisk === 'HIGH_RISK' ? 'Malicious' : 'Clean'}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {sample.url}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Tips for URL Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>Punycode Deception</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Attackers register domains using international Cyrillic or Greek lookalike characters (e.g. <code>xn--</code>) that resemble standard Latin alphabet letters.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Subdomain Stacking</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Phishing links often prepend trusted brand names (e.g. <code>paypal.com.verify.xyz</code>) to trick smartphone users where the URL bar truncates the actual root domain.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Defanging Security</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All malicious URLs scanned in ScamShield are automatically sanitized into <code>hxxps://domain[.]com</code> to eliminate accidental user navigation.
          </p>
        </div>
      </div>
    </div>
  );
}

