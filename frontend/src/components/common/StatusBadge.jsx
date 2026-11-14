import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function StatusBadge({ threatLevel, size = 'md' }) {
  const level = (threatLevel || 'SAFE').toUpperCase();

  const configs = {
    SAFE: {
      label: 'Verified Safe',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      borderColor: 'border-emerald-500/30',
      dotColor: 'bg-emerald-500',
      icon: ShieldCheck
    },
    SUSPICIOUS: {
      label: 'Suspicious (Elevated Risk)',
      bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
      textColor: 'text-amber-700 dark:text-amber-400',
      borderColor: 'border-amber-500/30',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle
    },
    HIGH_RISK: {
      label: 'High-Risk Threat',
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/15',
      textColor: 'text-rose-700 dark:text-rose-400',
      borderColor: 'border-rose-500/30',
      dotColor: 'bg-rose-500',
      icon: ShieldAlert
    }
  };

  const config = configs[level] || configs.SAFE;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs md:text-sm px-3 py-1 gap-2',
    lg: 'text-sm md:text-base px-4 py-1.5 gap-2.5 font-semibold'
  }[size] || 'text-xs px-3 py-1 gap-2';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}

