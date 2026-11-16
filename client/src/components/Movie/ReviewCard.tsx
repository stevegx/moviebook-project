import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/config"

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
    <div className="surface-panel flex flex-col justify-between gap-4 p-5">
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
          <h3 className="section-title">
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

          <div className="flex items-center gap-1 text-movie-highlight">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-base">
                {i < review.rating ? "★" : "☆"}
              </span>
            ))}
            <span className="ml-2 text-xs text-movie-text-sec">
              ({review.rating}/5)
            </span>
          </div>

          <p className="break-words pt-1 text-sm leading-relaxed text-movie-text-sec">
            "{review.content || "No review content provided."}"
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-movie-border pt-4">
        <span className="text-[11px] text-movie-text-sec font-mono">
          {review.createdAt
            ? new Date(review.createdAt).toLocaleDateString()
            : ""}
        </span>
        <Link
          to={`/feed`}
          className="button-secondary"
        >
          View on Feed
        </Link>
      </div>
    </div>
  );
}
