export const FOOD_TYPES = ["veg", "non-veg"] as const;
export const PRODUCT_TAGS = ["popular", "bestseller", "premium", "spicy"] as const;

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  category?: string;
  image?: string;
  isActive?: boolean;
  foodType?: string;
  tags?: string[];
}

export const isAdmin = (user: User | null) =>
  user?.role?.toLowerCase() === "admin";