import React, { useState } from 'react';
import { Copy, Check, Shield, AlertCircle } from 'lucide-react';

export default function DefangedUrl({ url, defangedUrl, isDangerous = false }) {
  const [copied, setCopied] = useState(false);

  const displayUrl = defangedUrl || url;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900/90 rounded-lg p-3 border border-slate-200 dark:border-slate-800 text-xs md:text-sm font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div className="flex items-center space-x-2.5 min-w-0">
        <Shield className={`w-4 h-4 shrink-0 ${isDangerous ? 'text-rose-500' : 'text-cyan-500'}`} />
        <div className="truncate text-slate-700 dark:text-slate-300 font-semibold selection:bg-rose-500/20">
          {displayUrl}
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          Defanged
        </span>
        <button
          onClick={handleCopy}
          type="button"
          title="Copy safe defanged URL"
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

