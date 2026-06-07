type MovieCardProps = {
  title: string;
  rating: string;
  genre: string;
};

function MovieCard({ title, rating, genre }: MovieCardProps) {
  return (
    <div className="movie-card">
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