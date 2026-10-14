// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import type { PlacedInfo } from "./types";

// function Icon({ name, className = "w-5 h-5" }: { name: "check" | "copy" | "clock" | "pin" | "phone" | "arrow" | "shopping"; className?: string }) {
//   const paths = {
//     check: <path d="m5 12 4 4L19 6" />,
//     copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
//     clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
//     pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
//     phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.1 10a16 16 0 0 0 6.9 6.9l1.5-1.9a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" />,
//     arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
//     shopping: <><path d="M3 4h2l2 12h12l2-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
//   };
//   return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
// }

// function ScooterAnimation() {
//   return (
//     <div className="relative mx-auto h-56 w-full max-w-sm overflow-hidden sm:h-64" aria-label="Animated delivery scooter heading towards a location pin" role="img">
//       <div className="absolute left-1/2 top-4 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-50 sm:h-56 sm:w-56" />
//       <div className="absolute right-[15%] top-5 animate-location-bounce">
//         <div className="absolute inset-0 rounded-full bg-red-400/25 animate-pin-pulse" />
//         <svg className="relative h-11 w-11 drop-shadow-sm" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 3C13.5 3 6 11 6 21c0 13 18 25 18 25s18-12 18-25C42 11 34.5 3 24 3Z" fill="#EF4444"/><circle cx="24" cy="21" r="7" fill="white"/></svg>
//       </div>
//       <div className="absolute bottom-9 left-[9%] right-[9%] h-[3px] rounded-full bg-rose-200" />
//       <div className="absolute bottom-10 left-1/2 w-52 -translate-x-1/2 animate-scooter-drive sm:w-60">
//         <svg viewBox="0 0 280 170" className="w-full overflow-visible drop-shadow-lg" aria-hidden="true">
//           <ellipse cx="137" cy="154" rx="108" ry="7" fill="#E5B6B6" opacity=".3" />
//           <g className="animate-wheel-spin origin-[66px_133px]"><circle cx="66" cy="133" r="29" fill="#30343B"/><circle cx="66" cy="133" r="16" fill="#9CA3AF"/><circle cx="66" cy="133" r="6" fill="#E5E7EB"/><path d="M66 117v32M50 133h32" stroke="#D1D5DB" strokeWidth="2"/></g>
//           <g className="animate-wheel-spin origin-[217px_133px]"><circle cx="217" cy="133" r="29" fill="#30343B"/><circle cx="217" cy="133" r="16" fill="#9CA3AF"/><circle cx="217" cy="133" r="6" fill="#E5E7EB"/><path d="M217 117v32M201 133h32" stroke="#D1D5DB" strokeWidth="2"/></g>
//           <path d="M63 127 92 77h58l26 48h35l-6-57h-28l-14 30-29 15H90" fill="#FFC400" stroke="#E6A600" strokeWidth="5" strokeLinejoin="round" />
//           <path d="M183 70V41h22" stroke="#374151" strokeWidth="7" strokeLinecap="round" fill="none"/>
//           <path d="M197 40h18" stroke="#374151" strokeWidth="6" strokeLinecap="round"/>
//           <rect x="170" y="79" width="51" height="42" rx="7" fill="#EF4444"/><rect x="178" y="73" width="37" height="9" rx="4" fill="#F87171"/>
//           <path d="M103 73h49" stroke="#374151" strokeWidth="8" strokeLinecap="round"/>
//           <path d="M119 66 115 42l23-4 13 28" fill="#FBBF24"/>
//           <circle cx="124" cy="29" r="13" fill="#E9A47B"/><path d="M110 26c-2-17 26-23 29-4l-10-3-12 9Z" fill="#374151"/>
//           <path d="m140 48 20 25 29-2" fill="none" stroke="#E9A47B" strokeWidth="10" strokeLinecap="round"/>
//           <path d="m137 64 22 31-24 23" fill="none" stroke="#374151" strokeWidth="12" strokeLinecap="round"/>
//           <path d="M184 70h15" stroke="#374151" strokeWidth="6" strokeLinecap="round"/>
//         </svg>
//       </div>
//       <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-300"/><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 [animation-delay:200ms]"/><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 [animation-delay:400ms]"/></div>
//     </div>
//   );
// }

// export default function OrderSuccess({ order }: { order: PlacedInfo }) {
//   const [copied, setCopied] = useState(false);
//   useEffect(() => {
//     if (!copied) return;
//     const timer = window.setTimeout(() => setCopied(false), 1800);
//     return () => window.clearTimeout(timer);
//   }, [copied]);

