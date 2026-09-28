import { Trace, Span, Feedback, EvalRecord, Incident, Integration, TeamMember } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Industry-specific pipelines
export const industries = {
  healthcare: {
    name: 'Healthcare',
    pipelines: [
      { name: 'medical_diagnosis_assistant', description: 'AI-assisted diagnostic support', sla: '99.9%' },
      { name: 'patient_triage_rag', description: 'Patient symptom analysis & routing', sla: '99.5%' },
      { name: 'medical_record_summarizer', description: 'EHR document summarization', sla: '99.0%' },
    ]
  },
  finance: {
    name: 'Financial Services',
    pipelines: [
      { name: 'fraud_detection_agent', description: 'Real-time transaction monitoring', sla: '99.99%' },
      { name: 'compliance_document_analyzer', description: 'Regulatory document processing', sla: '99.5%' },
      { name: 'investment_research_rag', description: 'Market analysis & recommendations', sla: '99.0%' },
    ]
  },
  legal: {
    name: 'Legal Tech',
    pipelines: [
      { name: 'contract_review_agent', description: 'Automated contract analysis', sla: '99.5%' },
      { name: 'case_research_rag', description: 'Legal precedent retrieval', sla: '99.0%' },
      { name: 'document_drafting_assistant', description: 'Legal document generation', sla: '98.5%' },
    ]
  },
  ecommerce: {
    name: 'E-Commerce',
    pipelines: [
      { name: 'product_recommendation_engine', description: 'Personalized product suggestions', sla: '99.5%' },
      { name: 'customer_support_agent', description: 'Automated customer service', sla: '99.0%' },
      { name: 'review_sentiment_analyzer', description: 'Product review analysis', sla: '98.5%' },
    ]
  },
  saas: {
    name: 'SaaS / Tech',
    pipelines: [
      { name: 'code_review_assistant', description: 'Automated code review', sla: '99.0%' },
      { name: 'documentation_generator', description: 'API docs generation', sla: '98.5%' },
      { name: 'bug_triage_agent', description: 'Issue classification & routing', sla: '99.0%' },
    ]
  }
};

// Real-world failure scenarios
export const failureScenarios = {
  retrieval: [
    { error: 'Vector similarity search returned documents with cosine similarity < 0.3', root_cause: 'Embedding model degradation', confidence: 0.94 },
    { error: 'Retrieved context from 2019, predating question about 2024 API changes', root_cause: 'Missing temporal filtering', confidence: 0.91 },
    { error: 'Top-k retrieval returned 0 relevant documents despite query relevance', root_cause: 'Index corruption', confidence: 0.87 },
  ],
  generation: [
    { error: 'LLM hallucinated API endpoint /api/v3/admin-override that does not exist', root_cause: 'Insufficient grounding', confidence: 0.89 },
    { error: 'Generated response contradicts retrieved context documents', root_cause: 'Context window overflow', confidence: 0.85 },
    { error: 'Output format violates JSON schema validation', root_cause: 'Prompt formatting issue', confidence: 0.92 },
  ],
  verification: [
    { error: 'Verification step passed despite factual inaccuracy in output', root_cause: 'Weak verification prompt', confidence: 0.78 },
    { error: 'Cross-reference check failed to detect contradictory statements', root_cause: 'Verification model limitation', confidence: 0.75 },
  ],
  tool: [
    { error: 'External API call to payment processor timed out after 30s', root_cause: 'Third-party service degradation', confidence: 0.96 },
    { error: 'Database query returned connection pool exhausted error', root_cause: 'Resource exhaustion', confidence: 0.93 },
    { error: 'Rate limit exceeded: 429 Too Many Requests from OpenAI API', root_cause: 'Rate limiting', confidence: 0.98 },
  ],
  prompt: [
    { error: 'Ambiguous instructions led to inconsistent output formats', root_cause: 'Prompt engineering gap', confidence: 0.82 },
    { error: 'Missing few-shot examples caused output drift', root_cause: 'Insufficient prompt context', confidence: 0.80 },
  ]
};

