// Shared types for checkout components
export interface Details {
  fullName: string;
  phone: string;
  address: string;
  landmark: string;
}

export type Errors = Partial<Record<keyof Details, string>>;
export type PaymentMethod = "COD" | "RAZORPAY";

export interface OrderPayloadExtra {
  paymentMethod?: "COD" | "ONLINE";
  paymentId?: string;
  razorpayOrderId?: string;
}

export interface PlacedInfo {
  id?: string;
  orderNumber?: string;
  address: string;
  landmark?: string;
  phone: string;
}