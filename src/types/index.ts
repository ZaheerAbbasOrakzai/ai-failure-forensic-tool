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
  industry?: string;
  cost_usd?: string;
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

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'warning' | 'info';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  pipeline: string;
  industry: string;
  started_at: string;
  updated_at: string;
  assignee: string;
  affected_traces: number;
  description: string;
  timeline: { time: string; event: string; author: string }[];
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  last_sync: string | null;
  config: Record<string, any>;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'reviewer' | 'viewer';
  avatar: string;
  joined: string;
}

export interface RootCauseResult {
  root_cause: string;
  confidence: number;
  evidence: string;
  recommendations: string[];
  affected_node: string;
}
