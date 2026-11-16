import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "@/config";

interface MovieGalleryProps {
  category: string;
  currentMovieId?: string;
  tittle?: string;
  className?: string;
  isSidebar?: boolean;
}
interface Movie {
  id: string;
  title: string;
  poster_path: string;
}

export default function MovieGallery({
  category,
  currentMovieId,
  tittle,
  className = "",
  isSidebar = false,
}: MovieGalleryProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    async function getMoviesByCategory(cat: string) {
      try {
        const response = await fetch(`${API_URL}/movies/list?type=${encodeURIComponent(cat)}&page=1`);
        if (!response.ok) throw new Error("Could not load movies");
        const data = await response.json();
        setMovies(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error(error);
      }
    }

    getMoviesByCategory(category);
  }, [category]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = x - startX;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }

    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const scrollContainerClasses = `flex gap-4 w-full overflow-x-auto cursor-grab active:cursor-grabbing select-none ${
    isSidebar ? "snap-x snap-mandatory" : ""
  }`;

  const movieItemClasses = isSidebar
    ? "flex-[0_0_50%] snap-start"
    : "flex-none";

  return (
    <div className={`relative group min-w-0 ${className}`}>
      {tittle && (
        <h2 className="section-title mb-4">
          {tittle}
        </h2>
      )}

      <div className="relative flex items-center">
        <button
          onClick={() => {
            const width = scrollRef.current?.offsetWidth || 0;
            scrollRef.current?.scrollBy({
              left: -width * 0.5,
              behavior: "smooth",
            });
          }}
          aria-label="Scroll movies left"
          className="button-secondary absolute left-1 z-20 p-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className={scrollContainerClasses}
          onMouseDown={handleMouseDown}
          onMouseLeave={() => setIsDown(false)}
          onMouseUp={() => setIsDown(false)}
          onMouseMove={handleMouseMove}
        >
          {movies
            .filter((movieResult) => String(movieResult.id) !== currentMovieId)
            .map((movie) => (
              <div key={movie.id} className={movieItemClasses}>
                <Link
                  className="block rounded-xl"
                  to={`/movies/${movie.id}`}
                  onClick={(event) => { if (isDragging && event.detail > 0) event.preventDefault(); }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    draggable="false"
                    className="aspect-2/3 w-36 rounded-xl object-cover sm:w-40"
                  />
                </Link>
              </div>
            ))}
        </div>

        <button
          onClick={() => {
            const width = scrollRef.current?.offsetWidth || 0;
            scrollRef.current?.scrollBy({
              left: width * 0.5,
              behavior: "smooth",
            });
          }}
          aria-label="Scroll movies right"
          className="button-secondary absolute right-1 z-20 p-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
