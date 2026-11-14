import React from 'react';
import { Shield, Moon, Sun, Menu, X, Cpu, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useScan } from '../../context/ScanContext';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { isDark, toggleTheme } = useTheme();
  const { activeTab, setActiveTab, backendOnline } = useScan();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-cyber-bg/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
          >
            <div className="relative p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
                ScamShield
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                v1.0 DEFENSE
              </span>
            </div>
          </button>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <Cpu className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Engine:</span>
          {backendOnline ? (
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1.5">
              <span>FastAPI Backend Live (:8000)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          ) : (
            <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold flex items-center space-x-1.5">
              <span>Client Heuristic Core Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </span>
          )}
        </div>

        {/* Right: Quick Actions & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setActiveTab('url-scanner')}
            className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'url-scanner'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Quick URL Scan
          </button>

          <button
            onClick={() => setActiveTab('message-scanner')}
            className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'message-scanner'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Quick Message Scan
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Color Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}

