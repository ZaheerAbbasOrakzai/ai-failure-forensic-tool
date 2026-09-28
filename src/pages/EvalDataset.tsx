import { useState } from 'react';
import { 
  Database, Plus, Trash2, CheckCircle2, XCircle, Clock, 
  ArrowUpRight, Edit3, Filter, Download, Upload
} from 'lucide-react';
import { mockEvalRecords } from '../data/mockData';
import { EvalRecord } from '../types';

export default function EvalDataset() {
  const [records, setRecords] = useState<EvalRecord[]>(mockEvalRecords);
  const [filter, setFilter] = useState<string>('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState<string>('all');

  const filteredRecords = records.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (failureTypeFilter !== 'all' && r.failure_type !== failureTypeFilter) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: EvalRecord['status']) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', label: 'Pending' },
    approved: { icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'Approved' },
    discarded: { icon: XCircle, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', label: 'Discarded' },
  };

  const failureTypeColors: Record<string, string> = {
    retrieval: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    generation: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    verification: 'bg-green-500/10 text-green-400 border-green-500/20',
    tool: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    prompt: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    approved: records.filter(r => r.status === 'approved').length,
    discarded: records.filter(r => r.status === 'discarded').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluation Dataset</h1>
          <p className="text-gray-400 text-sm mt-1">Convert production failures into test cases for regression testing</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-gray-600 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm text-white font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Discarded</p>
          <p className="text-2xl font-bold text-gray-400 mt-1">{stats.discarded}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="discarded">Discarded</option>
          </select>
        </div>
        <select
          value={failureTypeFilter}
          onChange={(e) => setFailureTypeFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50"
        >
          <option value="all">All Failure Types</option>
          <option value="retrieval">Retrieval</option>
          <option value="generation">Generation</option>
          <option value="verification">Verification</option>
          <option value="tool">Tool</option>
          <option value="prompt">Prompt</option>
        </select>
      </div>

      {/* Records */}
      <div className="space-y-4">
        {filteredRecords.map(record => {
          const config = statusConfig[record.status];
          const StatusIcon = config.icon;

          return (
            <div key={record.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{record.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {config.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${failureTypeColors[record.failure_type]}`}>
                        {record.failure_type}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">Source trace: {record.trace_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Input / Expected / Actual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <p className="text-xs text-gray-500 font-medium mb-1">Input (Question)</p>
                  <p className="text-gray-200 text-sm">{record.input}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg border border-green-500/20">
                  <p className="text-xs text-green-400 font-medium mb-1">Expected Answer</p>
                  <p className="text-gray-200 text-sm">{record.expected}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg border border-red-500/20">
                  <p className="text-xs text-red-400 font-medium mb-1">Actual Output</p>
                  <p className="text-gray-200 text-sm">{record.actual}</p>
                </div>
              </div>

              {/* Actions */}
              {record.status === 'pending' && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => handleStatusChange(record.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Promote to Eval Set
                  </button>
                  <button
                    onClick={() => handleStatusChange(record.id, 'discarded')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Discard
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
