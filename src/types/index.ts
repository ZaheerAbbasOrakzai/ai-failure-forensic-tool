export interface Trace {
  id: string;
  pipeline_name: string;
  user_id: string;
  status: 'success' | 'failed' | 'partial';
  start_time: string;
  end_time: string;
  duration_ms: number;
  final_output: string;
  root_cause?: string;
  root_cause_confidence?: number;
  tokens_in: number;
  tokens_out: number;
  spans: Span[];
}

export interface Span {
  id: string;
  trace_id: string;
  parent_span_id: string | null;
  node_name: string;
  node_type: 'retrieve' | 'generate' | 'verify' | 'tool' | 'rewrite' | 'agent';
  input: string;
  output: string;
  latency_ms: number;
  tokens_in: number;
  tokens_out: number;
  status: 'success' | 'failed' | 'timeout';
  error: string | null;
  start_time: string;
  metadata: Record<string, any>;
}

export interface Feedback {
  id: string;
  trace_id: string;
  reviewer: string;
  label: 'good' | 'bad' | 'needs_review';
  comment: string;
  created_at: string;
}

export interface EvalRecord {
  id: string;
  trace_id: string;
  input: string;
  expected: string;
  actual: string;
  failure_type: 'retrieval' | 'prompt' | 'generation' | 'verification' | 'tool';
  status: 'pending' | 'approved' | 'discarded';
  created_at: string;
}

export interface RootCauseResult {
  root_cause: string;
  confidence: number;
  evidence: string;
  recommendations: string[];
  affected_node: string;
}

export interface DashboardMetrics {
  total_traces: number;
  successful: number;
  failed: number;
  failure_rate: number;
  avg_latency: number;
  total_tokens: number;
}
