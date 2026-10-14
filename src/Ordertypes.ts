

export const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  deliveryBoy: Rider | null | undefined;
  _id: string;
  orderNumber: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  deliveryDetails: { fullName: string; phone: string; address: string; landmark: string };
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID";
  razorpayOrderId?: string;
  paymentId?: string;
  status: OrderStatus;
  cancelReason?: string;
  cancelledBy?: "ADMIN" | "CUSTOMER";
  createdAt: string;
  updatedAt: string;
}

export interface StatusPayload {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: "PENDING" | "PAID";
  updatedAt: string;
  cancelReason?: string;
  deliveryBoy?: Rider | null;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export interface Rider {
  _id: string;
  name: string;
  phone?: string;
}

export const PROGRESS_STEPS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const isActive = (s: OrderStatus) => s !== "DELIVERED" && s !== "CANCELLED";

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");

export function timeAgo(iso: string) {
  const sec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)} d ago`;
}



export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });