import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useSearch } from "../context/SearchContext";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { query } = useSearch();
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .products()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  return (
    <>
      <Banner />

      <section className="max-w-6xl mx-auto px-4 py-8">
        {query && (
          <p className="mb-4 text-sm text-ink/70">
            {filtered.length} result{filtered.length !== 1 && "s"} for{" "}
            <span className="font-semibold text-ink">“{query}”</span>
          </p>
        )}

        {loading && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center gap-4 py-16"
          >
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-sauce/20 border-t-sauce" />
            <p className="text-lg font-semibold text-sauce animate-pulse">
              Loading menu…
            </p>
            <p className="text-sm text-ink/60">Garma garam khana aa raha hai 🍕</p>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sauce font-semibold">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-ink/70">
            {query ? `No items match “${query}”.` : "The menu is empty. Check back soon."}
          </p>
        )}

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={(p, qty) => addToCart(p, qty)} />
          ))}
        </div>
      </section>
    </>
  );
}