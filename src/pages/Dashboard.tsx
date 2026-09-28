import { useNavigate } from 'react-router-dom';
import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  TrendingDown, Zap, ArrowUpRight, ArrowDownRight,
  XCircle, ChevronRight, Flame
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { mockTraces, dailyTraceData, failureBreakdown, pipelineComparison } from '../data/mockData';
import { Card, StatCard, Badge } from '../components/ui';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const totalTraces = mockTraces.length;
  const successful = mockTraces.filter(t => t.status === 'success').length;
  const failed = mockTraces.filter(t => t.status === 'failed').length;
  const failureRate = ((failed / totalTraces) * 100).toFixed(1);
  const avgLatency = (mockTraces.reduce((sum, t) => sum + t.duration_ms, 0) / totalTraces / 1000).toFixed(2);

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Real-time AI pipeline health & failure monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <select className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <button className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98]">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in-delay-1">
        <StatCard 
          label="Total Traces" 
          value={totalTraces.toLocaleString()} 
          change="+12.4% vs last period"
          changeType="positive"
          icon={Activity} 
          accent="blue"
        />
        <StatCard 
          label="Success Rate" 
          value={`${((successful / totalTraces) * 100).toFixed(1)}%`} 
          change={`${successful.toLocaleString()} successful`}
          changeType="positive"
          icon={CheckCircle2} 
          accent="green"
        />
        <StatCard 
          label="Failed" 
          value={failed.toLocaleString()} 
          change="-3.2% vs last period"
          changeType="positive"
          icon={AlertTriangle} 
          accent="red"
        />
        <StatCard 
          label="Avg Latency" 
          value={`${avgLatency}s`} 
          change="P95: 3.2s"
          changeType="neutral"
          icon={Clock} 
          accent="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-in-delay-2">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Trace Volume</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Requests & failures over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-zinc-400">Traces</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-zinc-400">Failures</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyTraceData}>
              <defs>
                <linearGradient id="gradTraces" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradFailures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
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
              <Area type="monotone" dataKey="traces" stroke="#3b82f6" fill="url(#gradTraces)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="failures" stroke="#ef4444" fill="url(#gradFailures)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Failure Breakdown */}
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Failure Sources</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Where failures originate</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={failureBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {failureBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid rgba(63, 63, 70, 0.5)', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {failureBreakdown.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-zinc-300">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pipeline Table */}
      <Card className="p-5 animate-in-delay-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Pipeline Performance</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Compare metrics across all pipelines</p>
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
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Traces</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Success</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Latency</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 px-4">Failures</th>
                <th className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-3 pl-4">Health</th>
              </tr>
            </thead>
            <tbody>
              {pipelineComparison.map((pipeline, i) => (
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
                  <td className="py-3 px-4 text-sm text-zinc-400">{pipeline.traces}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            'h-full rounded-full',
                            pipeline.success_rate > 90 ? 'bg-emerald-500' : pipeline.success_rate > 80 ? 'bg-amber-500' : 'bg-red-500'
                          )} 
                          style={{ width: `${pipeline.success_rate}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-300 font-medium">{pipeline.success_rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-zinc-400">{pipeline.avg_latency}s</td>
                  <td className="py-3 px-4">
                    <Badge variant={pipeline.failure_rate > 20 ? 'danger' : pipeline.failure_rate > 10 ? 'warning' : 'success'}>
                      {pipeline.failure_rate}%
                    </Badge>
                  </td>
                  <td className="py-3 pl-4">
                    <Badge variant={pipeline.failure_rate > 20 ? 'danger' : 'success'}>
                      {pipeline.failure_rate > 20 ? '⚠ Degraded' : '✓ Healthy'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Failures */}
      <Card className="p-5 animate-in-delay-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Recent Failures</h3>
          </div>
          <button 
            onClick={() => navigate('/traces')}
            className="text-xs text-zinc-400 hover:text-orange-400 transition-colors flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {mockTraces.filter(t => t.status === 'failed').slice(0, 5).map(trace => (
            <div 
              key={trace.id} 
              onClick={() => navigate(`/traces/${trace.id}`)}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500/50" />
                <div>
                  <p className="text-xs font-mono text-zinc-300 group-hover:text-white transition-colors">{trace.id}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{trace.pipeline_name} • {new Date(trace.start_time).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {trace.root_cause && (
                  <Badge variant="danger">{trace.root_cause}</Badge>
                )}
                <span className="text-xs text-zinc-500">{(trace.duration_ms / 1000).toFixed(1)}s</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
