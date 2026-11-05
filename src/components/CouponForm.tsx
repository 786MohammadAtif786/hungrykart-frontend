import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { couponApi, type Coupon, type CouponInput, type DiscountType } from "../api/Couponapi";
import Modal from "./Modal";

const CODE_RE = /^[A-Z0-9_-]{3,20}$/;

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // confusing letters (0/O, 1/I) nahi
  const rnd = crypto.getRandomValues(new Uint32Array(8));
  return Array.from(rnd, (n) => chars[n % chars.length]).join("");
}

// ISO <-> <input type="datetime-local">
const pad = (n: number) => String(n).padStart(2, "0");
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const toISO = (v: string) => (v ? new Date(v).toISOString() : null);

interface Props {
  coupon: Coupon | null; // null = create, warna edit
  onClose: () => void;
  onSaved: (coupon: Coupon, created: boolean) => void;
}

export default function CouponForm({ coupon, onClose, onSaved }: Props) {
  const { token } = useAuth();
  const isEdit = !!coupon;

  const [code, setCode] = useState(coupon?.code ?? "");
  const [description, setDescription] = useState(coupon?.description ?? "");
  const [discountType, setDiscountType] = useState<DiscountType>(coupon?.discountType ?? "percentage");
  const [discountValue, setDiscountValue] = useState(coupon ? String(coupon.discountValue) : "");
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount != null ? String(coupon.maxDiscount) : "");
  const [minOrder, setMinOrder] = useState(coupon ? String(coupon.minimumOrderAmount) : "0");
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit != null ? String(coupon.usageLimit) : "");
  const [perUser, setPerUser] = useState(coupon ? (coupon.perUserLimit != null ? String(coupon.perUserLimit) : "") : "1");
  const [startsAt, setStartsAt] = useState(toLocalInput(coupon?.startsAt ?? null));
  const [expiresAt, setExpiresAt] = useState(toLocalInput(coupon?.expiresAt ?? null));
  const [active, setActive] = useState(coupon?.active ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || saving) return;
    setError("");

    const codeUp = code.trim().toUpperCase();
    if (!isEdit && !CODE_RE.test(codeUp)) {
      return setError("Code must be 3 to 20 characters (letters, numbers, - or _)");
    }

    const value = Number(discountValue);
    if (!Number.isFinite(value) || value < 1) return setError("Discount value must be at least 1");
    if (discountType === "percentage" && value > 100) return setError("Percentage cannot be more than 100");

    const max = maxDiscount.trim() === "" ? null : Number(maxDiscount);
    if (discountType === "percentage" && max !== null && (!Number.isFinite(max) || max < 1)) {
      return setError("Max discount must be at least 1");
    }

    const min = minOrder.trim() === "" ? 0 : Number(minOrder);
    if (!Number.isFinite(min) || min < 0) return setError("Minimum order amount cannot be negative");

    const limit = usageLimit.trim() === "" ? null : Number(usageLimit);
    if (limit !== null && (!Number.isInteger(limit) || limit < 1)) {
      return setError("Usage limit must be a whole number, 1 or more");
    }
    if (limit !== null && coupon && limit < coupon.usedCount) {
      return setError(`Usage limit cannot be lower than the times already used (${coupon.usedCount})`);
    }

    const per = perUser.trim() === "" ? null : Number(perUser);
    if (per !== null && (!Number.isInteger(per) || per < 1)) {
      return setError("Per user limit must be a whole number, 1 or more");
    }

    if (startsAt && expiresAt && new Date(expiresAt) <= new Date(startsAt)) {
      return setError("Expiry must be after the start date");
    }

    const input: CouponInput = {
      code: coupon?.code ?? codeUp,
      description: description.trim(),
      discountType,
      discountValue: value,
      maxDiscount: discountType === "percentage" ? max : null,
      minimumOrderAmount: min,
      usageLimit: limit,
      perUserLimit: per,
      startsAt: toISO(startsAt),
      expiresAt: toISO(expiresAt),
      active,
    };

    setSaving(true);
    try {
      const res = isEdit ? await couponApi.update(token, coupon!._id, input) : await couponApi.create(token, input);
      onSaved(res.coupon, !isEdit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save coupon");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Edit ${coupon!.code}` : "Create coupon"}
      subtitle={isEdit ? "Update the discount, limits or validity" : "Set up a new discount code for customers"}
      onClose={onClose}
      locked={saving}
      size="lg"
      footer={
        <>
          <button type="button" className="ac-btn ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="coupon-form" className="ac-btn primary" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create coupon"}
          </button>
        </>
      }
    >
      <form id="coupon-form" onSubmit={submit} className="ac-form" noValidate>
        {/* Code */}
        <div className="ac-field">
          <label htmlFor="cf-code">Coupon code</label>
          <div className="ac-inline">
            <input
              id="cf-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="WELCOME20"
              maxLength={20}
              disabled={isEdit}
              autoFocus={!isEdit}
              autoComplete="off"
              spellCheck={false}
              className="ac-mono"
            />
            {!isEdit && (
              <button type="button" className="ac-btn ghost" onClick={() => setCode(genCode())}>
                Generate
              </button>
            )}
          </div>
          <small>{isEdit ? "The code cannot be changed after creation." : "3 to 20 characters: letters, numbers, - or _"}</small>
        </div>

        <div className="ac-field">
          <label htmlFor="cf-desc">
            Description <span className="ac-opt">(optional, shown to customers)</span>
          </label>
          <input
            id="cf-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            placeholder="20% off on your first order"
          />
        </div>

        {/* Discount type */}
        <div className="ac-field">
          <span className="ac-label">Discount type</span>
          <div className="ac-seg" role="radiogroup" aria-label="Discount type">
            {(["percentage", "fixed"] as DiscountType[]).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={discountType === t}
                className={discountType === t ? "on" : ""}
                onClick={() => setDiscountType(t)}
              >
                {t === "percentage" ? "Percentage (%)" : "Fixed amount (₹)"}
              </button>
            ))}
          </div>
        </div>

        <div className="ac-grid2">
          <div className="ac-field">
            <label htmlFor="cf-value">Discount value {discountType === "percentage" ? "(%)" : "(₹)"}</label>
            <input
              id="cf-value"
              type="number"
              inputMode="decimal"
              min={1}
              max={discountType === "percentage" ? 100 : undefined}
              step="any"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percentage" ? "20" : "50"}
            />
          </div>

          {discountType === "percentage" ? (
            <div className="ac-field">
              <label htmlFor="cf-max">
                Max discount (₹) <span className="ac-opt">(optional)</span>
              </label>
              <input
                id="cf-max"
                type="number"
                inputMode="decimal"
                min={1}
                step="any"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="No cap"
              />
            </div>
          ) : (
            <div className="ac-field">
              <label htmlFor="cf-min-fixed">Minimum order (₹)</label>
              <input
                id="cf-min-fixed"
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="0"
              />
            </div>
          )}
        </div>

        {discountType === "percentage" && (
          <div className="ac-field">
            <label htmlFor="cf-min">Minimum order (₹)</label>
            <input
              id="cf-min"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="0"
            />
            <small>Checked against the food subtotal, before delivery fee and tax.</small>
          </div>
        )}

        <div className="ac-grid2">
          <div className="ac-field">
            <label htmlFor="cf-limit">
              Total usage limit <span className="ac-opt">(blank = unlimited)</span>
            </label>
            <input
              id="cf-limit"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Unlimited"
            />
          </div>
          <div className="ac-field">
            <label htmlFor="cf-per">
              Per user limit <span className="ac-opt">(blank = unlimited)</span>
            </label>
            <input
              id="cf-per"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={perUser}
              onChange={(e) => setPerUser(e.target.value)}
              placeholder="Unlimited"
            />
          </div>
        </div>

        <div className="ac-grid2">
          <div className="ac-field">
            <label htmlFor="cf-start">
              Starts at <span className="ac-opt">(optional)</span>
            </label>
            <input id="cf-start" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </div>
          <div className="ac-field">
            <label htmlFor="cf-end">
              Expires at <span className="ac-opt">(optional)</span>
            </label>
            <input id="cf-end" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        </div>

        <label className="ac-switch">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <span className="track" aria-hidden />
          <span>
            <b>{active ? "Active" : "Inactive"}</b>
            <small>{active ? "Customers can use this coupon" : "Saved, but customers cannot use it yet"}</small>
          </span>
        </label>

        {error && (
          <p role="alert" className="ac-error">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}