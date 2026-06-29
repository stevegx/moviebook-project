import { useState } from "react";
import { FaComments } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { API_URL } from "@/config";
import { useAuth } from "../providers/AuthContext";
import ProfPic from "@/assets/ProfPic.png";

export default function MovieComments({ id, data }: { id?: string, data: any }) {
  const { user } = useAuth();

  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 py-8 px-4">
      <h2 className="text-white text-2xl font-bold self-start pl-2">Comments</h2>

      {data?.data.length ? (
        <div className="w-full max-w-screen-2xl mx-auto flex flex-col gap-8">
          {data.data.map((movie: any) => (
            <div key={`mc_${movie._id}`} className="flex flex-col gap-2 w-full">
              <div className="bg-movie-surface/40 border border-movie-border/40 p-3 rounded-xl flex gap-3 shadow-sm w-full">
                <img className="w-8 h-8 rounded-full object-cover shrink-0" alt="avatar" src={ProfPic} />
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">
                      @{user?.name}
                    </span>

                    <span className="text-[10px] text-movie-text-sec/50">{new Date(movie.createdAt).toLocaleDateString()}</span>
                  </div>
                
                  <p className="text-sm text-movie-text-sec/90 mt-1 wrap-break-words">{movie.content}</p>
                  <button className="text-[11px] text-movie-accent hover:underline mt-2 w-fit font-semibold flex items-center gap-1 cursor-pointer">↩️ Reply</button>
                </div>
              </div>
            </div>
          ))}

          <CommentDialog id={id} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-6 px-8 bg-gray-900 rounded-xl w-full max-w-md">
          <span className="flex items-center gap-2 text-lg text-center">
            <FaComments />
            No comments yet. Be the first commenter!
          </span>

          <div className="flex items-center justify-center">
            <CommentDialog id={id} />
          </div>
        </div>
      )}
    </section>
  )
}

function CommentDialog({ id }: { id?: string }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    content: ""
  })

  function refreshPage() {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  async function storeMovieComment(id: string, data: { content: string }) {
    const response = await fetch(`${API_URL}/movies/${id}/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "Comment submission failed");
    }

    return result;
  }

  async function handleSubmit(id: string, data: { content: string }) {
    try {
      await storeMovieComment(id, data);
      setOpen(false);
      refreshPage();
    } catch (error) {
      console.log("Comment post failed:", error);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-movie-accent/10 hover:bg-movie-accent/20 border border-movie-accent/30 text-movie-accent font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all"
      >
        Comment Now
      </button>

      {
        open && <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-movie-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Leave a comment</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-white/70 hover:text-white"
              >
                <IoCloseSharp />
              </button>
            </div>

            <form
              className="mt-5 flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (id) {
                  handleSubmit(id, formData);
                }
              }}
            >
              <label className="text-sm font-medium text-white/80" htmlFor="comment">
                Content
              </label>

              <textarea
                id="comment"
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-movie-accent/50 focus:ring-2 focus:ring-movie-accent/20"
                placeholder="Write your comment here..."
                onChange={(e) => setFormData({ content: e.target.value })}
              />

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-movie-accent px-4 py-2 text-sm font-semibold text-black transition hover:bg-movie-accent/90"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  )
}
