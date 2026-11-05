// import { useEffect, useState } from "react";
// import type { Offer, OfferPayload, DiscountType } from "../types/Offer";

// type Props = {
//   open: boolean;
//   initial?: Offer | null;
//   saving?: boolean;
//   error?: string;
//   onClose: () => void;
//   onSubmit: (payload: OfferPayload) => void;
// };

// // ISO -> value for <input type="datetime-local"> (local time)
// const toLocalInput = (iso?: string) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   const pad = (n: number) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
// };

// const emptyForm = {
//   title: "",
//   description: "",
//   code: "",
//   DiscountType: "",
//   discountValue: "",
//   maxDiscount: "",
//   minOrderValue: "",
//   startDate: "",
//   endDate: "",
//   priority: "0",
//   usageLimit: "",
//   perUserLimit: "",
//   isActive: true,
// };

// const numOrUndef = (v: string) => (v.trim() === "" ? undefined : Number(v));

// export default function OfferFormModal({ open, initial, saving, error, onClose, onSubmit }: Props) {
//   const [f, setF] = useState(emptyForm);

//   useEffect(() => {
//     if (!open) return;
//     if (initial) {
//       setF({
//         title: initial.title ?? "",
//         description: initial.description ?? "",
//         code: initial.code ?? "",
//         discountType: initial.discountType,
//         discountValue: String(initial.discountValue ?? ""),
//         maxDiscount: initial.maxDiscount != null ? String(initial.maxDiscount) : "",
//         minOrderValue: initial.minOrderValue != null ? String(initial.minOrderValue) : "",
//         startDate: toLocalInput(initial.startDate),
//         endDate: toLocalInput(initial.endDate),
//         priority: String(initial.priority ?? 0),
//         usageLimit: initial.usageLimit != null ? String(initial.usageLimit) : "",
//         perUserLimit: initial.perUserLimit != null ? String(initial.perUserLimit) : "",
//         isActive: initial.isActive,
//       });
//     } else {
//       setF(emptyForm);
//     }
//   }, [open, initial]);

//   if (!open) return null;

//   const set = (k: keyof typeof emptyForm, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const payload: OfferPayload = {
//       title: f.title.trim(),
//       description: f.description.trim() || undefined,
//       code: f.code.trim() ? f.code.trim().toUpperCase() : undefined,
//       discountType: f.discountType,
//       discountValue: Number(f.discountValue),
//       maxDiscount: f.discountType === "percentage" ? numOrUndef(f.maxDiscount) : undefined,
//       minOrderValue: numOrUndef(f.minOrderValue),
//       startDate: new Date(f.startDate).toISOString(),
//       endDate: new Date(f.endDate).toISOString(),
//       priority: Number(f.priority) || 0,
//       usageLimit: numOrUndef(f.usageLimit),
//       perUserLimit: numOrUndef(f.perUserLimit),
//       isActive: f.isActive,
//     };
//     onSubmit(payload);
//   };

//   const input =
//     "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-sauce focus:ring-2 focus:ring-sauce/20";
//   const label = "block text-xs font-bold text-ink/70 mb-1";

//   return (
//     <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <form
//         onSubmit={submit}
//         className="relative bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl"
//       >
//         <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-ink/10 z-10">
//           <h2 className="text-lg font-extrabold">{initial ? "Edit Offer" : "New Offer"}</h2>
//           <button type="button" onClick={onClose} className="text-xl px-2" aria-label="Close">
//             ✕
//           </button>
//         </div>

//         <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="sm:col-span-2">
//             <label className={label}>Title *</label>
//             <input className={input} required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Weekend Special 20% Off" />
//           </div>

//           <div className="sm:col-span-2">
//             <label className={label}>Description</label>
//             <textarea className={input} rows={2} value={f.description} onChange={(e) => set("description", e.target.value)} />
//           </div>

//           <div>
//             <label className={label}>Coupon Code (optional)</label>
//             <input className={`${input} uppercase`} value={f.code} onChange={(e) => set("code", e.target.value)} placeholder="WEEKEND20" />
//             <p className="text-[11px] text-ink/50 mt-1">Khali chhodo to auto-offer ban jayega</p>
//           </div>

//           <div>
//             <label className={label}>Discount Type *</label>
//             <select className={input} value={f.discountType} onChange={(e) => set("discountType", e.target.value)}>
//               <option value="percentage">Percentage (%)</option>
//               <option value="flat">Flat (₹)</option>
//             </select>
//           </div>

//           <div>
//             <label className={label}>Discount Value *</label>
//             <input className={input} type="number" min={1} step="any" required value={f.discountValue} onChange={(e) => set("discountValue", e.target.value)} />
//           </div>

