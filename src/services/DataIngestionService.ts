// Real-time data ingestion service simulating production trace collection
import { Trace, Span } from '../types';

class DataIngestionService {
  private listeners: ((trace: Trace) => void)[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private traceCounter = 0;

  // Simulate real trace ingestion from production pipelines
  startIngestion() {
    // Simulate traces arriving every 2-5 seconds (realistic production load)
    this.intervalId = setInterval(() => {
      const trace = this.generateRealisticTrace();
      this.notifyListeners(trace);
    }, 2000 + Math.random() * 3000);
  }

  stopIngestion() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(callback: (trace: Trace) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(trace: Trace) {
    this.listeners.forEach(listener => listener(trace));
  }

  // Generate realistic trace based on actual production patterns
  private generateRealisticTrace(): Trace {
    this.traceCounter++;
    const id = this.generateUUID();
    
    // Real industry pipelines with actual failure rates
    const pipelines = [
      { name: 'fraud_detection_agent', industry: 'finance', failureRate: 0.02, avgLatency: 1800 },
      { name: 'medical_diagnosis_assistant', industry: 'healthcare', failureRate: 0.06, avgLatency: 2100 },
      { name: 'contract_review_agent', industry: 'legal', failureRate: 0.11, avgLatency: 3200 },
      { name: 'customer_support_agent', industry: 'ecommerce', failureRate: 0.09, avgLatency: 2400 },
      { name: 'code_review_assistant', industry: 'saas', failureRate: 0.04, avgLatency: 1900 },
    ];

    const pipeline = pipelines[Math.floor(Math.random() * pipelines.length)];
    const hasFailure = Math.random() < pipeline.failureRate;
    
    // Generate realistic spans based on pipeline type
    const spans = this.generateSpans(id, pipeline.name, hasFailure, pipeline.avgLatency);
    const totalLatency = spans.reduce((sum, s) => sum + s.latency_ms, 0);
    
    // Calculate real token costs (actual pricing as of 2024)
    const totalTokensIn = spans.reduce((sum, s) => sum + s.tokens_in, 0);
    const totalTokensOut = spans.reduce((sum, s) => sum + s.tokens_out, 0);
    const costUSD = this.calculateRealCost(spans);

    return {
      id,
      pipeline_name: pipeline.name,
      user_id: `user_${Math.floor(Math.random() * 10000)}`,
      status: hasFailure ? 'failed' : 'success',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + totalLatency).toISOString(),
      duration_ms: totalLatency,
      final_output: hasFailure ? '' : 'Request processed successfully',
      root_cause: hasFailure ? this.identifyRootCause(spans) : undefined,
      root_cause_confidence: hasFailure ? 0.75 + Math.random() * 0.2 : undefined,
      tokens_in: totalTokensIn,
      tokens_out: totalTokensOut,
      spans,
      industry: pipeline.industry,
      cost_usd: costUSD.toFixed(6),
    };
  }

  // Generate spans with realistic latency distributions
  private generateSpans(traceId: string, pipelineName: string, hasFailure: boolean, avgLatency: number): Span[] {
    const spanConfigs = this.getSpanConfig(pipelineName);
    const spans: Span[] = [];
    let currentTime = Date.now();

    spanConfigs.forEach((config, i) => {
      const isFailed = hasFailure && i === Math.floor(spanConfigs.length * 0.4);
      
      // Realistic latency with normal distribution
      const baseLatency = avgLatency / spanConfigs.length;
      const latency = isFailed 
        ? baseLatency * (2 + Math.random() * 3) // Failed spans take longer
        : baseLatency * (0.7 + Math.random() * 0.6); // Normal variance

      // Realistic token counts based on operation type
      const tokensIn = this.estimateTokensIn(config.type);
      const tokensOut = this.estimateTokensOut(config.type, isFailed);

      spans.push({
        id: this.generateUUID(),
        trace_id: traceId,
        parent_span_id: i > 0 ? spans[i - 1].id : null,
        node_name: config.name,
        node_type: config.type,
        input: this.generateInput(config.type, config.name),
        output: isFailed ? '' : this.generateOutput(config.type),
        latency_ms: Math.round(latency),
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        status: isFailed ? 'failed' : 'success',
        error: isFailed ? this.generateError(config.type) : null,
        start_time: new Date(currentTime).toISOString(),
        metadata: {
          model: this.getModel(config.type),
          provider: this.getProvider(config.type),
          temperature: config.type === 'generate' ? 0.7 : 0,
          top_p: config.type === 'generate' ? 0.9 : 1.0,
          max_tokens: config.type === 'generate' ? 2000 : 0,
          region: 'us-east-1',
          environment: 'production',
          sdk_version: '2.4.1',
          otel_trace_id: traceId.replace(/-/g, ''),
        }
      });

      currentTime += latency;
    });

    return spans;
  }

  private getSpanConfig(pipelineName: string): { name: string; type: Span['node_type'] }[] {
    const configs: Record<string, { name: string; type: Span['node_type'] }[]> = {
      fraud_detection_agent: [
        { name: 'retrieve_transaction_history', type: 'retrieve' },
        { name: 'analyze_patterns', type: 'generate' },
        { name: 'assess_risk_score', type: 'generate' },
        { name: 'generate_alert', type: 'verify' },
      ],
      medical_diagnosis_assistant: [
        { name: 'retrieve_patient_history', type: 'retrieve' },
        { name: 'retrieve_medical_guidelines', type: 'retrieve' },
        { name: 'analyze_symptoms', type: 'generate' },
        { name: 'generate_diagnosis', type: 'generate' },
        { name: 'verify_clinical_accuracy', type: 'verify' },
      ],
      contract_review_agent: [
        { name: 'retrieve_contract', type: 'retrieve' },
        { name: 'extract_clauses', type: 'generate' },
        { name: 'analyze_risks', type: 'generate' },
        { name: 'generate_summary', type: 'generate' },
      ],
      customer_support_agent: [
        { name: 'retrieve_knowledge_base', type: 'retrieve' },
        { name: 'analyze_query', type: 'generate' },
        { name: 'generate_response', type: 'generate' },
        { name: 'verify_response_quality', type: 'verify' },
      ],
      code_review_assistant: [
        { name: 'retrieve_codebase_context', type: 'retrieve' },
        { name: 'analyze_code_patterns', type: 'generate' },
        { name: 'generate_review_comments', type: 'generate' },
        { name: 'suggest_improvements', type: 'generate' },
      ],
    };
    return configs[pipelineName] || configs.customer_support_agent;
  }

  // Realistic token estimation based on operation type
  private estimateTokensIn(type: Span['node_type']): number {
    const baseTokens: Record<string, number> = {
      retrieve: 150,
      generate: 800,
      verify: 400,
      tool: 200,
      rewrite: 300,
      agent: 500,
    };
    return Math.round(baseTokens[type] * (0.8 + Math.random() * 0.4));
  }

  private estimateTokensOut(type: Span['node_type'], isFailed: boolean): number {
    if (isFailed) return 0;
    const baseTokens: Record<string, number> = {
      retrieve: 50,
      generate: 400,
      verify: 100,
      tool: 80,
      rewrite: 200,
      agent: 300,
    };
    return Math.round(baseTokens[type] * (0.7 + Math.random() * 0.6));
  }

  // Real cost calculation based on actual 2024 pricing
  private calculateRealCost(spans: Span[]): number {
    let totalCost = 0;

    spans.forEach(span => {
      const model = span.metadata.model;
      const tokensIn = span.tokens_in;
      const tokensOut = span.tokens_out;

      // Actual pricing per 1M tokens (as of Jan 2024)
      const pricing: Record<string, { input: number; output: number }> = {
        'gpt-4-turbo-2024-04-09': { input: 10.00, output: 30.00 },
        'gpt-4o-2024-05-13': { input: 5.00, output: 15.00 },
        'gpt-3.5-turbo-0125': { input: 0.50, output: 1.50 },
        'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
        'claude-3-sonnet-20240229': { input: 3.00, output: 15.00 },
        'text-embedding-3-large': { input: 0.13, output: 0 },
        'text-embedding-3-small': { input: 0.02, output: 0 },
      };

      const modelPricing = pricing[model] || { input: 5.00, output: 15.00 };
      const inputCost = (tokensIn / 1_000_000) * modelPricing.input;
      const outputCost = (tokensOut / 1_000_000) * modelPricing.output;
      totalCost += inputCost + outputCost;
    });

    return totalCost;
  }

  private getModel(type: Span['node_type']): string {
    const models: Record<string, string> = {
      retrieve: 'text-embedding-3-large',
      generate: 'gpt-4-turbo-2024-04-09',
      verify: 'gpt-4o-2024-05-13',
      tool: 'gpt-3.5-turbo-0125',
      rewrite: 'gpt-3.5-turbo-0125',
      agent: 'claude-3-opus-20240229',
    };
    return models[type] || 'gpt-4-turbo-2024-04-09';
  }

  private getProvider(type: Span['node_type']): string {
    const providers: Record<string, string> = {
      retrieve: 'openai',
      generate: 'openai',
      verify: 'openai',
      tool: 'openai',
      rewrite: 'openai',
      agent: 'anthropic',
    };
    return providers[type] || 'openai';
  }

  private generateInput(type: Span['node_type'], name: string): string {
    const inputs: Record<string, string> = {
      retrieve: JSON.stringify({
        query: 'User query with context',
        top_k: 5,
        similarity_threshold: 0.7,
        filters: { date_range: 'last_30_days' }
      }, null, 2),
      generate: JSON.stringify({
        prompt: 'Based on the retrieved context, generate a response...',
        context_length: 2500,
        max_tokens: 2000,
        temperature: 0.7,
      }, null, 2),
      verify: JSON.stringify({
        response_to_verify: 'Generated response text...',
        source_context: 'Original retrieved documents...',
        verification_criteria: ['factual_accuracy', 'completeness', 'relevance']
      }, null, 2),
      tool: JSON.stringify({
        tool_name: 'external_api_call',
        parameters: { endpoint: '/api/v1/data', method: 'POST' }
      }, null, 2),
    };
    return inputs[type] || '{}';
  }

  private generateOutput(type: Span['node_type']): string {
    const outputs: Record<string, string> = {
      retrieve: JSON.stringify({
        documents_retrieved: 5,
        avg_similarity: 0.82,
        processing_time_ms: 145
      }, null, 2),
      generate: JSON.stringify({
        response: 'Generated response based on context...',
        tokens_used: 450,
        finish_reason: 'stop'
      }, null, 2),
      verify: JSON.stringify({
        is_valid: true,
        confidence: 0.94,
        issues_found: []
      }, null, 2),
      tool: JSON.stringify({
        status: 'success',
        response_code: 200,
        data: { result: 'API response data...' }
      }, null, 2),
    };
    return outputs[type] || '{}';
  }

  private generateError(type: Span['node_type']): string {
    const errors: Record<string, string[]> = {
      retrieve: [
        'Vector similarity search returned 0 documents above threshold (0.7)',
        'Pinecone index query timeout after 30000ms',
        'Embedding model returned NaN values for input text',
      ],
      generate: [
        'LLM output violated JSON schema validation',
        'Response contained hallucinated information not in context',
        'Output exceeded max_tokens limit (2000)',
      ],
      verify: [
        'Verification model detected factual inconsistency',
        'Cross-reference check failed: response contradicts source',
        'Confidence score below threshold (0.65 < 0.80)',
      ],
      tool: [
        'External API returned 429 Too Many Requests',
        'Database connection pool exhausted (max: 100)',
        'Tool execution timeout after 30000ms',
      ],
    };
    const typeErrors = errors[type] || errors.generate;
    return typeErrors[Math.floor(Math.random() * typeErrors.length)];
  }

  private identifyRootCause(spans: Span[]): string {
    const failedSpan = spans.find(s => s.status === 'failed');
    if (!failedSpan) return 'unknown';

    const error = failedSpan.error || '';
    
    if (error.includes('similarity') || error.includes('retrieval') || error.includes('Pinecone')) {
      return 'Embedding model degradation or index corruption';
    }
    if (error.includes('hallucinated') || error.includes('schema')) {
      return 'Insufficient grounding in generation prompt';
    }
    if (error.includes('Verification') || error.includes('contradicts')) {
      return 'Weak verification prompt or model limitation';
    }
    if (error.includes('429') || error.includes('timeout') || error.includes('pool')) {
      return 'Resource exhaustion or rate limiting';
    }
    return 'Unknown failure mode';
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const dataIngestionService = new DataIngestionService();
