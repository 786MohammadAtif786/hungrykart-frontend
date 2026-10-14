
import { useState } from "react";
import { Heart } from "lucide-react";
import { imageUrl } from "../api";
import { useAuth } from "../context/AuthContext";
import { isAdmin, type Product } from "../types";

export const formatPrice = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const src = imageUrl(product.image);
  return src ? (
    <img src={src} alt={product.name} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`bg-ink/10 flex items-center justify-center text-ink/40 text-sm ${className}`}>
      No image
    </div>
  );
}

const TAG_BADGES: Record<string, { emoji: string; label: string; cls: string }> = {
  popular:    { emoji: "🔥", label: "Popular",    cls: "bg-orange-100/90 text-orange-700" },
  bestseller: { emoji: "🌟", label: "Bestseller", cls: "bg-yellow-100/90 text-yellow-800" },
  premium:    { emoji: "👑", label: "Premium",    cls: "bg-purple-100/90 text-purple-700" },
  spicy:      { emoji: "🌶️", label: "Spicy",      cls: "bg-red-100/90 text-red-700" },
};

const FOOD_BADGES: Record<string, { emoji: string; label: string; cls: string }> = {
  "veg":     { emoji: "🟢", label: "Veg",     cls: "bg-green-100/90 text-green-700" },
  "non-veg": { emoji: "🍗", label: "Non-Veg", cls: "bg-red-100/90 text-red-700" },
};

interface Props {
  product: Product;
  onAdd?: (product: Product, qty: number) => void;
  /** Controlled wishlist state (optional). Na do to card apna local state use karega. */
  wishlisted?: boolean;
  onToggleWishlist?: (product: Product, next: boolean) => void;
}

export default function ProductCard({ product, onAdd, wishlisted, onToggleWishlist }: Props) {
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [localWish, setLocalWish] = useState(false);

  // Admin aur delivery partner order nahi kar sakte (guest aur customer kar sakte hain)
  const isRider = String(user?.role) === "delivery_partner";
  const cannotOrder = isAdmin(user) || isRider;

  const isWished = wishlisted ?? localWish;

  const toggleWish = () => {
    const next = !isWished;
    if (wishlisted === undefined) setLocalWish(next);
    onToggleWishlist?.(product, next);
  };

  const handleAdd = () => {
    if (cannotOrder) return; // extra safety: kisi aur raste se call ho to bhi cart me na jaye
    onAdd?.(product, qty);
  };

  const tagList = (product.tags ?? []).filter((t: any) => TAG_BADGES[t]);
  const food = product.foodType ? FOOD_BADGES[product.foodType] : null;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden flex flex-col shadow-md ring-1 ring-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* ---------- Image ---------- */}
      <div className="relative overflow-hidden">
        <ProductImage
          product={product}
          className="w-full aspect-[16/10] transition-transform duration-500 group-hover:scale-105"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20"
        />

        {/* Tags: top-left */}
        {tagList.length > 0 && (
          <div className="absolute top-2.5 left-2.5 right-12 flex flex-wrap gap-1.5">
            {tagList.map((t: any) => {
              const b = TAG_BADGES[t];
              return (
                <span
                  key={t}
                  className={`text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${b.cls}`}
                >
                  {b.emoji} {b.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Wishlist heart: top-right (sirf customer / guest ke liye) */}
        {!cannotOrder && (
          <button
            type="button"
            onClick={toggleWish}
            aria-pressed={isWished}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isWished ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}

        {/* Food type: bottom-left */}
        {food && (
          <span
            className={`absolute bottom-2.5 left-2.5 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${food.cls}`}
          >
            {food.emoji} {food.label}
          </span>
        )}
      </div>

      {/* ---------- Details ---------- */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-bold leading-tight text-sm sm:text-base">{product.name}</h3>

        {product.description && (
          <p className="mt-0.5 text-xs sm:text-sm text-ink/60 line-clamp-1">{product.description}</p>
        )}

        <p className="mt-2 text-lg font-extrabold text-sauce">{formatPrice(product.price)}</p>

        {cannotOrder ? (
          <p className="mt-3 rounded-lg bg-ink/5 px-3 py-2 text-center text-xs sm:text-sm font-semibold text-ink/60">
            {isRider ? "Ordering is disabled for delivery partners" : "Ordering is disabled for admin accounts"}
          </p>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center border-2 border-ink rounded-lg overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-2 py-1 font-bold hover:bg-cheese"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-1.5 min-w-[1.5rem] text-center text-sm font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-2 py-1 font-bold hover:bg-cheese"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 bg-sauce text-white font-semibold text-sm py-1.5 rounded-lg shadow-sm hover:bg-sauce-dark hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              🛒 Add to Cart
            </button>
          </div>
        )}
      </div>
    </article>
  );
}