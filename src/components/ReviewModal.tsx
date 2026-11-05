import { useState } from "react";
import { orderApi } from "../Orderapi";
import { useAuth } from "../context/AuthContext";
import "../css/ReviewModal.css";

const STARS = [1, 2, 3, 4, 5];

// parent kuch bhi extra fields bheje, chalega
type ModalItem = {
  name: string;
  quantity: number;
  itemId?: string;
  myRating?: number | null;
  [key: string]: any;
};

type Draft = {
  rating: number;
  description: string;
  error: string;
  done: number | null;
};

// order item se product/item ki ID nikalta hai (alag alag naam ho sakte hain)
// NOTE: "_id" jaan-boojh kar nahi liya, wo order-item ki apni ID hoti hai, product ki nahi
const ID_KEYS = ["itemId", "productId", "product", "item", "menuItem", "menuItemId"];

function resolveId(obj: any): string | undefined {
  if (!obj) return undefined;
  for (const k of ID_KEYS) {
    const v = obj[k];
    if (!v) continue;
    if (typeof v === "string") return v;
    if (typeof v === "object" && v._id) return String(v._id); // populated object
  }
  return undefined;
}

function ItemReview({
  item,
  draft,
  disabled,
  onChange,
}: {
  item: ModalItem;
  draft: Draft;
  disabled: boolean;
  onChange: (patch: Partial<Draft>) => void;
}) {
  const [hover, setHover] = useState(0);

  if (draft.done) {
    return (
      <div className="rv-item-block">
        <div className="rv-item-name">
          {item.name} × {item.quantity}
        </div>
        <span className="rv-rated">★ Rated {draft.done}/5</span>
      </div>
    );
  }

  return (
    <div className="rv-item-block">
      <div className="rv-item-name">
        {item.name} × {item.quantity}
      </div>

      <div className="rv-stars">
        {STARS.map((n) => (
          <button
            key={n}
            type="button"
            disabled={disabled}
            className={`rv-star ${n <= (hover || draft.rating) ? "filled" : ""}`}
            onClick={() => onChange({ rating: n, error: "" })}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </button>
        ))}
        <span className="rv-rating-label">
          {draft.rating > 0 ? `${draft.rating}/5` : "Tap a star"}
        </span>
      </div>

      <textarea
        className="rv-text"
        placeholder={`How was ${item.name}? (min 5 characters)`}
        value={draft.description}
        disabled={disabled}
        onChange={(e) => onChange({ description: e.target.value, error: "" })}
        rows={3}
      />

      {draft.error && <p className="rv-error">{draft.error}</p>}
    </div>
  );
}

export default function ReviewModal({
  orderId,
  orderNumber,
  items = [],
  onClose,
  onDone,
}: {
  orderId: string;
  orderNumber: string;
  items?: ModalItem[];
  onClose: () => void;
  // onDone: () => void;
  onDone: (rating: number) => void;
}) {
  const { token } = useAuth();
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  // drafts INDEX se bante hain, isliye har item ka state alag rehta hai
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    items.map((i) => ({ rating: 0, description: "", error: "", done: i.myRating ?? null }))
  );

  const patch = (idx: number, p: Partial<Draft>) =>
    setDrafts((list) => list.map((d, k) => (k === idx ? { ...d, ...p } : d)));

  const submit = async () => {
    if (busy) return; // double click guard
    if (!token) return setFormError("Please login again");
    setFormError("");

    // sirf wo items jinhe user ne chhua hai (star ya text) aur jo abhi done nahi
    const touched = items
      .map((item, idx) => ({ item, idx }))
      .filter(({ idx }) => {
        const d = drafts[idx];
        return !d.done && (d.rating > 0 || d.description.trim().length > 0);
      });

    if (touched.length === 0)
      return setFormError("Kam se kam ek item ko rating aur description dein");

    // pehle rating/description validate
    let invalid = false;
    for (const { idx } of touched) {
      const d = drafts[idx];
      if (d.rating === 0) {
        patch(idx, { error: "Please select a star rating" });
        invalid = true;
      } else if (d.description.trim().length < 5) {
        patch(idx, { error: "Description is required (min 5 characters)" });
        invalid = true;
      }
    }
    if (invalid) return;

    setBusy(true);

    // item IDs: pehle parent ke items se, na mile to myOrders se nikalo
    const ids: Record<number, string | undefined> = {};
    for (const { item, idx } of touched) ids[idx] = resolveId(item);

    if (touched.some(({ idx }) => !ids[idx])) {
      try {
        const orders: any[] = await orderApi.myOrders(token);
        const order = orders.find((o) => String(o._id ?? o.id) === String(orderId));
        for (const { item, idx } of touched) {
          if (ids[idx]) continue;
          const real = order?.items?.[idx];
          // naam match bhi check karo taaki galat item par review na jaye
          if (real && (!real.name || real.name === item.name)) ids[idx] = resolveId(real);
        }
      } catch {
        /* neeche error dikhayenge */
      }
    }

    let failed = 0;

    for (const { item, idx } of touched) {
      const d = drafts[idx];
      const productId = ids[idx];

      if (!productId) {
        failed++;
        patch(idx, {
          error: `Item ID nahi mili. Order item ke keys: ${Object.keys(item).join(", ")}`,
        });
        continue;
      }

      try {
        await orderApi.createReview(token, orderId, productId, d.rating, d.description.trim());
        patch(idx, { done: d.rating, error: "" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to submit review";
        if (msg.toLowerCase().includes("already reviewed")) {
          patch(idx, { done: d.rating, error: "" });
        } else {
          failed++;
          patch(idx, { error: msg });
        }
      }
    }

    // setBusy(false);
    // if (failed === 0) onDone(); // sab theek: parent modal band karke orders refresh karega
    setBusy(false);
if (failed === 0) {
  const given = touched.map(({ idx }) => drafts[idx].rating).filter((r) => r > 0);
  const avg = given.length
    ? Math.round(given.reduce((a, b) => a + b, 0) / given.length)
    : 0;
  onDone(avg);
}
  };

  const pendingCount = drafts.filter((d) => !d.done).length;

  return (
    <div className="rv-overlay" onClick={onClose}>
      <div className="rv-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Rate Order #{orderNumber}</h3>

        {items.map((item, idx) => (
          <ItemReview
            key={idx}
            item={item}
            draft={drafts[idx]}
            disabled={busy}
            onChange={(p) => patch(idx, p)}
          />
        ))}

        {formError && <p className="rv-error">{formError}</p>}

        <div className="rv-actions">
          <button className="rv-cancel" onClick={onClose} disabled={busy}>
            {pendingCount === 0 ? "Close" : "Cancel"}
          </button>
          {pendingCount > 0 && (
            <button className="rv-submit" onClick={submit} disabled={busy}>
              {busy ? "Submitting…" : "Submit Review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}