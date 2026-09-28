import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, XCircle, CheckCircle2, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { mockTraces } from '../data/mockData';
import { Card, Badge } from '../components/ui';
import { cn } from '../lib/utils';

export default function TraceExplorer() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pipelineFilter, setPipelineFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTraces = mockTraces.filter(trace => {
    if (statusFilter !== 'all' && trace.status !== statusFilter) return false;
    if (pipelineFilter !== 'all' && trace.pipeline_name !== pipelineFilter) return false;
    if (searchQuery && !trace.id.includes(searchQuery) && !trace.pipeline_name.includes(searchQuery)) return false;
    return true;
  });

  const statusIcons = {
    success: CheckCircle2,
    failed: XCircle,
    partial: AlertTriangle,
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Trace Explorer</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Browse and search all pipeline executions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{filteredTraces.length} of {mockTraces.length} traces</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trace ID, pipeline, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 placeholder:text-zinc-600 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
            </select>

            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="all">All Pipelines</option>
              <option value="rag_pipeline">RAG Pipeline</option>
              <option value="agent_workflow">Agent Workflow</option>
              <option value="multi_agent_crew">Multi-Agent Crew</option>
              <option value="code_gen_pipeline">Code Gen</option>
              <option value="summarization_chain">Summarization</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/30">
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Trace ID</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Pipeline</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Duration</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Root Cause</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Tokens</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTraces.map(trace => {
                const StatusIcon = statusIcons[trace.status as keyof typeof statusIcons] || AlertTriangle;
                return (
                  <tr 
                    key={trace.id} 
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/30 cursor-pointer transition-all group"
                    onClick={() => navigate(`/traces/${trace.id}`)}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs text-orange-400 group-hover:text-orange-300 transition-colors">{trace.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-sm text-zinc-200">{trace.pipeline_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={trace.status === 'success' ? 'success' : trace.status === 'failed' ? 'danger' : 'warning'}>
                        <StatusIcon className="w-3 h-3" />
                        {trace.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-zinc-400 font-mono">{(trace.duration_ms / 1000).toFixed(2)}s</td>
                    <td className="px-5 py-3.5">
                      {trace.root_cause ? (
                        <Badge variant="danger">{trace.root_cause}</Badge>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-blue-400">{trace.tokens_in}</span>
                        <span className="text-zinc-600">/</span>
                        <span className="text-purple-400">{trace.tokens_out}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-500">
                      {new Date(trace.start_time).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
