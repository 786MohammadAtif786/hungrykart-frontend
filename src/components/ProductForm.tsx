import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { FOOD_TYPES, PRODUCT_TAGS, type Product } from "../types";
import { ProductImage } from "./ProductCard";

const CATEGORIES = ["pizza", "burger", "fries", "sandwich", "pasta", "momos", "shake", "dessert"];

const MAX_IMAGE_MB = 5; // backend multer limit
const CLOSE_MS = 200; // close animation ka time

const fieldCls =
  "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 " +
  "focus:border-sauce focus:outline-none focus:ring-2 focus:ring-sauce/20";

const labelCls = "text-sm font-semibold text-ink";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Props {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, onClose, onSaved }: Props) {
  const { token } = useAuth();

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(product?.description ?? "");
  const [foodType, setFoodType] = useState(product?.foodType ?? FOOD_TYPES[0]);
  const [tags, setTag] = useState(product?.tags ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // open / close animation
  const [show, setShow] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const categoryOptions = CATEGORIES.includes(category) ? CATEGORIES : [...CATEGORIES, category];

  // image preview (memory leak na ho isliye revoke)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // mount hote hi smooth open + first field focus
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    const focus = window.setTimeout(() => nameRef.current?.focus(), 150);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(focus);
    };
  }, []);

  // background scroll band
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // animation ke saath band karo, phir parent ko batao
  const close = useCallback(() => {
    if (saving) return;
    setShow(false);
    window.setTimeout(onClose, CLOSE_MS);
  }, [saving, onClose]);

  // Escape se band
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const pickFile = (f: File | null | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("Sirf image file chuniye (JPG, PNG, WEBP)");
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`Image ${MAX_IMAGE_MB}MB se badi nahi honi chahiye`);
    setError("");
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || saving) return;
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("price", price);
      fd.append("category", category);
      fd.append("description", description.trim());
      fd.append("foodType", foodType);
      // if (tags) fd.append("tags", tags);
      if (tags) fd.append("tags", Array.isArray(tags) ? tags.join(",") : tags);
      if (file) fd.append("image", file);
      if (product) await api.updateProduct(token, product._id, fd);
      else await api.createProduct(token, fd);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save item");
    } finally {
      setSaving(false);
    }
  };

  const chip = (on: boolean) =>
    `px-3.5 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
      on
        ? "bg-sauce border-sauce text-white"
        : "bg-white border-gray-300 text-ink/80 hover:border-sauce hover:text-sauce"
    }`;

  // Portal: modal <body> ke upar render hota hai, isliye navbar (sticky z-50) ya kisi parent ke
  // stacking context ke andar nahi fasta
  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none ${
        show ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pf-title"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <form
        onSubmit={submit}
        className={`bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] transition-all duration-200 ease-out motion-reduce:transition-none ${
          show ? "translate-y-0 sm:scale-100 opacity-100" : "translate-y-8 sm:translate-y-2 sm:scale-95 opacity-0"
        }`}
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 id="pf-title" className="text-xl font-extrabold tracking-tight">
              {product ? "Edit item" : "Add new item"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {product ? "Item ki details badal kar save karo" : "Menu me naya item jodne ke liye details bharo"}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xl leading-none text-gray-500 hover:bg-gray-100 hover:text-ink transition-colors"
          >
            ×
          </button>
        </div>

        {/* ---------- Body (scrolls) ---------- */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Name + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-4">
            <label className="block">
              <span className={labelCls}>Name</span>
              <input
                ref={nameRef}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Margherita Pizza"
                className={fieldCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Price</span>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-[3px] text-gray-500 text-sm">₹</span>
                <input
                  required
                  type="number"
                  min="1"
                  step="any"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="249"
                  className={`${fieldCls} pl-7`}
                />
              </div>
            </label>
          </div>

          {/* Food type */}
          <div>
            <span className={labelCls}>Food type</span>
            <div className="mt-1.5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Food type">
              {FOOD_TYPES.map((t) => {
                const on = foodType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFoodType(t)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      on ? "border-sauce bg-sauce/10 text-sauce" : "border-gray-300 text-ink/70 hover:border-gray-400"
                    }`}
                  >
                    {t === "veg" ? "🟢 Veg" : "🍗 Non-Veg"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <span className={labelCls}>Category</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {categoryOptions.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)} className={chip(category === c)}>
                  {cap(c)}
                </button>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div>
            <span className={labelCls}>
              Tag <span className="font-normal text-gray-400">(optional)</span>
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTag("")} className={chip(tags === "")}>
                None
              </button>
              {PRODUCT_TAGS.map((t) => (
                <button key={t} type="button" onClick={() => setTag(t)} className={chip(tags === t)}>
                  {cap(t)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <label className="block">
            <span className={labelCls}>Description</span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cheese, tomato sauce and fresh basil on a thin crust."
              className={`${fieldCls} resize-none`}
            />
          </label>

          {/* Image */}
          <div>
            <span className={labelCls}>Image</span>

            {preview || product ? (
              <div className="mt-1.5 relative group">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full aspect-[4/3] object-cover rounded-xl" />
                ) : (
                  product && <ProductImage product={product} className="w-full aspect-[4/3] rounded-xl" />
                )}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white/95 text-sm font-semibold shadow hover:bg-white"
                  >
                    {preview ? "Change" : "Replace image"}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/95 text-sm font-semibold text-sauce shadow hover:bg-white"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`mt-1.5 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed py-8 cursor-pointer text-center transition-colors ${
                  dragging ? "border-sauce bg-sauce/5" : "border-gray-300 hover:border-sauce hover:bg-gray-50"
                }`}
              >
                <span className="text-3xl" aria-hidden>
                  📷
                </span>
                <span className="text-sm font-semibold">Image yahan drop karo ya click karke chuno</span>
                <span className="text-xs text-gray-500">JPG, PNG, WEBP · max {MAX_IMAGE_MB}MB</span>
              </label>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={preview || product ? "hidden" : "sr-only"}
              onChange={(e) => {
                pickFile(e.target.files?.[0]);
                e.target.value = ""; // same file dobara chun sako
              }}
            />
            {product && !preview && (
              <p className="text-xs text-gray-500 mt-1.5">Nayi image na chuno to purani image hi rahegi.</p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-sauce/10 text-sauce font-semibold text-sm px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* ---------- Footer (always visible) ---------- */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100 shrink-0 bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-sauce text-white font-semibold hover:bg-sauce-dark disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving…" : product ? "Save changes" : "Add item"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}