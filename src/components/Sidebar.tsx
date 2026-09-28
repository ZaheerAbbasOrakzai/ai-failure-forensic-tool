import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Target, MessageSquare, 
  Database, BarChart3, Settings, Zap, HelpCircle,
  ChevronRight, Command, AlertTriangle, Plug, BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/traces', icon: Search, label: 'Traces' },
  { path: '/incidents', icon: AlertTriangle, label: 'Incidents' },
  { path: '/root-cause', icon: Target, label: 'Root Cause' },
  { path: '/reviews', icon: MessageSquare, label: 'Reviews' },
  { path: '/evals', icon: Database, label: 'Eval Dataset' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/integrations', icon: Plug, label: 'Integrations' },
  { path: '/sdk', icon: BookOpen, label: 'SDK & Docs' },
];

interface SidebarProps {
  onCommandPalette: () => void;
}

export default function Sidebar({ onCommandPalette }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-[260px] bg-zinc-950 border-r border-zinc-800/60 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-zinc-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Failure Forensics</h1>
            <p className="text-[10px] text-zinc-500 font-medium">AI Pipeline Observability</p>
          </div>
        </div>
      </div>
      
      {/* Command Palette Trigger */}
      <div className="px-3 pt-3">
        <button
          onClick={onCommandPalette}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-sm text-zinc-400 hover:text-zinc-300 group"
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="flex-1 text-left">Search...</span>
          <div className="flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-500 font-mono">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
          Monitor
        </div>
        {navItems.slice(0, 4).map(item => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                isActive 
                  ? 'bg-zinc-800/80 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              )}
            >
              <item.icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-zinc-400')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </NavLink>
          );
        })}

        <div className="px-3 py-1.5 mt-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
          Workflow
        </div>
        {navItems.slice(4, 7).map(item => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                isActive 
                  ? 'bg-zinc-800/80 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              )}
            >
              <item.icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-zinc-400')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </NavLink>
          );
        })}

        <div className="px-3 py-1.5 mt-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">
          Platform
        </div>
        {navItems.slice(7).map(item => {
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group',
                isActive 
                  ? 'bg-zinc-800/80 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              )}
            >
              <item.icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-orange-400' : 'text-zinc-500 group-hover:text-zinc-400')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-3 space-y-1 border-t border-zinc-800/60 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all">
          <HelpCircle className="w-4 h-4 text-zinc-500" />
          <span>Documentation</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all">
          <Settings className="w-4 h-4 text-zinc-500" />
          <span>Settings</span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white">
            AE
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">Alice Engineer</p>
            <p className="text-[10px] text-zinc-500">Admin • Pro Plan</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        </div>
      </div>
    </aside>
  );
}
