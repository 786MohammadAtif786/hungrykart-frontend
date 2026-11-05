// // // import type { Offer } from '../../types/Offer';
// // // import { formatDate, formatINR } from '../../lib/utils';

// // // interface Props {
// // //   offer: Offer;
// // //   isAdmin?: boolean;
// // //   onEdit?: (offer: Offer) => void;
// // //   onDelete?: (offer: Offer) => void;
// // //   onToggle?: (offer: Offer) => void;
// // // }

// // // const OfferCard = ({ offer, isAdmin, onEdit, onDelete, onToggle }: Props) => {
 
// // //   const discountText =
// // //   offer.discountType === 'PERCENT'
// // //     ? `${offer.discountValue}% OFF`
// // //     : offer.discountType === 'FLAT'
// // //       ? `${formatINR(offer.discountValue)} OFF`
// // //       : 'BUY 1 GET 1 FREE';

// // //   const subText =
// // //     offer.minOrderValue
// // //       ? `On orders above ${formatINR(offer.minOrderValue)}`
// // //       : offer.description ?? '';

// // //   return (
// // //     <div
// // //       className="relative flex w-full items-stretch overflow-hidden rounded-2xl shadow-md"
// // //       style={{ backgroundColor: offer.bgColor || '#EF4444' }}
// // //     >
// // //       {/* Left: text */}
// // //       <div className="flex flex-1 flex-col justify-center gap-1 p-5 text-white">
// // //         <h3 className="text-2xl font-extrabold leading-tight">{discountText}</h3>
// // //         {subText && <p className="text-xs text-white/80">{subText}</p>}
// // //         <p className="mt-1 text-sm font-semibold">{offer.title}</p>
// // //         {offer.code && (
// // //           <span className="mt-2 w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-800">
// // //             Use code: {offer.code}
// // //           </span>
// // //         )}
// // //         {isAdmin && (
// // //           <p className="mt-2 text-[10px] text-white/60">
// // //             {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
// // //             {offer.usageLimit ? ` • ${offer.usedCount}/${offer.usageLimit} used` : ''}
// // //           </p>
// // //         )}
// // //       </div>

// // //       {/* Right: image */}
// // //       {offer.imageUrl && (
// // //         <img
// // //           src={offer.imageUrl}
// // //           alt={offer.title}
// // //           className="h-36 w-36 object-cover md:h-44 md:w-52"
// // //         />
// // //       )}

// // //       {/* Admin actions */}
// // //       {isAdmin && (
// // //         <div className="absolute right-2 top-2 flex gap-2">
// // //           <button
// // //             onClick={() => onToggle?.(offer)}
// // //             className={`rounded-full px-3 py-1 text-xs font-bold ${
// // //               offer.isActive ? 'bg-green-500' : 'bg-gray-500'
// // //             }`}
// // //           >
// // //             {offer.isActive ? 'Active' : 'Inactive'}
// // //           </button>
// // //           <button
// // //             onClick={() => onEdit?.(offer)}
// // //             className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur"
// // //           >
// // //             Edit
// // //           </button>
// // //           <button
// // //             onClick={() => onDelete?.(offer)}
// // //             className="rounded-full bg-black/30 px-3 py-1 text-xs font-bold"
// // //           >
// // //             Delete
// // //           </button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default OfferCard;



// // // import type { Offer } from '../../types/Offer';
// // // import { formatDate, formatINR } from '../../lib/utils';

// // // interface Props {
// // //   offer: Offer;
// // //   isAdmin?: boolean;
// // //   onEdit?: (offer: Offer) => void;
// // //   onDelete?: (offer: Offer) => void;
// // //   onToggle?: (offer: Offer) => void;
// // // }

// // // const OfferCard = ({ offer, isAdmin, onEdit, onDelete, onToggle }: Props) => {
// // //   const discountText =
// // //     offer.discountType === 'PERCENT'
// // //       ? `${offer.discountValue}% OFF`
// // //       : offer.discountType === 'FLAT'
// // //         ? `${formatINR(offer.discountValue)} OFF`
// // //         : 'BUY 1 GET 1';

