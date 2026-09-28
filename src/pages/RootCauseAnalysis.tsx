import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, AlertTriangle, Lightbulb, ChevronRight, 
  ArrowRight, Shield, Zap, Database, Code, Brain
} from 'lucide-react';
import { mockTraces, mockRootCauseResults } from '../data/mockData';

const failureCategories = [
  { 
    name: 'Retrieval Failures', 
    icon: Database, 
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    items: ['Wrong document retrieved', 'Missing context', 'Outdated context', 'Low relevance scores'],
    percentage: 42
  },
  { 
    name: 'Generation Failures', 
    icon: Brain, 
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    items: ['Hallucinations', 'Reasoning errors', 'Format violations', 'Off-topic responses'],
    percentage: 28
  },
  { 
    name: 'Verification Failures', 
    icon: Shield, 
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
    items: ['Missed incorrect outputs', 'False positives', 'Incomplete checks'],
    percentage: 15
  },
  { 
    name: 'Tool Failures', 
    icon: Zap, 
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    items: ['API errors', 'Timeouts', 'Bad outputs', 'Rate limiting'],
    percentage: 10
  },
  { 
    name: 'Prompt Failures', 
    icon: Code, 
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    items: ['Ambiguous instructions', 'Missing context', 'Incorrect formatting'],
    percentage: 5
  },
];

export default function RootCauseAnalysis() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const failedTraces = mockTraces.filter(t => t.status === 'failed');

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Root Cause Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">AI-powered failure diagnosis and recommendations</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={analyzing}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Run Analysis
            </>
          )}
        </button>
      </div>

      {/* Analysis Engine Status */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Root Cause Engine</h3>
            <p className="text-gray-400 text-sm">Combines rule-based analysis + LLM reasoning to identify failure origins</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Active</span>
          </div>
        </div>
      </div>

      {/* Recent Root Cause Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(mockRootCauseResults).map(([key, result]) => (
          <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold capitalize">{result.root_cause}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                result.confidence > 0.85 ? 'bg-green-500/10 text-green-400' :
                result.confidence > 0.7 ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {(result.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            
            {/* Confidence bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  result.confidence > 0.85 ? 'bg-green-500' :
                  result.confidence > 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

            <p className="text-gray-400 text-sm mb-4">{result.evidence}</p>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Recommendations</p>
              {result.recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Lightbulb className="w-3 h-3 text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-xs">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Failure Categories */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Failure Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {failureCategories.map(category => (
            <div 
              key={category.name}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedCategory === category.name 
                  ? 'border-orange-500/50 bg-orange-500/5' 
                  : 'border-gray-800 hover:border-gray-700 bg-gray-800/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${category.color}`}>
                <category.icon className="w-5 h-5" />
              </div>
              <h4 className="text-white text-sm font-medium">{category.name}</h4>
              <p className="text-2xl font-bold text-white mt-1">{category.percentage}%</p>
              <p className="text-gray-500 text-xs mt-1">of all failures</p>
              
              {selectedCategory === category.name && (
                <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                  {category.items.map(item => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <ChevronRight className="w-3 h-3 text-orange-400" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Failed Traces for Analysis */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Failed Traces Pending Analysis</h3>
          <span className="text-gray-400 text-sm">{failedTraces.length} traces</span>
        </div>
        <div className="space-y-2">
          {failedTraces.slice(0, 8).map(trace => (
            <div 
              key={trace.id} 
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 cursor-pointer transition-colors"
              onClick={() => navigate(`/traces/${trace.id}`)}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-white text-sm font-mono">{trace.id}</p>
                  <p className="text-gray-500 text-xs">{trace.pipeline_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {trace.root_cause && (
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded text-xs">
                    {trace.root_cause}
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
