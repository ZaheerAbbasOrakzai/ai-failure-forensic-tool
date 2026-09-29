import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  Zap, ChevronRight, Flame, DollarSign, Shield,
  Radio, Pause, Play
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { calculateMetrics, calculatePipelineMetrics } from '../services/MetricsService';
import { incidentDetectionService } from '../services/IncidentDetectionService';
import { Card, StatCard, Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { Trace } from '../types';

export default function LiveDashboard() {
  const navigate = useNavigate();
  const { traces, isLive, toggleLive } = useRealTimeData();
  const [incidents, setIncidents] = useState<any[]>([]);

  // Calculate real-time metrics
  const metrics = calculateMetrics(traces);
  const pipelineMetrics = calculatePipelineMetrics(traces);

  // Update incidents when new traces arrive
  useEffect(() => {
    if (traces.length > 0) {
      const latestTrace = traces[0];
      const newIncident = incidentDetectionService.addTrace(latestTrace);
      if (newIncident) {
        setIncidents(prev => [newIncident, ...prev]);
      }
      setIncidents(incidentDetectionService.getActiveIncidents());
    }
  }, [traces]);

  // Prepare chart data
  const timeSeriesData = traces.slice(0, 50).reverse().map((trace, i) => ({
    time: new Date(trace.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    latency: trace.duration_ms / 1000,
    status: trace.status,
  }));

  const failureBreakdown = [
    { name: 'Retrieval', value: 38, color: '#3b82f6' },
    { name: 'Generation', value: 32, color: '#8b5cf6' },
    { name: 'Tool Call', value: 18, color: '#f97316' },
    { name: 'Verification', value: 8, color: '#10b981' },
    { name: 'Prompt', value: 4, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Live Dashboard</h1>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full border',
              isLive 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-zinc-800 border-zinc-700'
            )}>
              <div className={cn(
                'w-2 h-2 rounded-full',
                isLive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
              )} />
              <span className={cn(
                'text-xs font-medium',
                isLive ? 'text-emerald-400' : 'text-zinc-400'
              )}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-500 mt-0.5">
            Real-time AI pipeline monitoring • {metrics.tracesPerMinute.toFixed(1)} traces/min
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLive}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              isLive 
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
            )}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Active Incidents Banner */}
      {incidents.length > 0 && (
        <Card className="p-4 border-red-500/20 bg-red-500/[0.02]" glow="red">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">
                {incidents.length} Active Incident{incidents.length > 1 ? 's' : ''} Detected
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {incidents[0]?.title}
              </p>
            </div>
            <button 
              onClick={() => navigate('/incidents')}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-medium text-red-400 transition-colors"
            >
              View Incidents
            </button>
          </div>
        </Card>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in-delay-1">
        <StatCard 
          label="Total Traces" 
          value={metrics.totalTraces.toLocaleString()} 
          change={`${metrics.tracesPerMinute.toFixed(1)}/min`}
          changeType="neutral"
          icon={Activity} 
          accent="blue"
        />
        <StatCard 
          label="Success Rate" 
          value={`${metrics.successRate.toFixed(1)}%`} 
          change={`${Math.round(metrics.totalTraces * metrics.successRate / 100)} successful`}
          changeType={metrics.successRate > 90 ? 'positive' : 'negative'}
          icon={CheckCircle2} 
          accent="green"
        />
        <StatCard 
          label="Avg Latency" 
          value={`${metrics.avgLatency.toFixed(2)}s`} 
          change={`P95: ${metrics.p95Latency.toFixed(2)}s`}
          changeType="neutral"
          icon={Clock} 
          accent="purple"
        />
        <StatCard 
          label="Total Cost" 
          value={`$${metrics.totalCost.toFixed(2)}`} 
          change={`${(metrics.totalTokensIn + metrics.totalTokensOut).toLocaleString()} tokens`}
          changeType="neutral"
          icon={DollarSign} 
          accent="orange"
        />
      </div>

      {/* Real-time Latency Chart */}
      <Card className="p-5 animate-in-delay-2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Real-time Latency</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Last 50 traces • Updates every 2-5s</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-zinc-400">Latency (s)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="gradLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" vertical={false} />
            <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval={Math.floor(timeSeriesData.length / 6)} />
            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} unit="s" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid rgba(63, 63, 70, 0.5)', 
                borderRadius: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                padding: '10px 14px'
              }}
              labelStyle={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}
              itemStyle={{ color: '#e4e4e7', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="latency" stroke="#3b82f6" fill="url(#gradLatency)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Pipeline Performance */}
      <Card className="p-5 animate-in-delay-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Pipeline Performance</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Real-time metrics by pipeline</p>
          </div>
          <button 
            onClick={() => navigate('/analytics')}
            className="text-xs text-zinc-400 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 pr-4">Pipeline</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Industry</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Traces</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Success</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Latency</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Cost</th>
              </tr>
            </thead>
            <tbody>
              {pipelineMetrics.slice(0, 5).map((pipeline, i) => (
                <tr key={pipeline.name} className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors cursor-pointer" onClick={() => navigate('/traces')}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        i === 0 ? 'bg-blue-500/10' : i === 1 ? 'bg-purple-500/10' : i === 2 ? 'bg-pink-500/10' : i === 3 ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                      )}>
                        <Zap className={cn(
                          'w-4 h-4',
                          i === 0 ? 'text-blue-400' : i === 1 ? 'text-purple-400' : i === 2 ? 'text-pink-400' : i === 3 ? 'text-emerald-400' : 'text-amber-400'
                        )} />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">{pipeline.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="capitalize">
                      {pipeline.industry}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-400">{pipeline.totalTraces}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            'h-full rounded-full',
                            pipeline.successRate > 90 ? 'bg-emerald-500' : pipeline.successRate > 80 ? 'bg-amber-500' : 'bg-red-500'
                          )} 
                          style={{ width: `${pipeline.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-300 font-medium">{pipeline.successRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-400">{pipeline.avgLatency.toFixed(2)}s</td>
                  <td className="py-3 px-4 text-sm text-zinc-400">${pipeline.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Traces */}
      <Card className="p-5 animate-in-delay-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Live Trace Feed</h3>
          </div>
          <Badge variant="outline">{traces.length} traces</Badge>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {traces.slice(0, 20).map(trace => (
            <div 
              key={trace.id} 
              onClick={() => navigate(`/traces/${trace.id}`)}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  trace.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                )} />
                <div>
                  <p className="text-xs font-mono text-zinc-300 group-hover:text-white transition-colors">{trace.id.slice(0, 8)}...</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {trace.pipeline_name} • {(trace.duration_ms / 1000).toFixed(2)}s • ${trace.cost_usd}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {trace.root_cause && (
                  <Badge variant="danger">{trace.root_cause.slice(0, 20)}...</Badge>
                )}
                <span className="text-[10px] text-zinc-500">
                  {new Date(trace.start_time).toLocaleTimeString()}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
