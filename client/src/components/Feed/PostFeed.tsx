import React, { useState } from "react";
import ProfPic from "@/Assets/ProfPic.png";
import ReviewDialog from "./ReviewDialog";

export default function PostFeed() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="surface-panel p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <img
          src={ProfPic}
          alt="Profile picture of the user"
          className="w-9 h-9 border border-movie-accent/40 rounded-full object-cover shrink-0 active:border-movie-accent cursor-pointer"
        />
        <p className="min-w-0 flex-1 text-sm text-movie-text-sec">Share your thoughts on a movie.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="button-primary"
        >
          Write a review
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
