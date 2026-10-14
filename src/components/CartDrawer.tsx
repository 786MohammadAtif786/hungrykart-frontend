import { useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductImage, formatPrice } from "./ProductCard";
import { useNavigate } from "react-router-dom";

const DELIVERY_FEE = 40;
const GST_RATE = 0.05;

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeFromCart, subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();


  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + DELIVERY_FEE + gst;

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

        {/* Footer — bill + checkout */}
        {items.length > 0 && (
          <div className="border-t-2 border-ink/10 px-4 py-4 space-y-3">
            {/* Promo */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 border-2 border-ink/20 rounded-lg px-3">
                <span className="text-ink/40 font-bold">%</span>
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter promo code"
                  className="w-full py-2 text-sm outline-none bg-transparent"
                />
              </div>
              <button className="px-4 py-2 rounded-lg bg-sauce/15 text-sauce font-bold text-sm hover:bg-sauce hover:text-white transition-colors">
                Apply
              </button>
            </div>

            {/* Bill */}
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Delivery Fee</span><span>{formatPrice(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Taxes (GST)</span><span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-base pt-1.5 border-t border-ink/10">
                <span>Total Amount</span><span className="text-sauce">{formatPrice(total)}</span>
              </div>
            </div>

            {/* <button className="w-full py-3 rounded-xl bg-sauce text-white font-extrabold hover:bg-sauce-dark transition-colors">
              Proceed to Checkout →
            </button> */}
            <button  className="w-full py-3 rounded-xl bg-sauce text-white font-extrabold hover:bg-sauce-dark transition-colors" onClick={() => { closeCart(); navigate("/checkout"); }}>
                    Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}