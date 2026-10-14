import { SERVER_URL } from "./lib/socket";
import type { Order, OrderStatus } from "./Ordertypes";

async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${SERVER_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? `Request failed (${res.status})`);
  return data as T;
}

export interface AdminOrdersQuery {
  status?: OrderStatus;
  q?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface AdminOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
  counts: Record<string, number>;
  deliveredToday: number;
}

export const orderApi = {
  myOrders: (token: string) => request<Order[]>("/orders/my-orders", token),

  cancelMyOrder: (token: string, id: string, reason?: string) =>
    request<Order>(`/orders/${id}/cancel`, token, { method: "PATCH", body: JSON.stringify({ reason }) }),

  adminOrders: (token: string, query: AdminOrdersQuery = {}) => {
    const p = new URLSearchParams();
    if (query.status) p.set("status", query.status);
    if (query.q) p.set("q", query.q);
    if (query.date) p.set("date", query.date);
    p.set("page", String(query.page ?? 1));
    p.set("limit", String(query.limit ?? 20));
    return request<AdminOrdersResponse>(`/orders/admin/all?${p.toString()}`, token);
  },

  updateStatus: (token: string, id: string, status: OrderStatus, reason?: string) =>
    request<Order>(`/orders/admin/${id}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    }),
};