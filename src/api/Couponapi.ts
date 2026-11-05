import { SERVER_URL } from "../lib/socket";

const BASE = SERVER_URL.replace(/\/$/, "");

export type DiscountType = "fixed" | "percentage";
export type CouponStatus = "active" | "scheduled" | "expired" | "exhausted" | "inactive" | "archived";

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minimumOrderAmount: number;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  active: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: CouponStatus; // server calculate karke bhejta hai
}

// Create / update me jo bhejna hai
export interface CouponInput {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minimumOrderAmount: number;
  usageLimit: number | null;
  perUserLimit: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  active: boolean;
}

export interface ListParams {
  status: string; // all | active | scheduled | expired | inactive | archived
  q: string;
  page: number;
  limit?: number;
}

export interface ListResponse {
  coupons: Coupon[];
  total: number;
  page: number;
  pages: number;
}

export interface DetailResponse {
  coupon: Coupon;
  stats: { usedCount: number; uniqueUsers: number };
}

export interface DeleteResponse {
  deleted?: boolean;
  archived?: boolean;
  message: string;
  coupon?: Coupon;
}

async function call<T>(token: string, path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}/api/admin/coupons${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
  return json as T;
}

export const couponApi = {
  list(token: string, p: ListParams) {
    const qs = new URLSearchParams({ status: p.status, page: String(p.page), limit: String(p.limit ?? 20) });
    if (p.q) qs.set("q", p.q);
    return call<ListResponse>(token, `?${qs.toString()}`);
  },
  get: (token: string, id: string) => call<DetailResponse>(token, `/${id}`),
  create: (token: string, input: CouponInput) => call<{ coupon: Coupon }>(token, "", "POST", input),
  update: (token: string, id: string, input: Partial<CouponInput>) =>
    call<{ coupon: Coupon }>(token, `/${id}`, "PATCH", input),
  setStatus: (token: string, id: string, active: boolean) =>
    call<{ coupon: Coupon }>(token, `/${id}/status`, "PATCH", { active }),
  remove: (token: string, id: string) => call<DeleteResponse>(token, `/${id}`, "DELETE"),
};