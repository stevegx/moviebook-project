import MovieCard from "./MovieCard";

type MovieSectionProps = {
  title: string;
  movies: {
    id: number;
    title: string;
    rating: number;
    genre: string;
  }[];
};

function MovieSection({
  title,
  movies,
}: MovieSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-5">
        {title}
      </h2>

      <div className="flex gap-5 flex-wrap">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            rating={movie.rating.toString()}
            genre={movie.genre}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;