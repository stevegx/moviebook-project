import React, { useState } from "react";
import ProfPic from "@/assets/ProfPic.png";
import ReviewDialog from "./ReviewDialog";

export default function PostFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-movie-surface/40 p-4 rounded-xl border border-movie-border/60 max-w-2xl w-full mt-5">
      <div className="flex gap-3 items-center w-ful">
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
        <div
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-movie-surface/60 border border-movie-border/80 rounded-lg px-4 py-2.5 text-sm text-movie-text-sec/50 cursor-pointer hover:border-movie-accent/60 hover:bg-movie-surface/80 transition-all duration-200"
        >
          Share your thoughts on a movie...
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-movie-accent/10 hover:bg-movie-accent/20 border border-movie-accent/30 text-movie-accent font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all"
        >
          Review
        </button>
      </div>
      <ReviewDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmit={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
