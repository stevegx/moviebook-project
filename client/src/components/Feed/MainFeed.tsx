import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { API_URL } from "@/config";

interface Review {
  id: string;
  movie_id: string;
  rating: number;
  content: string;
  user?: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export default function MainFeed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getFeedData = async () => {
    try {
      const response = await fetch(`${API_URL}/feeds`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const resBody = await response.json();

      const rawReviews =
        resBody && Array.isArray(resBody.data)
          ? resBody.data
          : Array.isArray(resBody)
            ? resBody
            : [];

      const normalizedReviews = rawReviews.map((review: any) => ({
        id: review.id || review._id,
        movie_id: review.movie_id,
        rating: review.rating,
        content: review.content,
        reviewText: review.content || review.reviewText,
        username: review.user?.username || "Anonymous",
        user: review.user,
        createdAt: review.createdAt,
      }));

      setReviews(normalizedReviews);
    } catch (error) {
      console.error("failed to get reviews: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-sm text-movie-text-sec/60">
        Loading feeds...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {reviews.length === 0 ? (
        <p className="text-sm text-movie-text-sec/60 italic text-center py-8">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        reviews.map((review) => {
          const normalizedReview = {
            ...review,
            id: review.id || (review as any)._id,
          };
          return (
            <PostCard key={normalizedReview.id} review={normalizedReview} />
          );
        })
      )}
    </div>
  );
}
