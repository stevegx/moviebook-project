import { useState, useEffect, use } from "react";
import { useSearchParams } from "react-router-dom";
import HeroBanner from "@/components/HeroBanner";
import MovieSection from "@/components/MovieSection";
import { API_URL } from "@/config";

const safeFetchMovies = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) return { results: [] };
      return res.json();
    })
    .catch(() => ({ results: [] }));

const popularPromise = safeFetchMovies(`${API_URL}/movies/list?type=popular`);
const topRatedPromise = safeFetchMovies(`${API_URL}/movies/list?type=top_rated`);
const upcomingPromise = safeFetchMovies(`${API_URL}/movies/list?type=upcoming`);
const nowPlayingPromise = safeFetchMovies(`${API_URL}/movies/list?type=now_playing`);

function HomePage() {
  const popularData = use(popularPromise);
  const topRatedData = use(topRatedPromise);
  const upcomingData = use(upcomingPromise);
  const nowPlayingData = use(nowPlayingPromise);

  const trending = popularData.results || [];
  const featuredBackdrops = trending.filter((movie: any) => movie.backdrop_path).slice(0, 3);
  const topRated = topRatedData.results || [];
  const upcoming = upcomingData.results || [];
  const nowPlaying = nowPlayingData.results || [];
  const [currentTrendingPage, setCurrentTrendingPage] = useState(0);
  const moviesPerPage = 5;

  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || "";
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!urlSearchQuery || urlSearchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await fetch(`${API_URL}/movies/search?query=${encodeURIComponent(urlSearchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setSearchLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [urlSearchQuery]);

  const isSearching = urlSearchQuery && urlSearchQuery.trim() !== "";

  return (
    <div className="page-shell">
      {isSearching ? (
        <div className="space-y-6">
          <h1 className="page-title">
            Search Results for:{" "}
            <span className="text-movie-accent">"{urlSearchQuery}"</span>
          </h1>
          {searchLoading ? (
            <p className="text-movie-accent animate-pulse">Searching...</p>
          ) : (
            <MovieSection movies={searchResults} />
          )}
        </div>
      ) : (
        <>
          <HeroBanner backdrops={featuredBackdrops} />

          <div className="mt-8 space-y-10 sm:mt-10">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 border-b border-movie-border pb-2">
                  <h2 className="section-title">
                    Popular
                  </h2>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      disabled={currentTrendingPage === 0}
                      onClick={() =>
                        setCurrentTrendingPage((prev) => prev - 1)
                      }
                      className={`inline-flex min-h-11 items-center text-sm font-semibold transition-colors ${
                        currentTrendingPage === 0
                          ? "text-movie-text-sec/65"
                          : "text-movie-accent hover:text-movie-accent-hover cursor-pointer"
                      }`}
                    >
                      ← Previous
                    </button>

                    <span className="text-xs text-movie-text-sec font-medium">
                      Page {currentTrendingPage + 1}
                    </span>

                    <button
                      disabled={
                        (currentTrendingPage + 1) * moviesPerPage >=
                        trending.length
                      }
                      onClick={() =>
                        setCurrentTrendingPage((prev) => prev + 1)
                      }
                      className={`inline-flex min-h-11 items-center text-sm font-semibold transition-colors ${
                        (currentTrendingPage + 1) * moviesPerPage >=
                        trending.length
                          ? "text-movie-text-sec/65"
                          : "text-movie-accent hover:text-movie-accent-hover cursor-pointer"
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <MovieSection
                  movies={trending.slice(
                    currentTrendingPage * moviesPerPage,
                    (currentTrendingPage + 1) * moviesPerPage,
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="border-b border-movie-border pb-3">
                  <h2 className="section-title">
                    Top Rated
                  </h2>
                </div>

                <MovieSection movies={topRated} />
              </div>

              <div className="space-y-4">
                <div className="border-b border-movie-border pb-3">
                  <h2 className="section-title">
                    Now Playing
                  </h2>
                </div>

                <MovieSection movies={nowPlaying} />
              </div>

              <div className="space-y-4">
                <div className="border-b border-movie-border pb-3">
                  <h2 className="section-title">
                    Upcoming
                  </h2>
                </div>

                <MovieSection movies={upcoming} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
