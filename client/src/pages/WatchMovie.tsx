import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "@/config";

type Trailer = { key: string; name: string };
type TrailerState = {
  movieId?: string;
  trailer: Trailer | null;
  error?: string;
};

export default function WatchMovie() {
  const { id } = useParams();
  const [result, setResult] = useState<TrailerState>();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/movies/${id}/trailer`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the trailer. Try again later.");
        return response.json() as Promise<Trailer | null>;
      })
      .then((trailer) => setResult({ movieId: id, trailer }))
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setResult({ movieId: id, trailer: null, error: "Could not load the trailer. Try again later." });
        }
      });

    return () => controller.abort();
  }, [id]);

  const current = result?.movieId === id ? result : undefined;

  return (
    <section className="page-shell space-y-6">
      <Link className="button-secondary" to={`/movies/${id}`}>Back to movie</Link>
      <h1 className="page-title">Official trailer</h1>

      {!current ? (
        <p className="surface-panel p-6 text-movie-text-sec" role="status">Loading trailer…</p>
      ) : current.trailer ? (
        <div className="max-w-5xl space-y-4">
          <iframe
            className="aspect-video w-full rounded-2xl border border-movie-border bg-black"
            src={`https://www.youtube-nocookie.com/embed/${current.trailer.key}`}
            title={current.trailer.name}
            allow="encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a
            className="button-secondary"
            href={`https://www.youtube.com/watch?v=${current.trailer.key}`}
            target="_blank"
            rel="noreferrer"
          >
            Open on YouTube
          </a>
        </div>
      ) : (
        <p className="surface-panel p-6 text-movie-text-sec" role={current.error ? "alert" : "status"}>
          {current.error || "An official YouTube trailer is unavailable for this movie."}
        </p>
      )}
    </section>
  );
}
