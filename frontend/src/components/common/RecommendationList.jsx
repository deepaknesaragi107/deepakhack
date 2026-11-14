import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck, ExternalLink } from 'lucide-react';

export default function RecommendationList({ recommendations = [], threatLevel = 'SAFE' }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const isHighRisk = threatLevel === 'HIGH_RISK';

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {recommendations.map((rec, idx) => {
          const isDone = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                isDone
                  ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-cyan-500/40'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-cyan-600 dark:text-cyan-400 shrink-0 focus:outline-none"
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <span
                className={`text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-snug ${
                  isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
              >
                {rec}
              </span>
            </div>
          );
        })}
      </div>

      {isHighRisk && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 space-y-2">
          <div className="flex items-center space-x-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Official Incident Reporting Resources</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Reporting verified phishing campaigns helps cybersecurity authorities take down malicious host servers and protect other internet users.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href="https://safebrowsing.google.com/safebrowsing/report_phish/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-cyan-500 text-[11px] font-medium"
            >
              <span>Google SafeBrowsing Report</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.ic3.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-cyan-500 text-[11px] font-medium"
            >
              <span>FBI IC3 Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

