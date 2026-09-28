import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, AlertTriangle, Lightbulb, ChevronRight, 
  ArrowRight, Shield, Zap, Database, Code, Brain,
  Sparkles, Activity
} from 'lucide-react';
import { mockTraces, mockRootCauseResults } from '../data/mockData';
import { Card, Badge, Button } from '../components/ui';
import { cn } from '../lib/utils';

const failureCategories = [
  { name: 'Retrieval', icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', percentage: 42 },
  { name: 'Generation', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', percentage: 28 },
  { name: 'Verification', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', percentage: 15 },
  { name: 'Tool Call', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', percentage: 10 },
  { name: 'Prompt', icon: Code, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', percentage: 5 },
];

export default function RootCauseAnalysis() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const failedTraces = mockTraces.filter(t => t.status === 'failed');

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Root Cause Analysis</h1>
          <p className="text-sm text-zinc-500 mt-0.5">AI-powered failure diagnosis with rule-based + LLM reasoning</p>
        </div>
        <Button 
          onClick={runAnalysis} 
          disabled={analyzing}
          className="shadow-lg shadow-orange-500/20"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      {/* Engine Status */}
      <Card className="p-5 relative overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-white">Forensics Engine v2.4</h3>
              <Badge variant="success">
                <Activity className="w-3 h-3" />
                Active
              </Badge>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Hybrid analysis combining deterministic rules with LLM-powered reasoning across {failedTraces.length} pending traces
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{failedTraces.length}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Pending</p>
          </div>
        </div>
      </Card>

      {/* Analysis Complete Banner */}
      {analysisComplete && (
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/[0.03] animate-in" glow="green">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-400">Analysis Complete</p>
              <p className="text-xs text-zinc-400 mt-0.5">Identified root causes for {failedTraces.length} failed traces with 91% average confidence</p>
            </div>
          </div>
        </Card>
      )}

      {/* Root Cause Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(mockRootCauseResults).map(([key, result], i) => (
          <Card key={key} className="p-5 hover-lift animate-in" >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  i === 0 ? 'bg-blue-500/10' : i === 1 ? 'bg-purple-500/10' : 'bg-emerald-500/10'
                )}>
                  {i === 0 ? <Database className="w-4 h-4 text-blue-400" /> : 
                   i === 1 ? <Brain className="w-4 h-4 text-purple-400" /> : 
                   <Shield className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="text-sm font-semibold text-white capitalize">{result.root_cause}</h3>
              </div>
              <Badge variant={result.confidence > 0.85 ? 'success' : result.confidence > 0.7 ? 'warning' : 'danger'}>
                {(result.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            
            {/* Confidence bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-4 overflow-hidden">
              <div 
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  result.confidence > 0.85 ? 'bg-emerald-500' : result.confidence > 0.7 ? 'bg-amber-500' : 'bg-red-500'
                )}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-4">{result.evidence}</p>

            <div className="space-y-2">
              <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Recommendations</p>
              {result.recommendations.slice(0, 3).map((rec, j) => (
                <div key={j} className="flex items-start gap-2">
                  <Lightbulb className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-zinc-300 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Failure Categories */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Failure Distribution</h3>
        <div className="grid grid-cols-5 gap-3">
          {failureCategories.map(cat => (
            <div 
              key={cat.name}
              className={cn(
                'p-4 rounded-xl border text-center hover-lift cursor-pointer transition-all',
                cat.bg, cat.border
              )}
            >
              <cat.icon className={cn('w-6 h-6 mx-auto mb-2', cat.color)} />
              <p className="text-xs font-medium text-zinc-300">{cat.name}</p>
              <p className="text-xl font-bold text-white mt-1">{cat.percentage}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Traces */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Failed Traces</h3>
          <Badge variant="outline">{failedTraces.length} traces</Badge>
        </div>
        <div className="space-y-2">
          {failedTraces.slice(0, 6).map(trace => (
            <div 
              key={trace.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer transition-all group"
              onClick={() => navigate(`/traces/${trace.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-xs font-mono text-zinc-300 group-hover:text-white transition-colors">{trace.id}</p>
                  <p className="text-[10px] text-zinc-500">{trace.pipeline_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {trace.root_cause && (
                  <Badge variant="danger">{trace.root_cause}</Badge>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
