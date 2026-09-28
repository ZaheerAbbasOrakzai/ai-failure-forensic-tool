import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { mockTraces } from '../data/mockData';

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

  const StatusBadge = ({ status }: { status: string }) => {
    const config = {
      success: { icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
      failed: { icon: XCircle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
      partial: { icon: AlertTriangle, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    }[status] || { icon: Clock, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.color}`}>
        <config.icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trace Explorer</h1>
          <p className="text-gray-400 text-sm mt-1">Browse and search all pipeline executions</p>
        </div>
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{filteredTraces.length}</span> of {mockTraces.length} traces
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trace ID or pipeline name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50 placeholder:text-gray-500"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
            </select>

            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50"
            >
              <option value="all">All Pipelines</option>
              <option value="rag_pipeline">RAG Pipeline</option>
              <option value="agent_workflow">Agent Workflow</option>
              <option value="multi_agent_crew">Multi-Agent Crew</option>
              <option value="code_gen_pipeline">Code Gen Pipeline</option>
              <option value="summarization_chain">Summarization Chain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium px-5 py-3">Trace ID</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Pipeline</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Status</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Duration</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Root Cause</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Tokens</th>
                <th className="text-left text-gray-400 font-medium px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredTraces.map(trace => (
                <tr 
                  key={trace.id} 
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/traces/${trace.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-orange-400 text-xs">{trace.id}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-200">{trace.pipeline_name}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={trace.status} />
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">{(trace.duration_ms / 1000).toFixed(2)}s</td>
                  <td className="px-5 py-3.5">
                    {trace.root_cause ? (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium">
                        {trace.root_cause}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-300">
                    <span className="text-blue-400">{trace.tokens_in}</span>
                    {' / '}
                    <span className="text-purple-400">{trace.tokens_out}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(trace.start_time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
