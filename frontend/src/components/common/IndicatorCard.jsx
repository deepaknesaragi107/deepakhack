import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Flame } from 'lucide-react';

export default function IndicatorCard({ indicator }) {
  const { title, category, severity, description, scoreImpact, matches } = indicator;

  const severityConfigs = {
    critical: {
      border: 'border-rose-500/40 dark:border-rose-500/30',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: Flame,
      iconColor: 'text-rose-500',
    },
    high: {
      border: 'border-rose-400/30 dark:border-rose-500/20',
      bg: 'bg-rose-50/30 dark:bg-rose-950/10',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      icon: AlertOctagon,
      iconColor: 'text-rose-500',
    },
    medium: {
      border: 'border-amber-400/30 dark:border-amber-500/20',
      bg: 'bg-amber-50/30 dark:bg-amber-950/10',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    low: {
      border: 'border-sky-400/30 dark:border-sky-500/20',
      bg: 'bg-sky-50/30 dark:bg-sky-950/10',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      icon: Info,
      iconColor: 'text-sky-500',
    },
    safe: {
      border: 'border-emerald-400/30 dark:border-emerald-500/20',
      bg: 'bg-emerald-50/30 dark:bg-emerald-950/10',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    }
  };

  const config = severityConfigs[severity] || severityConfigs.low;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border transition-all ${config.border} ${config.bg} hover:shadow-xs`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0">
            <Icon className={`w-4 h-4 ${config.iconColor}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h4>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                {severity}
              </span>
              {category && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  [{category}]
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>

            {matches && matches.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">Trigger tokens:</span>
                {matches.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-[10px]"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {scoreImpact > 0 && (
          <div className="shrink-0 text-right">
            <span className="inline-block font-mono text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              +{scoreImpact} pts
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

