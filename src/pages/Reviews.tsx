import { useState } from 'react';
import { 
  ThumbsUp, ThumbsDown, HelpCircle, MessageSquare, 
  Send, Clock, User, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';
import { mockFeedback, mockTraces } from '../data/mockData';
import { Card, Badge, Button, Avatar } from '../components/ui';
import { cn } from '../lib/utils';
import { Feedback } from '../types';

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredFeedbacks = feedbacks.filter(f => 
    filter === 'all' ? true : f.label === filter
  );

  const handleLabel = (id: string, label: 'good' | 'bad' | 'needs_review') => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, label } : f));
  };

  const handleSubmitComment = (id: string) => {
    if (comment.trim()) {
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, comment: comment.trim() } : f));
      setComment('');
      setSelectedFeedback(null);
    }
  };

  const getTrace = (traceId: string) => mockTraces.find(t => t.id === traceId);

  const labelConfig = {
    good: { icon: ThumbsUp, variant: 'success' as const, label: 'Correct' },
    bad: { icon: ThumbsDown, variant: 'danger' as const, label: 'Incorrect' },
    needs_review: { icon: HelpCircle, variant: 'warning' as const, label: 'Needs Review' },
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Human Review</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Validate AI suggestions and provide feedback</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-zinc-400">Pending: <span className="text-amber-400 font-medium">{feedbacks.filter(f => f.label === 'needs_review').length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-zinc-400">Reviewed: <span className="text-emerald-400 font-medium">{feedbacks.filter(f => f.label !== 'needs_review').length}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All', count: feedbacks.length },
          { value: 'needs_review', label: 'Needs Review', count: feedbacks.filter(f => f.label === 'needs_review').length },
          { value: 'bad', label: 'Incorrect', count: feedbacks.filter(f => f.label === 'bad').length },
          { value: 'good', label: 'Correct', count: feedbacks.filter(f => f.label === 'good').length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-medium transition-all',
              filter === tab.value 
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:bg-zinc-800/40'
            )}
          >
            {tab.label} <span className="text-zinc-600 ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {filteredFeedbacks.map(feedback => {
          const trace = getTrace(feedback.trace_id);
          const config = labelConfig[feedback.label];
          const LabelIcon = config.icon;

          return (
            <Card key={feedback.id} className="p-5 hover-lift">
              <div className="flex items-start gap-4">
                <Avatar initials={feedback.reviewer.slice(0, 2).toUpperCase()} color="purple" />
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-zinc-200">{feedback.reviewer}</span>
                    <Badge variant={config.variant}>
                      <LabelIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                    <span className="text-[10px] text-zinc-600 ml-auto flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(feedback.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-xs font-mono text-zinc-500 mb-3">trace: {feedback.trace_id}</p>

                  {/* Trace Preview */}
                  {trace && (
                    <div className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 mb-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Pipeline</span>
                        <span className="text-xs text-zinc-300">{trace.pipeline_name}</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        {trace.final_output || <span className="text-red-400 italic">No output (failed)</span>}
                      </p>
                      {trace.root_cause && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-zinc-500">Root Cause:</span>
                          <Badge variant="danger">{trace.root_cause}</Badge>
                          <span className="text-[10px] text-zinc-500">{((trace.root_cause_confidence || 0) * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Comment */}
                  {feedback.comment && (
                    <div className="p-3 bg-zinc-800/20 rounded-lg border border-zinc-800/30 mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Comment</span>
                      </div>
                      <p className="text-xs text-zinc-300">{feedback.comment}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={feedback.label === 'good' ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => handleLabel(feedback.id, 'good')}
                      className={feedback.label === 'good' ? 'border-emerald-500/30 text-emerald-400' : ''}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct
                    </Button>
                    <Button 
                      variant={feedback.label === 'bad' ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => handleLabel(feedback.id, 'bad')}
                      className={feedback.label === 'bad' ? 'border-red-500/30 text-red-400' : ''}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect
                    </Button>
                    <Button 
                      variant={feedback.label === 'needs_review' ? 'secondary' : 'ghost'} 
                      size="sm"
                      onClick={() => handleLabel(feedback.id, 'needs_review')}
                      className={feedback.label === 'needs_review' ? 'border-amber-500/30 text-amber-400' : ''}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Review
                    </Button>

                    <div className="h-4 w-px bg-zinc-800 mx-1" />

                    {selectedFeedback === feedback.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add comment..."
                          className="flex-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-orange-500/50 placeholder:text-zinc-600"
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(feedback.id)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSubmitComment(feedback.id)}
                          className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                        >
                          <Send className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFeedback(feedback.id)}>
                        <MessageSquare className="w-3.5 h-3.5" />
                        Comment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