//   async function copyOrderId() {
//     if (!order.orderNumber) return;
//     try {
//       await navigator.clipboard.writeText(order.orderNumber);
//       setCopied(true);
//     } catch {
//       setCopied(false);
//     }
//   }

//   return (
//     <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-rose-50/60 via-white to-white px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
//       <style>{`
//         @keyframes scooter-drive { 0%,100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(calc(-50% + 14px)) translateY(-3px) } }
//         @keyframes wheel-spin { to { rotate: 360deg } }
//         @keyframes location-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
//         @keyframes pin-pulse { 0% { transform: scale(1); opacity:.8 } 100% { transform: scale(1.8); opacity:0 } }
//         @keyframes success-pop { 0% { transform: scale(.6); opacity:0 } 70% { transform: scale(1.1); opacity:1 } 100% { transform: scale(1); opacity:1 } }
//         .animate-scooter-drive { animation: scooter-drive 3s ease-in-out infinite; }
//         .animate-wheel-spin { animation: wheel-spin 1.5s linear infinite; transform-box: view-box; }
//         .animate-location-bounce { animation: location-bounce 2s ease-in-out infinite; }
//         .animate-pin-pulse { animation: pin-pulse 2s ease-out infinite; }
//         .animate-success-pop { animation: success-pop .65s ease-out both; }
//         @media (prefers-reduced-motion: reduce) { .animate-scooter-drive,.animate-wheel-spin,.animate-location-bounce,.animate-pin-pulse,.animate-success-pop { animation: none !important; } }
//       `}</style>
//       <section className="mx-auto grid w-full max-w-5xl items-center gap-7 overflow-hidden rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_18px_70px_-35px_rgba(190,24,40,.25)] sm:p-8 md:grid-cols-2 md:gap-10 lg:p-12">
//         <div className="min-w-0 order-1">
//           <div className="animate-success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-50 md:mx-0"><Icon name="check" className="h-9 w-9" /></div>
//           <h1 className="mt-6 text-center text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-left lg:text-4xl">Order Placed <span className="text-green-600">Successfully!</span></h1>
//           <p className="mt-3 text-center text-sm leading-6 text-gray-500 sm:text-base md:text-left">Your order has been placed and is being processed.</p>
//           <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 sm:px-5">
//             <div className="min-w-0"><p className="text-xs font-medium text-gray-500">Order ID</p><p className="mt-1 break-all text-sm font-extrabold tracking-wide text-gray-900 sm:text-base">#{order.orderNumber || "—"}</p></div>
//             <button type="button" onClick={copyOrderId} disabled={!order.orderNumber} title="Copy Order ID" aria-label="Copy Order ID" className="shrink-0 rounded-xl border border-rose-100 bg-white p-3 text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:text-red-500 active:scale-95 disabled:opacity-40"><Icon name="copy" className="h-4 w-4" /></button>
//           </div>
//           <p aria-live="polite" className="mt-1 min-h-5 text-right text-xs font-semibold text-green-600">{copied ? "Order ID copied!" : ""}</p>
//           <div className="mt-4 space-y-5 rounded-2xl border border-gray-100 p-4 sm:p-5">
//             <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="clock" /></span><div><p className="text-xs text-gray-400">Estimated Delivery Time</p><p className="mt-0.5 text-sm font-bold text-gray-900">25–30 minutes</p></div></div>
//             <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="pin" /></span><div className="min-w-0"><p className="text-xs text-gray-400">Delivery Address</p><p className="mt-0.5 break-words text-sm font-bold text-gray-900">{order.address}</p>{order.landmark && <p className="mt-1 text-xs text-gray-500">Landmark: {order.landmark}</p>}</div></div>
//             <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="phone" /></span><div><p className="text-xs text-gray-400">Contact Number</p><p className="mt-0.5 text-sm font-bold text-gray-900">{order.phone}</p></div></div>
//           </div>
//           <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <Link to={order.id ? `/orders/${order.id}` : "/orders"} className="group flex min-h-13 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-red-100 transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"><Icon name="pin" className="h-4 w-4"/>Track Order<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
//             <Link to="/" className="group flex min-h-13 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center text-sm font-bold text-gray-900 transition duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-rose-50 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"><Icon name="shopping" className="h-4 w-4"/>Continue Shopping</Link>
//           </div>
//         </div>
//         <div className="order-2 flex min-w-0 flex-col items-center rounded-3xl bg-gradient-to-b from-rose-50/80 to-white px-3 py-6 text-center sm:px-6 md:py-10">
//           <ScooterAnimation />
//           <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">We're preparing your food</h2>
//           <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">Your delicious food is being prepared. Track your order for the latest status.</p>
//           <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-semibold text-red-500 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500"/>Order confirmed</div>
//         </div>
//       </section>
//     </main>
//   );
// }



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PlacedInfo } from "./types";