// // //   const subText = offer.minOrderValue
// // //     ? `On orders above ${formatINR(offer.minOrderValue)}`
// // //     : offer.description ?? '';

// // //   const imageUrl =
// // //     offer.imageUrl ||
// // //     'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80';

// // //   const usagePercent =
// // //     offer.usageLimit && offer.usageLimit > 0
// // //       ? Math.min(100, Math.round((offer.usedCount / offer.usageLimit) * 100))
// // //       : 0;

// // //   return (
// // //     <div
// // //       className="group relative flex w-full overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
// // //       style={{ backgroundColor: offer.bgColor || '#EF4444' }}
// // //     >
// // //       {/* Left: content */}
// // //       <div className="flex flex-1 flex-col justify-center gap-1.5 p-4 sm:p-5 text-white min-w-0">
// // //         {/* Discount badge */}
// // //         <span className="w-fit rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
// // //           {offer.discountType === 'PERCENT'
// // //             ? 'Save Big'
// // //             : offer.discountType === 'FLAT'
// // //               ? 'Flat Discount'
// // //               : 'Combo Deal'}
// // //         </span>

// // //         <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight break-words">
// // //           {discountText}
// // //         </h3>

// // //         {subText && (
// // //           <p className="text-xs sm:text-sm text-white/80 line-clamp-1">
// // //             {subText}
// // //           </p>
// // //         )}

// // //         <p className="mt-1 text-sm sm:text-base font-semibold truncate">
// // //           {offer.title}
// // //         </p>

// // //         {offer.code && (
// // //           <span className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-dashed border-white/60 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
// // //             <svg
// // //               className="h-3.5 w-3.5"
// // //               fill="none"
// // //               viewBox="0 0 24 24"
// // //               stroke="currentColor"
// // //               strokeWidth={2}
// // //             >
// // //               <path
// // //                 strokeLinecap="round"
// // //                 strokeLinejoin="round"
// // //                 d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
// // //               />
// // //             </svg>
// // //             {offer.code}
// // //           </span>
// // //         )}

// // //         {/* Admin usage info */}
// // //         {isAdmin && (
// // //           <div className="mt-2 space-y-1">
// // //             <p className="text-[10px] sm:text-[11px] text-white/70">
// // //               {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
// // //               {offer.usageLimit ? ` • ${offer.usedCount}/${offer.usageLimit} used` : ''}
// // //             </p>
// // //             {offer.usageLimit ? (
// // //               <div className="h-1 w-28 sm:w-36 overflow-hidden rounded-full bg-white/20">
// // //                 <div
// // //                   className="h-full rounded-full bg-white/80 transition-all"
// // //                   style={{ width: `${usagePercent}%` }}
// // //                 />
// // //               </div>
// // //             ) : null}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Coupon cutout divider — desktop pe hi dikhega */}
// // //       <div className="hidden sm:flex relative flex-col items-center justify-between py-3">
// // //         <div className="absolute -top-2.5 left-0 h-5 w-5 -translate-x-1/2 rounded-full bg-white shadow-inner" />
// // //         <div className="h-full border-l-2 border-dashed border-white/50" />
// // //         <div className="absolute -bottom-2.5 left-0 h-5 w-5 -translate-x-1/2 rounded-full bg-white shadow-inner" />
// // //       </div>

// // //       {/* Right: image */}
// // //       <div className="relative hidden xs:block sm:block w-28 sm:w-40 md:w-52 shrink-0">
// // //         <img
// // //           src={imageUrl}
// // //           alt={offer.title}
// // //           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
// // //           loading="lazy"
// // //         />
// // //         <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
// // //       </div>

