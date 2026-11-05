// import { useEffect, useState } from "react";
// import { offersApi } from "../api/Offer";
// import type { AppliedOffer, CartItem } from "../types/Offer";

// type Props = {
//   /** Cart items — applyOfferSchema ke hisaab se shape adjust karna (types/offer.ts me CartItem) */
//   items: CartItem[];
//   /** ActiveOffersStrip se code select hone par yahan pass karo */
//   presetCode?: string;
//   /** Apply / remove hone par parent ko batata hai (checkout total update ke liye) */
//   onChange?: (applied: AppliedOffer | null) => void;
// };

// /** Cart / Checkout page par lagao: <ApplyOfferBox items={cartItems} onChange={setApplied} /> */
// export default function ApplyOfferBox({ items, presetCode, onChange }: Props) {
//   const [code, setCode] = useState("");
//   const [applied, setApplied] = useState<AppliedOffer | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     if (presetCode) setCode(presetCode);
//   }, [presetCode]);

//   // Cart badal jaye to purana discount invalid ho sakta hai — dobara apply karwao
//   useEffect(() => {
//     if (applied) {
//       setApplied(null);
//       onChange?.(null);
//       setErr("Cart change hua hai, offer dobara apply karo");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(items)]);

//   const apply = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     const c = code.trim().toUpperCase();
//     if (!c) return setErr("Coupon code daalo");
//     if (items.length === 0) return setErr("Cart khali hai");

//     setLoading(true);
//     setErr("");
//     try {
//       const res = await offersApi.apply(c, items);
//       setApplied(res.data);
//       onChange?.(res.data);
//     } catch (e) {
//       setApplied(null);
//       onChange?.(null);
//       setErr((e as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const remove = () => {
//     setApplied(null);
//     setCode("");
//     setErr("");
//     onChange?.(null);
//   };

//   if (applied) {
//     return (
//       <div className="rounded-xl border border-green-300 bg-green-50 p-4">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className="text-sm font-bold text-green-800">
//               ✅ {applied.code ?? "Offer"} applied
//             </div>
//             <div className="text-xs text-green-700">{applied.title}</div>
//           </div>
//           <button onClick={remove} className="text-xs font-bold text-sauce underline">
//             Remove
//           </button>
//         </div>
//         <div className="mt-3 text-sm space-y-1">
//           <div className="flex justify-between"><span>Subtotal</span><span>₹{applied.subtotal}</span></div>
//           <div className="flex justify-between text-green-700 font-semibold"><span>Discount</span><span>− ₹{applied.discount}</span></div>
//           <div className="flex justify-between font-extrabold border-t border-green-200 pt-1"><span>Total</span><span>₹{applied.total}</span></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={apply} className="rounded-xl border border-ink/10 bg-white p-4">
//       <label className="block text-sm font-bold mb-2">🏷️ Have a coupon?</label>
//       <div className="flex gap-2">
//         <input
//           value={code}
//           onChange={(e) => {
//             setCode(e.target.value.toUpperCase());
//             setErr("");
//           }}
//           placeholder="Enter code"
//           className="flex-1 min-w-0 rounded-lg border border-ink/15 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-sauce focus:ring-2 focus:ring-sauce/20"
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-sauce text-white font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-60"
//         >
//           {loading ? "..." : "Apply"}
//         </button>
//       </div>
//       {err && <p className="text-xs text-red-600 mt-2">{err}</p>}
//     </form>
//   );
// }