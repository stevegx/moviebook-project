import { useNavigate } from "react-router-dom";

type MovieCardProps = {
  id: number;
  title: string;
  rating: string;
  genre: string;
  isLoggedIn: boolean;
};

function MovieCard({ id, title, rating, genre, isLoggedIn }: MovieCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to view movie details!");
      navigate("/login");
    } else {
      navigate(`/movies/${id}`);
    }
  }


  return (
    <div
      onClick={handleCardClick} 
      className="movie-card">
      <div className="movie-poster">🎬</div>

      <div className="movie-info">
        <h3>{title}</h3>
        <p className="movie-meta">2024 • {genre}</p>
        <p className="movie-rating">⭐ {rating}</p>
      </div>
    </div>
  );
}

export default MovieCard;