// // //       {/* Admin actions */}
// // //       {isAdmin && (
// // //         <div className="absolute right-2 top-2 flex gap-1.5 sm:gap-2">
// // //           <button
// // //             onClick={() => onToggle?.(offer)}
// // //             title={offer.isActive ? 'Deactivate' : 'Activate'}
// // //             className={`rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold transition-opacity hover:opacity-85 ${
// // //               offer.isActive
// // //                 ? 'bg-green-500 text-white'
// // //                 : 'bg-white/25 text-white backdrop-blur'
// // //             }`}
// // //           >
// // //             {offer.isActive ? 'Active' : 'Inactive'}
// // //           </button>
// // //           <button
// // //             onClick={() => onEdit?.(offer)}
// // //             className="rounded-full bg-white/90 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-gray-800 backdrop-blur transition hover:bg-white"
// // //           >
// // //             Edit
// // //           </button>
// // //           <button
// // //             onClick={() => onDelete?.(offer)}
// // //             className="rounded-full bg-black/40 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-white transition hover:bg-black/60"
// // //           >
// // //             Delete
// // //           </button>
// // //         </div>
// // //       )}

// // //       {/* Mobile ke liye image as background jab width chhota ho */}
// // //       <img
// // //         src={imageUrl}
// // //         alt=""
// // //         aria-hidden
// // //         className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25 sm:hidden"
// // //         loading="lazy"
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default OfferCard;


// // import type { Offer } from '../../types/Offer';
// // import { formatDate, formatINR } from '../../lib/utils';

// // interface Props {
// //   offer: Offer;
// //   isAdmin?: boolean;
// //   onEdit?: (offer: Offer) => void;
// //   onDelete?: (offer: Offer) => void;
// //   onToggle?: (offer: Offer) => void;
// // }

// // // hex color ko thoda dark karne ke liye (gradient ke liye)
// // const darken = (hex: string, amount: number): string => {
// //   const h = hex.replace('#', '');
// //   const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
// //   const r = Math.max(0, (num >> 16) - amount);
// //   const g = Math.max(0, ((num >> 8) & 0xff) - amount);
// //   const b = Math.max(0, (num & 0xff) - amount);
// //   return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
// // };

// // const OfferCard = ({ offer, isAdmin, onEdit, onDelete, onToggle }: Props) => {
// //   const bg = offer.bgColor || '#EF4444';
// //   const bgDark = darken(bg, 40);

// //   // Upar chhota label + neeche bada value (jaise "FLAT" / "₹120 OFF")
// //   const label =
// //     offer.discountType === 'PERCENT'
// //       ? 'DISCOUNT'
// //       : offer.discountType === 'FLAT'
// //         ? 'FLAT'
// //         : 'SPECIAL';

// //   const bigText =
// //     offer.discountType === 'PERCENT'
// //       ? `${offer.discountValue}% OFF`
// //       : offer.discountType === 'FLAT'
// //         ? `${formatINR(offer.discountValue)} OFF`
// //         : 'BUY 1 GET 1';

// //   const subText = offer.minOrderValue
// //     ? `On orders above ${formatINR(offer.minOrderValue)}`
// //     : offer.description ?? '';

// //   const imageUrl =
// //     offer.imageUrl ||
// //     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

// //   const usagePercent =
// //     offer.usageLimit && offer.usageLimit > 0
// //       ? Math.min(100, Math.round((offer.usedCount / offer.usageLimit) * 100))
// //       : 0;

// //   return (
// //     <div
// //       className="group relative flex w-full items-stretch overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
// //       style={{
// //         background: `linear-gradient(100deg, ${bgDark} 0%, ${bg} 55%, ${bg} 100%)`,
// //       }}
// //     >
// //       {/* Left: content */}
// //       <div className="flex flex-1 flex-col justify-center gap-1 p-4 sm:p-6 text-white min-w-0">
// //         <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/90">
// //           {label}
// //         </span>

// //         <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
// //           {bigText}
// //         </h3>

// //         {subText && (
// //           <p className="text-xs sm:text-sm text-white/80">{subText}</p>
// //         )}

// //         {offer.title && (
// //           <p className="text-xs sm:text-sm font-semibold text-white/90 truncate">
// //             {offer.title}
// //           </p>
// //         )}

