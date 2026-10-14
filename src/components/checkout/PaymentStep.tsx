import { formatPrice } from "../ProductCard";
import type { PaymentMethod } from "./types";

interface Props {
  paymentMethod: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  total: number;
  placing: boolean;
  error: string;
  onPay: () => void;
}

const BRANDS = ["UPI", "VISA", "Mastercard", "Amex", "RuPay", "Net Banking"];

export default function PaymentStep({
  paymentMethod,
  onMethodChange,
  total,
  placing,
  error,
  onPay,
}: Props) {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm font-semibold">Payment method</p>

      {/* COD option */}
      <label
        className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
          paymentMethod === "COD"
            ? "border-sauce bg-red-50/60"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "COD"}
          onChange={() => onMethodChange("COD")}
          className="mt-1 accent-[#e23744] shrink-0"
        />
        <span className="text-2xl leading-none">💵</span>
        <span>
          <span className="font-semibold block">Cash on Delivery (COD)</span>
          <span className="text-sm text-gray-500">Pay when your order arrives</span>
        </span>
      </label>

      {/* Razorpay option */}
      <label
        className={`block rounded-xl border p-4 cursor-pointer transition ${
          paymentMethod === "RAZORPAY"
            ? "border-sauce bg-red-50/60"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={paymentMethod === "RAZORPAY"}
          onChange={() => onMethodChange("RAZORPAY")}
          className="sr-only"
        />
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 w-4 h-4 rounded-full border-4 shrink-0 ${
              paymentMethod === "RAZORPAY" ? "border-sauce" : "border-gray-300"
            }`}
          />
          <div className="flex-1">
            <p className="font-semibold">
              Pay Online with Razorpay{" "}
              <span className="text-[10px] font-extrabold text-[#528FF0] align-middle ml-1">
                Razorpay
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Pay securely using UPI, Cards, Net Banking or Wallets.
            </p>
            <span className="flex flex-wrap items-center gap-1.5 mt-3">
              {BRANDS.map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5"
                >
                  {b}
                </span>
              ))}
            </span>
            <p className="mt-2 text-xs text-gray-400">
              🔒 Secure online payment powered by Razorpay
            </p>
          </div>
        </div>
      </label>

      {error && (
        <p role="alert" className="text-sauce font-semibold text-sm">
          {error}
        </p>
      )}

      {/* <button
        onClick={onPay}
        disabled={placing}
        className="w-full py-3 rounded-lg bg-sauce text-white font-semibold hover:bg-sauce-dark disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {placing
          ? "Processing…"
          : paymentMethod === "COD"
            ? `Place Order · ${formatPrice(total)}`
            : `Pay ${formatPrice(total)} with Razorpay →`}
      </button> */}
    </div>
  );
}