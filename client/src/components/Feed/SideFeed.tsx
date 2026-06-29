import MovieGallery from "../Movie/MovieGallery";

export default function SideFeed() {
  return (
    <div className="hidden lg:flex flex-col gap-6 w-full max-w-xs">
      <div className="flex flex-col bg-movie-surface/40 p-5 rounded-xl border border-movie-border/60 gap-4 w-full overflow-x-hidden">
        <h1 className="text-base font-bold text-white tracking-wide uppercase opacity-90">
          Trending Movies
        </h1>
        
        <div>
          <MovieGallery
            category="popular"
            className="p-0 mb-0"
            isSidebar={true}
          />
        </div>
      </div>
    </div>
  );
}
