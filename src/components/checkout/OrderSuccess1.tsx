import { useState } from "react";
import { Link } from "react-router-dom";
import type { PlacedInfo } from "./types";

function CheckIcon() {
  return (
    <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 21s-7-5.1-7-11a7 7 0 1114 0c0 5.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M4 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2A15 15 0 014 5z" />
    </svg>
  );
}

export default function OrderSuccess({ order }: { order: PlacedInfo }) {
  const [copied, setCopied] = useState(false);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT — order info */}
        <div className="text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto md:mx-0">
            <CheckIcon />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold mt-5">Order Placed Successfully!</h1>
          <p className="mt-2 text-gray-500">Your order has been placed and is being processed.</p>

          {/* Order ID + copy */}
          <div className="mt-5 inline-flex items-center gap-3 bg-red-50 rounded-xl px-5 py-3">
            <div className="text-left">
              <p className="text-[11px] text-gray-500 font-medium">Order ID</p>
              <p className="font-extrabold text-ink tracking-wide">
                #{order.orderNumber ?? "—"}
              </p>
            </div>
            <button
              onClick={copyOrderId}
              title="Copy Order ID"
              className="p-2 rounded-lg text-gray-500 hover:text-sauce hover:bg-white transition"
            >
              <CopyIcon />
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-green-600 font-semibold">Copied!</p>
          )}

          {/* Details rows */}
          <div className="mt-6 space-y-4 text-sm text-left">
            <div className="flex items-center gap-3">
              <ClockIcon />
              <div>
                <p className="text-gray-400 text-xs">Estimated Delivery Time</p>
                <p className="font-bold text-ink">25 - 30 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PinIcon />
              <div>
                <p className="text-gray-400 text-xs">Delivery Address</p>
                <p className="font-bold text-ink">{order.address}</p>
                {order.landmark && (
                  <p className="text-gray-500">{order.landmark}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon />
              <div>
                <p className="text-gray-400 text-xs">Contact Number</p>
                <p className="font-bold text-ink">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {/* <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to={order.id ? `/orders/${order.id}` : "/orders"}
              className="px-8 py-3 rounded-xl bg-sauce text-white font-semibold hover:bg-sauce-dark transition flex items-center justify-center gap-2"
            >
              Track Order <span aria-hidden>→</span>
            </Link>
            <Link
              to="/"
              className="px-8 py-3 rounded-xl border border-gray-300 font-semibold text-ink hover:bg-gray-50 transition text-center"
            >
              Continue Shopping
            </Link>
          </div> */}
          <Link
              to="/orders"
              className="px-8 py-3 rounded-xl bg-sauce text-white font-semibold hover:bg-sauce-dark transition flex items-center justify-center gap-2"
            >
              Track Order <span aria-hidden>→</span>
            </Link>
        </div>

        {/* RIGHT — illustration */}
        <div className="hidden md:flex flex-col items-center text-center">
          <div className="relative w-64 h-64 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-8xl">🛵</span>
            <span className="absolute -top-2 right-4 text-4xl">📍</span>
          </div>
          <p className="mt-6 font-extrabold text-lg text-ink">We&apos;re preparing your food</p>
          <p className="mt-1 text-sm text-gray-500">
            You&apos;ll get real-time updates on your order status.
          </p>
        </div>
      </div>
    </div>
  );
}