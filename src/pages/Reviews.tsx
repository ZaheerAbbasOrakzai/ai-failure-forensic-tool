import { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertTriangle, MessageSquare, 
  ThumbsUp, ThumbsDown, HelpCircle, Send, Clock, User
} from 'lucide-react';
import { mockFeedback, mockTraces } from '../data/mockData';
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
    setFeedbacks(prev => prev.map(f => 
      f.id === id ? { ...f, label } : f
    ));
  };

  const handleSubmitComment = (id: string) => {
    if (comment.trim()) {
      setFeedbacks(prev => prev.map(f => 
        f.id === id ? { ...f, comment: comment.trim() } : f
      ));
      setComment('');
      setSelectedFeedback(null);
    }
  };

  const getTrace = (traceId: string) => mockTraces.find(t => t.id === traceId);

  const labelConfig = {
    good: { icon: ThumbsUp, color: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'Correct' },
    bad: { icon: ThumbsDown, color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Incorrect' },
    needs_review: { icon: HelpCircle, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', label: 'Needs Review' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Human Review</h1>
          <p className="text-gray-400 text-sm mt-1">Validate AI suggestions and provide feedback on traces</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Pending:</span>
            <span className="text-yellow-400 font-medium">{feedbacks.filter(f => f.label === 'needs_review').length}</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Reviewed:</span>
            <span className="text-green-400 font-medium">{feedbacks.filter(f => f.label !== 'needs_review').length}</span>
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value 
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                : 'text-gray-400 hover:text-gray-200 bg-gray-800/50 border border-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filteredFeedbacks.map(feedback => {
          const trace = getTrace(feedback.trace_id);
          const config = labelConfig[feedback.label];
          const LabelIcon = config.icon;

          return (
            <div key={feedback.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${config.color}`}>
                    <LabelIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">{feedback.trace_id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    {trace && (
                      <p className="text-gray-400 text-sm mt-1">{trace.pipeline_name} • {trace.user_id}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {feedback.reviewer}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(feedback.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment */}
              {feedback.comment && (
                <div className="mt-4 ml-14 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Comment</span>
                  </div>
                  <p className="text-gray-300 text-sm">{feedback.comment}</p>
                </div>
              )}

              {/* Trace Preview */}
              {trace && (
                <div className="mt-4 ml-14 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-1">Final Output:</p>
                  <p className="text-gray-300 text-sm truncate">
                    {trace.final_output || <span className="text-red-400 italic">No output (failed)</span>}
                  </p>
                  {trace.root_cause && (
                    <p className="text-xs text-orange-400 mt-2">
                      Root Cause: {trace.root_cause} ({((trace.root_cause_confidence || 0) * 100).toFixed(0)}% confidence)
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 ml-14 flex items-center gap-3">
                <button
                  onClick={() => handleLabel(feedback.id, 'good')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedback.label === 'good' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-green-500/30 hover:text-green-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Correct
                </button>
                <button
                  onClick={() => handleLabel(feedback.id, 'bad')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedback.label === 'bad' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-red-500/30 hover:text-red-400'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Incorrect
                </button>
                <button
                  onClick={() => handleLabel(feedback.id, 'needs_review')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    feedback.label === 'needs_review' 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-yellow-500/30 hover:text-yellow-400'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Needs Review
                </button>

                <div className="h-4 w-px bg-gray-700 mx-1" />

                {selectedFeedback === feedback.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add comment..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-orange-500/50"
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(feedback.id)}
                    />
                    <button
                      onClick={() => handleSubmitComment(feedback.id)}
                      className="p-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedFeedback(feedback.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-gray-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Comment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
