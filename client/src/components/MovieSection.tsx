import MovieCard from "./MovieCard";

type MovieSectionProps = {
    movies: {
    id: number;
    title: string;
    vote_average: string;
    poster_path: string | undefined;
    release_date?: string | Date;
  }[];
};

function MovieSection({
  movies,
}: MovieSectionProps) {
  const displayedMovies = movies.slice(0, 8);
  
  return (
    <section className="mb-12">
      <div className="flex gap-5 flex-wrap">
        {displayedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            vote_average={movie.vote_average}
            release_date={movie.release_date}
            poster_path={movie.poster_path}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;