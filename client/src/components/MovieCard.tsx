import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";

type MovieCardProps = {
  id: number;
  title: string;
  vote_average: string;
  poster_path?: string;
  release_date?: string | Date;
};

function MovieCard({ id, title, vote_average, poster_path, release_date }: MovieCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${id}`);
  };

  const movieImageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w342${poster_path}`
    : "https://placehold.co/342x513/1a1a1a/ffffff?text=No+Image";

  return (
    <div
      onClick={handleCardClick} 
      className="movie-card">
      <div className="w-full aspect-2/3 overflow-hidden">
        <img 
          src={movieImageUrl} 
          alt={title} 
          className="size-full object-cover hover:scale-105 transition-transform duration-300 rounded"
        />
      </div>

      <div className="flex flex-col mt-4">
        <h3 className="font-bold text-base truncate">{title}</h3>
        
        <span className="flex items-center gap-1 text-sm text-gray-300">
          <FaRegClock />
          {release_date ? new Date(release_date).getFullYear() : 'Unknown'}
        </span>

        <span className="flex items-center gap-1">
          <FaStar color="gold" />
          {Number(vote_average).toFixed(1)}
        </span>
      </div>
    </div>
  );

}
export default MovieCard;