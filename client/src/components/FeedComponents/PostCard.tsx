import React, { useState, useEffect } from "react";
import ProfPic from "../../Assets/ProfPic.png";
import MoviePosterFallback from "../../Assets/MoviePoster3.jpg";
import CommentDialog from "./CommentDialog";
import { useAuth } from "../providers/AuthContext";
interface PostCardProps {
  review: {
    id?: string;
    _id?: string;
    movie_id?: string;
    rating: number;
    content: string;
    createdAt: string;
    user?: {
      _id?: string; // 🟢 Χρειαζόμαστε το ID του user για να δούμε αν έχει κάνει like
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
  user: string | { _id: string }; // Μπορεί να είναι string ID ή populated object
}

export default function PostCard({ review }: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [userLikeId, setUserLikeId] = useState<string | null>(null); // 🟢 Κρατάει το ID του like αν έχει κάνει ο χρήστης
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [movieLoading, setMovieLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const reviewId = review._id || review.id;

  // 1. Fetch Likes (Count & Check Status)
  const fetchLikes = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/feeds/${reviewId}/likes/all`,
        { credentials: "include" },
      );
      const data = await response.json();

      // 🟢 SAFE CHECK: Ensure data is an array before using .find
      if (response.ok && Array.isArray(data)) {
        setLikeCount(data.length);
        const currentUserId = user?._id || user?.id;
        const myLike = data.find(
          (l: any) => (l.user?._id || l.user) === currentUserId,
        );
        setUserLikeId(myLike ? myLike._id : null);
      } else {
        console.warn("API did not return a valid list:", data);
        setLikeCount(0); // Reset count if data is invalid
        setUserLikeId(null);
      }
    } catch (err) {
      console.error("Fetch likes error:", err);
    }
  };

  // 2. Fetch Movie Details & Likes on Mount
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!review.movie_id) {
        setMovieLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/api/movies/${review.movie_id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

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

  // 3. Handle Like / Unlike Toggle
  const handleLikeToggle = async () => {
    if (!reviewId) return;

    try {
      if (userLikeId) {
        // --- DELETE LOGIC ---
        console.log("Attempting to delete like with ID:", userLikeId);

        const response = await fetch(
          `http://localhost:8000/api/feeds/${reviewId}/likes/${userLikeId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        if (response.ok) {
          setUserLikeId(null);
          setLikeCount((prev) => Math.max(0, prev - 1));
          console.log("Like deleted successfully");
        } else {
          console.error("Failed to delete. Status:", response.status);
          // Αν απέτυχε, ίσως το like δεν υπάρχει πια, οπότε ανανεώνουμε το state
          fetchLikes();
        }
      } else {
        // --- POST LOGIC ---
        console.log("Attempting to create like for feed:", reviewId);

        const response = await fetch(
          `http://localhost:8000/api/feeds/${reviewId}/likes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        if (response.ok) {
          const newData = await response.json();
          setUserLikeId(newData._id);
          setLikeCount((prev) => prev + 1);
          console.log("Like created successfully");
        } else if (response.status === 400 || response.status === 409) {
          // 400 Bad Request ή 409 Conflict (αν υπάρχει ήδη)
          console.warn("Like already exists or invalid request, refreshing...");
          fetchLikes();
        } else {
          console.error("Failed to post like. Status:", response.status);
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
      {/* TOP ROW */}
      <div className="flex justify-between items-center w-full bg-movie-bg/60 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <img
            src={ProfPic}
            alt="Profile pic"
            className="w-10 h-10 border border-movie-accent/40 rounded-full object-cover shrink-0"
          />
          <h2 className="text-sm md:text-base font-medium text-movie-text-sec">
            <span className="text-white font-semibold hover:text-movie-accent cursor-pointer transition-colors duration-200">
              @{displayUsername}
            </span>{" "}
            reviewed{" "}
            <span className="text-movie-accent font-bold italic hover:underline cursor-pointer">
              {displayMovieTitle}
            </span>
          </h2>
        </div>
        <span className="text-xs text-movie-text-sec shrink-0">
          {displayTime}
        </span>
      </div>

      {/* MIDDLE ROW */}
      <div className="flex gap-4 items-start w-full">
        <img
          src={posterUrl}
          alt={displayMovieTitle}
          className="w-24 h-36 object-cover rounded-md shadow-md shrink-0 border border-movie-border"
          onError={(e) => {
            (e.target as HTMLImageElement).src = MoviePosterFallback;
          }}
        />

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

      {/* LIKE COUNTER */}
      {likeCount > 0 ? (
        <span className="text-xs font-semibold text-movie-text-main/80 animate-fade-in">
          ❤️ {likeCount} {likeCount === 1 ? "person" : "people"} liked this
          post!
        </span>
      ) : (
        <div className="my-2"></div>
      )}

      {/* BOTTOM ROW */}
      <div className="flex items-center gap-3 w-full pt-4 border-t border-movie-border/20">
        {/* Live Like Button */}
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

        {/* Comment Button */}
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