// Realistic trace generation
function generateSpans(traceId: string, pipelineType: string, hasFailure: boolean): Span[] {
  const pipelineConfigs: Record<string, string[]> = {
    medical: ['retrieve_patient_history', 'analyze_symptoms', 'generate_diagnosis', 'verify_clinical_accuracy'],
    finance: ['retrieve_transactions', 'detect_patterns', 'assess_risk', 'generate_alert'],
    legal: ['retrieve_precedents', 'analyze_contract', 'extract_clauses', 'generate_summary'],
    ecommerce: ['retrieve_products', 'analyze_preferences', 'generate_recommendations', 'rank_results'],
    saas: ['retrieve_codebase', 'analyze_patterns', 'generate_review', 'suggest_improvements'],
  };

  const nodes = pipelineConfigs[pipelineType] || pipelineConfigs.saas;
  const spans: Span[] = [];
  let baseTime = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000;

  nodes.forEach((node, i) => {
    const isFailed = hasFailure && i === Math.floor(nodes.length * 0.4);
    const baseLatency = node.includes('retrieve') ? 200 : node.includes('generate') ? 800 : 400;
    const latency = isFailed ? baseLatency * 3 + Math.random() * 2000 : baseLatency + Math.random() * baseLatency;
    
    const failureScenario = isFailed ? failureScenarios[
      node.includes('retrieve') ? 'retrieval' : 
      node.includes('generate') ? 'generation' : 
      node.includes('verify') ? 'verification' : 'tool'
    ][Math.floor(Math.random() * 3)] : null;

    spans.push({
      id: generateUUID(),
      trace_id: traceId,
      parent_span_id: i > 0 ? spans[i - 1].id : null,
      node_name: node,
      node_type: node.includes('retrieve') ? 'retrieve' : node.includes('generate') ? 'generate' : node.includes('verify') ? 'verify' : 'tool',
      input: JSON.stringify({
        query: node.includes('retrieve') ? 'User input with context' : 'Processed data from previous step',
        parameters: { temperature: 0.7, max_tokens: 2000, top_p: 0.9 }
      }, null, 2),
      output: isFailed ? '' : JSON.stringify({
        result: 'Processed output',
        confidence: 0.85 + Math.random() * 0.14,
        tokens_used: Math.floor(100 + Math.random() * 500)
      }, null, 2),
      latency_ms: Math.round(latency),
      tokens_in: Math.round(100 + Math.random() * 800),
      tokens_out: Math.round(50 + Math.random() * 400),
      status: isFailed ? 'failed' : 'success',
      error: failureScenario?.error || null,
      start_time: new Date(baseTime).toISOString(),
      metadata: {
        model: node.includes('generate') ? 'gpt-4-turbo-2024-04-09' : node.includes('retrieve') ? 'text-embedding-3-large' : 'claude-3-opus-20240229',
        provider: node.includes('generate') ? 'openai' : node.includes('retrieve') ? 'openai' : 'anthropic',
        region: 'us-east-1',
        environment: 'production',
        version: '2.4.1',
      }
    });
    baseTime += latency;
  });

  return spans;
}