// //         {offer.code && (
// //           <span className="mt-2 sm:mt-3 w-fit rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-extrabold text-red-600 shadow">
// //             Use code: {offer.code}
// //           </span>
// //         )}

// //         {/* Admin info */}
// //         {isAdmin && (
// //           <div className="mt-2 space-y-1">
// //             <p className="text-[10px] text-white/70">
// //               {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
// //               {offer.usageLimit ? ` • ${offer.usedCount}/${offer.usageLimit} used` : ''}
// //             </p>
// //             {offer.usageLimit ? (
// //               <div className="h-1 w-28 sm:w-40 overflow-hidden rounded-full bg-white/20">
// //                 <div
// //                   className="h-full rounded-full bg-white transition-all"
// //                   style={{ width: `${usagePercent}%` }}
// //                 />
// //               </div>
// //             ) : null}
// //           </div>
// //         )}
// //       </div>

// //       {/* Right: image — red background me blend hoga */}
// //       <div className="relative w-28 sm:w-56 md:w-72 lg:w-80 shrink-0 overflow-hidden">
// //         <img
// //           src={imageUrl}
// //           alt={offer.title}
// //           className="h-full min-h-28 sm:min-h-36 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
// //           loading="lazy"
// //         />
// //         {/* Blend overlay — image ka edge red background me dissolve ho jayega */}
// //         <div
// //           className="absolute inset-0"
// //           style={{
// //             background: `linear-gradient(90deg, ${bg} 0%, ${bg}99 25%, transparent 70%)`,
// //           }}
// //         />
// //       </div>

// //       {/* Admin actions */}
// //       {isAdmin && (
// //         <div className="absolute right-2 top-2 flex gap-1.5 sm:gap-2">
// //           <button
// //             onClick={() => onToggle?.(offer)}
// //             title={offer.isActive ? 'Deactivate' : 'Activate'}
// //             className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow transition-opacity hover:opacity-85 ${
// //               offer.isActive ? 'bg-green-500 text-white' : 'bg-white/30 text-white backdrop-blur'
// //             }`}
// //           >
// //             {offer.isActive ? 'Active' : 'Inactive'}
// //           </button>
// //           <button
// //             onClick={() => onEdit?.(offer)}
// //             className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-gray-800 shadow transition hover:bg-gray-100"
// //           >
// //             Edit
// //           </button>
// //           <button
// //             onClick={() => onDelete?.(offer)}
// //             className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white shadow transition hover:bg-black/60"
// //           >
// //             Delete
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OfferCard;




// import type { Offer } from '../../types/Offer';
// import { formatDate, formatINR } from '../../lib/utils';

// interface Props {
//   offer: Offer;
//   isAdmin?: boolean;
//   onEdit?: (offer: Offer) => void;
//   onDelete?: (offer: Offer) => void;
//   onToggle?: (offer: Offer) => void;
// }

// const darken = (hex: string, amount: number): string => {
//   const h = hex.replace('#', '');
//   const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
//   const r = Math.max(0, (num >> 16) - amount);
//   const g = Math.max(0, ((num >> 8) & 0xff) - amount);
//   const b = Math.max(0, (num & 0xff) - amount);
//   return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
// };

// const OfferCard = ({ offer, isAdmin, onEdit, onDelete, onToggle }: Props) => {
//   const bg = offer.bgColor || '#EF4444';
//   const bgDark = darken(bg, 40);

//   const label =
//     offer.discountType === 'PERCENT'
//       ? 'DISCOUNT'
//       : offer.discountType === 'FLAT'
//         ? 'FLAT'
//         : 'SPECIAL';

//   const bigText =
//     offer.discountType === 'PERCENT'
//       ? `${offer.discountValue}% OFF`
//       : offer.discountType === 'FLAT'
//         ? `${formatINR(offer.discountValue)} OFF`
//         : 'BUY 1 GET 1';

//   const subText = offer.minOrderValue
//     ? `On orders above ${formatINR(offer.minOrderValue)}`
//     : offer.description ?? '';

//   const imageUrl =
//     offer.imageUrl ||
//     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

