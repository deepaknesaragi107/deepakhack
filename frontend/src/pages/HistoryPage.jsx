import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  RotateCcw,
  Globe,
  MessageSquareText,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import StatusBadge from '../components/common/StatusBadge';

export default function HistoryPage() {
  const { scanHistory, viewResult, deleteHistoryItem, clearHistory, restoreSampleHistory } = useScan();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [threatFilter, setThreatFilter] = useState('ALL');

  const filteredHistory = scanHistory.filter((item) => {
    // Type filter
    if (typeFilter !== 'ALL' && item.scanType !== typeFilter) return false;
    // Threat level filter
    if (threatFilter !== 'ALL' && item.threatLevel !== threatFilter) return false;
    // Search keyword
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchInput = item.input?.toLowerCase().includes(q);
      const matchThreat = item.primaryThreat?.toLowerCase().includes(q);
      const matchId = item.id?.toLowerCase().includes(q);
      if (!matchInput && !matchThreat && !matchId) return false;
    }
    return true;
  });

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scanHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scamshield_scan_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Scan Audit Logs & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, and export previously inspected website addresses and communications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportToJson}
            disabled={scanHistory.length === 0}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={restoreSampleHistory}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          {scanHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by URL, text, or ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Scan Type Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${typeFilter === 'ALL' ? 'bg-white dark:bg-slate-800 shadow-xs text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('URL')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${typeFilter === 'URL' ? 'bg-white dark:bg-slate-800 shadow-xs text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-500'}`}
            >
              URLs
            </button>
            <button
              onClick={() => setTypeFilter('MESSAGE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${typeFilter === 'MESSAGE' ? 'bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500'}`}
            >
              Messages
            </button>
          </div>

          {/* Threat Level Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setThreatFilter('ALL')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${threatFilter === 'ALL' ? 'bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
            >
              All Severities
            </button>
            <button
              onClick={() => setThreatFilter('HIGH_RISK')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${threatFilter === 'HIGH_RISK' ? 'bg-rose-500 text-white font-bold' : 'text-rose-500'}`}
            >
              High Risk
            </button>
            <button
              onClick={() => setThreatFilter('SUSPICIOUS')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${threatFilter === 'SUSPICIOUS' ? 'bg-amber-500 text-white font-bold' : 'text-amber-500'}`}
            >
              Suspicious
            </button>
            <button
              onClick={() => setThreatFilter('SAFE')}
              className={`px-2 py-1 rounded-lg font-medium transition-colors ${threatFilter === 'SAFE' ? 'bg-emerald-500 text-white font-bold' : 'text-emerald-500'}`}
            >
              Safe
            </button>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="p-6 rounded-3xl glass-panel">
        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No scan logs found matching the active filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID & Time</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Target Value</th>
                  <th className="pb-3 font-semibold">Threat Level</th>
                  <th className="pb-3 font-semibold">Risk Score</th>
                  <th className="pb-3 font-semibold">Primary Threat</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {filteredHistory.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        #{scan.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        {new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 pr-2 font-sans">
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {scan.scanType === 'URL' ? <Globe className="w-3 h-3 text-cyan-500" /> : <MessageSquareText className="w-3 h-3 text-indigo-500" />}
                        <span>{scan.scanType}</span>
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 max-w-xs truncate text-slate-700 dark:text-slate-300">
                      {scan.defanged || scan.input}
                    </td>

                    <td className="py-3.5 pr-2 font-sans">
                      <StatusBadge threatLevel={scan.threatLevel} size="sm" />
                    </td>

                    <td className="py-3.5 pr-2 font-bold">
                      <span className={scan.riskScore >= 60 ? 'text-rose-500' : scan.riskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'}>
                        {scan.riskScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 pr-2 font-sans text-slate-500 dark:text-slate-400 max-w-[180px] truncate">
                      {scan.primaryThreat || 'None'}
                    </td>

                    <td className="py-3.5 text-right font-sans space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => viewResult(scan)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => deleteHistoryItem(scan.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