// Generate realistic traces
export const mockTraces: Trace[] = Array.from({ length: 100 }, (_, i) => {
  const industryKeys = Object.keys(industries);
  const industryKey = industryKeys[i % industryKeys.length];
  const industry = industries[industryKey as keyof typeof industries];
  const pipeline = industry.pipelines[i % industry.pipelines.length];
  
  const id = generateUUID();
  const hasFailure = Math.random() > 0.7;
  const pipelineType = industryKey === 'healthcare' ? 'medical' : industryKey;
  const spans = generateSpans(id, pipelineType, hasFailure);
  const totalLatency = spans.reduce((sum, s) => sum + s.latency_ms, 0);
  
  const failedSpan = spans.find(s => s.status === 'failed');
  const failureScenario = failedSpan ? failureScenarios[
    failedSpan.node_name.includes('retrieve') ? 'retrieval' : 
    failedSpan.node_name.includes('generate') ? 'generation' : 
    failedSpan.node_name.includes('verify') ? 'verification' : 'tool'
  ][0] : null;

  return {
    id,
    pipeline_name: pipeline.name,
    user_id: `user_${Math.floor(Math.random() * 10000)}`,
    status: hasFailure ? 'failed' : Math.random() > 0.95 ? 'partial' : 'success',
    start_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 + totalLatency).toISOString(),
    duration_ms: totalLatency,
    final_output: hasFailure ? '' : 'Successfully processed request with high confidence',
    root_cause: failureScenario?.root_cause,
    root_cause_confidence: failureScenario?.confidence,
    tokens_in: spans.reduce((sum, s) => sum + s.tokens_in, 0),
    tokens_out: spans.reduce((sum, s) => sum + s.tokens_out, 0),
    spans,
    industry: industryKey,
    cost_usd: (spans.reduce((sum, s) => sum + s.tokens_in + s.tokens_out, 0) * 0.00003).toFixed(4),
  };
});

// Team members
export const mockTeam: TeamMember[] = [
  { id: generateId(), name: 'Alice Chen', email: 'alice@company.com', role: 'admin', avatar: 'AC', joined: '2024-01-15' },
  { id: generateId(), name: 'Bob Martinez', email: 'bob@company.com', role: 'engineer', avatar: 'BM', joined: '2024-02-20' },
  { id: generateId(), name: 'Carol Johnson', email: 'carol@company.com', role: 'engineer', avatar: 'CJ', joined: '2024-03-10' },
  { id: generateId(), name: 'Dave Kim', email: 'dave@company.com', role: 'reviewer', avatar: 'DK', joined: '2024-04-05' },
  { id: generateId(), name: 'Eve Williams', email: 'eve@company.com', role: 'viewer', avatar: 'EW', joined: '2024-05-12' },
];

// Integrations
export const mockIntegrations: Integration[] = [
  { id: generateId(), name: 'OpenAI', category: 'LLM Provider', status: 'connected', icon: 'openai', last_sync: new Date().toISOString(), config: { api_key: '***sk-...4f2a', model: 'gpt-4-turbo' } },
  { id: generateId(), name: 'Anthropic', category: 'LLM Provider', status: 'connected', icon: 'anthropic', last_sync: new Date().toISOString(), config: { api_key: '***sk-ant-...8b3c', model: 'claude-3-opus' } },
  { id: generateId(), name: 'AWS Bedrock', category: 'Cloud Provider', status: 'connected', icon: 'aws', last_sync: new Date().toISOString(), config: { region: 'us-east-1', access_key: '***AKIA...9x2m' } },
  { id: generateId(), name: 'Pinecone', category: 'Vector Database', status: 'connected', icon: 'pinecone', last_sync: new Date().toISOString(), config: { index: 'production-embeddings', dimension: 1536 } },
  { id: generateId(), name: 'LangChain', category: 'Framework', status: 'connected', icon: 'langchain', last_sync: new Date().toISOString(), config: { version: '0.1.0', tracing: true } },
  { id: generateId(), name: 'Slack', category: 'Notifications', status: 'connected', icon: 'slack', last_sync: new Date().toISOString(), config: { channel: '#ai-alerts', webhook: '***hooks.slack.com/...x9k2' } },
  { id: generateId(), name: 'Datadog', category: 'Monitoring', status: 'disconnected', icon: 'datadog', last_sync: null, config: {} },
  { id: generateId(), name: 'PostgreSQL', category: 'Database', status: 'connected', icon: 'postgres', last_sync: new Date().toISOString(), config: { host: 'db.company.com', database: 'forensics_prod' } },
];

