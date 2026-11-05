// components/Pagination.tsx
export default function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  if (pages <= 1) return null;

  // 1 ... 4 5 6 ... 10 jaisa window
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }

  const base = "min-w-9 h-9 px-3 rounded-lg text-sm font-semibold transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
      <button
        className={`${base} bg-white ring-1 ring-black/10 disabled:opacity-40`}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹ Prev
      </button>

      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`d${i}`} className="px-1 text-ink/40">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`${base} ${
              n === page ? "bg-sauce text-white" : "bg-white ring-1 ring-black/10 hover:bg-cheese"
            }`}
          >
            {n}
          </button>
        )
      )}

      <button
        className={`${base} bg-white ring-1 ring-black/10 disabled:opacity-40`}
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Next ›
      </button>
    </nav>
  );
}