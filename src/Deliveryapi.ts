

import { SERVER_URL } from "./lib/socket";

const BASE = SERVER_URL.replace(/\/$/, "");

export type DeliveryStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Rider {
  _id: string;
  name: string;
  phone?: string;
}

export interface DeliveryOrder {
  _id: string;
  orderNumber: string;
  items: { name: string; price: number; quantity: number }[];
  deliveryDetails: { fullName: string; phone: string; address: string; landmark?: string };
  total: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID";
  status: DeliveryStatus;
  deliveryBoy?: Rider | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusPayload {
  orderId: string;
  orderNumber: string;
  status: DeliveryStatus;
  paymentStatus: "PENDING" | "PAID";
  updatedAt: string;
  deliveryBoy: Rider | null;
  cancelReason?: string;
}

// body optional: OTP bhejne ke liye JSON body support add kiya
async function call<T>(token: string, path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}/api/delivery${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
  return json as T;
}

export const deliveryApi = {
  available: (token: string) => call<DeliveryOrder[]>(token, "/available"),
  mine: (token: string) => call<DeliveryOrder[]>(token, "/mine"),
  accept: (token: string, id: string) => call<DeliveryOrder>(token, `/${id}/accept`, "PATCH"),
  outForDelivery: (token: string, id: string) => call<DeliveryOrder>(token, `/${id}/out-for-delivery`, "PATCH"),

  // OTP verify hone par hi order DELIVERED hota hai (purana `delivered` method hata diya)
  verifyOtp: (token: string, id: string, otp: string) =>
    call<{ message: string }>(token, `/${id}/verify-otp`, "POST", { otp }),
};