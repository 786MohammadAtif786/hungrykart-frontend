// ✅ Category names bilkul waise hi rakhe hain jaise aapki app/UI mein likhe hain
// Kyunki filtering category name ke hisaab se hogi
export type Category =
  | "Pizza"
  | "Burger"
  | "Biryani"
  | "Chinese"
  | "North Indian"
  | "South Indian"
  | "Fast Food"
  | "Desserts"
  | "Beverages";

// ✅ Ek food item ka shape — apne existing item interface ke saath match kar lena
export interface FoodItem {
  id: number;
  name: string;
  price: number;      // ₹ mein
  image: string;      // image URL
  category: Category; // isi se filter hoga
  tag?: "Premium" | "Spicy" | "Popular"; // optional badge
}