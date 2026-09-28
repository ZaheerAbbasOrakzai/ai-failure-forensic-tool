import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Zap, AlertTriangle, XCircle, CheckCircle2,
  ChevronRight, Copy, Download, Play, MessageSquare, Target
} from 'lucide-react';
import { mockTraces, mockRootCauseResults } from '../data/mockData';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';

export default function TraceDetail() {
  const { traceId } = useParams();
  const navigate = useNavigate();
  const [selectedSpan, setSelectedSpan] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'metadata'>('output');

  const trace = mockTraces.find(t => t.id === traceId) || mockTraces[0];
  const maxLatency = Math.max(...trace.spans.map(s => s.latency_ms));
  const rootCause = trace.root_cause ? mockRootCauseResults[trace.root_cause as keyof typeof mockRootCauseResults] : null;
  const selectedSpanData = trace.spans.find(s => s.id === selectedSpan);

  const nodeColors: Record<string, { bar: string; bg: string; text: string }> = {
    retrieve: { bar: 'bg-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    rewrite: { bar: 'bg-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    generate: { bar: 'bg-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    verify: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    tool: { bar: 'bg-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    agent: { bar: 'bg-pink-500', bg: 'bg-pink-500/10', text: 'text-pink-400' },
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/traces')}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white font-mono tracking-tight">{trace.id}</h1>
            <Badge variant={trace.status === 'success' ? 'success' : trace.status === 'failed' ? 'danger' : 'warning'}>
              {trace.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : trace.status === 'failed' ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {trace.status}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{trace.pipeline_name} • {trace.user_id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{(trace.duration_ms / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-mono">{(trace.tokens_in + trace.tokens_out).toLocaleString()} tokens</span>
            </div>
          </div>
          <Button variant="ghost" size="sm"><Copy className="w-3.5 h-3.5" />Copy</Button>
          <Button variant="secondary" size="sm"><Download className="w-3.5 h-3.5" />Export</Button>
        </div>
      </div>

      {/* Root Cause Banner */}
      {rootCause && (
        <Card className="p-4 border-red-500/20 bg-red-500/[0.03]" glow="red">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-red-400">Root Cause: {rootCause.root_cause}</h3>
                <Badge variant="danger">{(rootCause.confidence * 100).toFixed(0)}% confidence</Badge>
              </div>
              <p className="text-sm text-zinc-400 mt-1.5">{rootCause.evidence}</p>
              <div className="flex items-center gap-4 mt-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/root-cause')}>
                  Full Analysis <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall & Span Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Waterfall */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white">Execution Waterfall</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Span timeline with latency breakdown</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                {Object.entries(nodeColors).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div className={cn('w-2 h-2 rounded-sm', val.bar)} />
                    <span>{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {trace.spans.map((span, i) => {
                const width = (span.latency_ms / maxLatency) * 100;
                const offset = i > 0 
                  ? trace.spans.slice(0, i).reduce((sum, s) => sum + s.latency_ms, 0) / trace.duration_ms * 100 
                  : 0;
                const colors = nodeColors[span.node_type] || nodeColors.retrieve;
                
                return (
                  <div 
                    key={span.id} 
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all',
                      selectedSpan === span.id ? 'bg-zinc-800/80 ring-1 ring-orange-500/30' : 'hover:bg-zinc-800/40'
                    )}
                    onClick={() => setSelectedSpan(span.id)}
                  >
                    <div className="w-20 flex-shrink-0">
                      <span className={cn('text-xs font-medium', colors.text)}>{span.node_name}</span>
                    </div>
                    <div className="flex-1 relative h-7 bg-zinc-800/40 rounded-md overflow-hidden">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {[25, 50, 75].map(p => (
                          <div key={p} className="absolute top-0 bottom-0 w-px bg-zinc-700/30" style={{ left: `${p}%` }} />
                        ))}
                      </div>
                      {/* Span bar */}
                      <div 
                        className={cn(
                          'absolute top-1 bottom-1 rounded-md transition-all',
                          colors.bar,
                          span.status === 'failed' ? 'opacity-100 ring-1 ring-red-500/50' : 'opacity-70'
                        )}
                        style={{ left: `${offset}%`, width: `${Math.max(width, 3)}%` }}
                      />
                      {span.status === 'failed' && (
                        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${offset + width/2}%` }}>
                          <XCircle className="w-3.5 h-3.5 text-red-400 -translate-x-1/2" />
                        </div>
                      )}
                    </div>
                    <div className="w-14 text-right flex-shrink-0">
                      <span className="text-[10px] font-mono text-zinc-500">{(span.latency_ms / 1000).toFixed(2)}s</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Timeline axis */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-600 font-mono px-[92px]">
              <span>0ms</span>
              <span>{Math.round(trace.duration_ms / 4)}ms</span>
              <span>{Math.round(trace.duration_ms / 2)}ms</span>
              <span>{Math.round(trace.duration_ms * 3 / 4)}ms</span>
              <span>{Math.round(trace.duration_ms)}ms</span>
            </div>
          </Card>

          {/* Span Details */}
          {selectedSpanData && (
            <Card className="p-5 animate-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('w-3 h-3 rounded-full', nodeColors[selectedSpanData.node_type]?.bar)} />
                  <h3 className="text-sm font-semibold text-white">{selectedSpanData.node_name}</h3>
                  <Badge variant={selectedSpanData.status === 'success' ? 'success' : 'danger'}>
                    {selectedSpanData.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
                  <span>{selectedSpanData.latency_ms}ms</span>
                  <span>{selectedSpanData.tokens_in}→{selectedSpanData.tokens_out} tok</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-3 p-0.5 bg-zinc-800/50 rounded-lg w-fit">
                {(['input', 'output', 'metadata'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                      activeTab === tab ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800/50 font-mono text-xs overflow-x-auto max-h-[250px] overflow-y-auto">
                {activeTab === 'input' && (
                  <pre className="text-blue-300/90 whitespace-pre-wrap leading-relaxed">{selectedSpanData.input}</pre>
                )}
                {activeTab === 'output' && (
                  <pre className={cn(
                    'whitespace-pre-wrap leading-relaxed',
                    selectedSpanData.error ? 'text-red-300/90' : 'text-emerald-300/90'
                  )}>
                    {selectedSpanData.error || selectedSpanData.output || 'No output'}
                  </pre>
                )}
                {activeTab === 'metadata' && (
                  <div className="space-y-2.5">
                    {Object.entries(selectedSpanData.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-zinc-500 w-24">{key}</span>
                        <span className="text-orange-300">{String(value)}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 w-24">span_id</span>
                      <span className="text-zinc-300 font-mono text-[10px]">{selectedSpanData.id}</span>
                    </div>
                    {selectedSpanData.error && (
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 w-24">error</span>
                        <span className="text-red-400">{selectedSpanData.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Trace Info */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Trace Information</h3>
            <div className="space-y-3">
              {[
                { label: 'Pipeline', value: trace.pipeline_name },
                { label: 'User', value: trace.user_id },
                { label: 'Started', value: new Date(trace.start_time).toLocaleTimeString() },
                { label: 'Duration', value: `${(trace.duration_ms / 1000).toFixed(2)}s` },
                { label: 'Spans', value: trace.spans.length.toString() },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{item.label}</span>
                  <span className="text-xs text-zinc-200 font-medium">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-zinc-800/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500">Tokens In</span>
                  <span className="text-xs text-blue-400 font-mono">{trace.tokens_in}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Tokens Out</span>
                  <span className="text-xs text-purple-400 font-mono">{trace.tokens_out}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          {rootCause && (
            <Card className="p-5" glow="orange">
              <h3 className="text-sm font-semibold text-white mb-3">Recommendations</h3>
              <div className="space-y-2.5">
                {rootCause.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-zinc-300 leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Actions</h3>
            <div className="space-y-1.5">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all">
                <Play className="w-3.5 h-3.5" />Replay Trace
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all">
                <MessageSquare className="w-3.5 h-3.5" />Add Feedback
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all">
                <Download className="w-3.5 h-3.5" />Export JSON
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
