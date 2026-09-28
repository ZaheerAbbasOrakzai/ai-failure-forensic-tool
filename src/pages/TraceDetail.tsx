import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Cpu, Zap, AlertTriangle, CheckCircle2, XCircle,
  ChevronRight, FileText, Code, MessageSquare, Copy
} from 'lucide-react';
import { mockTraces, mockRootCauseResults } from '../data/mockData';

export default function TraceDetail() {
  const { traceId } = useParams();
  const navigate = useNavigate();
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'metadata'>('output');

  const trace = mockTraces.find(t => t.id === traceId) || mockTraces[0];
  const maxLatency = Math.max(...trace.spans.map(s => s.latency_ms));
  const rootCause = trace.root_cause ? mockRootCauseResults[trace.root_cause as keyof typeof mockRootCauseResults] : null;
  const selectedSpanData = trace.spans.find(s => s.id === selectedSpan);

  const nodeColors: Record<string, string> = {
    retrieve: 'bg-blue-500',
    rewrite: 'bg-cyan-500',
    generate: 'bg-purple-500',
    verify: 'bg-green-500',
    tool: 'bg-orange-500',
    agent: 'bg-pink-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/traces')}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white font-mono">{trace.id}</h1>
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
              trace.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              trace.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            }`}>
              {trace.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">{trace.pipeline_name} • {trace.user_id}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{(trace.duration_ms / 1000).toFixed(2)}s</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-4 h-4" />
            <span>{trace.tokens_in + trace.tokens_out} tokens</span>
          </div>
        </div>
      </div>

      {/* Root Cause Banner */}
      {rootCause && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-red-400 font-semibold">Root Cause Identified</h3>
                <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs font-medium">
                  {rootCause.confidence * 100}% confidence
                </span>
              </div>
              <p className="text-gray-300 text-sm mt-1">{rootCause.evidence}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Affected node:</span>
                <span className="text-xs text-orange-400 font-medium">{rootCause.affected_node}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waterfall Visualization */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Execution Waterfall</h3>
            <div className="space-y-3">
              {trace.spans.map((span, i) => {
                const width = (span.latency_ms / maxLatency) * 100;
                const offset = i > 0 
                  ? trace.spans.slice(0, i).reduce((sum, s) => sum + s.latency_ms, 0) / (trace.duration_ms) * 100 
                  : 0;
                
                return (
                  <div 
                    key={span.id} 
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                      selectedSpan === span.id ? 'bg-gray-800 ring-1 ring-orange-500/50' : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedSpan(span.id)}
                  >
                    <div className="w-20 text-xs text-gray-400 font-medium">{span.node_name}</div>
                    <div className="flex-1 relative h-8 bg-gray-800/50 rounded overflow-hidden">
                      <div 
                        className={`absolute top-1 bottom-1 rounded ${nodeColors[span.node_type] || 'bg-gray-500'} ${
                          span.status === 'failed' ? 'opacity-100 ring-2 ring-red-500/50' : 'opacity-80'
                        }`}
                        style={{ left: `${offset}%`, width: `${Math.max(width, 5)}%` }}
                      />
                      {span.status === 'failed' && (
                        <XCircle className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" style={{ left: `${offset + width/2}%` }} />
                      )}
                    </div>
                    <div className="w-16 text-xs text-gray-400 text-right">{(span.latency_ms / 1000).toFixed(2)}s</div>
                  </div>
                );
              })}
            </div>
            {/* Timeline bar */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>0ms</span>
              <span>{(trace.duration_ms / 4).toFixed(0)}ms</span>
              <span>{(trace.duration_ms / 2).toFixed(0)}ms</span>
              <span>{(trace.duration_ms * 3 / 4).toFixed(0)}ms</span>
              <span>{trace.duration_ms.toFixed(0)}ms</span>
            </div>
          </div>

          {/* Span Details */}
          {selectedSpanData && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${nodeColors[selectedSpanData.node_type]}`} />
                  <h3 className="text-white font-semibold">{selectedSpanData.node_name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    selectedSpanData.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {selectedSpanData.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{selectedSpanData.latency_ms}ms</span>
                  <span>{selectedSpanData.tokens_in}→{selectedSpanData.tokens_out} tokens</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-gray-800 rounded-lg p-1">
                {(['input', 'output', 'metadata'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                {activeTab === 'input' && (
                  <pre className="text-blue-300 whitespace-pre-wrap">{selectedSpanData.input}</pre>
                )}
                {activeTab === 'output' && (
                  <pre className="text-green-300 whitespace-pre-wrap">
                    {selectedSpanData.error || selectedSpanData.output || 'No output'}
                  </pre>
                )}
                {activeTab === 'metadata' && (
                  <div className="space-y-2 text-gray-300">
                    {Object.entries(selectedSpanData.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-orange-300">{String(value)}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">span_id:</span>
                      <span className="text-orange-300">{selectedSpanData.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">error:</span>
                      <span className="text-red-400">{selectedSpanData.error || 'null'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Recommendations & Info */}
        <div className="space-y-6">
          {/* Trace Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Trace Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Pipeline</span>
                <span className="text-gray-200">{trace.pipeline_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User</span>
                <span className="text-gray-200">{trace.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Started</span>
                <span className="text-gray-200">{new Date(trace.start_time).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-gray-200">{(trace.duration_ms / 1000).toFixed(2)}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Spans</span>
                <span className="text-gray-200">{trace.spans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens In</span>
                <span className="text-blue-400">{trace.tokens_in}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens Out</span>
                <span className="text-purple-400">{trace.tokens_out}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {rootCause && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                {rootCause.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/root-cause')}
                className="mt-4 w-full bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg px-4 py-2 text-sm font-medium hover:bg-orange-500/20 transition-colors"
              >
                View Full Analysis →
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Trace ID
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export as JSON
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Add Feedback
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
                <Code className="w-4 h-4" />
                Replay Trace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
