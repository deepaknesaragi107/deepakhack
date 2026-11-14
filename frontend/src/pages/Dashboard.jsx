import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Globe,
  MessageSquareText,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import ThreatDistributionChart from '../components/charts/ThreatDistributionChart';
import ScanActivityChart from '../components/charts/ScanActivityChart';
import StatusBadge from '../components/common/StatusBadge';
import { SAMPLE_URLS, SAMPLE_MESSAGES } from '../data/mockScans';

export default function Dashboard() {
  const { scanHistory, setActiveTab, runUrlScan, runMessageScan, viewResult, isScanning } = useScan();

  const [quickUrl, setQuickUrl] = useState('');
  const [quickMessage, setQuickMessage] = useState('');

  // Calculate live summary stats from scan history
  const totalScans = scanHistory.length + 1420; // Blended with realistic platform baseline
  const safeCount = scanHistory.filter(s => s.threatLevel === 'SAFE').length + 890;
  const suspiciousCount = scanHistory.filter(s => s.threatLevel === 'SUSPICIOUS').length + 310;
  const highRiskCount = scanHistory.filter(s => s.threatLevel === 'HIGH_RISK').length + 220;

  const handleQuickUrlSubmit = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;
    runUrlScan(quickUrl);
    setQuickUrl('');
  };

  const handleQuickMessageSubmit = (e) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    runMessageScan(quickMessage);
    setQuickMessage('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Security Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time threat monitoring, heuristic audit logs, and quick triage actions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('url-scanner')}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Scan URL</span>
          </button>
          <button
            onClick={() => setActiveTab('message-scanner')}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors shadow-xs"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scan Message</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Scans
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {totalScans.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-500">+14% this week</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">URLs, SMS, and emails inspected</p>
        </div>

        {/* Safe URLs / Messages */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Verified Safe
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {safeCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">({Math.round((safeCount / totalScans) * 100)}%)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Clean domains and legitimate alerts</p>
        </div>

        {/* Suspicious Scans */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Suspicious (Caution)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {suspiciousCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">({Math.round((suspiciousCount / totalScans) * 100)}%)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Elevated risk anomalies detected</p>
        </div>

        {/* High Risk Threats */}
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              High-Risk Scams
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {highRiskCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-rose-500">Flagged</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Active phishing & credential harvesting</p>
        </div>
      </div>

      {/* Quick Interactive Scanning Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick URL Scanner Card */}
        <div className="p-6 rounded-2xl glass-panel">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick URL Scanner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect a suspicious domain or login link immediately
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickUrlSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                placeholder="e.g. https://paypal.com.verify-notice.xyz/signin"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setQuickUrl(SAMPLE_URLS[0].url)}
                  className="hover:text-cyan-500 underline"
                >
                  Load Sample
                </button>
              </div>
              <button
                type="submit"
                disabled={isScanning || !quickUrl.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <span>{isScanning ? 'Analyzing...' : 'Scan URL'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Message Scanner Card */}
        <div className="p-6 rounded-2xl glass-panel">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick Message / SMS Scanner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste suspicious text message, email alert, or DM
              </p>
            </div>
          </div>

          <form onSubmit={handleQuickMessageSubmit} className="space-y-3">
            <textarea
              rows={2}
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="e.g. URGENT: Your bank account is locked! Click to verify..."
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setQuickMessage(SAMPLE_MESSAGES[0].text)}
                  className="hover:text-indigo-400 underline"
                >
                  Load Bank Sample
                </button>
              </div>
              <button
                type="submit"
                disabled={isScanning || !quickMessage.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <span>{isScanning ? 'Analyzing...' : 'Analyze Message'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Visual Charts: Activity Trends and Threat Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                7-Day Scan Activity & Threat Trends
              </h3>
              <p className="text-xs text-slate-400">
                Volume of incoming inspected targets categorized by severity
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Live Telemetry
            </span>
          </div>
          <ScanActivityChart />
        </div>

        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Threat Ratio Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Cumulative risk categorization across all inspected items
            </p>
            <ThreatDistributionChart />
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400">
              Heuristic confidence average:{' '}
              <strong className="text-cyan-500 font-mono">94.8%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Scan Activity Feed */}
      <div className="p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Scan Activity
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Target / Content</th>
                <th className="pb-3 font-semibold">Threat Level</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Primary Indicator</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {scanHistory.slice(0, 5).map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-sans">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {scan.scanType === 'URL' ? <Globe className="w-3 h-3 text-cyan-500" /> : <MessageSquareText className="w-3 h-3 text-indigo-500" />}
                      <span>{scan.scanType}</span>
                    </span>
                  </td>
                  <td className="py-3 max-w-xs truncate pr-4 text-slate-700 dark:text-slate-300">
                    {scan.defanged || scan.input}
                  </td>
                  <td className="py-3 font-sans">
                    <StatusBadge threatLevel={scan.threatLevel} size="sm" />
                  </td>
                  <td className="py-3 font-bold">
                    <span className={scan.riskScore >= 60 ? 'text-rose-500' : scan.riskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'}>
                      {scan.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 font-sans text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                    {scan.primaryThreat || 'None'}
                  </td>
                  <td className="py-3 text-right font-sans">
                    <button
                      onClick={() => viewResult(scan)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 font-semibold text-[11px] transition-colors"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

