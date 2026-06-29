import React, { useState, useEffect } from "react";
import ProfPic from "@/assets/ProfPic.png";
import { API_URL } from "@/config";

interface Comment {
  _id: string;
  feed_id: string;
  content: string;
  parent: any;
  createdAt: string;
  user?: {
    username: string;
  };
  replies?: Comment[];
}

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id?: string;
    _id?: string;
    content: string;
    rating?: number;
    movieTitle: string;
    posterUrl: string;
    user?: { username: string };
  };
}

export default function CommentDialog({
  isOpen,
  onClose,
  review,
}: CommentDialogProps) {
  const [rootComments, setRootComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);
  const [actualParentId, setActualParentId] = useState<string | null>(null);

  const reviewId = review._id || review.id;

  const fetchComments = async () => {
    if (!reviewId) return;
    try {
      const response = await fetch(
        `${API_URL}/feeds/${reviewId}/comments`,
        { credentials: "include" },
      );
      if (response.ok) {
        const data = await response.json();
        setRootComments(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, reviewId]);

  if (!isOpen) return null;

  const handleReplyClick = (targetComment: Comment, rootCommentId: string) => {
    setReplyToComment(targetComment);
    setActualParentId(rootCommentId);
  };

  const handleCancelReply = () => {
    setReplyToComment(null);
    setActualParentId(null);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !reviewId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/feeds/${reviewId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: newComment.trim(),
            parent: actualParentId,
          }),
        },
      );

      if (response.ok) {
        setNewComment("");
        handleCancelReply();
        fetchComments();
      }
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="bg-movie-dark border border-movie-border/80 w-full max-w-xl rounded-xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-movie-border/40 bg-movie-bg/80 rounded-t-xl flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <img
                src={ProfPic}
                className="w-10 h-10 rounded-full object-cover border border-movie-border"
                alt="avatar"
              />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  @{review.user?.username || "user"}{" "}
                  <span className="text-movie-text-sec font-normal">
                    shared a review
                  </span>
                </h3>
                {review.rating && (
                  <div className="text-xs text-amber-400 mt-0.5">
                    {"★".repeat(review.rating)}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-movie-text-sec text-sm p-1 hover:text-white bg-movie-surface/30 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-3 bg-movie-surface/20 p-3 rounded-xl border border-movie-border/30 items-start">
            <img
              src={review.posterUrl}
              alt={review.movieTitle}
              className="w-16 h-24 object-cover rounded-md border border-movie-border shadow-md shrink-0"
            />
            <div className="flex flex-col gap-1 min-w-0">
              <h4 className="text-xs font-bold text-movie-accent uppercase tracking-wider">
                {review.movieTitle}
              </h4>
              <p className="text-sm text-movie-text-sec italic leading-relaxed whitespace-pre-line">
                "{review.content}"
              </p>
            </div>
          </div>
        </div>

        {/* COMMENTS AREA */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-movie-dark/50">
          {rootComments.length === 0 ? (
            <p className="text-xs text-movie-text-sec/40 text-center py-8 italic">
              No comments yet. Be the first to reply!
            </p>
          ) : (
            rootComments.map((comment) => {
              const replies = comment.replies || [];

              return (
                <div key={comment._id} className="flex flex-col gap-1.5">
                  <div className="bg-movie-surface/40 border border-movie-border/40 p-3 rounded-xl flex gap-3 shadow-sm">
                    <img
                      src={ProfPic}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      alt="avatar"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">
                          @{comment.user?.username || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-movie-text-sec/50">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-movie-text-sec/90 mt-1 wrap-break-words">
                        {comment.content}
                      </p>

                      <button
                        onClick={() => handleReplyClick(comment, comment._id)}
                        className="text-[11px] text-movie-accent hover:underline mt-2 w-fit font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        ↩️ Reply
                      </button>
                    </div>
                  </div>

                  {replies.length > 0 && (
                    <div className="flex flex-col gap-2 pl-6 border-l-2 border-movie-accent/30 ml-4 my-1">
                      {replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-movie-bg/80 border border-movie-border/30 p-2.5 rounded-xl flex gap-2.5 shadow-inner"
                        >
                          <img
                            src={ProfPic}
                            className="w-6 h-6 rounded-full object-cover shrink-0 opacity-80"
                            alt="avatar"
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-white/90">
                                @{reply.user?.username || "Anonymous"}
                              </span>
                              <span className="text-[9px] text-movie-text-sec/40">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-movie-text-sec/90 mt-1 wrap-break-words leading-relaxed">
                              <span className="text-movie-accent font-bold mr-1.5 bg-movie-accent/10 px-1 py-0.5 rounded">
                                @
                                {reply.parent === comment._id
                                  ? comment.user?.username
                                  : comment.replies?.find(
                                      (r) => r._id === reply.parent,
                                    )?.user?.username || comment.user?.username}
                              </span>
                              {reply.content}
                            </p>

                            <button
                              onClick={() =>
                                handleReplyClick(reply, comment._id)
                              }
                              className="text-[10px] text-movie-text-sec/60 hover:text-movie-accent hover:underline mt-1.5 w-fit font-medium flex items-center gap-0.5 cursor-pointer"
                            >
                              ↩️ Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER FORM */}
        <form
          onSubmit={handleSubmitComment}
          className="p-4 border-t border-movie-border/40 bg-movie-bg/80 flex flex-col gap-2 rounded-b-xl"
        >
          {replyToComment && (
            <div className="flex justify-between items-center bg-movie-accent/10 px-3 py-1.5 rounded-lg text-xs text-movie-accent border border-movie-accent/20">
              <span>
                Replying to <b>@{replyToComment.user?.username || "user"}</b>
              </span>
              <button
                type="button"
                onClick={handleCancelReply}
                className="hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                replyToComment
                  ? `Write a reply to @${replyToComment.user?.username}...`
                  : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-movie-surface/40 border border-movie-border/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-movie-accent"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-movie-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 disabled:opacity-40 cursor-pointer"
            >
              {replyToComment ? "Reply" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
