import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Command, Zap, BarChart3, MessageSquare, Database, Target, LayoutDashboard } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, path: '/', category: 'Navigation' },
  { id: 'traces', label: 'Go to Trace Explorer', icon: Search, path: '/traces', category: 'Navigation' },
  { id: 'incidents', label: 'Go to Incidents', icon: Target, path: '/incidents', category: 'Navigation' },
  { id: 'root-cause', label: 'Go to Root Cause Analysis', icon: Target, path: '/root-cause', category: 'Navigation' },
  { id: 'reviews', label: 'Go to Reviews', icon: MessageSquare, path: '/reviews', category: 'Navigation' },
  { id: 'evals', label: 'Go to Eval Dataset', icon: Database, path: '/evals', category: 'Navigation' },
  { id: 'analytics', label: 'Go to Analytics', icon: BarChart3, path: '/analytics', category: 'Navigation' },
  { id: 'integrations', label: 'Go to Integrations', icon: Database, path: '/integrations', category: 'Navigation' },
  { id: 'sdk', label: 'Go to SDK & Docs', icon: Database, path: '/sdk', category: 'Navigation' },
  { id: 'run-analysis', label: 'Run Root Cause Analysis', icon: Zap, path: '/root-cause', category: 'Actions' },
  { id: 'export-data', label: 'Export Evaluation Dataset', icon: Database, path: '/evals', category: 'Actions' },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].path);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, navigate, onClose]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 animate-in">
        <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <Search className="w-5 h-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />
            <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-500 font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[320px] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                No results found
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map((cmd) => {
                    const idx = flatIndex++;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => { navigate(cmd.path); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          idx === selectedIndex 
                            ? 'bg-zinc-800 text-white' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <cmd.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{cmd.label}</span>
                        {idx === selectedIndex && (
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono">↵</kbd>
                Select
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-600">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
