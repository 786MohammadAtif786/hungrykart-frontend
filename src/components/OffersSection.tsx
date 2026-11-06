
import  { useEffect, useRef, useState } from "react";
import "../css/OffersSection.css";

// const API_URL = "http://localhost:3000/api/offers/active";

const API_URL = "hungrykart-frontend-alpha.vercel.app/api/offers/active";

type ApiOffer = {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  bgColor?: string;
  code?: string;
  applyType: "AUTO" | "CODE";
  discountType: "PERCENT" | "FLAT";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  isActive: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
};

type OfferCard = {
  id: string | number;
  badge: string;
  title: string;
  subtitle: string;
  code?: string;
  btnText?: string;
  bg: string;
  img: string;
};

// API fail ho ya empty aaye to ye fallback dikhega
const fallbackOffers: OfferCard[] = [
  {
    id: 1,
    badge: "FLAT",
    title: "₹120 OFF",
    subtitle: "On orders above ₹399",
    code: "HUNGRY120",
    bg: "linear-gradient(135deg, #ff4d4d, #e63b3b)",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
  },
  {
    id: 2,
    badge: "BUY 1",
    title: "GET 1 FREE",
    subtitle: "On Selected Pizzas",
    btnText: "Order Now",
    bg: "linear-gradient(135deg, #ff4d4d, #e63b3b)",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300",
  },
  {
    id: 3,
    badge: "30% OFF",
    title: "On Healthy Meals",
    subtitle: "Fresh & Tasty",
    code: "HEALTHY30",
    bg: "linear-gradient(135deg, #2e7d32, #43a047)",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300",
  },
];

// color ko thoda dark karke gradient banane ke liye
const shade = (hex: string, percent: number) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return hex;
  const num = parseInt(m[1], 16);
  const adjust = (c: number) =>
    Math.max(0, Math.min(255, Math.round(c + (c * percent) / 100)));
  const r = adjust((num >> 16) & 255);
  const g = adjust((num >> 8) & 255);
  const b = adjust(num & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const mapOffer = (o: ApiOffer): OfferCard => {
  const isPercent = o.discountType === "PERCENT";
  const base = o.bgColor || "#e23c3c";

  const parts: string[] = [];
  if (o.minOrderValue) parts.push(`On orders above ₹${o.minOrderValue}`);
  if (isPercent && o.maxDiscount) parts.push(`Up to ₹${o.maxDiscount} off`);
  const autoSubtitle = parts.join(" • ");

  return {
    id: o._id,
    badge: isPercent ? `${o.discountValue}% OFF` : "FLAT",
    title: o.title,
    subtitle: o.subtitle?.trim() || autoSubtitle,
    code: o.applyType === "CODE" ? o.code : undefined,
    btnText: o.applyType === "AUTO" ? "Order Now" : undefined,
    bg: `linear-gradient(135deg, ${base}, ${shade(base, -15)})`,
    img: o.imageUrl || "",
  };
};

export default function OffersSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [offers, setOffers] = useState<OfferCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOffers = async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json?.success && Array.isArray(json.data) && json.data.length) {
          const now = Date.now();
          const list = (json.data as ApiOffer[])
            .filter((o) => {
              if (!o.isActive) return false;
              if (o.startDate && new Date(o.startDate).getTime() > now)
                return false;
              if (o.endDate && new Date(o.endDate).getTime() < now)
                return false;
              return true;
            })
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
            .map(mapOffer);

          setOffers(list.length ? list : fallbackOffers);
        } else {
          setOffers(fallbackOffers);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Offers fetch failed:", err);
          setOffers(fallbackOffers);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchOffers();
    return () => controller.abort();
  }, []);

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  if (!loading && offers.length === 0) return null;

  return (
    <section className="offers-wrapper">
      <div className="offers-header">
        <h2>Best Offers for You</h2>
        <button className="see-all" onClick={() => scroll(1)}>
          See All ›
        </button>
      </div>

      <div className="offers-track" ref={scrollRef}>
        {loading ? (
          <p style={{ padding: "16px" }}>Loading offers...</p>
        ) : (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="offer-card"
              style={{ background: offer.bg }}
            >
              <div className="offer-text">
                <span className="offer-badge">{offer.badge}</span>
                <h3>{offer.title}</h3>
                <p>{offer.subtitle}</p>
                {offer.code ? (
                  <span className="offer-code">Use code: {offer.code}</span>
                ) : (
                  <button className="offer-btn">{offer.btnText}</button>
                )}
              </div>
              {offer.img && (
                <img src={offer.img} alt={offer.title} className="offer-img" />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}