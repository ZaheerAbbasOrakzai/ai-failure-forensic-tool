import { Trace, Span, Feedback, EvalRecord } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const pipelines = ['rag_pipeline', 'agent_workflow', 'multi_agent_crew', 'code_gen_pipeline', 'summarization_chain'];
const users = ['alice_eng', 'bob_ml', 'carol_pm', 'dave_qa', 'eve_sre'];
const rootCauses = ['retriever', 'generator', 'verifier', 'tool_call', 'prompt_engineering', 'context_window'];

function generateSpans(traceId: string, count: number, hasFailure: boolean): Span[] {
  const nodes = ['retrieve', 'rewrite', 'generate', 'verify'];
  const spans: Span[] = [];
  let baseTime = new Date('2025-01-15T10:00:00Z').getTime();

  nodes.slice(0, count).forEach((node, i) => {
    const isFailed = hasFailure && i === Math.floor(count * 0.3);
    const latency = isFailed ? 500 + Math.random() * 2000 : 100 + Math.random() * 800;
    
    spans.push({
      id: generateId(),
      trace_id: traceId,
      parent_span_id: i > 0 ? spans[i - 1].id : null,
      node_name: node,
      node_type: node as Span['node_type'],
      input: node === 'retrieve' ? '{"query": "What is quantum computing?"}' :
             node === 'rewrite' ? '{"context": "Retrieved 5 documents..."}' :
             node === 'generate' ? '{"prompt": "Based on the context, answer..."}' :
             '{"answer": "Quantum computing uses qubits..."}',
      output: isFailed ? '' : 
             node === 'retrieve' ? '{"documents": 5, "relevance": 0.82}' :
             node === 'rewrite' ? '{"rewritten_query": "quantum computing principles"}' :
             node === 'generate' ? '{"answer": "Quantum computing leverages quantum mechanics..."}' :
             '{"verified": true, "confidence": 0.95}',
      latency_ms: Math.round(latency),
      tokens_in: Math.round(50 + Math.random() * 500),
      tokens_out: Math.round(20 + Math.random() * 300),
      status: isFailed ? 'failed' : 'success',
      error: isFailed ? 'Retrieval returned irrelevant documents. Relevance score below threshold.' : null,
      start_time: new Date(baseTime).toISOString(),
      metadata: {
        model: node === 'generate' ? 'gpt-4-turbo' : node === 'retrieve' ? 'text-embedding-3' : 'none',
        temperature: node === 'generate' ? 0.7 : 0,
        top_k: node === 'retrieve' ? 5 : undefined,
      }
    });
    baseTime += latency;
  });

  return spans;
}

export const mockTraces: Trace[] = Array.from({ length: 50 }, (_, i) => {
  const id = generateId();
  const hasFailure = Math.random() > 0.65;
  const spanCount = 3 + Math.floor(Math.random() * 2);
  const spans = generateSpans(id, spanCount, hasFailure);
  const totalLatency = spans.reduce((sum, s) => sum + s.latency_ms, 0);
  const failedSpan = spans.find(s => s.status === 'failed');

  return {
    id,
    pipeline_name: pipelines[i % pipelines.length],
    user_id: users[i % users.length],
    status: hasFailure ? 'failed' : Math.random() > 0.9 ? 'partial' : 'success',
    start_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 + totalLatency).toISOString(),
    duration_ms: totalLatency,
    final_output: hasFailure ? '' : 'Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to process information.',
    root_cause: hasFailure ? rootCauses[Math.floor(Math.random() * rootCauses.length)] : undefined,
    root_cause_confidence: hasFailure ? 0.7 + Math.random() * 0.25 : undefined,
    tokens_in: spans.reduce((sum, s) => sum + s.tokens_in, 0),
    tokens_out: spans.reduce((sum, s) => sum + s.tokens_out, 0),
    spans,
  };
});

export const mockFeedback: Feedback[] = [
  { id: generateId(), trace_id: mockTraces[2].id, reviewer: 'alice_eng', label: 'bad', comment: 'Retriever returned outdated documentation from 2019', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[5].id, reviewer: 'bob_ml', label: 'needs_review', comment: 'Generation seems plausible but needs fact-checking', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[8].id, reviewer: 'carol_pm', label: 'good', comment: 'Output is accurate and well-structured', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[12].id, reviewer: 'dave_qa', label: 'bad', comment: 'Hallucinated API endpoint that does not exist', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[15].id, reviewer: 'eve_sre', label: 'needs_review', comment: 'Tool call timed out but eventually succeeded', created_at: new Date().toISOString() },
];

