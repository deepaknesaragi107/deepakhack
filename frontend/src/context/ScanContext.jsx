import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_HISTORY } from '../data/mockScans';
import { analyzeUrlHeuristics } from '../utils/urlAnalyzer';
import { analyzeMessageText } from '../utils/messageAnalyzer';

const ScanContext = createContext();
const BACKEND_BASE_URL = 'http://localhost:8000/api';

export function ScanProvider({ children }) {
  const [activeTab, setActiveTab] = useState('landing');
  const [backendOnline, setBackendOnline] = useState(false);
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('scamshield_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading scan history from localStorage', e);
    }
    return INITIAL_HISTORY;
  });

  const [activeResult, setActiveResult] = useState(() => {
    return INITIAL_HISTORY[0] || null;
  });

  const [isScanning, setIsScanning] = useState(false);

  // Periodically check if FastAPI backend is reachable
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
        if (res.ok && isMounted) {
          setBackendOnline(true);
          return;
        }
      } catch (err) {
        // Backend offline
      }
      if (isMounted) setBackendOnline(false);
    };

    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scamshield_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.error('Failed saving scan history to localStorage', e);
    }
  }, [scanHistory]);

  const runUrlScan = async (url) => {
    setIsScanning(true);

    // 1. Try Live FastAPI Backend First
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/scan/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const data = await response.json();
        setBackendOnline(true);

        const newScanEntry = {
          id: data.scan_id,
          scanType: 'URL',
          input: url,
          defanged: data.input_defanged,
          threatLevel: data.threat_classification,
          riskScore: data.risk_score,
          badgeColor: data.threat_classification === 'HIGH_RISK' ? 'rose' : data.threat_classification === 'SUSPICIOUS' ? 'amber' : 'emerald',
          primaryThreat: data.detected_indicators[0]?.title || 'Standard Lexical Structure',
          createdAt: data.scanned_at,
          indicatorsCount: data.detected_indicators.length,
          indicators: data.detected_indicators,
          recommendations: data.security_recommendations,
          explanation: data.explanation,
          entropy: data.details?.entropy,
          hostname: data.details?.hostname,
          protocol: data.details?.protocol,
          isMock: false,
          source: 'FastAPI Backend'
        };

        setScanHistory(prev => [newScanEntry, ...prev]);
        setActiveResult(newScanEntry);
        setIsScanning(false);
        setActiveTab('results');
        return { success: true, result: newScanEntry };
      }
    } catch (backendErr) {
      console.log('FastAPI backend not reachable, falling back to local heuristic engine.');
      setBackendOnline(false);
    }

    // 2. Client-side heuristic fallback
    await new Promise(r => setTimeout(r, 600));
    const analysis = analyzeUrlHeuristics(url);
    if (!analysis.isValid) {
      setIsScanning(false);
      return { success: false, error: analysis.error };
    }

    const newScanEntry = {
      id: `sc-${Date.now().toString().slice(-4)}`,
      scanType: 'URL',
      input: url,
      defanged: analysis.defangedUrl,
      threatLevel: analysis.threatLevel,
      riskScore: analysis.riskScore,
      badgeColor: analysis.badgeColor,
      primaryThreat: analysis.indicators[0]?.title || 'Standard Lexical Structure',
      createdAt: analysis.scannedAt,
      indicatorsCount: analysis.indicators.length,
      indicators: analysis.indicators,
      recommendations: analysis.recommendations,
      explanation: analysis.plainEnglishExplanation,
      entropy: analysis.entropy,
      hostname: analysis.hostname,
      protocol: analysis.protocol,
      isMock: true,
      source: 'Client Heuristic Engine'
    };

    setScanHistory(prev => [newScanEntry, ...prev]);
    setActiveResult(newScanEntry);
    setIsScanning(false);
    setActiveTab('results');
    return { success: true, result: newScanEntry };
  };

  const runMessageScan = async (text) => {
    setIsScanning(true);

    // 1. Try Live FastAPI Backend First
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/scan/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: AbortSignal.timeout(6000)
      });

      if (response.ok) {
        const data = await response.json();
        setBackendOnline(true);

        const newScanEntry = {
          id: data.scan_id,
          scanType: 'MESSAGE',
          input: text,
          defanged: data.input_defanged,
          threatLevel: data.threat_classification,
          riskScore: data.risk_score,
          badgeColor: data.threat_classification === 'HIGH_RISK' ? 'rose' : data.threat_classification === 'SUSPICIOUS' ? 'amber' : 'emerald',
          primaryThreat: data.detected_indicators[0]?.title || 'Baseline Communication',
          createdAt: data.scanned_at,
          indicatorsCount: data.detected_indicators.length,
          indicators: data.detected_indicators,
          recommendations: data.security_recommendations,
          explanation: data.explanation,
          matchedKeywords: data.details?.matched_keywords || [],
          analyzedUrls: data.details?.analyzed_links || [],
          charCount: data.details?.character_count || text.length,
          wordCount: data.details?.word_count || text.split(/\s+/).length,
          isMock: false,
          source: 'FastAPI Backend'
        };

        setScanHistory(prev => [newScanEntry, ...prev]);
        setActiveResult(newScanEntry);
        setIsScanning(false);
        setActiveTab('results');
        return { success: true, result: newScanEntry };
      }
    } catch (backendErr) {
      console.log('FastAPI backend not reachable, falling back to local NLP engine.');
      setBackendOnline(false);
    }

    // 2. Client-side NLP fallback
    await new Promise(r => setTimeout(r, 650));
    const analysis = analyzeMessageText(text);
    if (!analysis.isValid) {
      setIsScanning(false);
      return { success: false, error: analysis.error };
    }

    const newScanEntry = {
      id: `sc-${Date.now().toString().slice(-4)}`,
      scanType: 'MESSAGE',
      input: text,
      defanged: text,
      threatLevel: analysis.threatLevel,
      riskScore: analysis.riskScore,
      badgeColor: analysis.badgeColor,
      primaryThreat: analysis.indicators[0]?.title || 'Baseline Communication',
      createdAt: analysis.scannedAt,
      indicatorsCount: analysis.indicators.length,
      indicators: analysis.indicators,
      recommendations: analysis.recommendations,
      explanation: analysis.plainEnglishExplanation,
      matchedKeywords: analysis.matchedKeywords,
      analyzedUrls: analysis.analyzedUrls,
      charCount: analysis.charCount,
      wordCount: analysis.wordCount,
      isMock: true,
      source: 'Client NLP Engine'
    };

    setScanHistory(prev => [newScanEntry, ...prev]);
    setActiveResult(newScanEntry);
    setIsScanning(false);
    setActiveTab('results');
    return { success: true, result: newScanEntry };
  };

  const viewResult = (item) => {
    setActiveResult(item);
    setActiveTab('results');
  };

  const deleteHistoryItem = (id) => {
    setScanHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  const restoreSampleHistory = () => {
    setScanHistory(INITIAL_HISTORY);
    setActiveResult(INITIAL_HISTORY[0]);
  };

  return (
    <ScanContext.Provider
      value={{
        activeTab,
        setActiveTab,
        backendOnline,
        scanHistory,
        activeResult,
        isScanning,
        runUrlScan,
        runMessageScan,
        viewResult,
        deleteHistoryItem,
        clearHistory,
        restoreSampleHistory,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScan() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
}
