import { useState } from 'react';
import { 
  Database, Plus, Trash2, CheckCircle2, XCircle, Clock, 
  Edit3, Filter, Download, Upload, ArrowUpRight
} from 'lucide-react';
import { mockEvalRecords } from '../data/mockData';
import { Card, Badge, Button, StatCard } from '../components/ui';
import { cn } from '../lib/utils';
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
    pending: { icon: Clock, variant: 'warning' as const, label: 'Pending' },
    approved: { icon: CheckCircle2, variant: 'success' as const, label: 'Approved' },
    discarded: { icon: XCircle, variant: 'outline' as const, label: 'Discarded' },
  };

  const failureTypeColors: Record<string, string> = {
    retrieval: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    generation: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    verification: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    tool: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    prompt: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Evaluation Dataset</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Convert production failures into regression test cases</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button variant="secondary" size="sm">
            <Upload className="w-3.5 h-3.5" />
            Import
          </Button>
          <Button size="sm" className="shadow-lg shadow-orange-500/20">
            <Plus className="w-3.5 h-3.5" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Records" value={records.length} accent="blue" />
        <StatCard label="Pending Review" value={records.filter(r => r.status === 'pending').length} accent="orange" />
        <StatCard label="Approved" value={records.filter(r => r.status === 'approved').length} accent="green" />
        <StatCard label="Discarded" value={records.filter(r => r.status === 'discarded').length} accent="purple" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="discarded">Discarded</option>
          </select>
          <select
            value={failureTypeFilter}
            onChange={(e) => setFailureTypeFilter(e.target.value)}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-orange-500/50 cursor-pointer"
          >
            <option value="all">All Failure Types</option>
            <option value="retrieval">Retrieval</option>
            <option value="generation">Generation</option>
            <option value="verification">Verification</option>
            <option value="tool">Tool</option>
            <option value="prompt">Prompt</option>
          </select>
          <div className="ml-auto text-xs text-zinc-500">
            {filteredRecords.length} records
          </div>
        </div>
      </Card>

      {/* Records */}
      <div className="space-y-3">
        {filteredRecords.map(record => {
          const config = statusConfig[record.status];
          const StatusIcon = config.icon;

          return (
            <Card key={record.id} className="p-5 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Database className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{record.id}</span>
                      <Badge variant={config.variant}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                      <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-medium border', failureTypeColors[record.failure_type])}>
                        {record.failure_type}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Source: {record.trace_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Input / Expected / Actual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50">
                  <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">Input</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{record.input}</p>
                </div>
                <div className="p-3 bg-emerald-500/[0.03] rounded-lg border border-emerald-500/10">
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1.5">Expected</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{record.expected}</p>
                </div>
                <div className="p-3 bg-red-500/[0.03] rounded-lg border border-red-500/10">
                  <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-1.5">Actual</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{record.actual}</p>
                </div>
              </div>

              {/* Actions */}
              {record.status === 'pending' && (
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800/50">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleStatusChange(record.id, 'approved')}
                    className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Promote to Eval Set
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleStatusChange(record.id, 'discarded')}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Discard
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
