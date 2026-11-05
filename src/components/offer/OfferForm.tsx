// import { useEffect, useState } from 'react';
// import type { CreateOfferInput, DiscountType, Offer } from '../../types/Offer';
// import { toInputDate } from '../../lib/utils';

// interface Props {
//   open: boolean;
//   initial?: Offer | null;
//   onClose: () => void;
//   onSubmit: (payload: CreateOfferInput) => Promise<void>;
// }

// const emptyForm: CreateOfferInput = {
//   title: '',
//   code: '',
//   description: '',
//   discountType: 'PERCENTAGE',
//   discountValue: 10,
//   maxDiscount: undefined,
//   minOrderValue: undefined,
//   imageUrl: '',
//   bgColor: '#EF4444',
//   startDate: toInputDate(new Date().toISOString()),
//   endDate: toInputDate(new Date(Date.now() + 7 * 86400000).toISOString()),
//   isActive: true,
//   priority: 0,
//   usageLimit: undefined,
//   perUserLimit: undefined,
// };

// const OfferForm = ({ open, initial, onClose, onSubmit }: Props) => {
//   const [form, setForm] = useState<CreateOfferInput>(emptyForm);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setForm(
//         initial
//           ? {
//               title: initial.title,
//               code: initial.code ?? '',
//               description: initial.description ?? '',
//               discountType: initial.discountType,
//               discountValue: initial.discountValue,
//               maxDiscount: initial.maxDiscount,
//               minOrderValue: initial.minOrderValue,
//               imageUrl: initial.imageUrl ?? '',
//               bgColor: initial.bgColor ?? '#EF4444',
//               startDate: toInputDate(initial.startDate),
//               endDate: toInputDate(initial.endDate),
//               isActive: initial.isActive,
//               priority: initial.priority,
//               usageLimit: initial.usageLimit,
//               perUserLimit: initial.perUserLimit,
//             }
//           : emptyForm
//       );
//     }
//   }, [open, initial]);

//   if (!open) return null;

//   const set = <K extends keyof CreateOfferInput>(key: K, value: CreateOfferInput[K]) =>
//     setForm((f) => ({ ...f, [key]: value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await onSubmit({
//         ...form,
//         startDate: new Date(form.startDate).toISOString(),
//         endDate: new Date(form.endDate).toISOString(),
//       });
//       onClose();
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputCls =
//     'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none';
//   const labelCls = 'mb-1 block text-xs font-semibold text-gray-600';

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
//       >
//         <h2 className="mb-4 text-lg font-bold">
//           {initial ? '✏️ Edit Offer' : '➕ Create Offer'}
//         </h2>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="md:col-span-2">
//             <label className={labelCls}>Title *</label>
//             <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required />
//           </div>

//           <div>
//             <label className={labelCls}>Coupon Code</label>
//             <input className={inputCls} value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="SAVE20" />
//           </div>

//           <div>
//             <label className={labelCls}>Discount Type *</label>
//             <select
//               className={inputCls}
//               value={form.discountType}
//               onChange={(e) => set('discountType', e.target.value as DiscountType)}
//             >
//               <option value="PERCENTAGE">Percentage (%)</option>
//               <option value="FLAT">Flat (₹)</option>
//               <option value="B1G1">Buy 1 Get 1</option>
//             </select>
//           </div>

//           {form.discountType !== 'B1G1' && (
//             <>
//               <div>
//                 <label className={labelCls}>
//                   {form.discountType === 'PERCENTAGE' ? 'Discount % *' : 'Flat Amount ₹ *'}
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   className={inputCls}
//                   value={form.discountValue}
//                   onChange={(e) => set('discountValue', Number(e.target.value))}
//                   required
//                 />
//               </div>
//               {form.discountType === 'PERCENTAGE' && (
//                 <div>
//                   <label className={labelCls}>Max Discount ₹ (cap)</label>
//                   <input type="number" className={inputCls} value={form.maxDiscount ?? ''} onChange={(e) => set('maxDiscount', e.target.value ? Number(e.target.value) : undefined)} />
//                 </div>
//               )}
//             </>
//           )}

//           <div>
//             <label className={labelCls}>Min Order Value ₹</label>
//             <input type="number" className={inputCls} value={form.minOrderValue ?? ''} onChange={(e) => set('minOrderValue', e.target.value ? Number(e.target.value) : undefined)} />
//           </div>

//           <div>
//             <label className={labelCls}>Usage Limit (total)</label>
//             <input type="number" className={inputCls} value={form.usageLimit ?? ''} onChange={(e) => set('usageLimit', e.target.value ? Number(e.target.value) : undefined)} />
//           </div>

