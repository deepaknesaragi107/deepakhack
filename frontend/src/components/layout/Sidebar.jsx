import React from 'react';
import {
  LayoutDashboard,
  Globe,
  MessageSquareText,
  FileCheck2,
  History,
  BookOpen,
  Home,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useScan } from '../../context/ScanContext';

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, scanHistory, activeResult } = useScan();

  const navItems = [
    { id: 'landing', label: 'Home & Overview', icon: Home },
    { id: 'dashboard', label: 'Security Dashboard', icon: LayoutDashboard },
    { id: 'url-scanner', label: 'URL Threat Scanner', icon: Globe },
    { id: 'message-scanner', label: 'Message & SMS Scanner', icon: MessageSquareText },
    { id: 'results', label: 'Analysis Report', icon: FileCheck2, badge: activeResult ? 'Active' : null },
    { id: 'history', label: 'Scan History & Logs', icon: History, count: scanHistory.length },
    { id: 'learn', label: 'Scam Encyclopedia', icon: BookOpen },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-cyber-surface transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Cyber Tools
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                          {item.badge}
                        </span>
                      )}
                      {typeof item.count === 'number' && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Threat Intel Widget */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/90 dark:to-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Phishing Radar Active</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Client heuristics verify Punycode attacks, Brand Spoofing, and Urgency patterns in real-time.
            </p>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Defensive Mode</span>
            <span className="font-mono text-emerald-500 font-semibold">ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
}

