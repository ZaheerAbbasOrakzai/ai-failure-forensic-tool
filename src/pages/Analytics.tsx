import { 
  TrendingUp, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight,
  DollarSign, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { dailyTraceData, pipelineComparison, heatmapData } from '../data/mockData';
import { Card, StatCard } from '../components/ui';

const latencyTrend = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  p50: 0.8 + Math.random() * 0.5,
  p90: 1.5 + Math.random() * 1.0,
  p99: 3.0 + Math.random() * 2.0,
}));

const tokenCostData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  cost: 10 + Math.random() * 30,
  tokens: 50000 + Math.random() * 100000,
}));

const radarData = [
  { metric: 'Accuracy', value: 82 },
  { metric: 'Latency', value: 71 },
  { metric: 'Cost', value: 65 },
  { metric: 'Reliability', value: 88 },
  { metric: 'Coverage', value: 74 },
  { metric: 'Quality', value: 79 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Long-term performance trends & insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none cursor-pointer">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Failure Rate" 
          value="9.5%" 
          change="-2.1% vs last month"
          changeType="positive"
          icon={TrendingUp} 
          accent="green"
        />
        <StatCard 
          label="Avg Latency" 
          value="1.7s" 
          change="-0.3s improvement"
          changeType="positive"
          icon={Clock} 
          accent="blue"
        />
        <StatCard 
          label="Monthly Cost" 
          value="$847" 
          change="+12% vs last month"
          changeType="negative"
          icon={DollarSign} 
          accent="purple"
        />
        <StatCard 
          label="Feedback Rate" 
          value="34%" 
          change="+8% vs last month"
          changeType="positive"
          icon={Activity} 
          accent="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latency Percentiles */}
        <Card className="p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white">Latency Percentiles</h3>
            <p className="text-xs text-zinc-500 mt-0.5">P50, P90, P99 over time</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={latencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
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
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={2} dot={false} name="P50" />
              <Line type="monotone" dataKey="p90" stroke="#eab308" strokeWidth={2} dot={false} name="P90" />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Token Cost */}
        <Card className="p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white">Token Cost Trend</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Daily spend on LLM tokens</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={tokenCostData}>
              <defs>
                <linearGradient id="gradCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} interval={4} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} unit="$" />
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
              <Area type="monotone" dataKey="cost" stroke="#8b5cf6" fill="url(#gradCost)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline Comparison */}
        <Card className="lg:col-span-2 p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white">Pipeline Comparison</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Success vs failure rates by pipeline</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipelineComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63, 63, 70, 0.3)" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} unit="%" />
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
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="success_rate" fill="#22c55e" radius={[4, 4, 0, 0]} name="Success" />
              <Bar dataKey="failure_rate" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failure" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quality Radar */}
        <Card className="p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white">System Quality</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Multi-dimensional score</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(63, 63, 70, 0.4)" />
              <PolarAngleAxis dataKey="metric" stroke="#71717a" fontSize={10} />
              <PolarRadiusAxis stroke="rgba(63, 63, 70, 0.3)" fontSize={9} />
              <Radar name="Score" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Failure Heatmap */}
      <Card className="p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-white">Failure Heatmap</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Failures by day of week and hour</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="flex gap-0.5 mb-1.5">
              <div className="w-10" />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex-1 text-center text-[9px] text-zinc-600">
                  {h % 3 === 0 ? `${h}` : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex gap-0.5 mb-0.5">
                <div className="w-10 text-[10px] text-zinc-500 flex items-center">{day}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const cell = heatmapData.find(d => d.day === day && d.hour === `${h}:00`);
                  const intensity = cell ? cell.failures / 15 : 0;
                  return (
                    <div
                      key={h}
                      className="flex-1 h-5 rounded-[3px] transition-all hover:scale-110 cursor-pointer"
                      style={{ 
                        backgroundColor: intensity > 0 
                          ? `rgba(239, 68, 68, ${Math.min(intensity * 0.7 + 0.05, 0.9)})` 
                          : 'rgba(39, 39, 42, 0.4)'
                      }}
                      title={`${day} ${h}:00 — ${cell?.failures || 0} failures`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span className="text-[10px] text-zinc-600">Less</span>
              {[0.1, 0.3, 0.5, 0.7, 1.0].map(intensity => (
                <div 
                  key={intensity}
                  className="w-3.5 h-3.5 rounded-[3px]"
                  style={{ backgroundColor: `rgba(239, 68, 68, ${intensity})` }}
                />
              ))}
              <span className="text-[10px] text-zinc-600">More</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Failure Trend */}
      <Card className="p-5">
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-white">Failure Trend</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Daily failure count over time</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyTraceData}>
            <defs>
              <linearGradient id="gradFailures2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
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
              labelStyle={{ color: '#a1a1aa', fontSize: '11px' }}
              itemStyle={{ color: '#e4e4e7', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="failures" stroke="#ef4444" fill="url(#gradFailures2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
