import { Trace, Incident } from '../types';

interface IncidentThreshold {
  failureRate: number; // percentage
  latencyP95: number; // seconds
  errorCount: number; // absolute count in time window
}

const DEFAULT_THRESHOLDS: IncidentThreshold = {
  failureRate: 10, // 10% failure rate
  latencyP95: 5, // 5 seconds P95 latency
  errorCount: 5, // 5 errors in 5 minutes
};

class IncidentDetectionService {
  private activeIncidents: Map<string, Incident> = new Map();
  private recentTraces: Trace[] = [];
  private readonly TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

  addTrace(trace: Trace): Incident | null {
    this.recentTraces.push(trace);
    
    // Clean old traces outside time window
    const cutoff = Date.now() - this.TIME_WINDOW_MS;
    this.recentTraces = this.recentTraces.filter(
      t => new Date(t.start_time).getTime() > cutoff
    );

    // Check for incidents
    return this.detectIncidents();
  }

  private detectIncidents(): Incident | null {
    if (this.recentTraces.length < 10) return null; // Need minimum sample

    // Group by pipeline
    const pipelineGroups = new Map<string, Trace[]>();
    this.recentTraces.forEach(trace => {
      const existing = pipelineGroups.get(trace.pipeline_name) || [];
      existing.push(trace);
      pipelineGroups.set(trace.pipeline_name, existing);
    });

    // Check each pipeline for incidents
    for (const [pipeline, traces] of pipelineGroups.entries()) {
      const incident = this.checkPipeline(pipeline, traces);
      if (incident) {
        return incident;
      }
    }

    return null;
  }

  private checkPipeline(pipeline: string, traces: Trace[]): Incident | null {
    const failed = traces.filter(t => t.status === 'failed');
    const failureRate = (failed.length / traces.length) * 100;

    // Check failure rate threshold
    if (failureRate > DEFAULT_THRESHOLDS.failureRate) {
      const incidentId = `incident-${pipeline}-${Date.now()}`;
      
      // Don't create duplicate incidents for same pipeline
      if (this.activeIncidents.has(pipeline)) {
        return null;
      }

      const incident: Incident = {
        id: incidentId,
        title: `Elevated failure rate in ${pipeline}`,
        severity: failureRate > 20 ? 'critical' : 'high',
        status: 'investigating',
        pipeline,
        industry: traces[0]?.industry || 'unknown',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: 'system@auto-detected',
        affected_traces: failed.length,
        description: `Failure rate detected at ${failureRate.toFixed(1)}% (threshold: ${DEFAULT_THRESHOLDS.failureRate}%). ${failed.length} failures in last 5 minutes.`,
        timeline: [
          {
            time: new Date().toISOString(),
            event: `Auto-detected: ${failureRate.toFixed(1)}% failure rate`,
            author: 'system',
          },
        ],
      };

      this.activeIncidents.set(pipeline, incident);
      return incident;
    }

    // Check P95 latency threshold
    const latencies = traces.map(t => t.duration_ms).sort((a, b) => a - b);
    const p95Index = Math.floor(latencies.length * 0.95);
    const p95Latency = latencies[p95Index] / 1000;

    if (p95Latency > DEFAULT_THRESHOLDS.latencyP95) {
      const incidentId = `incident-latency-${pipeline}-${Date.now()}`;
      
      if (this.activeIncidents.has(`latency-${pipeline}`)) {
        return null;
      }

      const incident: Incident = {
        id: incidentId,
        title: `High latency detected in ${pipeline}`,
        severity: p95Latency > 10 ? 'high' : 'warning',
        status: 'investigating',
        pipeline,
        industry: traces[0]?.industry || 'unknown',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: 'system@auto-detected',
        affected_traces: traces.length,
        description: `P95 latency detected at ${p95Latency.toFixed(2)}s (threshold: ${DEFAULT_THRESHOLDS.latencyP95}s).`,
        timeline: [
          {
            time: new Date().toISOString(),
            event: `Auto-detected: P95 latency ${p95Latency.toFixed(2)}s`,
            author: 'system',
          },
        ],
      };

      this.activeIncidents.set(`latency-${pipeline}`, incident);
      return incident;
    }

    return null;
  }

  getActiveIncidents(): Incident[] {
    return Array.from(this.activeIncidents.values());
  }

  resolveIncident(pipeline: string) {
    this.activeIncidents.delete(pipeline);
  }
}

export const incidentDetectionService = new IncidentDetectionService();
