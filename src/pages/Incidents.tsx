import { useState } from 'react';
import { 
  AlertTriangle, Clock, User, ChevronRight, 
  CheckCircle2, Eye, Radio, Flame, Shield
} from 'lucide-react';
import { mockIncidents } from '../data/mockData';
import { Card, Badge, Button, Avatar } from '../components/ui';
import { cn } from '../lib/utils';
import { Incident } from '../types';

export default function Incidents() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(mockIncidents[0]?.id || null);

  const filteredIncidents = mockIncidents.filter(i => 
    filter === 'all' ? true : i.status === filter
  );

  const selected = mockIncidents.find(i => i.id === selectedIncident);

  const severityConfig = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Flame },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle },
    warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
    info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Eye },
  };

  const statusConfig = {
    investigating: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    identified: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    monitoring: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  };

  const activeIncidents = mockIncidents.filter(i => i.status !== 'resolved').length;
  const criticalIncidents = mockIncidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Incidents</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Track and manage AI pipeline incidents</p>
        </div>
        <Button className="shadow-lg shadow-orange-500/20">
          <AlertTriangle className="w-4 h-4" />
          Report Incident
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-red-500/20 bg-red-500/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{criticalIncidents}</p>
              <p className="text-xs text-zinc-500">Critical Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeIncidents}</p>
              <p className="text-xs text-zinc-500">Active Incidents</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockIncidents.filter(i => i.status === 'resolved').length}</p>
              <p className="text-xs text-zinc-500">Resolved (30d)</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">42m</p>
              <p className="text-xs text-zinc-500">Avg MTTR</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-1 space-y-3">
          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'investigating', 'monitoring', 'resolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                  filter === status 
                    ? 'bg-zinc-800 text-white border border-zinc-700' 
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2">
            {filteredIncidents.map(incident => {
              const sevConfig = severityConfig[incident.severity];
              const statConfig = statusConfig[incident.status];
              const SevIcon = sevConfig.icon;

              return (
                <div 
                  key={incident.id} 
                  onClick={() => setSelectedIncident(incident.id)}
                >
                <Card 
                  className={cn(
                    'p-4 cursor-pointer transition-all hover-lift',
                    selectedIncident === incident.id && 'ring-1 ring-orange-500/30 border-orange-500/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border', sevConfig.bg, sevConfig.border)}>
                      <SevIcon className={cn('w-4 h-4', sevConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{incident.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={incident.status === 'resolved' ? 'success' : incident.severity === 'critical' ? 'danger' : 'warning'}>
                          {incident.status}
                        </Badge>
                        <span className="text-[10px] text-zinc-600">{incident.pipeline}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {incident.assignee.split('@')[0]}
                        </span>
                        <span>{incident.affected_traces} traces</span>
                      </div>
                    </div>
                  </div>
                </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card className="p-6 animate-in">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={selected.severity === 'critical' ? 'danger' : selected.severity === 'high' ? 'warning' : 'info'}>
                      {selected.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={selected.status === 'resolved' ? 'success' : 'warning'}>
                      {selected.status}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selected.title}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{selected.pipeline} • {selected.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Radio className="w-3.5 h-3.5" />
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-800/50 mb-6">
                <p className="text-sm text-zinc-300 leading-relaxed">{selected.description}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Assignee</p>
                  <div className="flex items-center gap-2">
                    <Avatar initials={selected.assignee.slice(0, 2).toUpperCase()} size="sm" color="purple" />
                    <span className="text-xs text-zinc-300">{selected.assignee.split('@')[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Started</p>
                  <p className="text-xs text-zinc-300">{new Date(selected.started_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-xs text-zinc-300">{Math.round((Date.now() - new Date(selected.started_at).getTime()) / (1000 * 60))}m</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Affected</p>
                  <p className="text-xs text-zinc-300">{selected.affected_traces} traces</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Timeline</h3>
                <div className="space-y-4">
                  {selected.timeline.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full border-2',
                          i === selected.timeline.length - 1 
                            ? 'bg-orange-500 border-orange-400' 
                            : 'bg-zinc-700 border-zinc-600'
                        )} />
                        {i < selected.timeline.length - 1 && (
                          <div className="w-px h-full bg-zinc-800 min-h-[20px]" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-zinc-200">{event.event}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                          <span>{new Date(event.time).toLocaleString()}</span>
                          <span>•</span>
                          <span>{event.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 flex items-center justify-center">
              <p className="text-zinc-500 text-sm">Select an incident to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
