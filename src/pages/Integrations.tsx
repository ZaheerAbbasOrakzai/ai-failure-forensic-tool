import { useState } from 'react';
import { 
  Plug, CheckCircle2, XCircle, RefreshCw, Settings,
  ExternalLink, Shield, Zap, Database, MessageSquare, Cloud
} from 'lucide-react';
import { mockIntegrations } from '../data/mockData';
import { Card, Badge, Button } from '../components/ui';
import { cn } from '../lib/utils';

const categoryIcons: Record<string, any> = {
  'LLM Provider': Zap,
  'Cloud Provider': Cloud,
  'Vector Database': Database,
  'Framework': Shield,
  'Notifications': MessageSquare,
  'Monitoring': RefreshCw,
  'Database': Database,
};

const integrationLogos: Record<string, string> = {
  openai: '🟢',
  anthropic: '🟤',
  aws: '🟠',
  pinecone: '🔵',
  langchain: '🦜',
  slack: '💬',
  datadog: '🐕',
  postgres: '🐘',
};

export default function Integrations() {
  const [filter, setFilter] = useState<string>('all');

  const categories = [...new Set(mockIntegrations.map(i => i.category))];
  const filtered = filter === 'all' ? mockIntegrations : mockIntegrations.filter(i => i.category === filter);

  const connected = mockIntegrations.filter(i => i.status === 'connected').length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Integrations</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Connect your AI stack and infrastructure</p>
        </div>
        <Button className="shadow-lg shadow-orange-500/20">
          <Plug className="w-4 h-4" />
          Add Integration
        </Button>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{connected}</p>
              <p className="text-xs text-zinc-500">Connected</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <Plug className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockIntegrations.length}</p>
              <p className="text-xs text-zinc-500">Total Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">SOC 2</p>
              <p className="text-xs text-zinc-500">Compliance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            filter === 'all' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          All ({mockIntegrations.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === cat ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {cat} ({mockIntegrations.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(integration => {
          const CatIcon = categoryIcons[integration.category] || Plug;
          
          return (
            <Card key={integration.id} className="p-5 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl">
                    {integrationLogos[integration.icon] || '🔌'}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
                    <p className="text-[10px] text-zinc-500">{integration.category}</p>
                  </div>
                </div>
                <Badge variant={integration.status === 'connected' ? 'success' : integration.status === 'error' ? 'danger' : 'outline'}>
                  {integration.status === 'connected' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {integration.status}
                </Badge>
              </div>

              {/* Config Preview */}
              {integration.status === 'connected' && Object.keys(integration.config).length > 0 && (
                <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 mb-4">
                  {Object.entries(integration.config).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{key}</span>
                      <span className="text-zinc-300 font-mono text-[10px] truncate max-w-[140px]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Last Sync */}
              {integration.last_sync && (
                <p className="text-[10px] text-zinc-600 mb-3">
                  Last sync: {new Date(integration.last_sync).toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Settings className="w-3.5 h-3.5" />
                  Configure
                </Button>
                {integration.status === 'connected' && (
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
