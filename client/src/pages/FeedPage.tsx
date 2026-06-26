import { useEffect, useState } from "react";
import PostFeed from "../components/FeedComponents/PostFeed";
import MainFeed from "../components/FeedComponents/MainFeed";
import SideFeed from "../components/FeedComponents/SideFeed";

export default function FeedPage() {
  return (
    <div className="flex flex-col items-start gap-6 max-w-5xl w-full mx-auto px-4 py-6">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight ">
          Recent Community Reviews
        </h1>
        <PostFeed />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full justify-center items-start mt-4">
        <div className="flex-1 max-w-2xl w-full">
          <MainFeed />
        </div>

        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <SideFeed />
        </div>
      </div>
    </div>
  );
}