//           <div>
//             <label className={labelCls}>Per User Limit</label>
//             <input type="number" className={inputCls} value={form.perUserLimit ?? ''} onChange={(e) => set('perUserLimit', e.target.value ? Number(e.target.value) : undefined)} />
//           </div>

//           <div>
//             <label className={labelCls}>Priority (high = pehle dikhega)</label>
//             <input type="number" className={inputCls} value={form.priority} onChange={(e) => set('priority', Number(e.target.value))} />
//           </div>

//           <div>
//             <label className={labelCls}>Start Date *</label>
//             <input type="datetime-local" className={inputCls} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} required />
//           </div>

//           <div>
//             <label className={labelCls}>End Date *</label>
//             <input type="datetime-local" className={inputCls} value={form.endDate} onChange={(e) => set('endDate', e.target.value)} required />
//           </div>

//           <div className="md:col-span-2">
//             <label className={labelCls}>Description</label>
//             <input className={inputCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="On Selected Pizzas" />
//           </div>

//           <div>
//             <label className={labelCls}>Image URL (burger/pizza photo)</label>
//             <input className={inputCls} value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." />
//           </div>

//           <div className="flex items-end gap-3">
//             <div className="flex-1">
//               <label className={labelCls}>Card Background Color</label>
//               <input type="color" className="h-10 w-full cursor-pointer rounded-lg border" value={form.bgColor} onChange={(e) => set('bgColor', e.target.value)} />
//             </div>
//             <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
//               <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
//               Active
//             </label>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="rounded-lg bg-red-600 px-6 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
//           >
//             {saving ? 'Saving...' : initial ? 'Update Offer' : 'Create Offer'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default OfferForm;



import { useEffect, useState } from 'react';
import type { ApplyType, CreateOfferInput, DiscountType, Offer } from '../../types/Offer';
import { toInputDate } from '../../lib/utils';

interface Props {
  open: boolean;
  initial?: Offer | null;
  onClose: () => void;
  onSubmit: (payload: CreateOfferInput) => Promise<void>;
}

const DEFAULT_IMAGE = 'https://placehold.co/600x400/EF4444/ffffff?text=Offer';

const emptyForm: CreateOfferInput = {
  title: '',
  code: undefined,
  applyType: 'CODE',
  description: undefined,
  discountType: 'PERCENT',
  discountValue: 10,
  maxDiscount: undefined,
  minOrderValue: undefined,
  imageUrl: DEFAULT_IMAGE,
  bgColor: '#EF4444',
  startDate: toInputDate(new Date().toISOString()),
  endDate: toInputDate(new Date(Date.now() + 7 * 86400000).toISOString()),
  isActive: true,
  priority: 0,
  usageLimit: undefined,
  perUserLimit: undefined,
};

