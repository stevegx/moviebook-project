import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function ReviewCard({ review }: { review: any }) {
  const [movieData, setMovieData] = useState<any>(null);
  const [loadingMovie, setLoadingMovie] = useState<boolean>(false);

  useEffect(() => {
    const movieId = review?.movie_id;
    if (!movieId) return;

    const fetchMovieDetail = async () => {
      setLoadingMovie(true);

      try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);

        if (!response.ok) throw new Error("Failed to fetch movie info");
        
        const data = await response.json();
        setMovieData(data);
      } catch (err) {
        console.error("Failed to fetch movie details for ID:", movieId, err);
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovieDetail();
  }, [review?.movie_id]);

  const displayTitle = movieData?.title || movieData?.original_title || `Movie ID: ${review.movie_id}`;

  return (
    <div className="p-6 rounded-2xl bg-linear-to-r from-white/1to-transparent border border-white/4 hover:border-movie-accent/30 hover:from-movie-accent/1 transition-all duration-300 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
      <div className="flex items-start gap-4 w-full md:w-auto">
        <Link
          to={`/movies/${review.movie_id}`}
          className="w-16 h-24 bg-white/3 border border-white/8 rounded-xl shrink-0 overflow-hidden flex items-center justify-center relative group-hover:border-movie-accent/40 transition-colors duration-300 "
        >
          {loadingMovie ? (
            <div className="animate-pulse w-full h-full bg-white/5" />
          ) : movieData?.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${movieData.poster_path}`}
              alt={displayTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-xl opacity-40">🎬</span>
          )}
        </Link>

        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold tracking-tight">
            {loadingMovie ? (
              <span className="inline-block w-48 h-5 bg-white/5 animate-pulse rounded" />
            ) : (
              <Link
                to={`/movies/${review.movie_id}`}
                className="text-white hover:text-movie-accent transition-colors duration-200 block"
              >
                {displayTitle}
              </Link>
            )}
          </h3>

          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-base">
                {i < review.rating ? "★" : "☆"}
              </span>
            ))}
            <span className="text-xs text-gray-500 font-mono ml-2">
              ({review.rating}/5)
            </span>
          </div>

          <p className="text-gray-300 italic text-sm font-light leading-relaxed max-w-3xl pt-1">
            "{review.content || "No review content provided."}"
          </p>
        </div>
      </div>

      <div className="flex md:flex-col justify-between md:justify-center items-end w-full md:w-auto border-t border-gray-900 md:border-none pt-4 md:pt-0 gap-2">
        <span className="text-[11px] text-movie-text-sec font-mono">
          {review.createdAt
            ? new Date(review.createdAt).toLocaleDateString()
            : ""}
        </span>
        <Link
          to={`/feed`}
          className="text-[11px] uppercase tracking-wider font-bold bg-white/3 border border-white/8 hover:bg-movie-accent text-white px-4 py-2 rounded-xl transition-all duration-200"
        >
          View on Feed
        </Link>
      </div>
    </div>
  );
}
