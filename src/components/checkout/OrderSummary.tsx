import { formatPrice, ProductImage } from "../ProductCard";
import type { PaymentMethod } from "./types";
import type { CartItem } from "../../context/CartContext";

// interface CartItem {
//   product: { _id: string; name: string; price: number; image?: string };
//   qty: number;
// }

interface Props {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  freeDeliveryAbove: number;
  step: number;
  placing: boolean;
  paymentMethod: PaymentMethod;
  error: string;
  onEditCart: () => void;
  onPay: () => void;
}

export default function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  freeDeliveryAbove,
  step,
  placing,
  paymentMethod,
  error,
  onEditCart,
  onPay,
}: Props) {
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <aside className="bg-white border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <button onClick={onEditCart} className="text-sm font-semibold text-sauce">
          Edit Cart
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.product._id} className="flex items-center gap-3">
            <ProductImage product={i.product} className="w-14 h-14 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{i.product.name}</p>
              <p className="text-xs text-gray-500">
                {formatPrice(i.product.price)} × {i.qty}
              </p>
            </div>
            <p className="font-semibold text-sm">{formatPrice(i.product.price * i.qty)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Subtotal ({itemCount} items)</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Delivery Fee</dt>
          <dd>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Taxes (GST)</dt>
          <dd>{formatPrice(tax)}</dd>
        </div>
      </dl>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-baseline">
        <span className="font-bold">Total Amount</span>
        <span className="text-2xl font-extrabold">{formatPrice(total)}</span>
      </div>

      {deliveryFee > 0 && (
        <p className="mt-3 text-xs text-green-700 bg-green-50 rounded-lg p-2.5">
          Add items worth {formatPrice(freeDeliveryAbove - subtotal)} more to get free delivery.
        </p>
      )}

      {error && step !== 3 && (
        <p role="alert" className="mt-3 text-sauce font-semibold text-sm">
          {error}
        </p>
      )}

      <button
        onClick={onPay}
        disabled={step !== 3 || placing}
        className="mt-4 w-full py-3 rounded-lg bg-sauce text-white font-semibold hover:bg-sauce-dark disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {placing
          ? "Processing…"
          : paymentMethod === "COD"
            ? `Place Order · ${formatPrice(total)}`
            : `Pay ${formatPrice(total)} with Razorpay →`}
      </button>
      {step !== 3 && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Complete the steps on the left to place your order.
        </p>
      )}
      {step === 3 && paymentMethod === "RAZORPAY" && (
        <p className="mt-2 text-[11px] text-gray-400 text-center">🔒 Secure online payment</p>
      )}
    </aside>
  );
}