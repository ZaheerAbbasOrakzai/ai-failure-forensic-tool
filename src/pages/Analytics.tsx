import { 
  BarChart3, TrendingUp, Clock, AlertTriangle,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { dailyTraceData, failureBreakdown, pipelineComparison, heatmapData } from '../data/mockData';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Long-term trends and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 6 months</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Avg Failure Rate</p>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">9.5%</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
            <ArrowDownRight className="w-3 h-3" />
            -2.1% from last month
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Avg Latency</p>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">1.7s</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
            <ArrowDownRight className="w-3 h-3" />
            -0.3s improvement
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Monthly Cost</p>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">$847</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
            <ArrowUpRight className="w-3 h-3" />
            +12% from last month
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Feedback Rate</p>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">34%</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
            <ArrowUpRight className="w-3 h-3" />
            +8% from last month
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Trends */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Latency Percentiles</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={latencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis stroke="#6b7280" fontSize={11} unit="s" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line type="monotone" dataKey="p50" stroke="#22c55e" strokeWidth={2} dot={false} name="P50" />
              <Line type="monotone" dataKey="p90" stroke="#eab308" strokeWidth={2} dot={false} name="P90" />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} dot={false} name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Token Cost */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Token Cost Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={tokenCostData}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
              <YAxis stroke="#6b7280" fontSize={11} unit="$" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="cost" stroke="#8b5cf6" fill="url(#colorCost)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Pipeline Success Rates</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipelineComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Bar dataKey="success_rate" fill="#22c55e" radius={[4, 4, 0, 0]} name="Success Rate" />
              <Bar dataKey="failure_rate" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failure Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Radar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">System Quality Score</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" stroke="#6b7280" fontSize={11} />
              <PolarRadiusAxis stroke="#374151" fontSize={10} />
              <Radar name="Score" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failure Heatmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Failure Heatmap (Day × Hour)</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="flex gap-0.5 mb-1">
              <div className="w-10" />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="flex-1 text-center text-[10px] text-gray-500">
                  {h % 3 === 0 ? `${h}:00` : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="flex gap-0.5 mb-0.5">
                <div className="w-10 text-xs text-gray-500 flex items-center">{day}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const cell = heatmapData.find(d => d.day === day && d.hour === `${h}:00`);
                  const intensity = cell ? cell.failures / 15 : 0;
                  return (
                    <div
                      key={h}
                      className="flex-1 h-6 rounded-sm transition-colors"
                      style={{ 
                        backgroundColor: intensity > 0 
                          ? `rgba(239, 68, 68, ${Math.min(intensity * 0.8 + 0.1, 1)})` 
                          : 'rgba(55, 65, 81, 0.3)'
                      }}
                      title={`${day} ${h}:00 - ${cell?.failures || 0} failures`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-xs text-gray-500">Less</span>
              {[0.1, 0.3, 0.5, 0.7, 1.0].map(intensity => (
                <div 
                  key={intensity}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: `rgba(239, 68, 68, ${intensity})` }}
                />
              ))}
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Failure Type Distribution Over Time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Failure Type Distribution (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={dailyTraceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} interval={4} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Area type="monotone" dataKey="failures" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Failures" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