//           {f.discountType === "percentage" && (
//             <div>
//               <label className={label}>Max Discount (₹)</label>
//               <input className={input} type="number" min={0} step="any" value={f.maxDiscount} onChange={(e) => set("maxDiscount", e.target.value)} />
//             </div>
//           )}

//           <div>
//             <label className={label}>Min Order Value (₹)</label>
//             <input className={input} type="number" min={0} step="any" value={f.minOrderValue} onChange={(e) => set("minOrderValue", e.target.value)} />
//           </div>

//           <div>
//             <label className={label}>Start Date *</label>
//             <input className={input} type="datetime-local" required value={f.startDate} onChange={(e) => set("startDate", e.target.value)} />
//           </div>

//           <div>
//             <label className={label}>End Date *</label>
//             <input className={input} type="datetime-local" required value={f.endDate} onChange={(e) => set("endDate", e.target.value)} />
//           </div>

//           <div>
//             <label className={label}>Priority</label>
//             <input className={input} type="number" value={f.priority} onChange={(e) => set("priority", e.target.value)} />
//             <p className="text-[11px] text-ink/50 mt-1">Zyada number = pehle dikhega</p>
//           </div>

//           <div>
//             <label className={label}>Total Usage Limit</label>
//             <input className={input} type="number" min={1} value={f.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} />
//           </div>

//           <div>
//             <label className={label}>Per User Limit</label>
//             <input className={input} type="number" min={1} value={f.perUserLimit} onChange={(e) => set("perUserLimit", e.target.value)} />
//           </div>

//           <label className="flex items-center gap-2 sm:col-span-2 cursor-pointer">
//             <input type="checkbox" className="w-4 h-4 accent-sauce" checked={f.isActive} onChange={(e) => set("isActive", e.target.checked)} />
//             <span className="text-sm font-semibold">Active</span>
//           </label>

//           {error && (
//             <div className="sm:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
//           )}
//         </div>

//         <div className="sticky bottom-0 bg-white flex gap-3 justify-end px-5 py-4 border-t border-ink/10">
//           <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-ink/15 text-sm font-semibold hover:bg-ink/5">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-5 py-2 rounded-lg bg-sauce text-white text-sm font-bold disabled:opacity-60"
//           >
//             {saving ? "Saving..." : initial ? "Update Offer" : "Create Offer"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import type { Offer, OfferPayload, DiscountType } from "../types/Offer";

type Props = {
  open: boolean;
  initial?: Offer | null;
  saving?: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (payload: OfferPayload) => void;
};

type OfferForm = {
  title: string;
  description: string;
  code: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  imageUrl: string;
  bgColor: string;
  startDate: string;
  endDate: string;
  priority: string;
  usageLimit: string;
  perUserLimit: string;
  isActive: boolean;
};

// ISO -> value for <input type="datetime-local"> (local time)
const toLocalInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const emptyForm: OfferForm = {
  title: "",
  description: "",
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "",
  imageUrl: "",
  bgColor: "#e23c3c",
  startDate: "",
  endDate: "",
  priority: "0",
  usageLimit: "",
  perUserLimit: "",
  isActive: true,
};

const numOrUndef = (v: string) => (v.trim() === "" ? undefined : Number(v));