const OfferForm = ({ open, initial, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<CreateOfferInput>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              code: initial.code ?? undefined,
              applyType: initial.applyType ?? 'CODE',
              description: initial.description ?? undefined,
              discountType: initial.discountType,
              discountValue: initial.discountValue,
              maxDiscount: initial.maxDiscount,
              minOrderValue: initial.minOrderValue,
              imageUrl: initial.imageUrl ?? DEFAULT_IMAGE,
              bgColor: initial.bgColor ?? '#EF4444',
              startDate: toInputDate(initial.startDate),
              endDate: toInputDate(initial.endDate),
              isActive: initial.isActive,
              priority: initial.priority,
              usageLimit: initial.usageLimit,
              perUserLimit: initial.perUserLimit,
            }
          : emptyForm
      );
    }
  }, [open, initial]);

  if (!open) return null;

  const set = <K extends keyof CreateOfferInput>(key: K, value: CreateOfferInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // ⬅️ Empty string "" backend zod reject karta hai — undefined bhejo
      const payload: CreateOfferInput = {
        ...form,
        title: form.title.trim(),
        code: form.code?.trim() ? form.code.trim().toUpperCase() : undefined,
        description: form.description?.trim() ? form.description.trim() : undefined,
        imageUrl: form.imageUrl?.trim() ? form.imageUrl.trim() : DEFAULT_IMAGE,
        maxDiscount: form.maxDiscount || undefined,
        minOrderValue: form.minOrderValue || undefined,
        usageLimit: form.usageLimit || undefined,
        perUserLimit: form.perUserLimit || undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none';
  const labelCls = 'mb-1 block text-xs font-semibold text-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="mb-4 text-lg font-bold">
          {initial ? '✏️ Edit Offer' : '➕ Create Offer'}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelCls}>Title *</label>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="FLAT ₹120 OFF"
              required
            />
          </div>

          {/* Apply Type */}
          <div>
            <label className={labelCls}>Apply Type *</label>
            <select
              className={inputCls}
              value={form.applyType}
              onChange={(e) => set('applyType', e.target.value as ApplyType)}
            >
              <option value="CODE">Coupon Code se apply</option>
              <option value="AUTO">Auto-apply (banner)</option>
            </select>
          </div>

          {/* Coupon Code — sirf CODE type pe */}
          {form.applyType === 'CODE' && (
            <div>
              <label className={labelCls}>Coupon Code</label>
              <input
                className={inputCls}
                value={form.code ?? ''}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="SAVE20"
              />
            </div>
          )}

          {/* Discount Type */}
          <div>
            <label className={labelCls}>Discount Type *</label>
            <select
              className={inputCls}
              value={form.discountType}
              onChange={(e) => set('discountType', e.target.value as DiscountType)}
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FLAT">Flat (₹)</option>
              <option value="BOGO">Buy 1 Get 1</option>
            </select>
          </div>

          {/* Discount Value — BOGO pe nahi chahiye */}
          {form.discountType !== 'BOGO' && (
            <div>
              <label className={labelCls}>
                {form.discountType === 'PERCENT' ? 'Discount % *' : 'Flat Amount ₹ *'}
              </label>
              <input
                type="number"
                min={0}
                max={form.discountType === 'PERCENT' ? 100 : undefined}
                className={inputCls}
                value={form.discountValue}
                onChange={(e) => set('discountValue', Number(e.target.value))}
                required
              />
            </div>
          )}

          {/* Max Discount — sirf PERCENT pe */}
          {form.discountType === 'PERCENT' && (
            <div>
              <label className={labelCls}>Max Discount ₹ (cap)</label>
              <input
                type="number"
                className={inputCls}
                value={form.maxDiscount ?? ''}
                onChange={(e) =>
                  set('maxDiscount', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          )}

          {/* Min Order Value */}
          <div>
            <label className={labelCls}>Min Order Value ₹</label>
            <input
              type="number"
              className={inputCls}
              value={form.minOrderValue ?? ''}
              onChange={(e) =>
                set('minOrderValue', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label className={labelCls}>Usage Limit (total)</label>
            <input
              type="number"
              className={inputCls}
              value={form.usageLimit ?? ''}
              onChange={(e) =>
                set('usageLimit', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Per User Limit */}
          <div>
            <label className={labelCls}>Per User Limit</label>
            <input
              type="number"
              className={inputCls}
              value={form.perUserLimit ?? ''}
              onChange={(e) =>
                set('perUserLimit', e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>

          {/* Priority */}
          <div>
            <label className={labelCls}>Priority (high = pehle dikhega)</label>
            <input
              type="number"
              className={inputCls}
              value={form.priority}
              onChange={(e) => set('priority', Number(e.target.value))}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className={labelCls}>Start Date *</label>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className={labelCls}>End Date *</label>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <input
              className={inputCls}
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="On orders above ₹399"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelCls}>Image URL *</label>
            <input
              className={inputCls}
              value={form.imageUrl}
              onChange={(e) => set('imageUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Color + Active toggle */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className={labelCls}>Card Background Color</label>
              <input
                type="color"
                className="h-10 w-full cursor-pointer rounded-lg border"
                value={form.bgColor}
                onChange={(e) => set('bgColor', e.target.value)}
              />
            </div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
              />
              Active
            </label>
          </div>

          {/* Live Preview */}
          <div className="md:col-span-2">
            <label className={labelCls}>Preview</label>
            <div
              className="flex items-stretch overflow-hidden rounded-2xl shadow-md"
              style={{ backgroundColor: form.bgColor }}
            >
              <div className="flex-1 p-4 text-white">
                <p className="text-xl font-extrabold">
                  {form.discountType === 'PERCENT'
                    ? `${form.discountValue}% OFF`
                    : form.discountType === 'FLAT'
                      ? `₹${form.discountValue} OFF`
                      : 'BUY 1 GET 1 FREE'}
                </p>
                <p className="text-xs text-white/80">{form.description}</p>
                <p className="mt-1 text-sm font-semibold">{form.title}</p>
                {form.applyType === 'CODE' && form.code && (
                  <span className="mt-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-800">
                    Use code: {form.code}
                  </span>
                )}
              </div>
              <img src={form.imageUrl} alt="" className="h-28 w-28 object-cover md:h-36 md:w-44" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : initial ? 'Update Offer' : 'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferForm;