import MovieGallery from "../Movie/MovieGallery";

export default function SideFeed() {
  return (
    <aside className="surface-panel hidden min-w-0 space-y-4 p-5 lg:block">
      <h2 className="section-title">Trending movies</h2>
      <MovieGallery category="popular" isSidebar />
    </aside>
  );
}
