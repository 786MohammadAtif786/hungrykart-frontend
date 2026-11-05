// import { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { ProductImage, formatPrice } from "./ProductCard";
// import { useNavigate } from "react-router-dom";

// const DELIVERY_FEE = 40;
// const GST_RATE = 0.05;

// export default function CartDrawer() {
//   const { items, isOpen, closeCart, updateQty, removeFromCart, subtotal } = useCart();
//   const [promo, setPromo] = useState("");
//   const navigate = useNavigate();


//   const gst = Math.round(subtotal * GST_RATE);
//   const total = subtotal + DELIVERY_FEE + gst;

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50" onClick={closeCart} />

//       {/* Panel — right se slide */}
//       <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3.5 border-b-2 border-ink/10">
//           <h2 className="text-lg font-extrabold">
//             Your Cart ({items.reduce((s, i) => s + i.qty, 0)})
//           </h2>
//           <button onClick={closeCart} aria-label="Close cart" className="text-2xl leading-none p-1 hover:text-sauce">
//             ×
//           </button>
//         </div>

//         {/* Items */}
//         <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
//           {items.length === 0 && (
//             <p className="text-center text-ink/50 py-10">Your cart is empty 🛒</p>
//           )}
//           {items.map(({ product, qty }) => (
//             <div key={product._id} className="flex gap-3 items-center bg-cheese/40 rounded-xl p-2.5">
//               <ProductImage product={product} className="w-14 h-14 rounded-lg shrink-0" />

//               <div className="flex-1 min-w-0">
//                 <p className="font-bold text-sm truncate">{product.name}</p>
//                 <p className="text-sauce font-extrabold text-sm">{formatPrice(product.price)}</p>

//                 <div className="mt-1 flex items-center border-2 border-ink rounded-lg overflow-hidden w-fit">
//                   <button onClick={() => updateQty(product._id, qty - 1)} className="px-2 py-0.5 font-bold hover:bg-cheese" aria-label="Decrease">−</button>
//                   <span className="px-2 text-sm font-bold min-w-[1.5rem] text-center">{qty}</span>
//                   <button onClick={() => updateQty(product._id, qty + 1)} className="px-2 py-0.5 font-bold hover:bg-cheese" aria-label="Increase">+</button>
//                 </div>
//               </div>

//               <div className="text-right shrink-0">
//                 <button onClick={() => removeFromCart(product._id)} aria-label={`Remove ${product.name}`} className="text-ink/40 hover:text-sauce text-lg mb-1">
//                   🗑
//                 </button>
//                 <p className="font-extrabold text-sm">{formatPrice(product.price * qty)}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer — bill + checkout */}
//         {items.length > 0 && (
//           <div className="border-t-2 border-ink/10 px-4 py-4 space-y-3">
//             {/* Promo */}
//             <div className="flex gap-2">
//               <div className="flex-1 flex items-center gap-2 border-2 border-ink/20 rounded-lg px-3">
//                 <span className="text-ink/40 font-bold">%</span>
//                 <input
//                   value={promo}
//                   onChange={(e) => setPromo(e.target.value)}
//                   placeholder="Enter promo code"
//                   className="w-full py-2 text-sm outline-none bg-transparent"
//                 />
//               </div>
//               <button className="px-4 py-2 rounded-lg bg-sauce/15 text-sauce font-bold text-sm hover:bg-sauce hover:text-white transition-colors">
//                 Apply
//               </button>
//             </div>

//             {/* Bill */}
//             <div className="text-sm space-y-1.5">
//               <div className="flex justify-between text-ink/70">
//                 <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
//               </div>
//               <div className="flex justify-between text-ink/70">
//                 <span>Delivery Fee</span><span>{formatPrice(DELIVERY_FEE)}</span>
//               </div>
//               <div className="flex justify-between text-ink/70">
//                 <span>Taxes (GST)</span><span>{formatPrice(gst)}</span>
//               </div>
//               <div className="flex justify-between font-extrabold text-base pt-1.5 border-t border-ink/10">
//                 <span>Total Amount</span><span className="text-sauce">{formatPrice(total)}</span>
//               </div>
//             </div>