export const mockEvalRecords: EvalRecord[] = [
  { id: generateId(), trace_id: mockTraces[2].id, input: 'What is the latest API version?', expected: 'v3.2 (released Jan 2025)', actual: 'v2.1 (released Mar 2019)', failure_type: 'retrieval', status: 'pending', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[5].id, input: 'Explain quantum entanglement', expected: 'Quantum entanglement is a phenomenon where particles become correlated...', actual: 'Quantum entanglement allows faster-than-light communication...', failure_type: 'generation', status: 'pending', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[12].id, input: 'List available API endpoints', expected: '/api/v3/users, /api/v3/data, /api/v3/auth', actual: '/api/v3/users, /api/v3/delete-all, /api/v3/admin-override', failure_type: 'generation', status: 'approved', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[18].id, input: 'Calculate the total cost', expected: '$1,247.50', actual: '$1,247.50', failure_type: 'verification', status: 'discarded', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[22].id, input: 'What tools are available?', expected: 'search, calculator, code_executor', actual: 'Tool call failed with timeout error', failure_type: 'tool', status: 'pending', created_at: new Date().toISOString() },
];

export const mockRootCauseResults = {
  retriever: {
    root_cause: 'retriever',
    confidence: 0.91,
    evidence: 'Retrieved documents had low relevance scores (avg 0.34). Top-5 results were from 2019, predating the question about 2025 API versions.',
    recommendations: [
      'Increase retrieval relevance threshold from 0.3 to 0.6',
      'Add temporal filtering to exclude outdated documents',
      'Update embedding model to improve semantic matching',
      'Increase top-k from 5 to 10 for broader context',
    ],
    affected_node: 'retrieve',
  },
  generator: {
    root_cause: 'generator',
    confidence: 0.87,
    evidence: 'LLM hallucinated information not present in retrieved context. Generated API endpoints that do not exist in the documentation.',
    recommendations: [
      'Add stricter grounding instructions to the prompt',
      'Implement citation requirements in generation',
      'Lower temperature from 0.7 to 0.3 for factual queries',
      'Add post-generation fact-checking step',
    ],
    affected_node: 'generate',
  },
  verifier: {
    root_cause: 'verifier',
    confidence: 0.78,
    evidence: 'Verification step passed despite incorrect output. The verifier model failed to catch the hallucinated content.',
    recommendations: [
      'Strengthen verification prompts with explicit error patterns',
      'Add cross-reference checking against source documents',
      'Implement multi-pass verification for critical outputs',
    ],
    affected_node: 'verify',
  },
};

export const dailyTraceData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  traces: 30 + Math.floor(Math.random() * 40),
  failures: Math.floor(Math.random() * 12),
  latency: 1.2 + Math.random() * 1.5,
}));

export const failureBreakdown = [
  { name: 'Retrieval', value: 42, color: '#f97316' },
  { name: 'Generation', value: 28, color: '#ef4444' },
  { name: 'Verification', value: 15, color: '#eab308' },
  { name: 'Tool Call', value: 10, color: '#8b5cf6' },
  { name: 'Prompt', value: 5, color: '#06b6d4' },
];

export const pipelineComparison = [
  { name: 'RAG Pipeline', success_rate: 89, avg_latency: 1.8, failure_rate: 11, traces: 450 },
  { name: 'Agent Workflow', success_rate: 76, avg_latency: 3.2, failure_rate: 24, traces: 320 },
  { name: 'Multi-Agent Crew', success_rate: 82, avg_latency: 4.5, failure_rate: 18, traces: 280 },
  { name: 'Code Gen', success_rate: 91, avg_latency: 2.1, failure_rate: 9, traces: 220 },
  { name: 'Summarization', success_rate: 94, avg_latency: 1.2, failure_rate: 6, traces: 180 },
];

export const heatmapData = Array.from({ length: 7 }, (_, day) => 
  Array.from({ length: 24 }, (_, hour) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    hour: `${hour}:00`,
    failures: Math.floor(Math.random() * (hour >= 9 && hour <= 17 ? 15 : 5)),
  }))
).flat();
