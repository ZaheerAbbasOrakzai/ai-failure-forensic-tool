import { Trace } from '../types';

export interface Metrics {
  totalTraces: number;
  successRate: number;
  failureRate: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  totalCost: number;
  totalTokensIn: number;
  totalTokensOut: number;
  activeIncidents: number;
  tracesPerMinute: number;
}

export function calculateMetrics(traces: Trace[]): Metrics {
  if (traces.length === 0) {
    return {
      totalTraces: 0,
      successRate: 0,
      failureRate: 0,
      avgLatency: 0,
      p95Latency: 0,
      p99Latency: 0,
      totalCost: 0,
      totalTokensIn: 0,
      totalTokensOut: 0,
      activeIncidents: 0,
      tracesPerMinute: 0,
    };
  }

  const successful = traces.filter(t => t.status === 'success').length;
  const failed = traces.filter(t => t.status === 'failed').length;

  // Calculate latency percentiles
  const latencies = traces.map(t => t.duration_ms).sort((a, b) => a - b);
  const avgLatency = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
  const p95Index = Math.floor(latencies.length * 0.95);
  const p99Index = Math.floor(latencies.length * 0.99);

  // Calculate total cost
  const totalCost = traces.reduce((sum, t) => sum + parseFloat(t.cost_usd || '0'), 0);

  // Calculate token usage
  const totalTokensIn = traces.reduce((sum, t) => sum + t.tokens_in, 0);
  const totalTokensOut = traces.reduce((sum, t) => sum + t.tokens_out, 0);

  // Calculate traces per minute (based on time range)
  const timeRange = traces.length > 1 
    ? (new Date(traces[0].start_time).getTime() - new Date(traces[traces.length - 1].start_time).getTime()) / 60000
    : 1;
  const tracesPerMinute = traces.length / Math.max(timeRange, 1);

  return {
    totalTraces: traces.length,
    successRate: (successful / traces.length) * 100,
    failureRate: (failed / traces.length) * 100,
    avgLatency: avgLatency / 1000, // Convert to seconds
    p95Latency: latencies[p95Index] / 1000,
    p99Latency: latencies[p99Index] / 1000,
    totalCost,
    totalTokensIn,
    totalTokensOut,
    activeIncidents: 0, // Will be calculated separately
    tracesPerMinute,
  };
}

export function calculatePipelineMetrics(traces: Trace[]) {
  const pipelineMap = new Map<string, Trace[]>();

  traces.forEach(trace => {
    const existing = pipelineMap.get(trace.pipeline_name) || [];
    existing.push(trace);
    pipelineMap.set(trace.pipeline_name, existing);
  });

  return Array.from(pipelineMap.entries()).map(([name, pipelineTraces]) => {
    const metrics = calculateMetrics(pipelineTraces);
    return {
      name,
      industry: pipelineTraces[0]?.industry || 'unknown',
      ...metrics,
    };
  });
}

export function calculateIndustryMetrics(traces: Trace[]) {
  const industryMap = new Map<string, Trace[]>();

  traces.forEach(trace => {
    const industry = trace.industry || 'unknown';
    const existing = industryMap.get(industry) || [];
    existing.push(trace);
    industryMap.set(industry, existing);
  });

  return Array.from(industryMap.entries()).map(([industry, industryTraces]) => {
    const metrics = calculateMetrics(industryTraces);
    return {
      industry,
      ...metrics,
    };
  });
}
