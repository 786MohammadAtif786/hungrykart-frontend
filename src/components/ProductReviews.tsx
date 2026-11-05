import { useEffect, useState } from "react";
import { SERVER_URL } from "../lib/socket";

type Review = { _id: string; rating: number; description: string; userName: string; createdAt: string };
type Data = {
  average: number;
  total: number;
  breakdown: Record<string, number>;
  pages: number;
  reviews: Review[];
};

const Stars = ({ value, size = "text-lg" }: { value: number; size?: string }) => (
  <span className={`${size} tracking-tight`} aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <span key={n} className={n <= Math.round(value) ? "text-sauce" : "text-gray-300"}>★</span>
    ))}
  </span>
);

export default function ProductReviews({ productId }: { productId?: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    setData(null);
  }, [productId]);

  useEffect(() => {
    // productId nahi hai to fetch hi mat karo (400 error yahin se aata hai)
    if (!productId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`${SERVER_URL}/api/reviews/product/${productId}?page=${page}&limit=5`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setData(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [productId, page]);

  if (!productId) return null;
  if (loading && !data) return <p className="mt-8 text-ink/60">Loading reviews…</p>;
  if (!data) return null;

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-5">
      <h2 className="text-xl font-extrabold">Customer Reviews</h2>

      {data.total === 0 ? (
        <p className="mt-3 text-ink/60">No reviews yet. Order karke pehla review dein! ⭐</p>
      ) : (
        <>
          {/* Average + breakdown */}
          <div className="mt-4 flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="text-center sm:pr-6 sm:border-r border-black/10">
              <div className="text-5xl font-extrabold text-sauce">{data.average.toFixed(1)}</div>
              <Stars value={data.average} size="text-xl" />
              <div className="text-sm text-ink/60 mt-1">
                {data.total} review{data.total !== 1 && "s"}
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((n) => {
                const c = data.breakdown[n] ?? 0;
                const pct = data.total ? (c / data.total) * 100 : 0;
                return (
                  <div key={n} className="flex items-center gap-2 text-sm">
                    <span className="w-8 shrink-0">{n} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-sauce" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-ink/60">{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <ul className="mt-6 divide-y divide-black/10">
            {data.reviews.map((r) => (
              <li key={r._id} className="py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-sauce/10 text-sauce font-bold flex items-center justify-center">
                      {r.userName.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold">{r.userName}</span>
                  </div>
                  <span className="text-xs text-ink/50">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-1.5"><Stars value={r.rating} size="text-base" /></div>
                <p className="mt-1 text-ink/80">{r.description}</p>
              </li>
            ))}
          </ul>

          {data.pages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg ring-1 ring-black/10 disabled:opacity-40"
              >
                ‹ Prev
              </button>
              <span className="text-sm">{page} / {data.pages}</span>
              <button
                disabled={page === data.pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg ring-1 ring-black/10 disabled:opacity-40"
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}