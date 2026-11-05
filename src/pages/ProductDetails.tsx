import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SERVER_URL } from "../lib/socket";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { isAdmin, type Product } from "../types";
import { ProductImage, formatPrice } from "../components/ProductCard";
import ProductReviews from "../components/ProductReviews";

const TAG_BADGES: Record<string, { emoji: string; label: string; cls: string }> = {
  popular:    { emoji: "🔥", label: "Popular",    cls: "bg-orange-100 text-orange-700" },
  bestseller: { emoji: "🌟", label: "Bestseller", cls: "bg-yellow-100 text-yellow-800" },
  premium:    { emoji: "👑", label: "Premium",    cls: "bg-purple-100 text-purple-700" },
  spicy:      { emoji: "🌶️", label: "Spicy",      cls: "bg-red-100 text-red-700" },
};

const FOOD_BADGES: Record<string, { emoji: string; label: string; cls: string }> = {
  "veg":     { emoji: "🟢", label: "Veg",     cls: "bg-green-100 text-green-700" },
  "non-veg": { emoji: "🍗", label: "Non-Veg", cls: "bg-red-100 text-red-700" },
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isRider = String(user?.role) === "delivery_partner";
  const cannotOrder = isAdmin(user) || isRider;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    window.scrollTo({ top: 0 });

    fetch(`${SERVER_URL}/api/products/${id}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message ?? `Product not found (${r.status})`);
        setProduct(data.product ?? data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || cannotOrder) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sauce/20 border-t-sauce" />
        <p className="text-sauce font-semibold">Loading…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl">😔</span>
        <p className="mt-3 text-sauce font-semibold">{error || "Product not found"}</p>
        <Link to="/" className="mt-4 inline-block underline font-semibold">
          ← Back to menu
        </Link>
      </div>
    );
  }

  const tagList = (product.tags ?? []).filter((t: any) => TAG_BADGES[t]);
  const food = product.foodType ? FOOD_BADGES[product.foodType] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm font-semibold text-sauce hover:underline">
        ← Back to menu
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-md ring-1 ring-black/5 overflow-hidden">
        <ProductImage product={product} className="w-full h-full min-h-[260px] aspect-[16/11]" />

        <div className="p-5 flex flex-col">
          <div className="flex flex-wrap gap-2">
            {food && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${food.cls}`}>
                {food.emoji} {food.label}
              </span>
            )}
            {tagList.map((t: any) => (
              <span key={t} className={`text-xs font-bold px-2.5 py-1 rounded-full ${TAG_BADGES[t].cls}`}>
                {TAG_BADGES[t].emoji} {TAG_BADGES[t].label}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">{product.name}</h1>

          {product.category && (
            <p className="text-sm text-ink/50 mt-1 capitalize">{product.category}</p>
          )}

          {product.description && (
            <p className="mt-3 text-ink/70 leading-relaxed">{product.description}</p>
          )}

          <p className="mt-4 text-3xl font-extrabold text-sauce">{formatPrice(product.price)}</p>

          <div className="mt-auto pt-6">
            {cannotOrder ? (
              <p className="rounded-lg bg-ink/5 px-3 py-2 text-center text-sm font-semibold text-ink/60">
                {isRider
                  ? "Ordering is disabled for delivery partners"
                  : "Ordering is disabled for admin accounts"}
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-ink rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1.5 font-bold hover:bg-cheese"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 min-w-[2rem] text-center font-bold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-1.5 font-bold hover:bg-cheese"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 bg-sauce text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-sauce-dark active:scale-[0.98] transition-all cursor-pointer"
                >
                  {added ? "✓ Added to Cart" : "🛒 Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </div>
        
      </div>
        <ProductReviews productId={product._id} />
    </div>
  );
}