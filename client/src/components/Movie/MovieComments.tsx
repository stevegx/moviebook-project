import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { API_URL } from "@/config";

interface MovieComment {
  _id: string;
  content: string;
  createdAt: string;
  user?: { username: string };
  replies?: MovieComment[];
}

interface ReplyTarget {
  id: string;
  username: string;
}

function CommentThread({ comment, onReply }: {
  comment: MovieComment;
  onReply: (target: ReplyTarget) => void;
}) {
  const username = comment.user?.username || "anonymous";
  return (
    <li className="space-y-3">
      <article className="rounded-xl border border-movie-border bg-movie-input p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <strong className="break-words">@{username}</strong>
          <time className="text-movie-text-sec" dateTime={comment.createdAt}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </time>
        </div>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm text-movie-text-sec">{comment.content}</p>
        <button className="text-link mt-2 min-h-9 rounded text-sm" onClick={() => onReply({ id: comment._id, username })}>
          Reply
        </button>
      </article>
      {!!comment.replies?.length && (
        <ul className="space-y-3 border-l border-movie-border pl-3">
          {comment.replies.map((reply) => <CommentThread key={reply._id} comment={reply} onReply={onReply} />)}
        </ul>
      )}
    </li>
  );
}

export default function MovieComments({ id, data }: { id?: string; data?: { data: MovieComment[] } | null }) {
  const [composer, setComposer] = useState<ReplyTarget | "new" | null>(null);
  const comments = data?.data ?? [];

  return (
    <section className="surface-panel w-full space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="section-title">Comments</h2>
        <button className="button-primary" onClick={() => setComposer("new")}>Write a comment</button>
      </div>
      {comments.length ? (
        <ul className="space-y-3">
          {comments.map((comment) => <CommentThread key={comment._id} comment={comment} onReply={setComposer} />)}
        </ul>
      ) : (
        <p className="rounded-xl bg-movie-input p-4 text-sm text-movie-text-sec">No comments yet.</p>
      )}
      {composer && id && (
        <CommentDialog movieId={id} reply={composer === "new" ? undefined : composer} onClose={() => setComposer(null)} />
      )}
    </section>
  );
}

function CommentDialog({ movieId, reply, onClose }: {
  movieId: string;
  reply?: ReplyTarget;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/movies/${movieId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), parent: reply?.id }),
      });
      if (!response.ok) throw new Error("Could not post your comment.");
      window.location.reload();
    } catch {
      setSaving(false);
      setError("Could not post your comment. Try again.");
    }
  }

  return (
    <dialog ref={dialog} className="modal-panel" aria-labelledby="movie-comment-title"
      onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}>
      <h2 id="movie-comment-title" className="section-title mb-4">
        {reply ? `Reply to @${reply.username}` : "Write a comment"}
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="form-label">
          Comment
          <textarea className="input-control resize-y" rows={4} required value={content}
            onChange={(event) => setContent(event.target.value)} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="flex justify-end gap-3">
          <button className="button-secondary" type="button" disabled={saving} onClick={onClose}>Cancel</button>
          <button className="button-primary" type="submit" disabled={saving || !content.trim()}>Post comment</button>
        </div>
      </form>
    </dialog>
  );
}
