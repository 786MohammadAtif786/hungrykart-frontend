// // import React from "react";
// // import type { Category } from "../types/type";

// // // ✅ Banner ke neeche wali category list (screenshot jaisi)
// // // Agar aapke paas images hain to emoji ki jagah <img> laga dena
// // const categories: { name: Category; icon: string }[] = [
// //   { name: "Pizza", icon: "🍕" },
// //   { name: "Burger", icon: "🍔" },
// //   { name: "Biryani", icon: "🍛" },
// //   { name: "Chinese", icon: "🍜" },
// //   { name: "North Indian", icon: "🫓" },
// //   { name: "South Indian", icon: "🥘" },
// //   { name: "Fast Food", icon: "🍟" },
// //   { name: "Desserts", icon: "🍰" },
// //   { name: "Beverages", icon: "🍹" },
// // ];

// // interface Props {
// //   active: Category | "All";               // kaunsi category select hai
// //   onSelect: (c: Category | "All") => void; // click karne pe parent ko batao
// // }

// // // ✅ Circular icon + name wali category bar (horizontally scrollable)
// // const CategoryBar: React.FC<Props> = ({ active, onSelect }) => {
// //   return (
// //     <div className="category-bar">
// //       {categories.map((cat) => (
// //         <button
// //           key={cat.name}
// //           className={`cat-btn ${active === cat.name ? "active" : ""}`}
// //           onClick={() => onSelect(cat.name)}
// //         >
// //           <span className="cat-icon">{cat.icon}</span>
// //           <span className="cat-name">{cat.name}</span>
// //         </button>
// //       ))}
// //     </div>
// //   );
// // };

// // export default CategoryBar;


// import type { Category } from "../types/type";

// // ✅ Category list — icon aur naam (screenshot jaisa)
// const categories: { name: Category; icon: string }[] = [
//   { name: "Pizza", icon: "🍕" },
//   { name: "Burger", icon: "🍔" },
//   { name: "Biryani", icon: "🍛" },
//   { name: "Chinese", icon: "🍜" },
//   { name: "North Indian", icon: "🫓" },
//   { name: "South Indian", icon: "🥘" },
//   { name: "Fast Food", icon: "🍟" },
//   { name: "Desserts", icon: "🍰" },
//   { name: "Beverages", icon: "🍹" },
// ];

// interface Props {
//   active: Category | "All";                 // kaunsi category select hai
//   onSelect: (c: Category | "All") => void;  // click pe Home ko batao
// }

// export default function Categories({ active, onSelect }: Props) {
//   return (
//     // ✅ White strip banner ke neeche, full width
//     <div className="w-full bg-white border-b border-ink/10">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* ✅ Horizontal scroll on mobile, hide scrollbar, responsive gap */}
//         <div className="flex gap-3 sm:gap-5 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {categories.map((cat) => {
//             const isActive = active === cat.name;
//             return (
//               <button
//                 key={cat.name}
//                 onClick={() => onSelect(cat.name)}
//                 className="flex flex-col items-center gap-1.5 shrink-0 group"
//               >
//                 {/* ✅ Circular icon — active pe red highlight (sauce color) */}
//                 <span
//                   className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
//                     text-2xl sm:text-3xl transition-all duration-200
//                     ${isActive
//                       ? "bg-sauce ring-4 ring-sauce/20 scale-105"   // selected
//                       : "bg-[#f6f6f6] group-hover:bg-sauce/10"        // normal + hover
//                     }`}
//                 >
//                   {cat.icon}
//                 </span>

//                 {/* ✅ Category name */}
//                 <span
//                   className={`text-xs sm:text-sm whitespace-nowrap transition-colors
//                     ${isActive ? "text-sauce font-semibold" : "text-ink/80"}`}
//                 >
//                   {cat.name}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


import type { Category } from "../types/type";
import "../css/Categories.css"; // ✅ Plain CSS file import

// ✅ Category list — icon aur naam (screenshot jaisa)
const categories: { name: Category; icon: string }[] = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Biryani", icon: "🍛" },
  { name: "Chinese", icon: "🍜" },
  { name: "North Indian", icon: "🫓" },
  { name: "South Indian", icon: "🥘" },
  { name: "Fast Food", icon: "🍟" },
  { name: "Desserts", icon: "🍰" },
  { name: "Beverages", icon: "🍹" },
];

interface Props {
  active: Category | "All";                 // kaunsi category select hai
  onSelect: (c: Category | "All") => void;  // click pe Home ko batao
}

export default function Categories({ active, onSelect }: Props) {
  return (
    // ✅ White strip banner ke neeche, full width
    <div className="cat-strip">
      <div className="cat-container">
        {/* ✅ Horizontal scroll on mobile */}
        <div className="cat-row">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={
                "cat-btn" + (active === cat.name ? " cat-btn-active" : "")
              }
            >
              {/* ✅ Circular icon — active pe red highlight */}
              <span className="cat-icon">{cat.icon}</span>

              {/* ✅ Category name */}
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}