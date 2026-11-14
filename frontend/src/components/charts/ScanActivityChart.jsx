import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ACTIVITY_TREND_DATA } from '../../data/mockScans';

export default function ScanActivityChart({ data = ACTIVITY_TREND_DATA }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label} Activity</p>
          <p className="text-emerald-400">Safe: {payload[0]?.value}</p>
          <p className="text-amber-400">Suspicious: {payload[1]?.value}</p>
          <p className="text-rose-400">High-Risk: {payload[2]?.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="safe"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorSafe)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="suspicious"
            stroke="#f59e0b"
            fillOpacity={1}
            fill="url(#colorSuspicious)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="highRisk"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorHighRisk)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