// Incidents
export const mockIncidents: Incident[] = [
  {
    id: generateId(),
    title: 'Elevated failure rate in fraud detection pipeline',
    severity: 'critical',
    status: 'investigating',
    pipeline: 'fraud_detection_agent',
    industry: 'finance',
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    assignee: 'alice@company.com',
    affected_traces: 47,
    description: 'Fraud detection pipeline showing 23% failure rate (normal: 2%). Root cause appears to be retrieval failures due to vector index corruption.',
    timeline: [
      { time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), event: 'Incident detected by monitoring system', author: 'system' },
      { time: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), event: 'Alice Chen assigned to investigate', author: 'bob@company.com' },
      { time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), event: 'Identified vector index corruption in Pinecone', author: 'alice@company.com' },
      { time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), event: 'Initiating index rebuild procedure', author: 'alice@company.com' },
    ]
  },
  {
    id: generateId(),
    title: 'Increased latency in customer support agent',
    severity: 'warning',
    status: 'monitoring',
    pipeline: 'customer_support_agent',
    industry: 'ecommerce',
    started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    assignee: 'bob@company.com',
    affected_traces: 156,
    description: 'P95 latency increased from 2.1s to 4.8s. Investigation shows OpenAI API response times degraded.',
    timeline: [
      { time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), event: 'Latency alert triggered', author: 'system' },
      { time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), event: 'Bob Martinez investigating', author: 'alice@company.com' },
      { time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), event: 'Confirmed OpenAI API degradation', author: 'bob@company.com' },
    ]
  },
  {
    id: generateId(),
    title: 'Medical diagnosis assistant output quality degradation',
    severity: 'high',
    status: 'resolved',
    pipeline: 'medical_diagnosis_assistant',
    industry: 'healthcare',
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    assignee: 'carol@company.com',
    affected_traces: 23,
    description: 'Diagnosis suggestions showing lower clinical accuracy. Root cause: outdated medical knowledge base.',
    timeline: [
      { time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), event: 'Quality alert from human review', author: 'system' },
      { time: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), event: 'Carol Johnson investigating', author: 'alice@company.com' },
      { time: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), event: 'Identified outdated knowledge base', author: 'carol@company.com' },
      { time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), event: 'Knowledge base updated, incident resolved', author: 'carol@company.com' },
    ]
  },
];

// Feedback
export const mockFeedback: Feedback[] = [
  { id: generateId(), trace_id: mockTraces[5].id, reviewer: 'alice@company.com', label: 'bad', comment: 'Retrieved medical guidelines from 2018, missing 2024 updates', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[12].id, reviewer: 'bob@company.com', label: 'needs_review', comment: 'Fraud detection logic seems correct but confidence score unusually low', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[18].id, reviewer: 'carol@company.com', label: 'good', comment: 'Accurate contract clause extraction', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[25].id, reviewer: 'dave@company.com', label: 'bad', comment: 'Hallucinated case law citation', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[32].id, reviewer: 'eve@company.com', label: 'needs_review', comment: 'Product recommendation relevant but ranking seems off', created_at: new Date().toISOString() },
];

// Eval records
export const mockEvalRecords: EvalRecord[] = [
  { id: generateId(), trace_id: mockTraces[5].id, input: 'What are the latest treatment guidelines for Type 2 Diabetes?', expected: 'Reference ADA 2024 Standards of Care', actual: 'Reference ADA 2018 guidelines (outdated)', failure_type: 'retrieval', status: 'pending', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[12].id, input: 'Analyze transaction #TXN-98234 for fraud indicators', expected: 'High-risk: unusual geographic location, amount 3x normal', actual: 'Low-risk: no indicators detected', failure_type: 'generation', status: 'pending', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[25].id, input: 'Find precedents for non-compete clause enforcement in California', expected: 'Edwards v. Arthur Andersen (2008), valid precedents', actual: 'Cited "Smith v. Jones (2015)" - does not exist', failure_type: 'generation', status: 'approved', created_at: new Date().toISOString() },
  { id: generateId(), trace_id: mockTraces[38].id, input: 'Recommend products for customer interested in hiking gear', expected: 'Hiking boots, backpack, trekking poles', actual: 'Running shoes, gym bag, yoga mat', failure_type: 'retrieval', status: 'discarded', created_at: new Date().toISOString() },
];

