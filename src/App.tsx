import { useState } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, GitBranch, Target, MessageSquare, 
  Database, BarChart3, Settings, Bell, ChevronDown, Zap
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import TraceExplorer from './pages/TraceExplorer';
import TraceDetail from './pages/TraceDetail';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import Reviews from './pages/Reviews';
import EvalDataset from './pages/EvalDataset';
import Analytics from './pages/Analytics';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/traces', icon: Search, label: 'Trace Explorer' },
  { path: '/root-cause', icon: Target, label: 'Root Cause' },
  { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
  { path: '/evals', icon: Database, label: 'Eval Dataset' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Failure Forensics</h1>
            <p className="text-gray-500 text-xs">AI Pipeline Observability</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive 
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            AE
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-200">Alice Engineer</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <Settings className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="h-14 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Environment:</span>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs font-medium border border-green-500/20">
            Production
          </span>
        </div>
        <div className="h-4 w-px bg-gray-700" />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Region:</span>
          <span className="text-gray-200">us-east-1</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search traces..." 
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-1.5 text-sm text-gray-200 w-64 focus:outline-none focus:border-orange-500/50 placeholder:text-gray-500"
          />
          <Search className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <button className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-950">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/traces" element={<TraceExplorer />} />
              <Route path="/traces/:traceId" element={<TraceDetail />} />
              <Route path="/root-cause" element={<RootCauseAnalysis />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/evals" element={<EvalDataset />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
