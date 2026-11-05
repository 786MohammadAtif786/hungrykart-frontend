import { SERVER_URL } from "./lib/socket";

const BASE = SERVER_URL.replace(/\/$/, "");

export interface AppliedBill {
  code: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  originalTotal: number;
  total: number;
}

export interface CartLine {
  productId: string;
  quantity: number;
}
export interface AvailableCoupon {
  code: string;
  description: string;
  discountType: "PERCENT" | "FLAT" | "BOGO";
  discountValue: number;
  maxDiscount: number | null;
  minimumOrderAmount: number;
  expiresAt: string | null;
}

// GET /api/coupons: customer ke liye available coupons ki list
export async function listCoupons(token: string): Promise<AvailableCoupon[]> {
  const res = await fetch(`${BASE}/api/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Could not load coupons");
  return (json.coupons ?? []) as AvailableCoupon[];
}

// POST /api/coupons/apply: server items se poora bill nikalta hai (client ka amount trust nahi hota)
export async function applyCoupon(token: string, code: string, items: CartLine[]): Promise<AppliedBill> {
  const res = await fetch(`${BASE}/api/coupons/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code, items }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || "Could not apply coupon");
  return json as AppliedBill;
}