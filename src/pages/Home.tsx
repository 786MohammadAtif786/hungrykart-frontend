

import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/api";
import { useSearch } from "../context/SearchContext";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";   // ✅ NEW
import Categories from "../components/CategoryBar";
import type { Product } from "../types";
import type { Category } from "../types/type";
import { useCart } from "../context/CartContext";
import OffersSection from "../components/OffersSection";

const PAGE_SIZE = 12; // ✅ ek page par 12 products (4 columns x 3 rows)

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { query } = useSearch();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [page, setPage] = useState(1);                 // ✅ NEW
  const listTopRef = useRef<HTMLElement | null>(null); // ✅ NEW: page change par yahan scroll

  useEffect(() => {
    api
      .products()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Category ya search badle to page 1 par wapas
  useEffect(() => {
    setPage(1);
  }, [query, activeCategory]);

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    result = result.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    return result;
  }, [products, query, activeCategory]);

  // ✅ Pagination calculation
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const changePage = (p: number) => {
    setPage(p);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Banner />

      <OffersSection />
      <Categories active={activeCategory} onSelect={setActiveCategory} />

      <section ref={listTopRef} className="max-w-6xl mx-auto px-4 py-8 scroll-mt-20">
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
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-5xl">🍽️</span>
            {query ? (
              <p className="text-ink/70">No items match “{query}”.</p>
            ) : activeCategory !== "All" ? (
              <p className="text-ink/70">
                No items found in{" "}
                <span className="font-semibold text-ink">{activeCategory}</span>{" "}
                right now — not available. 😔
              </p>
            ) : (
              <p className="text-ink/70">The menu is empty. Check back soon.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginated.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={(p, qty) => addToCart(p, qty)} />
          ))}
        </div>

        {/* ✅ Pagination: 1 se zyada page ho tabhi dikhega */}
        {!loading && !error && (
          <Pagination page={safePage} pages={pages} onChange={changePage} />
        )}
      </section>
    </>
  );
}