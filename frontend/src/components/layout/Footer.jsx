import React from 'react';
import { Shield, AlertTriangle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-cyber-surface/60 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Educational Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-xs text-amber-800 dark:text-amber-300">
          <div className="p-1 rounded-md bg-amber-500/20 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <strong className="font-semibold">Educational & Defensive Purpose Disclaimer:</strong>{' '}
            ScamShield is designed solely for defensive cybersecurity awareness, threat inspection, and educational guidance.
            It does not replace comprehensive enterprise endpoint security suites. Never engage, negotiate, or click on unverified suspicious web links.
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">ScamShield</span>
            <span>– Intelligent Digital Scam & Phishing Detection System</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px]">
            <span>MIT Defense License</span>
            <span>•</span>
            <span>Privacy First (Zero Logs Retained Off-Device)</span>
            <span>•</span>
            <span className="font-mono text-cyan-500">v1.0.0-Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

