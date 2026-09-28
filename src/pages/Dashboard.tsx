import { 
  Activity, AlertTriangle, CheckCircle2, Clock, 
  TrendingDown, Zap, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { mockTraces, dailyTraceData, failureBreakdown, pipelineComparison } from '../data/mockData';

function MetricCard({ title, value, change, changeType, icon: Icon, color }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
              {changeType === 'positive' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const totalTraces = mockTraces.length;
  const successful = mockTraces.filter(t => t.status === 'success').length;
  const failed = mockTraces.filter(t => t.status === 'failed').length;
  const failureRate = ((failed / totalTraces) * 100).toFixed(1);
  const avgLatency = (mockTraces.reduce((sum, t) => sum + t.duration_ms, 0) / totalTraces / 1000).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">AI Pipeline health overview & failure monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Traces" 
          value={totalTraces.toLocaleString()} 
          change="+12% vs last week" 
          changeType="positive"
          icon={Activity} 
          color="bg-blue-500/20" 
        />
        <MetricCard 
          title="Successful" 
          value={successful.toLocaleString()} 
          change="+8% vs last week" 
          changeType="positive"
          icon={CheckCircle2} 
          color="bg-green-500/20" 
        />
        <MetricCard 
          title="Failed" 
          value={failed.toLocaleString()} 
          change="-3% vs last week" 
          changeType="positive"
          icon={AlertTriangle} 
          color="bg-red-500/20" 
        />
        <MetricCard 
          title="Failure Rate" 
          value={`${failureRate}%`} 
          change="Below threshold" 
          changeType="positive"
          icon={TrendingDown} 
          color="bg-orange-500/20" 
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          title="Avg Latency" 
          value={`${avgLatency}s`} 
          change="-0.2s improvement" 
          changeType="positive"
          icon={Clock} 
          color="bg-purple-500/20" 
        />
        <MetricCard 
          title="Token Usage" 
          value={`${(mockTraces.reduce((s, t) => s + t.tokens_in + t.tokens_out, 0) / 1000).toFixed(0)}K`} 
          change="$42.50 estimated cost" 
          changeType="neutral"
          icon={Zap} 
          color="bg-yellow-500/20" 
        />
        <MetricCard 
          title="Active Pipelines" 
          value="5" 
          change="All healthy" 
          changeType="positive"
          icon={Activity} 
          color="bg-cyan-500/20" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trace Volume */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Trace Volume & Failures</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyTraceData}>
              <defs>
                <linearGradient id="colorTraces" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFailures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="traces" stroke="#3b82f6" fill="url(#colorTraces)" strokeWidth={2} />
              <Area type="monotone" dataKey="failures" stroke="#ef4444" fill="url(#colorFailures)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Failure Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={failureBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {failureBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {failureBreakdown.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Comparison */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Pipeline Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium pb-3">Pipeline</th>
                <th className="text-left text-gray-400 font-medium pb-3">Traces</th>
                <th className="text-left text-gray-400 font-medium pb-3">Success Rate</th>
                <th className="text-left text-gray-400 font-medium pb-3">Avg Latency</th>
                <th className="text-left text-gray-400 font-medium pb-3">Failure Rate</th>
                <th className="text-left text-gray-400 font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelineComparison.map(pipeline => (
                <tr key={pipeline.name} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 text-white font-medium">{pipeline.name}</td>
                  <td className="py-3 text-gray-300">{pipeline.traces}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${pipeline.success_rate}%` }}
                        />
                      </div>
                      <span className="text-gray-300">{pipeline.success_rate}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-300">{pipeline.avg_latency}s</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      pipeline.failure_rate > 20 ? 'bg-red-500/10 text-red-400' :
                      pipeline.failure_rate > 10 ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {pipeline.failure_rate}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      pipeline.failure_rate > 20 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {pipeline.failure_rate > 20 ? '⚠ Warning' : '✓ Healthy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Failures */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Recent Failures</h3>
        <div className="space-y-3">
          {mockTraces.filter(t => t.status === 'failed').slice(0, 5).map(trace => (
            <div key={trace.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div>
                  <p className="text-white text-sm font-mono">{trace.id}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{trace.pipeline_name} • {new Date(trace.start_time).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">
                  {trace.root_cause || 'Unknown'}
                </span>
                <span className="text-gray-400 text-sm">{(trace.duration_ms / 1000).toFixed(1)}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
