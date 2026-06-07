import { useEffect, useState } from "react";
import PostFeed from "../components/FeedComponents/PostFeed";
import MainFeed from "../components/FeedComponents/MainFeed";
import SideFeed from "../components/FeedComponents/SideFeed";

export interface Review {
  id: string;
  username: string;
  movieTitle: string;
  reviewText: string;
  rating: number;
  timeAgo: string;
}
const DEFAULT_REVIEW: Review = {
  id: "1",
  username: "Not_Batman",
  movieTitle: "The Dark Knight",
  rating: 5,
  reviewText:
    "This movie was absolutely incredible! I loved every minute of it and the performances were top notch.",
  timeAgo: "2 days ago",
};
export default function FeedPage() {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const savedReviews = localStorage.getItem("moviebook_reviews");
    if (savedReviews) {
      try {
        return JSON.parse(savedReviews);
      } catch (error) {
        console.log("Error parsing reviews from localstorage", error);
        return [DEFAULT_REVIEW];
      }
    }
    return [DEFAULT_REVIEW];
  });

  useEffect(() => {
    localStorage.setItem("moviebook_reviews", JSON.stringify(reviews));
  }, [reviews]);

  const handleAddReview = (
    newReview: Omit<Review, "id" | "username" | "timeAgo">,
  ) => {
    const fullReview: Review = {
      id: Date.now().toString(),
      username: "Not_Batman",
      movieTitle: newReview.movieTitle,
      rating: newReview.rating,
      reviewText: newReview.reviewText,
      timeAgo: "Just Now",
    };
    setReviews((prevReviews) => [fullReview, ...prevReviews]);
  };
  return (
    <div className="flex flex-col items-start gap-6 max-w-5xl w-full mx-auto px-4 py-6">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight ">
          Recent Community Reviews
        </h1>
        <PostFeed onReviewSubmit={handleAddReview} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-start mt-4">
        <div className="flex-1 max-w-2xl w-full">
          <MainFeed reviews={reviews} />
        </div>

        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <SideFeed />
        </div>
      </div>
    </div>
  );
}
