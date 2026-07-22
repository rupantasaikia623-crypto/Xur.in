import React, { useState, useEffect } from 'react';
import { Comment, Song } from '../types';
import { 
  fetchComments, 
  addComment, 
  toggleCommentUpvote, 
  addCommentReaction, 
  reportFlag,
  logUserActivity
} from '../lib/db-helpers';
import { 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  Flag, 
  Smile, 
  Quote, 
  Send, 
  AlertTriangle,
  ChevronDown,
  X
} from 'lucide-react';

interface DiscussionSectionProps {
  song: Song;
  currentUser: { uid: string; displayName: string; role?: string } | null;
  selectedLine: string | null;
  onClearSelectedLine: () => void;
  onRefreshSong: () => void;
}

const EMOJIS = ["❤️", "💡", "👏", "😮", "🤔"];

export default function DiscussionSection({ 
  song, 
  currentUser, 
  selectedLine, 
  onClearSelectedLine, 
  onRefreshSong 
}: DiscussionSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [quotedLineInput, setQuotedLineInput] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null); // commentId
  const [reportingComment, setReportingComment] = useState<Comment | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [flagDetails, setFlagDetails] = useState('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);

  // Sync selected line to quoted input when it changes
  useEffect(() => {
    if (selectedLine) {
      setQuotedLineInput(selectedLine);
    }
  }, [selectedLine]);

  const loadComments = async () => {
    const list = await fetchComments(song.id);
    setComments(list);
  };

  useEffect(() => {
    loadComments();
  }, [song.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const authorId = currentUser ? currentUser.uid : "guest-" + Date.now();
    const authorName = currentUser ? currentUser.displayName : "Anonymous Listener";

    await addComment({
      songId: song.id,
      userId: authorId,
      username: authorName,
      content: content.trim(),
      quotedLine: quotedLineInput || undefined,
      parentId: replyToId
    });

    try {
      await logUserActivity(
        'comment',
        `Discussed: "${content.trim().substring(0, 45)}${content.trim().length > 45 ? '...' : ''}" on "${song.title}"`,
        song.id,
        authorId,
        authorName
      );
    } catch (e) {
      console.warn("Activity logging failed on comment submit:", e);
    }

    setContent('');
    setReplyToId(null);
    setQuotedLineInput(null);
    onClearSelectedLine();
    loadComments();
    onRefreshSong(); // updates commentsCount
  };

  const handleUpvote = async (commentId: string) => {
    const uid = currentUser ? currentUser.uid : "guest-user";
    const updated = await toggleCommentUpvote(commentId, uid);
    if (updated) {
      loadComments();
    }
  };

  const handleReaction = async (commentId: string, emoji: string) => {
    const uid = currentUser ? currentUser.uid : "guest-user";
    const updated = await addCommentReaction(commentId, emoji, uid);
    if (updated) {
      loadComments();
      setShowEmojiPicker(null);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingComment || !flagReason.trim()) return;

    setIsSubmittingFlag(true);
    const reporterId = currentUser ? currentUser.uid : "guest-reporter";
    const reporterName = currentUser ? currentUser.displayName : "Anonymous Reporter";

    await reportFlag({
      type: 'comment',
      targetId: reportingComment.id,
      songId: song.id,
      reason: flagReason,
      details: flagDetails,
      reportedBy: reporterId,
      reportedByUsername: reporterName
    });

    setReportingComment(null);
    setFlagReason('');
    setFlagDetails('');
    setIsSubmittingFlag(false);
    loadComments(); // refresh list to hide flagged comment
  };

  // Group comments into trees
  const topLevelComments = comments.filter(c => !c.parentId && !c.isFlagged);
  const getRepliesFor = (id: string) => comments.filter(c => c.parentId === id && !c.isFlagged);

  return (
    <div className="bg-[#0d121f]/80 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-400" />
        <h3 className="font-display font-bold text-lg text-white tracking-tight">
          Interpretations & Meaning Discussions ({comments.length})
        </h3>
      </div>

      {/* Quoted Lyric Highlight (for starting context) */}
      {quotedLineInput && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 mb-5 flex items-start gap-3 backdrop-blur-md">
          <Quote className="w-4 h-4 text-emerald-400 mt-1 shrink-0 rotate-180" />
          <div className="grow">
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono mb-0.5">
              Commenting on Specific line:
            </p>
            <p className="text-sm italic font-medium text-emerald-100">
              "{quotedLineInput}"
            </p>
          </div>
          <button 
            onClick={() => {
              setQuotedLineInput(null);
              onClearSelectedLine();
            }}
            className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Remove quoted line"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reply indicator */}
      {replyToId && (
        <div className="bg-teal-950/40 border border-teal-500/30 rounded-2xl p-3 mb-5 flex items-center justify-between backdrop-blur-md">
          <span className="text-xs text-teal-200 font-medium flex items-center gap-1.5">
            <Reply className="w-3.5 h-3.5 text-teal-400" />
            Replying to <strong className="text-white">{comments.find(c => c.id === replyToId)?.username}</strong>
          </span>
          <button 
            onClick={() => setReplyToId(null)}
            className="text-teal-400 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8" id="comment-form-main">
        <div className="bg-slate-900/90 border border-white/10 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-2xl p-3.5 transition-all shadow-inner">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              replyToId 
                ? "Write a thoughtful reply..." 
                : quotedLineInput 
                  ? "Explain the meaning, translate, or share context of this line..." 
                  : "What does this song mean to you? Share cultural contexts, translations, or thoughts..."
            }
            className="w-full bg-transparent resize-none outline-none border-none text-slate-100 text-sm placeholder-slate-500 min-h-[90px]"
            required
            id="comment-textarea"
          />
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2">
            <div className="text-xs text-slate-400">
              {currentUser ? (
                <span>Posting as <strong className="text-emerald-400">{currentUser.displayName}</strong></span>
              ) : (
                <span>Posting as <strong className="text-slate-300">Guest Listener</strong></span>
              )}
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all hover:scale-105 cursor-pointer shadow-md shadow-emerald-500/20"
              id="submit-comment-btn"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm italic">
            No interpretations shared yet. Be the first to start the discussion!
          </div>
        ) : (
          topLevelComments.map(comment => {
            const replies = getRepliesFor(comment.id);
            const userUid = currentUser ? currentUser.uid : "guest-user";
            const userHasUpvoted = comment.upvotes?.includes(userUid);

            return (
              <div key={comment.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0" id={`comment-node-${comment.id}`}>
                {/* Individual Comment Container */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-display text-emerald-300 font-bold text-xs uppercase shadow-inner">
                        {comment.username.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {comment.username}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setReportingComment(comment)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Report comment"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quoted line on top of comment body */}
                  {comment.quotedLine && (
                    <div className="text-xs italic bg-emerald-950/30 border-l-2 border-emerald-400 py-1.5 px-3 rounded-r-md text-emerald-200 flex items-start gap-1">
                      <Quote className="w-3 h-3 text-emerald-400 rotate-180 mt-0.5 shrink-0" />
                      <span>"{comment.quotedLine}"</span>
                    </div>
                  )}

                  {/* Comment Text */}
                  <p className="text-sm leading-relaxed text-slate-200 pl-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Reactions Bar & Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      {/* Upvote button */}
                      <button
                        onClick={() => handleUpvote(comment.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-mono transition-colors cursor-pointer ${
                          userHasUpvoted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {comment.upvotes?.length || 0}
                      </button>

                      {/* Threaded Reply trigger */}
                      <button
                        onClick={() => {
                          setReplyToId(comment.id);
                          document.getElementById('comment-form-main')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                      </button>

                      {/* Emoji trigger */}
                      <div className="relative">
                        <button
                          onClick={() => setShowEmojiPicker(showEmojiPicker === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <Smile className="w-3.5 h-3.5" />
                          React
                        </button>

                        {showEmojiPicker === comment.id && (
                          <div className="absolute left-0 bottom-full mb-2 bg-slate-900 border border-white/15 rounded-full shadow-2xl px-3 py-1.5 flex gap-2 z-20 backdrop-blur-xl animate-fade-in">
                            {EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(comment.id, emoji)}
                                className="hover:scale-125 transition-transform text-sm cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Reactions display */}
                    {comment.reactions && Object.keys(comment.reactions).length > 0 && (
                      <div className="flex gap-1">
                        {Object.entries(comment.reactions).map(([emoji, userIds]) => {
                          const ids = userIds as string[];
                          if (ids.length === 0) return null;
                          const hasReacted = ids.includes(userUid);
                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(comment.id, emoji)}
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                hasReacted 
                                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 font-bold'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-mono">{ids.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Render Threaded Replies */}
                {replies.length > 0 && (
                  <div className="pl-6 sm:pl-10 mt-4 border-l-2 border-white/10 space-y-4">
                    {replies.map(reply => {
                      const replyHasUpvoted = reply.upvotes?.includes(userUid);
                      return (
                        <div key={reply.id} className="space-y-1.5" id={`reply-node-${reply.id}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-display text-slate-300 font-bold text-[10px] uppercase shadow-inner">
                                {reply.username.slice(0, 2)}
                              </div>
                              <div>
                                <h5 className="text-xs font-semibold text-slate-200 leading-tight">
                                  {reply.username}
                                </h5>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setReportingComment(reply)}
                              className="text-slate-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                              title="Report comment"
                            >
                              <Flag className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-300 pl-1 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          <div className="flex items-center justify-between gap-3 pt-0.5">
                            <button
                              onClick={() => handleUpvote(reply.id)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium font-mono transition-colors cursor-pointer ${
                                replyHasUpvoted
                                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {reply.upvotes?.length || 0}
                            </button>

                            {/* Reply emoji reactions */}
                            {reply.reactions && Object.keys(reply.reactions).length > 0 && (
                              <div className="flex gap-1">
                                {Object.entries(reply.reactions).map(([emoji, userIds]) => {
                                  const ids = userIds as string[];
                                  if (ids.length === 0) return null;
                                  const rHasReacted = ids.includes(userUid);
                                  return (
                                    <button
                                      key={emoji}
                                      onClick={() => handleReaction(reply.id, emoji)}
                                      className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full border transition-colors cursor-pointer ${
                                        rHasReacted 
                                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                                          : 'bg-white/5 border-white/10 text-slate-400'
                                      }`}
                                    >
                                      <span>{emoji}</span>
                                      <span>{ids.length}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Flag / Report Comment Modal Dialog */}
      {reportingComment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d121f] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/15 animate-scale-up">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Report Comment
              </h3>
              <button 
                onClick={() => setReportingComment(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFlagSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Reason for Reporting
                </label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none focus:border-rose-500 transition-colors"
                  required
                >
                  <option value="" className="bg-[#0d121f] text-white">Select a reason...</option>
                  <option value="Mistranslation / Bad lyrics" className="bg-[#0d121f] text-white">Inaccurate lyrics / translation</option>
                  <option value="Inappropriate Content" className="bg-[#0d121f] text-white">Inappropriate / abusive language</option>
                  <option value="Spam / Self-promotion" className="bg-[#0d121f] text-white">Spam or self-promotion</option>
                  <option value="Copyright violation" className="bg-[#0d121f] text-white">Copyright or legal concerns</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Additional Details
                </label>
                <textarea
                  value={flagDetails}
                  onChange={(e) => setFlagDetails(e.target.value)}
                  placeholder="Explain why this comment is inaccurate or inappropriate..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 h-24 resize-none outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReportingComment(null)}
                  className="text-xs font-semibold text-slate-400 hover:bg-white/5 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFlag}
                  className="bg-rose-500 hover:bg-rose-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-500/20"
                >
                  {isSubmittingFlag ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