// Daily metrics
export const dailyTraceData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  traces: 150 + Math.floor(Math.random() * 200),
  failures: Math.floor(Math.random() * 25),
  latency: 1.5 + Math.random() * 2.0,
  cost: 15 + Math.random() * 35,
}));

export const failureBreakdown = [
  { name: 'Retrieval', value: 38, color: '#3b82f6' },
  { name: 'Generation', value: 32, color: '#8b5cf6' },
  { name: 'Tool Call', value: 18, color: '#f97316' },
  { name: 'Verification', value: 8, color: '#10b981' },
  { name: 'Prompt', value: 4, color: '#06b6d4' },
];

export const pipelineComparison = [
  { name: 'Medical Diagnosis', success_rate: 94, avg_latency: 2.1, failure_rate: 6, traces: 1240, industry: 'healthcare' },
  { name: 'Fraud Detection', success_rate: 77, avg_latency: 1.8, failure_rate: 23, traces: 3420, industry: 'finance' },
  { name: 'Contract Review', success_rate: 89, avg_latency: 3.2, failure_rate: 11, traces: 890, industry: 'legal' },
  { name: 'Customer Support', success_rate: 91, avg_latency: 2.4, failure_rate: 9, traces: 5670, industry: 'ecommerce' },
  { name: 'Code Review', success_rate: 96, avg_latency: 1.9, failure_rate: 4, traces: 2340, industry: 'saas' },
];

export const heatmapData = Array.from({ length: 7 }, (_, day) => 
  Array.from({ length: 24 }, (_, hour) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    hour: `${hour}:00`,
    failures: Math.floor(Math.random() * (hour >= 9 && hour <= 17 ? 20 : 8)),
  }))
).flat();

// Root cause analysis results
export const mockRootCauseResults: Record<string, {
  root_cause: string;
  confidence: number;
  evidence: string;
  recommendations: string[];
  affected_node: string;
}> = {
  retriever: {
    root_cause: 'retriever',
    confidence: 0.91,
    evidence: 'Vector similarity search returned documents with cosine similarity < 0.3. Embedding model degradation detected in production index.',
    recommendations: [
      'Rebuild Pinecone index with latest embedding model (text-embedding-3-large)',
      'Add similarity threshold validation (min 0.65)',
      'Implement temporal filtering to exclude outdated documents',
      'Set up embedding drift monitoring alerts',
    ],
    affected_node: 'retrieve',
  },
  generator: {
    root_cause: 'generator',
    confidence: 0.87,
    evidence: 'LLM hallucinated API endpoint /api/v3/admin-override that does not exist in documentation. Context window overflow caused loss of grounding.',
    recommendations: [
      'Add explicit grounding instructions: "Only use information from provided context"',
      'Implement citation requirements with source verification',
      'Reduce temperature from 0.7 to 0.3 for factual queries',
      'Add post-generation fact-checking step using separate model',
    ],
    affected_node: 'generate',
  },
  verifier: {
    root_cause: 'verifier',
    confidence: 0.78,
    evidence: 'Verification step passed despite factual inaccuracy. Verification prompt too permissive, allowing plausible-sounding but incorrect outputs.',
    recommendations: [
      'Strengthen verification prompts with explicit error patterns',
      'Add cross-reference checking against source documents',
      'Implement multi-pass verification for critical outputs',
      'Use separate model for verification to avoid same biases',
    ],
    affected_node: 'verify',
  },
};
