import { Code, Copy, Check, BookOpen, Terminal, Package, Zap } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useState } from 'react';

const codeExamples = {
  python: `from failure_forensics import trace, instrument

# Initialize the SDK
instrument(
    api_key="ff_prod_***",
    project="my-ai-pipeline",
    environment="production"
)

# Auto-trace LangChain pipelines
@trace(name="retrieve_context")
def retrieve_context(query: str):
    docs = vector_store.similarity_search(query, k=5)
    return docs

@trace(name="generate_answer") 
def generate_answer(context: str, query: str):
    prompt = f"Based on: {context}\\nAnswer: {query}"
    response = llm.invoke(prompt)
    return response

# Full pipeline with automatic tracing
@trace(name="rag_pipeline")
def rag_pipeline(query: str):
    context = retrieve_context(query)
    answer = generate_answer(context, query)
    return answer`,
  
  javascript: `import { trace, instrument } from '@failure-forensics/sdk';

// Initialize the SDK
instrument({
  apiKey: 'ff_prod_***',
  project: 'my-ai-pipeline',
  environment: 'production'
});

// Auto-trace LangChain.js pipelines
const retrieveContext = trace({ name: 'retrieve_context' }, 
  async (query) => {
    const docs = await vectorStore.similaritySearch(query, { k: 5 });
    return docs;
  }
);

const generateAnswer = trace({ name: 'generate_answer' },
  async (context, query) => {
    const prompt = \`Based on: \${context}\\nAnswer: \${query}\`;
    const response = await llm.invoke(prompt);
    return response;
  }
);

// Full pipeline
const ragPipeline = trace({ name: 'rag_pipeline' },
  async (query) => {
    const context = await retrieveContext(query);
    const answer = await generateAnswer(context, query);
    return answer;
  }
);`,

  typescript: `import { trace, instrument, type Span } from '@failure-forensics/sdk';

interface PipelineConfig {
  model: string;
  temperature: number;
  topK: number;
}

// Initialize with type-safe config
instrument({
  apiKey: process.env.FF_API_KEY!,
  project: 'my-ai-pipeline',
  environment: 'production',
  sampling: { rate: 1.0 } // Trace 100% of requests
});

// Type-safe traced functions
const retrieveContext = trace<{ query: string }, Document[]>(
  { 
    name: 'retrieve_context',
    metadata: { component: 'retriever' }
  },
  async ({ query }): Promise<Document[]> => {
    const docs = await vectorStore.similaritySearch(query, { k: 5 });
    return docs;
  }
);`
};

export default function SDKDocs() {
  const [activeTab, setActiveTab] = useState<'python' | 'javascript' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">SDK & Documentation</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Integrate Failure Forensics into your AI pipelines</p>
      </div>

      {/* Quick Start */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Quick Start</h2>
            <p className="text-xs text-zinc-500">Get up and running in under 5 minutes</p>
          </div>
        </div>

        {/* Installation */}
        <div className="mb-6">
          <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Install</p>
          <div className="flex items-center gap-2 p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-sm">
            <Terminal className="w-4 h-4 text-zinc-500" />
            <code className="text-zinc-300">pip install failure-forensics</code>
            <button 
              onClick={() => navigator.clipboard.writeText('pip install failure-forensics')}
              className="ml-auto p-1 hover:bg-zinc-800 rounded transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Code Example */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Example</p>
            <div className="flex items-center gap-2">
              {(['python', 'javascript', 'typescript'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    activeTab === lang 
                      ? 'bg-zinc-700 text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <pre className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed max-h-[400px] overflow-y-auto">
              {codeExamples[activeTab]}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
          </div>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <Code className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Auto-Instrumentation</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Zero-code tracing for LangChain, LlamaIndex, CrewAI, and AutoGen. Just add the decorator.
          </p>
        </Card>

        <Card className="p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Multi-Language SDK</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Python, TypeScript, Go, and Rust SDKs with full type safety and IDE autocomplete.
          </p>
        </Card>

        <Card className="p-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Low Overhead</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Async batch export with &lt;1ms overhead. Sampling controls for high-volume production.
          </p>
        </Card>
      </div>

      {/* API Reference */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-zinc-400" />
          <h2 className="text-base font-semibold text-white">API Reference</h2>
        </div>
        <div className="space-y-3">
          {[
            { method: 'POST', endpoint: '/api/v1/traces', description: 'Create a new trace' },
            { method: 'GET', endpoint: '/api/v1/traces/{trace_id}', description: 'Get trace details' },
            { method: 'GET', endpoint: '/api/v1/traces/search', description: 'Search traces with filters' },
            { method: 'POST', endpoint: '/api/v1/feedback', description: 'Submit human feedback' },
            { method: 'POST', endpoint: '/api/v1/root-cause', description: 'Run root cause analysis' },
            { method: 'POST', endpoint: '/api/v1/eval/promote', description: 'Promote trace to eval dataset' },
          ].map(api => (
            <div key={api.endpoint} className="flex items-center gap-4 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50">
              <Badge variant={api.method === 'POST' ? 'info' : 'success'}>
                {api.method}
              </Badge>
              <code className="text-xs text-zinc-300 font-mono flex-1">{api.endpoint}</code>
              <span className="text-xs text-zinc-500">{api.description}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