export default function OfferFormModal({ open, initial, saving, error, onClose, onSubmit }: Props) {
  const [f, setF] = useState<OfferForm>(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setF({
        title: initial.title ?? "",
        description: initial.description ?? "",
        code: initial.code ?? "",
        discountType: initial.discountType,
        discountValue: String(initial.discountValue ?? ""),
        maxDiscount: initial.maxDiscount != null ? String(initial.maxDiscount) : "",
        minOrderValue: initial.minOrderValue != null ? String(initial.minOrderValue) : "",
        imageUrl: initial.imageUrl ?? "",
        bgColor: initial.bgColor ?? "#e23c3c",
        startDate: toLocalInput(initial.startDate),
        endDate: toLocalInput(initial.endDate),
        priority: String(initial.priority ?? 0),
        usageLimit: initial.usageLimit != null ? String(initial.usageLimit) : "",
        perUserLimit: initial.perUserLimit != null ? String(initial.perUserLimit) : "",
        isActive: initial.isActive,
      });
    } else {
      setF(emptyForm);
    }
  }, [open, initial]);

  if (!open) return null;

  const set = <K extends keyof OfferForm>(k: K, v: OfferForm[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = f.code.trim() ? f.code.trim().toUpperCase() : undefined;

    const payload: OfferPayload = {
      title: f.title.trim(),
      description: f.description.trim() || undefined,
      code,
      applyType: code ? "CODE" : "AUTO",
      discountType: f.discountType,
      discountValue: Number(f.discountValue) || 0,
      maxDiscount: f.discountType === "PERCENT" ? numOrUndef(f.maxDiscount) : undefined,
      minOrderValue: numOrUndef(f.minOrderValue),
      imageUrl: f.imageUrl.trim(),
      bgColor: f.bgColor || undefined,
      startDate: new Date(f.startDate).toISOString(),
      endDate: new Date(f.endDate).toISOString(),
      priority: Number(f.priority) || 0,
      usageLimit: numOrUndef(f.usageLimit),
      perUserLimit: numOrUndef(f.perUserLimit),
      isActive: f.isActive,
    };
    onSubmit(payload);
  };

  const input =
    "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-sauce focus:ring-2 focus:ring-sauce/20";
  const label = "block text-xs font-bold text-ink/70 mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl"
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-ink/10 z-10">
          <h2 className="text-lg font-extrabold">{initial ? "Edit Offer" : "New Offer"}</h2>
          <button type="button" onClick={onClose} className="text-xl px-2" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={label}>Title *</label>
            <input
              className={input}
              required
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Weekend Special 20% Off"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Description</label>
            <textarea
              className={input}
              rows={2}
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Image URL *</label>
            <input
              className={input}
              type="url"
              required
              value={f.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
            {f.imageUrl && (
              <img
                src={f.imageUrl}
                alt="preview"
                className="mt-2 h-20 w-20 rounded-lg object-cover border border-ink/10"
              />
            )}
          </div>

          <div>
            <label className={label}>Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-12 rounded border border-ink/15 bg-white p-1 cursor-pointer"
                value={f.bgColor}
                onChange={(e) => set("bgColor", e.target.value)}
              />
              <input
                className={input}
                value={f.bgColor}
                onChange={(e) => set("bgColor", e.target.value)}
                placeholder="#e23c3c"
              />
            </div>
          </div>

          <div>
            <label className={label}>Coupon Code (optional)</label>
            <input
              className={`${input} uppercase`}
              value={f.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="WEEKEND20"
            />
            <p className="text-[11px] text-ink/50 mt-1">Khali chhodo to auto-offer ban jayega</p>
          </div>

          <div>
            <label className={label}>Discount Type *</label>
            <select
              className={input}
              value={f.discountType}
              onChange={(e) => set("discountType", e.target.value as DiscountType)}
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FLAT">Flat (₹)</option>
              <option value="BOGO">Buy 1 Get 1</option>
            </select>
          </div>

          <div>
            <label className={label}>
              Discount Value {f.discountType !== "BOGO" && "*"}
            </label>
            <input
              className={input}
              type="number"
              min={f.discountType === "BOGO" ? 0 : 1}
              step="any"
              required={f.discountType !== "BOGO"}
              value={f.discountValue}
              onChange={(e) => set("discountValue", e.target.value)}
            />
          </div>

          {f.discountType === "PERCENT" && (
            <div>
              <label className={label}>Max Discount (₹)</label>
              <input
                className={input}
                type="number"
                min={0}
                step="any"
                value={f.maxDiscount}
                onChange={(e) => set("maxDiscount", e.target.value)}
              />
            </div>
          )}

          <div>
            <label className={label}>Min Order Value (₹)</label>
            <input
              className={input}
              type="number"
              min={0}
              step="any"
              value={f.minOrderValue}
              onChange={(e) => set("minOrderValue", e.target.value)}
            />
          </div>

          <div>
            <label className={label}>Start Date *</label>
            <input
              className={input}
              type="datetime-local"
              required
              value={f.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>

          <div>
            <label className={label}>End Date *</label>
            <input
              className={input}
              type="datetime-local"
              required
              value={f.endDate}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </div>

          <div>
            <label className={label}>Priority</label>
            <input
              className={input}
              type="number"
              value={f.priority}
              onChange={(e) => set("priority", e.target.value)}
            />
            <p className="text-[11px] text-ink/50 mt-1">Zyada number = pehle dikhega</p>
          </div>

          <div>
            <label className={label}>Total Usage Limit</label>
            <input
              className={input}
              type="number"
              min={1}
              value={f.usageLimit}
              onChange={(e) => set("usageLimit", e.target.value)}
            />
          </div>

          <div>
            <label className={label}>Per User Limit</label>
            <input
              className={input}
              type="number"
              min={1}
              value={f.perUserLimit}
              onChange={(e) => set("perUserLimit", e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 sm:col-span-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-sauce"
              checked={f.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            <span className="text-sm font-semibold">Active</span>
          </label>

          {error && (
            <div className="sm:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white flex gap-3 justify-end px-5 py-4 border-t border-ink/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-ink/15 text-sm font-semibold hover:bg-ink/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-sauce text-white text-sm font-bold disabled:opacity-60"
          >
            {saving ? "Saving..." : initial ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </form>
    </div>
  );
}