//   const usagePercent =
//     offer.usageLimit && offer.usageLimit > 0
//       ? Math.min(100, Math.round((offer.usedCount / offer.usageLimit) * 100))
//       : 0;

//   // Admin buttons — chhote card pe overlap na karein
//   const renderActions = (variant: 'mobile' | 'desktop') => (
//     <div
//       className={
//         variant === 'desktop'
//           ? 'absolute right-3 top-3 hidden gap-2 md:flex'
//           : 'mb-2 flex justify-end gap-1.5 md:hidden'
//       }
//     >
//       <button
//         onClick={() => onToggle?.(offer)}
//         className={`rounded-full px-2.5 py-1 text-[10px] font-bold shadow transition-opacity hover:opacity-85 ${
//           offer.isActive ? 'bg-green-500 text-white' : 'bg-white/30 text-white backdrop-blur'
//         }`}
//       >
//         {offer.isActive ? 'Active' : 'Inactive'}
//       </button>
//       <button
//         onClick={() => onEdit?.(offer)}
//         className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-gray-800 shadow transition hover:bg-gray-100"
//       >
//         Edit
//       </button>
//       <button
//         onClick={() => onDelete?.(offer)}
//         className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white shadow transition hover:bg-black/60"
//       >
//         Delete
//       </button>
//     </div>
//   );

//   return (
//     <div
//       className="group relative flex w-full items-stretch overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
//       style={{
//         background: `linear-gradient(100deg, ${bgDark} 0%, ${bg} 55%, ${bg} 100%)`,
//       }}
//     >
//       {/* Left: content */}
//       <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4 text-white sm:p-6">
//         {/* Mobile pe buttons yahan flow me aate hain — overlap nahi */}
//         {isAdmin && renderActions('mobile')}

//         <span className="truncate text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 sm:text-sm">
//           {label}
//         </span>

//         {/* whitespace-nowrap = kabhi line-break nahi hoga */}
//         <h3 className="whitespace-nowrap text-xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
//           {bigText}
//         </h3>

//         {subText && (
//           <p className="truncate text-[11px] text-white/80 sm:text-sm">
//             {subText}
//           </p>
//         )}

//         {offer.title && (
//           <p className="truncate text-xs font-semibold text-white/90 sm:text-sm">
//             {offer.title}
//           </p>
//         )}

//         {offer.code && (
//           <span className="mt-2 w-fit whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold text-red-600 shadow sm:mt-3 sm:px-4 sm:text-sm">
//             Use code: {offer.code}
//           </span>
//         )}

//         {isAdmin && (
//           <div className="mt-2 space-y-1">
//             <p className="truncate text-[10px] text-white/70">
//               {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
//               {offer.usageLimit ? ` • ${offer.usedCount}/${offer.usageLimit} used` : ''}
//             </p>
//             {offer.usageLimit ? (
//               <div className="h-1 w-28 overflow-hidden rounded-full bg-white/20 sm:w-40">
//                 <div
//                   className="h-full rounded-full bg-white transition-all"
//                   style={{ width: `${usagePercent}%` }}
//                 />
//               </div>
//             ) : null}
//           </div>
//         )}
//       </div>

//       {/* Right: image — halka fade, zyada image visible */}
//       <div className="relative w-24 shrink-0 overflow-hidden sm:w-48 md:w-64 lg:w-72">
//         <img
//           src={imageUrl}
//           alt={offer.title}
//           className="h-full min-h-24 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 sm:min-h-32"
//           loading="lazy"
//         />
//         {/* Halka blend — sirf edge smooth kare, image ko cover na kare */}
//         <div
//           className="absolute inset-0"
//           style={{
//             background: `linear-gradient(90deg, ${bg} 0%, ${bg}aa 18%, transparent 55%)`,
//           }}
//         />
//       </div>

//       {/* Desktop pe buttons top-right absolute */}
//       {isAdmin && renderActions('desktop')}
//     </div>
//   );
// };

// export default OfferCard;




import type { Offer } from '../../types/Offer';
import { formatDate, formatINR } from '../../lib/utils';
import '../../css/OfferCard.css';

