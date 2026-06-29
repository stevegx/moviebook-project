import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/providers/AuthContext";
import ReviewCard from "@/components/moviePageComponents/ReviewCard";
import { API_URL } from "@/config";

export default function MyReviews() {
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const fetchAndFilterMyReviews = async () => {
      try {
        const currentUserId = (user as { id?: string; _id?: string })?.id ||
          (user as { id?: string; _id?: string })?._id;

        if (!currentUserId) {
          setError("User authentication ID missing. Please re-login.");
          setLoading(false);
          return;
        }

        setError(null);

        const response = await fetch(`${API_URL}/feeds`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const resData = await response.json();
        const allFeeds = Array.isArray(resData) ? resData : resData.data || [];

        const userReviews = allFeeds.filter((feed: any) => {
          if (!feed.user) return false;

          const feedUserId =
            typeof feed.user === "object"
              ? feed.user._id || feed.user.id
              : feed.user;

          return String(feedUserId).trim() === String(currentUserId).trim();
        });

        setMyReviews(userReviews);
      } catch (err: any) {
        console.error("Filtering flow broke:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterMyReviews();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-movie-accent mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
            Verifying identity & loading records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-100 py-16 px-4 relative overflow-hidden select-none">
      <div className="absolute top-[-20%] left-[-10%] w-150 h-150 bg-movie-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto z-10 relative">
        <header className="mb-12 border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold">My Reviews</h1>
          </div>
          <div className="text-xs font-mono text-gray-400 bg-white/2 border border-white/5 px-4 py-2 rounded-xl">
            Total Logs:{" "}
            <span className="text-movie-accent font-bold">
              {myReviews.length}
            </span>
          </div>
        </header>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono shadow-2xl">
            ⚠️ Auth/Fetch Error: {error}
          </div>
        )}

        {myReviews.length === 0 ? (
          <div className="text-center py-24 bg-white/1 border border-white/2 rounded-3xl p-8 backdrop-blur-md">
            <span className="text-5xl block mb-4 animate-bounce">🎬</span>
            <h3 className="text-lg font-bold text-gray-300 uppercase tracking-wide">
              No Reviews Found
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              Your personal feed is currently empty. Head over to the database
              to drop your first movie rating!
            </p>
            <Link
              to="/"
              className="mt-6 inline-block text-xs uppercase tracking-widest font-black bg-movie-accent text-white px-8 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.3)]"
            >
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {myReviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
