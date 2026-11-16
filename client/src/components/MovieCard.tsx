import { Link } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";

type MovieCardProps = {
  id: number;
  title: string;
  vote_average: string;
  poster_path?: string;
  release_date?: string | Date;
};

function MovieCard({ id, title, vote_average, poster_path, release_date }: MovieCardProps) {
  const movieImageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w342${poster_path}`
    : "https://placehold.co/342x513/1a1a1a/ffffff?text=No+Image";

  return (
    <Link to={`/movies/${id}`} className="movie-card block">
      <div className="w-full aspect-2/3 overflow-hidden">
        <img 
          src={movieImageUrl} 
          alt={title} 
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="space-y-1 p-3 sm:p-4">
        <h3 className="font-bold text-base truncate">{title}</h3>
        
        <span className="flex items-center gap-1.5 text-sm text-movie-text-sec">
          <FaRegClock />
          {release_date ? new Date(release_date).getFullYear() : 'Unknown'}
        </span>

        <span className="flex items-center gap-1.5 text-sm">
          <FaStar className="text-movie-highlight" aria-hidden="true" />
          {Number(vote_average).toFixed(1)}
        </span>
      </div>
    </Link>
  );

}
export default MovieCard;