interface Props {
  offer: Offer;
  isAdmin?: boolean;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
  onToggle?: (offer: Offer) => void;
}

// hex color ko thoda dark karne ke liye (gradient ke liye)
const darken = (hex: string, amount: number): string => {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const OfferCard = ({ offer, isAdmin, onEdit, onDelete, onToggle }: Props) => {
  const bg = offer.bgColor || '#EF4444';
  const bgDark = darken(bg, 40);

  const label =
    offer.discountType === 'PERCENT'
      ? 'DISCOUNT'
      : offer.discountType === 'FLAT'
        ? 'FLAT'
        : 'SPECIAL';

  const bigText =
    offer.discountType === 'PERCENT'
      ? `${offer.discountValue}% OFF`
      : offer.discountType === 'FLAT'
        ? `${formatINR(offer.discountValue)} OFF`
        : 'BUY 1 GET 1';

  const subText = offer.minOrderValue
    ? `On orders above ${formatINR(offer.minOrderValue)}`
    : offer.description ?? '';

  const imageUrl =
    offer.imageUrl ||
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80';

  const usagePercent =
    offer.usageLimit && offer.usageLimit > 0
      ? Math.min(100, Math.round((offer.usedCount / offer.usageLimit) * 100))
      : 0;

  const gradientBg = `linear-gradient(100deg, ${bgDark} 0%, ${bg} 55%, ${bg} 100%)`;
  const fadeOverlay = `linear-gradient(90deg, ${bg} 0%, ${bg}aa 18%, transparent 55%)`;

  return (
    <div className="oc-banner" style={{ background: gradientBg }}>
      {/* Left: content */}
      <div className="oc-content">
        {/* Mobile pe buttons flow mein — overlap nahi honge */}
        {isAdmin && (
          <div className="oc-actions oc-actions-mobile">
            <button
              onClick={() => onToggle?.(offer)}
              className={`oc-btn ${offer.isActive ? 'oc-btn-active' : 'oc-btn-inactive'}`}
            >
              {offer.isActive ? 'Active' : 'Inactive'}
            </button>
            <button onClick={() => onEdit?.(offer)} className="oc-btn oc-btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete?.(offer)} className="oc-btn oc-btn-delete">
              Delete
            </button>
          </div>
        )}

        <span className="oc-label">{label}</span>

        <h3 className="oc-bigtext">{bigText}</h3>

        {subText && <p className="oc-subtext">{subText}</p>}

        {offer.title && <p className="oc-title">{offer.title}</p>}

        {offer.code && (
          <span className="oc-code">Use code: {offer.code}</span>
        )}

        {/* Admin info */}
        {isAdmin && (
          <div className="oc-admin-info">
            <p className="oc-dates">
              {formatDate(offer.startDate)} → {formatDate(offer.endDate)}
              {offer.usageLimit ? ` • ${offer.usedCount}/${offer.usageLimit} used` : ''}
            </p>
            {offer.usageLimit ? (
              <div className="oc-usage-track">
                <div className="oc-usage-fill" style={{ width: `${usagePercent}%` }} />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Right: image — halka fade, image mostly visible */}
      <div className="oc-image-wrap">
        <img src={imageUrl} alt={offer.title} className="oc-image" loading="lazy" />
        <div className="oc-image-fade" style={{ background: fadeOverlay }} />
      </div>

      {/* Desktop pe buttons top-right absolute */}
      {isAdmin && (
        <div className="oc-actions oc-actions-desktop">
          <button
            onClick={() => onToggle?.(offer)}
            className={`oc-btn ${offer.isActive ? 'oc-btn-active' : 'oc-btn-inactive'}`}
          >
            {offer.isActive ? 'Active' : 'Inactive'}
          </button>
          <button onClick={() => onEdit?.(offer)} className="oc-btn oc-btn-edit">
            Edit
          </button>
          <button onClick={() => onDelete?.(offer)} className="oc-btn oc-btn-delete">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferCard;