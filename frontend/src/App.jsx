import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ScanProvider, useScan } from './context/ScanContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UrlScanner from './pages/UrlScanner';
import MessageScanner from './pages/MessageScanner';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import LearnPage from './pages/LearnPage';

function AppContent() {
  const { activeTab } = useScan();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'url-scanner':
        return <UrlScanner />;
      case 'message-scanner':
        return <MessageScanner />;
      case 'results':
        return <ResultsPage />;
      case 'history':
        return <HistoryPage />;
      case 'learn':
        return <LearnPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-cyber-bg text-slate-900 dark:text-slate-100 cyber-grid-bg transition-colors duration-200">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ScanProvider>
        <AppContent />
      </ScanProvider>
    </ThemeProvider>
  );
}

