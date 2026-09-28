import { Bell, Search, Command, ChevronDown, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/traces': 'Trace Explorer',
  '/incidents': 'Incidents',
  '/root-cause': 'Root Cause Analysis',
  '/reviews': 'Human Review',
  '/evals': 'Evaluation Dataset',
  '/analytics': 'Analytics',
  '/integrations': 'Integrations',
  '/sdk': 'SDK & Docs',
};

interface HeaderProps {
  onCommandPalette: () => void;
}

export default function Header({ onCommandPalette }: HeaderProps) {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || 'Dashboard';

  return (
    <header className="h-14 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Failure Forensics</span>
          <span className="text-zinc-700">/</span>
          <span className="text-sm font-medium text-zinc-200">{pageName}</span>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 ml-4 px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
        </div>
      </div>
      
      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Environment Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-xs font-medium text-zinc-300">Production</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </div>

        {/* Command Palette */}
        <button 
          onClick={onCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors group"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-400" />
          <span className="text-xs text-zinc-500 group-hover:text-zinc-400 hidden sm:inline">Search</span>
          <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] text-zinc-500 font-mono">
            ⌘K
          </kbd>
        </button>
        
        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-zinc-950" />
        </button>

        {/* Activity */}
        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-all">
          <Activity className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
