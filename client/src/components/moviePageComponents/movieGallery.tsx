import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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

  // States για το drag-to-scroll
  const [isDown, setIsDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  useEffect(() => {
    async function getMoviesByCategory(cat: string) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/movies/${cat}?page=1`,
        );
        const data = await response.json();
        setMovies(data.results || data);
      } catch (error) {
        console.error(error);
      }
    }

    getMoviesByCategory(category);
  }, [category]);

  // Λειτουργίες Drag
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
  const scrollContainerClasses = `flex gap-4 w-full overflow-x-hidden cursor-grab active:cursor-grabbing select-none ${
    isSidebar ? "snap-x snap-mandatory" : ""
  }`;

  const movieItemClasses = isSidebar
    ? "flex-[0_0_50%] snap-start" // 50% πλάτος = 2 ταινίες
    : "flex-none";

  return (
    <div className={`max-w-7xl mx-auto p-4 relative group mb-10 ${className}`}>
      {tittle && (
        <h2 className="text-3xl text-white font-bold mb-6 capitalize">
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
          className="absolute left-0 z-20 bg-black/60 p-2 rounded-full hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
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
            .filter((movieResult) => movieResult.id !== currentMovieId)
            .map((movie) => (
              <div key={movie.id} className={movieItemClasses}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    if (!isDragging) {
                      window.location.href = `/movies/${movie.id}`;
                    }
                  }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    draggable="false"
                    className="rounded-xl w-40 h-60 object-cover shadow-lg"
                  />
                </div>
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
          className="absolute right-0 z-20 bg-black/60 p-2 rounded-full hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
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