//             {/* <button className="w-full py-3 rounded-xl bg-sauce text-white font-extrabold hover:bg-sauce-dark transition-colors">
//               Proceed to Checkout →
//             </button> */}
//             <button  className="w-full py-3 rounded-xl bg-sauce text-white font-extrabold hover:bg-sauce-dark transition-colors" onClick={() => { closeCart(); navigate("/checkout"); }}>
//                     Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </aside>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ProductImage, formatPrice } from "./ProductCard";
import { applyCoupon, type AppliedBill } from "../Couponuserapi";
import { clearCoupon, getSavedCoupon, saveCoupon } from "../lib/couponStore";

const DELIVERY_FEE = 40;
const GST_RATE = 0.05;

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeFromCart, subtotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  // ---- coupon state ----
  const [promo, setPromo] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(() => getSavedCoupon());
  const [bill, setBill] = useState<AppliedBill | null>(null); // server ka bill (coupon lagne ke baad)
  const [applying, setApplying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [couponError, setCouponError] = useState("");
  const reqId = useRef(0);
  const billKey = useRef(""); // kis cart + coupon ke liye bill nikla tha

  const toLines = () => items.map((i) => ({ productId: i.product._id, quantity: i.qty }));
  const itemsKey = items.map((i) => `${i.product._id}:${i.qty}`).join("|");

  const dropCoupon = (message = "") => {
    clearCoupon();
    setCouponCode(null);
    setBill(null);
    billKey.current = "";
    setCouponError(message);
  };

  // Cart badle (qty / item hata) to coupon dobara check hota hai (min order, discount amount)
  useEffect(() => {
    if (!isOpen || !couponCode || !token || items.length === 0) return;
    if (billKey.current === `${couponCode}|${itemsKey}`) return; // pehle se latest hai

    const id = ++reqId.current;
    setRefreshing(true);
    applyCoupon(token, couponCode, toLines())
      .then((r) => {
        if (id !== reqId.current) return;
        billKey.current = `${couponCode}|${itemsKey}`;
        setBill(r);
        setCouponError("");
      })
      .catch((e) => {
        if (id !== reqId.current) return;
        dropCoupon(e instanceof Error ? `${couponCode} removed: ${e.message}` : "Coupon removed");
      })
      .finally(() => {
        if (id === reqId.current) setRefreshing(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, couponCode, token, itemsKey]);

  // Cart khali ho gaya to coupon ka matlab nahi
  useEffect(() => {
    if (items.length === 0 && couponCode) dropCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const onApply = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) return setCouponError("Enter a coupon code");
    if (!token) return setCouponError("Please log in to use a coupon");

    setApplying(true);
    setCouponError("");
    try {
      const r = await applyCoupon(token, code, toLines());
      reqId.current++; // koi purani request ka result ignore ho
      saveCoupon(r.code);
      billKey.current = `${r.code}|${itemsKey}`;
      setCouponCode(r.code);
      setBill(r);
      setPromo("");
    } catch (e) {
      setCouponError(e instanceof Error ? e.message : "Could not apply coupon");
    } finally {
      setApplying(false);
    }
  };

  // ---- bill numbers: coupon laga ho to server ke, warna local ----
  const localGst = Math.round(subtotal * GST_RATE);
  const view = bill
    ? { subtotal: bill.subtotal, fee: bill.deliveryFee, tax: bill.tax, discount: bill.discount, total: bill.total }
    : { subtotal, fee: DELIVERY_FEE, tax: localGst, discount: 0, total: subtotal + DELIVERY_FEE + localGst };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />

      {/* Panel — right se slide */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b-2 border-ink/10">
          <h2 className="text-lg font-extrabold">
            Your Cart ({items.reduce((s, i) => s + i.qty, 0)})
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-2xl leading-none p-1 hover:text-sauce">
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 && (
            <p className="text-center text-ink/50 py-10">Your cart is empty 🛒</p>
          )}
          {items.map(({ product, qty }) => (
            <div key={product._id} className="flex gap-3 items-center bg-cheese/40 rounded-xl p-2.5">
              <ProductImage product={product} className="w-14 h-14 rounded-lg shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{product.name}</p>
                <p className="text-sauce font-extrabold text-sm">{formatPrice(product.price)}</p>

                <div className="mt-1 flex items-center border-2 border-ink rounded-lg overflow-hidden w-fit">
                  <button onClick={() => updateQty(product._id, qty - 1)} className="px-2 py-0.5 font-bold hover:bg-cheese" aria-label="Decrease">−</button>
                  <span className="px-2 text-sm font-bold min-w-[1.5rem] text-center">{qty}</span>
                  <button onClick={() => updateQty(product._id, qty + 1)} className="px-2 py-0.5 font-bold hover:bg-cheese" aria-label="Increase">+</button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <button onClick={() => removeFromCart(product._id)} aria-label={`Remove ${product.name}`} className="text-ink/40 hover:text-sauce text-lg mb-1">
                  🗑
                </button>
                <p className="font-extrabold text-sm">{formatPrice(product.price * qty)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer — coupon + bill + checkout */}
        {items.length > 0 && (
          <div className="border-t-2 border-ink/10 px-4 py-4 space-y-3">
            {/* Promo */}
            {couponCode && bill ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-green-300 bg-green-50 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-green-800 truncate">🎟 {couponCode} applied</p>
                  <p className="text-xs text-green-700">You save {formatPrice(bill.discount)} on this order</p>
                </div>
                <button
                  type="button"
                  onClick={() => dropCoupon()}
                  className="shrink-0 text-xs font-bold text-sauce underline hover:no-underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 border-2 border-ink/20 rounded-lg px-3 focus-within:border-sauce">
                    <span className="text-ink/40 font-bold">%</span>
                    <input
                      value={promo}
                      onChange={(e) => {
                        setPromo(e.target.value.toUpperCase());
                        if (couponError) setCouponError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && onApply()}
                      placeholder="Enter promo code"
                      aria-label="Promo code"
                      maxLength={20}
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full py-2 text-sm outline-none bg-transparent uppercase placeholder:normal-case"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onApply}
                    disabled={applying}
                    className="px-4 py-2 rounded-lg bg-sauce/15 text-sauce font-bold text-sm hover:bg-sauce hover:text-white transition-colors disabled:opacity-60"
                  >
                    {applying ? "Checking…" : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p role="alert" className="mt-1.5 text-xs font-semibold text-sauce">
                    {couponError}{" "}
                    {!token && (
                      <button
                        type="button"
                        className="underline"
                        onClick={() => {
                          closeCart();
                          navigate("/login");
                        }}
                      >
                        Log in
                      </button>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Bill */}
            <div className={`text-sm space-y-1.5 transition-opacity ${refreshing ? "opacity-60" : ""}`} aria-busy={refreshing}>
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span><span>{formatPrice(view.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Delivery Fee</span><span>{formatPrice(view.fee)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Taxes (GST)</span><span>{formatPrice(view.tax)}</span>
              </div>
              {view.discount > 0 && (
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Coupon discount{couponCode ? ` (${couponCode})` : ""}</span>
                  <span>− {formatPrice(view.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base pt-1.5 border-t border-ink/10">
                <span>Total Amount</span><span className="text-sauce">{formatPrice(view.total)}</span>
              </div>
            </div>

            <button
              className="w-full py-3 rounded-xl bg-sauce text-white font-extrabold hover:bg-sauce-dark transition-colors disabled:opacity-60"
              disabled={refreshing}
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}