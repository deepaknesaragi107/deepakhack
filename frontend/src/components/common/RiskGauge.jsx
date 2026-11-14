import React from 'react';

export default function RiskGauge({ score = 0, size = 220 }) {
  const clampedScore = Math.min(100, Math.max(0, score));

  // Determine color and status
  let strokeColor = '#10b981'; // Green (Safe)
  let statusText = 'Low Threat';
  let statusColor = 'text-emerald-500';

  if (clampedScore >= 65) {
    strokeColor = '#ef4444'; // Red (Danger)
    statusText = 'Severe Threat';
    statusColor = 'text-rose-500';
  } else if (clampedScore >= 30) {
    strokeColor = '#f59e0b'; // Amber (Suspicious)
    statusText = 'Elevated Risk';
    statusColor = 'text-amber-500';
  }

  // SVG Gauge Calculations (Semi-circle 180 degrees)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  // Dash offset: from 0% (full dash) to 100% (0 dash)
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full overflow-visible"
        >
          {/* Background arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />

          {/* Tick markers */}
          <circle cx="20" cy="100" r="3" fill="#10b981" />
          <circle cx="100" cy="20" r="3" fill="#f59e0b" />
          <circle cx="180" cy="100" r="3" fill="#ef4444" />
        </svg>

        {/* Center Score Reading */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="flex items-baseline space-x-0.5">
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              {clampedScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/100</span>
          </div>
          <span className={`text-xs md:text-sm font-bold tracking-wide uppercase mt-0.5 ${statusColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-[200px] text-[11px] text-slate-400 font-medium px-2 mt-1">
        <span>0 (Safe)</span>
        <span>50</span>
        <span>100 (Critical)</span>
      </div>
    </div>
  );
}