function Icon({ name, className = "w-5 h-5" }: { name: "check" | "copy" | "clock" | "pin" | "phone" | "arrow" | "shopping"; className?: string }) {
  const paths = {
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.1 10a16 16 0 0 0 6.9 6.9l1.5-1.9a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    shopping: <><path d="M3 4h2l2 12h12l2-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  };
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ScooterAnimation() {
  return (
    <div className="relative mx-auto h-56 w-full max-w-sm overflow-hidden sm:h-64" aria-label="Animated delivery scooter heading towards a location pin" role="img">
      <div className="absolute left-1/2 top-4 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-50 sm:h-56 sm:w-56" />
      <div className="absolute right-[15%] top-5 animate-location-bounce">
        <div className="absolute inset-0 rounded-full bg-red-400/25 animate-pin-pulse" />
        <svg className="relative h-11 w-11 drop-shadow-sm" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 3C13.5 3 6 11 6 21c0 13 18 25 18 25s18-12 18-25C42 11 34.5 3 24 3Z" fill="#EF4444"/><circle cx="24" cy="21" r="7" fill="white"/></svg>
      </div>
      <div className="absolute bottom-9 left-[9%] right-[9%] h-[3px] rounded-full bg-rose-200" />
      <div className="absolute bottom-10 left-1/2 w-52 -translate-x-1/2 animate-scooter-drive sm:w-60">
        <svg viewBox="0 0 280 170" className="w-full overflow-visible drop-shadow-lg" aria-hidden="true">
          <ellipse cx="137" cy="154" rx="108" ry="7" fill="#E5B6B6" opacity=".3" />
          <g className="animate-wheel-spin origin-[66px_133px]"><circle cx="66" cy="133" r="29" fill="#30343B"/><circle cx="66" cy="133" r="16" fill="#9CA3AF"/><circle cx="66" cy="133" r="6" fill="#E5E7EB"/><path d="M66 117v32M50 133h32" stroke="#D1D5DB" strokeWidth="2"/></g>
          <g className="animate-wheel-spin origin-[217px_133px]"><circle cx="217" cy="133" r="29" fill="#30343B"/><circle cx="217" cy="133" r="16" fill="#9CA3AF"/><circle cx="217" cy="133" r="6" fill="#E5E7EB"/><path d="M217 117v32M201 133h32" stroke="#D1D5DB" strokeWidth="2"/></g>
          <path d="M63 127 92 77h58l26 48h35l-6-57h-28l-14 30-29 15H90" fill="#FFC400" stroke="#E6A600" strokeWidth="5" strokeLinejoin="round" />
          <path d="M183 70V41h22" stroke="#374151" strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M197 40h18" stroke="#374151" strokeWidth="6" strokeLinecap="round"/>
          <rect x="170" y="79" width="51" height="42" rx="7" fill="#EF4444"/><rect x="178" y="73" width="37" height="9" rx="4" fill="#F87171"/>
          <path d="M103 73h49" stroke="#374151" strokeWidth="8" strokeLinecap="round"/>
          <path d="M119 66 115 42l23-4 13 28" fill="#FBBF24"/>
          <circle cx="124" cy="29" r="13" fill="#E9A47B"/><path d="M110 26c-2-17 26-23 29-4l-10-3-12 9Z" fill="#374151"/>
          <path d="m140 48 20 25 29-2" fill="none" stroke="#E9A47B" strokeWidth="10" strokeLinecap="round"/>
          <path d="m137 64 22 31-24 23" fill="none" stroke="#374151" strokeWidth="12" strokeLinecap="round"/>
          <path d="M184 70h15" stroke="#374151" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-300"/><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 [animation-delay:200ms]"/><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 [animation-delay:400ms]"/></div>
    </div>
  );
}

export default function OrderSuccess({ order }: { order: PlacedInfo }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyOrderId() {
    if (!order.orderNumber) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-rose-50/60 via-white to-white px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
      <style>{`
        @keyframes scooter-drive { 0%,100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(calc(-50% + 14px)) translateY(-3px) } }
        @keyframes wheel-spin { to { rotate: 360deg } }
        @keyframes location-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes pin-pulse { 0% { transform: scale(1); opacity:.8 } 100% { transform: scale(1.8); opacity:0 } }
        @keyframes success-pop { 0% { transform: scale(.6); opacity:0 } 70% { transform: scale(1.1); opacity:1 } 100% { transform: scale(1); opacity:1 } }
        .animate-scooter-drive { animation: scooter-drive 3s ease-in-out infinite; }
        .animate-wheel-spin { animation: wheel-spin 1.5s linear infinite; transform-box: view-box; }
        .animate-location-bounce { animation: location-bounce 2s ease-in-out infinite; }
        .animate-pin-pulse { animation: pin-pulse 2s ease-out infinite; }
        .animate-success-pop { animation: success-pop .65s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .animate-scooter-drive,.animate-wheel-spin,.animate-location-bounce,.animate-pin-pulse,.animate-success-pop { animation: none !important; } }
      `}</style>
      <section className="mx-auto grid w-full max-w-5xl items-center gap-7 overflow-hidden rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_18px_70px_-35px_rgba(190,24,40,.25)] sm:p-8 md:grid-cols-2 md:gap-10 lg:p-12">
        <div className="min-w-0 order-1">
          <div className="animate-success-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-50 md:mx-0"><Icon name="check" className="h-9 w-9" /></div>
          <h1 className="mt-6 text-center text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-left lg:text-4xl">Order Placed <span className="text-green-600">Successfully!</span></h1>
          <p className="mt-3 text-center text-sm leading-6 text-gray-500 sm:text-base md:text-left">Your order has been placed and is being processed.</p>
          <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 sm:px-5">
            <div className="min-w-0"><p className="text-xs font-medium text-gray-500">Order ID</p><p className="mt-1 break-all text-sm font-extrabold tracking-wide text-gray-900 sm:text-base">#{order.orderNumber || "—"}</p></div>
            <button type="button" onClick={copyOrderId} disabled={!order.orderNumber} title="Copy Order ID" aria-label="Copy Order ID" className="shrink-0 rounded-xl border border-rose-100 bg-white p-3 text-gray-600 shadow-sm transition hover:-translate-y-0.5 hover:text-red-500 active:scale-95 disabled:opacity-40"><Icon name="copy" className="h-4 w-4" /></button>
          </div>
          <p aria-live="polite" className="mt-1 min-h-5 text-right text-xs font-semibold text-green-600">{copied ? "Order ID copied!" : ""}</p>
          <div className="mt-4 space-y-5 rounded-2xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="clock" /></span><div><p className="text-xs text-gray-400">Estimated Delivery Time</p><p className="mt-0.5 text-sm font-bold text-gray-900">25–30 minutes</p></div></div>
            <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="pin" /></span><div className="min-w-0"><p className="text-xs text-gray-400">Delivery Address</p><p className="mt-0.5 break-words text-sm font-bold text-gray-900">{order.address}</p>{order.landmark && <p className="mt-1 text-xs text-gray-500">Landmark: {order.landmark}</p>}</div></div>
            <div className="flex items-start gap-3"><span className="rounded-xl bg-gray-50 p-2.5 text-gray-500"><Icon name="phone" /></span><div><p className="text-xs text-gray-400">Contact Number</p><p className="mt-0.5 text-sm font-bold text-gray-900">{order.phone}</p></div></div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link to={order.id ? `/orders/${order.id}` : "/orders"} className="group flex min-h-13 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-red-100 transition duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"><Icon name="pin" className="h-4 w-4"/>Track Order<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
            <Link to="/" className="group flex min-h-13 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-red-100 transition duration-200 hover:-translate-y-0.5 hover:bg-red-800 hover:shadow-xl active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"><Icon name="shopping" className="h-4 w-4"/>Continue Shopping<Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </div>
        <div className="order-2 flex min-w-0 flex-col items-center rounded-3xl bg-gradient-to-b from-rose-50/80 to-white px-3 py-6 text-center sm:px-6 md:py-10">
          <ScooterAnimation />
          <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">We're preparing your food</h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">Your delicious food is being prepared. Track your order for the latest status.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-semibold text-red-500 shadow-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500"/>Order confirmed</div>
        </div>
      </section>
    </main>
  );
}