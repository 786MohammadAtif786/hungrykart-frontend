// import type {
//   AppliedOffer,
//   CartItem,
//   ListMeta,
//   Offer,
//   OfferPayload,
// } from "../types/Offer";

// // Apne project ke hisaab se set karo
// const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
// const TOKEN_KEY = "token"; // jis key me JWT save karte ho

// const getToken = () => {
//   try {
//     return localStorage.getItem(TOKEN_KEY);
//   } catch {
//     return null;
//   }
// };

// async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const token = getToken();
//   const res = await fetch(`${BASE}/api${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers ?? {}),
//     },
//   });

//   const json = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     const msg =
//       json?.message ||
//       json?.error ||
//       (Array.isArray(json?.errors) ? json.errors.map((e: any) => e.message).join(", ") : "") ||
//       `Request failed (${res.status})`;
//     throw new Error(msg);
//   }
//   return json as T;
// }

// /* ---------------- ADMIN ---------------- */

// export const adminOffersApi = {
//   list: (params: { page?: number; limit?: number; isActive?: "true" | "false" | "" } = {}) => {
//     const q = new URLSearchParams();
//     if (params.page) q.set("page", String(params.page));
//     if (params.limit) q.set("limit", String(params.limit));
//     if (params.isActive) q.set("isActive", params.isActive);
//     return request<{ success: boolean; data: Offer[]; meta: ListMeta }>(
//       `/admin/offers?${q.toString()}`
//     );
//   },

//   create: (payload: OfferPayload) =>
//     request<{ success: boolean; data: Offer }>("/admin/offers", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),

//   update: (id: string, payload: Partial<OfferPayload>) =>
//     request<{ success: boolean; data: Offer }>(`/admin/offers/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),

//   setStatus: (id: string, isActive?: boolean) =>
//     request<{ success: boolean; data: Offer }>(`/admin/offers/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify(isActive === undefined ? {} : { isActive }),
//     }),

//   remove: (id: string) =>
//     request<{ success: boolean; message: string }>(`/admin/offers/${id}`, {
//       method: "DELETE",
//     }),
// };

// /* ---------------- CUSTOMER ---------------- */

// export const offersApi = {
//   active: () => request<{ success: boolean; data: Offer[] }>("/offers/active"),

//   apply: (code: string, items: CartItem[]) =>
//     request<{ success: boolean; data: AppliedOffer }>("/offers/apply", {
//       method: "POST",
//       body: JSON.stringify({ code, items }),
//     }),
// };





import api from './axios';
import type {
  ApplyOfferResponse,
  CreateOfferInput,
  Offer,
  OfferListResponse,
} from '../types/Offer';

/* ---------------- ADMIN APIs ---------------- */

export const getAllOffers = async (
  page = 1,
  isActive?: boolean
): Promise<OfferListResponse> => {
  const { data } = await api.get('/admin/offers', {
    params: { page, limit: 20, ...(isActive !== undefined && { isActive }) },
  });
  return data;
};

export const createOfferApi = async (payload: CreateOfferInput): Promise<Offer> => {
  const { data } = await api.post('/admin/offers', payload);
  return data.data;
};

export const updateOfferApi = async (
  id: string,
  payload: Partial<CreateOfferInput>
): Promise<Offer> => {
  const { data } = await api.patch(`/admin/offers/${id}`, payload);
  return data.data;
};

export const toggleOfferStatusApi = async (id: string, isActive: boolean): Promise<Offer> => {
  const { data } = await api.patch(`/admin/offers/${id}/status`, { isActive });
  return data.data;
};

export const deleteOfferApi = async (id: string): Promise<void> => {
  await api.delete(`/admin/offers/${id}`);
};

/* ---------------- CUSTOMER APIs (public) ---------------- */

export const getActiveOffers = async (): Promise<Offer[]> => {
  const { data } = await api.get('/offers/active');
  return data.data;
};

export const applyOfferApi = async (
  code: string,
  items: { menuItemId: string; price: number; quantity: number }[]
): Promise<ApplyOfferResponse['data']> => {
  const { data } = await api.post('/offers/apply', { code, items });
  return data.data;
};