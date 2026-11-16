import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReviewCard from "@/components/Movie/ReviewCard";
import { API_URL } from "@/config";

type Review = {
  _id: string;
  movie_id: string;
  content: string;
  rating: number;
  createdAt: string;
};

type ReviewPage = { data: Review[]; total: number; total_pages: number };

export default function MyReviews() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ page: number; data?: ReviewPage }>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/feeds?mine=true&page=${page}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load reviews.");
        return response.json() as Promise<ReviewPage>;
      })
      .then((data) => setResult({ page, data }))
      .catch((error: Error) => {
        if (error.name !== "AbortError") setResult({ page });
      });
    return () => controller.abort();
  }, [page]);

  const current = result?.page === page ? result : undefined;

  return (
    <section className="page-shell space-y-6">
      <h1 className="page-title">My reviews</h1>
      {!current ? (
        <p role="status" className="surface-panel p-6 text-movie-text-sec">Loading reviews…</p>
      ) : !current.data ? (
        <p role="alert" className="form-error">Could not load your reviews. Try again later.</p>
      ) : current.data.total === 0 ? (
        <div className="surface-panel max-w-xl space-y-4 p-6">
          <p className="text-movie-text-sec">Your reviews will appear here after you post them.</p>
          <Link className="button-primary" to="/feed">Go to the feed</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {current.data.data.map((review) => <ReviewCard key={review._id} review={review} />)}
          </div>
          {current.data.total_pages > 1 && (
            <div className="flex flex-wrap items-center gap-3" aria-label="Review pages">
              <button className="button-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-sm text-movie-text-sec">Page {page} of {current.data.total_pages}</span>
              <button className="button-secondary" disabled={page >= current.data.total_pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
