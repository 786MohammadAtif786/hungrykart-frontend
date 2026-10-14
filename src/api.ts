

import type { Product, User } from "./types";

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const TOKEN_KEY = "hk_token";

// ---------- ORDER TYPES ----------


export interface PlaceOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryDetails: {
    fullName: string;
    phone: string;
    address: string;
    landmark?: string;
  };
   paymentMethod: "COD" | "ONLINE";   
  paymentId?: string;              
  razorpayOrderId?: string;  
}

export interface RegisterInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface CreateRazorpayOrderInput {
  amount: number;
  receipt?: string;
}

export interface CreateRazorpayOrderResponse {
  id?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  key?: string;
  order?: {
    id?: string;
    amount?: number;
    currency?: string;
  };
  [key: string]: unknown;
}

export interface VerifyRazorpayPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ---------- RESPONSE HELPERS ----------

const pickOrder = (j: any) => j?.order ?? j?.data ?? j;

const pickUser = (j: any): User =>
  j?.user ?? j?.data?.user ?? j?.data ?? j;

const pickToken = (j: any): string =>
  j?.token ?? j?.data?.token ?? "";

const pickList = (j: any): Product[] =>
  Array.isArray(j)
    ? j
    : Array.isArray(j?.products)
      ? j.products
      : Array.isArray(j?.data)
        ? j.data
        : [];

const pickProduct = (j: any): Product =>
  j?.product ?? j?.data?.product ?? j?.data ?? j;

// ---------- IMAGE URL HELPER ----------

export function imageUrl(img?: unknown): string | undefined {
  if (!img) return undefined;

  let path: unknown = img;

  if (Array.isArray(path)) {
    path = path[0];
  }

  if (path && typeof path === "object") {
    const o = path as Record<string, unknown>;
    path = o.url ?? o.secure_url ?? o.path ?? o.filename ?? o.src;
  }

  if (typeof path !== "string" || !path) {
    return undefined;
  }

  path = path.replace(/\\/g, "/");

  const p = path as string;

  if (/^https?:\/\//i.test(p) || p.startsWith("data:")) {
    return p;
  }

  return `${BASE}${p.startsWith("/") ? "" : "/"}${p}`;
}

// ---------- REQUEST HELPER ----------

interface Options {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T = any>(
  path: string,
  opts: Options = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;

  if (opts.body instanceof FormData) {
    // Browser automatically sets multipart/form-data boundary.
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      json?.message ||
      (Array.isArray(json?.errors)
        ? json.errors
            .map((e: any) => e?.message ?? e)
            .join(", ")
        : "") ||
      `Request failed (${res.status})`;

    throw new Error(msg);
  }

  return json as T;
}

// ---------- API METHODS ----------

export const api = {
  // AUTH

  async login(identifier: string, password: string) {
    const j = await request("/api/auth/login", {
      method: "POST",
      body: { identifier, password },
    });

    return {
      token: pickToken(j),
      user: pickUser(j),
    };
  },

  async register(input: RegisterInput) {
    const j = await request("/api/auth/register", {
      method: "POST",
      body: input,
    });

    return {
      token: pickToken(j),
      user: pickUser(j),
    };
  },

  async me(token: string) {
    return pickUser(
      await request("/api/auth/me", { token })
    );
  },

  // PRODUCTS

  async products() {
    return pickList(await request("/api/products"));
  },

  async adminProducts(token: string) {
    return pickList(
      await request("/api/products/admin/all", { token })
    );
  },

  async createProduct(token: string, form: FormData) {
    return pickProduct(
      await request("/api/products", {
        method: "POST",
        body: form,
        token,
      })
    );
  },

  async updateProduct(
    token: string,
    id: string,
    form: FormData
  ) {
    return pickProduct(
      await request(`/api/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: form,
        token,
      })
    );
  },

  async deleteProduct(token: string, id: string) {
    await request(
      `/api/products/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        token,
      }
    );
  },

  // COD OR RAZORPAY ORDER CREATION

  async placeOrder(token: string, input: PlaceOrderInput) {
    return pickOrder(
      await request("/api/orders", {
        method: "POST",
        body: input,
        token,
      })
    );
  },

  // RAZORPAY: CREATE PAYMENT ORDER

  async createRazorpayOrder(
    token: string,
    body: CreateRazorpayOrderInput
  ): Promise<CreateRazorpayOrderResponse> {
    return request<CreateRazorpayOrderResponse>(
      "/api/payments/razorpay/order",
      {
        method: "POST",
        token,
        body,
      }
    );
  },

  // RAZORPAY: VERIFY PAYMENT SIGNATURE

  async verifyRazorpayPayment(
    token: string,
    body: VerifyRazorpayPaymentInput
  ) {
    return request(
      "/api/payments/razorpay/verify",
      {
        method: "POST",
        token,
        body,
      }
    );
  },
};
