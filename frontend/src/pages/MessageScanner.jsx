import React, { useState } from 'react';
import {
  MessageSquareText,
  Search,
  AlertCircle,
  Loader2,
  Zap,
  Sparkles,
  FileText,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { SAMPLE_MESSAGES } from '../data/mockScans';

export default function MessageScanner() {
  const { runMessageScan, isScanning } = useScan();
  const [messageInput, setMessageInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) {
      setValidationError('Please paste or type a message to inspect.');
      return;
    }
    setValidationError('');
    const res = await runMessageScan(messageInput.trim());
    if (!res.success) {
      setValidationError(res.error);
    }
  };

  const loadSample = (text) => {
    setMessageInput(text);
    setValidationError('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>NLP Social Engineering & Smishing Detector</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Message & Communications Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detect artificial panic, gift card coercion, cryptocurrency fraud, two-factor OTP theft, and fake customer service alerts.
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Paste SMS, Email Content, or DM Text
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {messageInput.length} characters • {messageInput.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Paste suspicious text here... (e.g. 'Your bank account will be suspended within 24 hours. Click https://... to verify your SSN and avoid closure.')"
              className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-sm font-sans text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                validationError
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500'
              }`}
            />
          </div>

          {validationError && (
            <div className="flex items-center space-x-2 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-400">
              🔒 Privacy Protected: All content is processed locally and never stored externally.
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating NLP Indicators...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Message Content</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset Message Samples */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Preset Threat Scenarios (Click to test):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSample(sample.text)}
                className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {sample.name}
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded font-mono ${
                    sample.expectedRisk === 'HIGH_RISK'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {sample.type}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2">
                  {sample.text}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Social Engineering Red Flag Indicators Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Artificial Urgency</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Deadlines like "within 24 hours" or "account will be terminated" intentionally create panic to bypass your natural skepticism.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Untraceable Payment</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Requests for gift cards (Apple, Steam, Google Play) or Bitcoin are definitive proof of advance-fee or impersonation fraud.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>OTP & 2FA Theft</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Legitimate services will never ask you to send back a 6-digit verification code. Once shared, attackers gain total account control.
          </p>
        </div>
      </div>
    </div>
  );
}

