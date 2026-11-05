// import { useEffect, useState } from "react";
// import { offersApi } from "../api/Offer";
// import type { Offer } from "../types/Offer";

// const discountLabel = (o: Offer) =>
//   o.discountType === "percentage"
//     ? `${o.discountValue}% OFF${o.maxDiscount ? ` up to ₹${o.maxDiscount}` : ""}`
//     : `Flat ₹${o.discountValue} OFF`;

// type Props = {
//   /** Card par click karne par code mil jaye (e.g. cart ke coupon box me fill karne ke liye) */
//   onSelectCode?: (code: string) => void;
// };

// /**
//  * Home / menu page par lagao: <ActiveOffersStrip />
//  * Mobile par horizontal swipe, desktop par bhi scrollable row.
//  */
// export default function ActiveOffersStrip({ onSelectCode }: Props) {
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState<string | null>(null);

//   useEffect(() => {
//     let alive = true;
//     offersApi
//       .active()
//       .then((r) => alive && setOffers(r.data))
//       .catch(() => alive && setOffers([]))
//       .finally(() => alive && setLoading(false));
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const copy = async (code: string) => {
//     onSelectCode?.(code);
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopied(code);
//       setTimeout(() => setCopied(null), 1500);
//     } catch {
//       /* clipboard blocked — ignore */
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex gap-3 overflow-hidden py-2">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="min-w-[260px] h-28 rounded-xl bg-ink/5 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (offers.length === 0) return null;

//   return (
//     <section className="my-4">
//       <h2 className="text-lg sm:text-xl font-extrabold mb-3">🏷️ Offers for you</h2>
//       <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
//         {offers.map((o) => (
//           <div
//             key={o._id}
//             className="snap-start shrink-0 w-[260px] sm:w-[300px] rounded-xl bg-gradient-to-br from-sauce to-sauce/80 text-white p-4 shadow"
//           >
//             <div className="text-xs font-semibold opacity-90 line-clamp-1">{o.title}</div>
//             <div className="text-xl font-extrabold mt-1">{discountLabel(o)}</div>
//             {o.minOrderValue ? <div className="text-xs opacity-90 mt-0.5">On orders above ₹{o.minOrderValue}</div> : null}
//             {o.description && <div className="text-xs opacity-80 mt-1 line-clamp-2">{o.description}</div>}

//             <div className="mt-3 flex items-center justify-between gap-2">
//               {o.code ? (
//                 <>
//                   <span className="border border-dashed border-white/80 rounded px-2 py-1 text-xs font-bold tracking-wider">
//                     {o.code}
//                   </span>
//                   <button
//                     onClick={() => copy(o.code as string)}
//                     className="bg-white text-sauce text-xs font-bold px-3 py-1.5 rounded-lg"
//                   >
//                     {copied === o.code ? "Copied ✓" : "Copy"}
//                   </button>
//                 </>
//               ) : (
//                 <span className="text-xs font-semibold bg-white/20 rounded px-2 py-1">Auto-applied at checkout</span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }