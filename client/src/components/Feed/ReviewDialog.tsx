import { useState, useEffect } from "react";
import ProfPic from "@/assets/ProfPic.png";
import { API_URL } from "@/config";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit: (newReview?: any) => void;
}

export default function ReviewDialog({
  isOpen,
  onClose,
  onReviewSubmit,
}: ReviewDialogProps) {
  const [movieSearch, setMovieSearch] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [movie, setMovie] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData = {
      movie_id: selectedMovie,
      rating: rating,
      content: reviewText,
    };

    try {
      const response = await fetch(`${API_URL}/feeds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error("Failed to post");

      const createdReview = await response.json();

      // 1. Καθαρισμός της φόρμας
      setMovieSearch("");
      setSelectedMovie("");
      setRating(0);
      setReviewText("");

      if (typeof onReviewSubmit === "function") {
        onReviewSubmit(createdReview);
      }
      onClose();
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  const searchMovies = async (movieSearch: string) => {
    if (!movieSearch) return;

    try {
      const response = await fetch(
        `${API_URL}/movies/search?query=${encodeURIComponent(movieSearch)}&page=1&_t=${Date.now()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Network response not ok");
      const resBody = await response.json();

      if (resBody && Array.isArray(resBody.data)) {
        setMovie(resBody.data);
      } else if (Array.isArray(resBody)) {
        setMovie(resBody);
      } else {
        setMovie(resBody.results || []);
      }
    } catch (error) {
      console.error("Failed to search", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (movieSearch.length > 2) {
        searchMovies(movieSearch);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [movieSearch]);

  if (!isOpen) return null;

  const handleSelectMovie = (title: string, id: string) => {
    setSelectedMovie(id);
    setMovieSearch(title);
    setShowDropdown(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-in-out"
        onClick={onClose}
      />
      <div className="bg-movie-dark border border-movie-border/80 w-full max-w-lg rounded-xl shadow-2xl relative z-10 p-6 duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-movie-accent focus:ring-offset-2 disabled:pointer-events-none text-movie-text-sec cursor-pointer text-sm p-1"
        >
          ✕<span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 className="text-lg font-semibold text-white leading-none tracking-tight">
            Create New Review
          </h2>
          <p className="text-sm text-movie-text-sec/60">
            Share your cinema experience with the community. Select a movie and
            leave your rating.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3 items-start w-full relative">
            <img
              src={ProfPic}
              alt="User profile"
              className="w-9 h-9 border border-movie-accent/30 rounded-full object-cover shrink-0 mt-0.5"
            />

            <div className="flex-1 flex flex-col relative">
              <input
                type="text"
                placeholder="Search and select a movie..."
                value={movieSearch}
                onChange={(e) => {
                  setMovieSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-movie-surface/40 border border-movie-border/80 rounded-md px-3 py-2 text-sm text-white placeholder-movie-text-sec/40 focus:outline-none focus:ring-2 focus:ring-movie-accent/50 focus:border-movie-accent transition-all"
              />
              {showDropdown && movieSearch && movie.length > 0 && (
                <ul className="absolute left-0 right-0 top-11 bg-movie-bg border border-movie-border/80 rounded-md shadow-xl z-50 max-h-40 overflow-y-auto p-1">
                  {movie.map((movieItem) => (
                    <li
                      key={movieItem.id}
                      onClick={() =>
                        handleSelectMovie(
                          `${movieItem.original_title} (${new Date(movieItem.release_date).getFullYear()})`,
                          movieItem.id.toString(),
                        )
                      }
                      className="px-3 py-2 text-sm hover:bg-movie-surface hover:text-white rounded-sm cursor-pointer transition-colors"
                    >
                      <div className="flex gap-4">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movieItem.poster_path}`}
                          alt={movieItem.original_title}
                          className="w-18 h-18 object-fit"
                        />
                        <div className="flex flex-col gap-0.5">
                          <h2 className="text-movie-text text-md">
                            {movieItem.original_title}
                          </h2>{" "}
                          <span className="text-movie-text-sec text-sm">
                            ({new Date(movieItem.release_date).getFullYear()})
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-1 mt-1">
            <span className="text-xs font-medium text-movie-text-sec/80 tracking-wide">
              Rating
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-lg cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-movie-text-sec/20"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-xs font-semibold text-white bg-amber-400/10 px-2 py-0.5 rounded-md">
                {rating} / 5
              </span>
            )}
          </div>

          <div className="w-full mt-1">
            <textarea
              placeholder="What did you think of the movie? Share your thoughts..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full bg-movie-surface/40 border border-movie-border/80 rounded-md p-3 text-sm text-white placeholder-movie-text-sec/40 focus:outline-none focus:ring-2 focus:ring-movie-accent/50 focus:border-movie-accent resize-none transition-all leading-relaxed"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-movie-border/80 bg-transparent px-4 py-2 text-sm font-medium text-movie-text-sec hover:bg-movie-surface hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedMovie || rating === 0 || !reviewText.trim()}
              className="w-full sm:w-auto inline-flex justify-center items-center rounded-md bg-movie-accent text-white font-semibold text-sm px-4 py-2 hover:bg-opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Post Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
