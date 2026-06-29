import { useState, useEffect } from "react";
import ProfPic from "@/assets/ProfPic.png";
import MoviePosterFallback from "@/assets/MoviePoster3.jpg";
import CommentDialog from "./CommentDialog";
import { useAuth } from "../providers/AuthContext";
import { Link } from "react-router-dom";
import { API_URL } from "@/config";

interface PostCardProps {
  review: {
    id?: string;
    _id?: string;
    movie_id?: string;
    rating: number;
    content: string;
    createdAt: string;
    user?: {
      _id?: string;
      username: string;
      avatar?: string;
    };
  };
}

interface MovieDetails {
  title: string;
  poster_path: string;
}

interface LikeData {
  _id: string;
  user: string | { _id: string };
}

export default function PostCard({ review }: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userLikeId, setUserLikeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [movieLoading, setMovieLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const reviewId = review._id || review.id;

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_URL}/feeds/${reviewId}/likes/all`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setLikeCount(data.length);
        const currentUserId = user?._id || user?.id;
        const myLike = data.find(
          (l: any) => (l.user?._id || l.user) === currentUserId,
        );
        setUserLikeId(myLike ? myLike._id : null);
      } else {
        console.warn("API did not return a valid list:", data);
        setLikeCount(0);
        setUserLikeId(null);
      }
    } catch (err) {
      console.error("Fetch likes error:", err);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!review.movie_id) {
        setMovieLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/movies/${review.movie_id}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const resData = await response.json();
          setMovieDetails(resData.data || resData);
        }
      } catch (err) {
        console.error("Failed to fetch movie details from TMDB API:", err);
      } finally {
        setMovieLoading(false);
      }
    };

    fetchMovieDetails();
    fetchLikes();
  }, [review.movie_id, reviewId]);

  const handleLikeToggle = async () => {
    if (!reviewId) return;

    try {
      if (userLikeId) {
        const response = await fetch(
          `${API_URL}/feeds/${reviewId}/likes/${userLikeId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (response.ok) {
          setUserLikeId(null);
          setLikeCount((prev) => Math.max(0, prev - 1));
        } else {
          fetchLikes();
        }
      } else {
        const response = await fetch(`${API_URL}/feeds/${reviewId}/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const newData = await response.json();
          setUserLikeId(newData._id);
          setLikeCount((prev) => prev + 1);
        } else if (response.status === 400 || response.status === 409) {
          fetchLikes();
        }
      }
    } catch (err) {
      console.error("Error in handleLikeToggle:", err);
    }
  };

  const displayUsername = review.user?.username || "Anonymous";
  const displayReviewText = review.content || "";
  const displayTime = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : "Just now";

  const displayMovieTitle = movieLoading
    ? "Loading title..."
    : movieDetails?.title || `Movie #${review.movie_id}`;

  const posterUrl = movieDetails?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    : MoviePosterFallback;

  const currentRating = Math.min(
    Math.max(Math.round(review.rating || 0), 0),
    5,
  );

  return (
    <section className="flex flex-col gap-4 bg-movie-surface/40 p-5 rounded-xl border border-movie-border/60 max-w-2xl w-full">
      <div className="flex justify-between items-center w-full bg-movie-bg/60 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 496 512"
            className="w-10 h-10 text-movie-accent "
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
          </svg>
          <h2 className="text-sm md:text-base font-medium text-movie-text-sec">
            <div className="text-white font-semibold hover:text-movie-accent cursor-pointer transition-colors duration-200 inline-block">
              @{displayUsername}
            </div>{" "}
            reviewed
            <Link
              to={`/movies/${review?.movie_id}`}
              className="text-movie-accent font-bold italic hover:underline cursor-pointer inline-block"
            >
              {displayMovieTitle}
            </Link>
          </h2>
        </div>
        <span className="text-xs text-movie-text-sec shrink-0">
          {displayTime}
        </span>
      </div>

      <div className="flex gap-4 items-start w-full">
        <Link
          to={`/movies/${review?.movie_id}`}
          className="text-movie-accent font-bold italic hover:underline cursor-pointer inline-block"
        >
          {" "}
          <img
            src={posterUrl}
            alt={displayMovieTitle}
            className="w-24 h-36 object-cover rounded-md shadow-md shrink-0 border border-movie-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = MoviePosterFallback;
            }}
          />
        </Link>

        <div className="flex flex-col gap-2 grow min-w-0">
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded w-fit">
            <span>{"⭐".repeat(currentRating)}</span>
            <span className="text-xs ml-1 text-white">{currentRating}/5</span>
          </div>

          <p className="text-sm md:text-base text-movie-text-sec italic leading-relaxed line-clamp-4">
            "{displayReviewText}"
          </p>

          <button className="hover:underline cursor-pointer text-movie-accent text-xs font-medium w-fit mt-1">
            Read More
          </button>
        </div>
      </div>

      <hr className="border-movie-border/40 w-full mt-2" />

      {likeCount > 0 ? (
        <span className="text-xs font-semibold text-movie-text-main/80 animate-fade-in">
          ❤️ {likeCount} {likeCount === 1 ? "person" : "people"} liked this
          post!
        </span>
      ) : (
        <div className="my-2"></div>
      )}

      <div className="flex items-center gap-3 w-full pt-4 border-t border-movie-border/20">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer w-24
          ${
            userLikeId
              ? "bg-movie-accent/10 border-movie-accent/50 text-movie-accent"
              : "bg-transparent border-movie-border/40 text-movie-text-sec hover:border-movie-text-sec hover:text-white"
          }`}
        >
          <span>{userLikeId ? "❤️" : "🤍"}</span>
          {userLikeId ? "Liked" : "Like"}
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg border border-movie-border/40 text-sm font-medium text-movie-text-sec hover:text-white hover:border-movie-text-sec transition-all duration-200 cursor-pointer w-28"
        >
          <span>💬</span>
          Comment
        </button>

        <CommentDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          review={{
            id: reviewId,
            _id: reviewId,
            content: displayReviewText,
            rating: currentRating,
            movieTitle: displayMovieTitle,
            posterUrl: posterUrl,
            user: review.user || { username: displayUsername },
          }}
        />
      </div>
    </section>
  );
}
