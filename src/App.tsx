import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import Dashboard from './pages/Dashboard';
import TraceExplorer from './pages/TraceExplorer';
import TraceDetail from './pages/TraceDetail';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import Reviews from './pages/Reviews';
import EvalDataset from './pages/EvalDataset';
import Analytics from './pages/Analytics';
import Incidents from './pages/Incidents';
import Integrations from './pages/Integrations';
import SDKDocs from './pages/SDKDocs';

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-zinc-950 overflow-hidden">
        <Sidebar onCommandPalette={() => setCommandPaletteOpen(true)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onCommandPalette={() => setCommandPaletteOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/traces" element={<TraceExplorer />} />
              <Route path="/traces/:traceId" element={<TraceDetail />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/root-cause" element={<RootCauseAnalysis />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/evals" element={<EvalDataset />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/sdk" element={<SDKDocs />} />
            </Routes>
          </main>
        </div>
      </div>
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </Router>
  );
}
