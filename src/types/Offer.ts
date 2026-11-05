// export type DiscountType = "percentage" | "flat";

// export interface Offer {
//   _id: string;
//   title: string;
//   description?: string;
//   code?: string | null;
//   discountType: DiscountType;
//   discountValue: number;
//   maxDiscount?: number;
//   minOrderValue?: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   priority: number;
//   usageLimit?: number;
//   usedCount?: number;
//   perUserLimit?: number;
//   createdAt?: string;
// }

// export interface OfferPayload {
//   title: string;
//   description?: string;
//   code?: string;
//   discountType: DiscountType;
//   discountValue: number;
//   maxDiscount?: number;
//   minOrderValue?: number;
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   priority: number;
//   usageLimit?: number;
//   perUserLimit?: number;
// }

// export interface ListMeta {
//   page: number;
//   limit: number;
//   total: number;
// }

// // Backend ke applyOfferSchema ke hisaab se items ka shape adjust kar lena
// export interface CartItem {
//   productId: string;
//   quantity: number;
// }

// export interface AppliedOffer {
//   offerId: string;
//   code: string | null;
//   title: string;
//   discountType: DiscountType;
//   subtotal: number;
//   discount: number;
//   total: number;
// }


// export type DiscountType = 'PERCENTAGE' | 'FLAT' | 'B1G1';

// export interface Offer {
//   _id: string;
//   title: string;
//   code?: string;
//   description?: string;
//   discountType: DiscountType;
//   discountValue: number;
//   maxDiscount?: number;
//   minOrderValue?: number;
//   imageUrl?: string;
//   bgColor?: string;        // jaise "#EF4444" red card
//   startDate: string;
//   endDate: string;
//   isActive: boolean;
//   priority: number;
//   usageLimit?: number;
//   usedCount: number;
//   perUserLimit?: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface OfferListResponse {
//   success: boolean;
//   data: Offer[];
//   meta: { page: number; limit: number; total: number };
// }

// export interface CreateOfferInput {
//   title: string;
//   code?: string;
//   description?: string;
//   discountType: DiscountType;
//   discountValue: number;
//   maxDiscount?: number;
//   minOrderValue?: number;
//   imageUrl?: string;
//   bgColor?: string;
//   startDate: string;
//   endDate: string;
//   isActive?: boolean;
//   priority?: number;
//   usageLimit?: number;
//   perUserLimit?: number;
// }

// export interface ApplyOfferResponse {
//   success: boolean;
//   data: {
//     offerId: string;
//     code: string | null;
//     title: string;
//     discountType: DiscountType;
//     subtotal: number;
//     discount: number;
//     total: number;
//   };
// }
export interface OfferPayload {
  title: string;
  description?: string;
  code?: string;
  applyType: ApplyType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  imageUrl: string;
  bgColor?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  usageLimit?: number;
  perUserLimit?: number;
}


export type DiscountType = 'FLAT' | 'PERCENT' | 'BOGO';
export type ApplyType = 'CODE' | 'AUTO';

export interface Offer {
  _id: string;
  title: string;
  code?: string;
  applyType: ApplyType;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  imageUrl: string;
  bgColor?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferInput {
  title: string;
  code?: string;
  applyType: ApplyType;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  imageUrl: string;
  bgColor?: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  priority?: number;
  usageLimit?: number;
  perUserLimit?: number;
}

export interface OfferListResponse {
  success: boolean;
  data: Offer[];
  meta: { page: number; limit: number; total: number };
}

export interface ApplyOfferResponse {
  success: boolean;
  data: {
    offerId: string;
    code: string | null;
    title: string;
    discountType: DiscountType;
    subtotal: number;
    discount: number;
    total: number;
  };
}