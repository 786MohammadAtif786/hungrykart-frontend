// import { useCallback, useEffect, useState } from "react";
// import { api } from "../api/api";
// import { api as http } from "../api/Adminapi";
// import { useAuth } from "../context/AuthContext";
// import { formatPrice, ProductImage } from "../components/ProductCard";
// import ProductForm from "../components/ProductForm";
// import type { Product } from "../types";

// // DB me field "isAvailable" hai (true = menu me dikhega, false = customers se chhupa)
// const isOn = (p: Product) => (p as Product & { isAvailable?: boolean }).isAvailable !== false;

// export default function Admin() {
//   const { token } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editing, setEditing] = useState<Product | null | undefined>(undefined);
//   const [busyId, setBusyId] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     if (!token) return;
//     try {
//       setProducts(await api.adminProducts(token));
//       setError("");
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Could not load items");
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const remove = async (p: Product) => {
//     if (!token || !confirm(`Delete "${p.name}"?`)) return;
//     try {
//       await api.deleteProduct(token, p._id);
//       setProducts((list) => list.filter((x) => x._id !== p._id));
//     } catch (e) {
//       alert(e instanceof Error ? e.message : "Could not delete item");
//     }
//   };

//   // Available <-> Hidden. Pehle screen turant badalti hai, error aaye to wapas purani ho jati hai
//   const toggle = async (p: Product) => {
//     if (!token) return;
//     const next = !isOn(p);
//     setBusyId(p._id);
//     setProducts((list) => list.map((x) => (x._id === p._id ? ({ ...x, isAvailable: next } as Product) : x)));
//     try {
//       await http(`/api/products/${p._id}/availability`, {
//         method: "PATCH",
//         body: JSON.stringify({ isAvailable: next }),
//       }, token);
//     } catch (e) {
//       setProducts((list) => list.map((x) => (x._id === p._id ? ({ ...x, isAvailable: !next } as Product) : x)));
//       alert(e instanceof Error ? e.message : "Could not update item");
//     } finally {
//       setBusyId(null);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
//       {/* Header: mobile pe chhota text, Add button bhi responsive */}
//       <div className="flex items-center justify-between gap-3 mb-6">
//         <h1 className="text-2xl sm:text-3xl font-extrabold">Manage items</h1>
//         <button
//           onClick={() => setEditing(null)}
//           className="px-3 py-2 sm:px-4 sm:py-2 rounded-md bg-sauce text-white font-bold text-sm sm:text-base whitespace-nowrap hover:bg-sauce-dark"
//         >
//           + Add item
//         </button>
//       </div>

//       {loading && <p>Loading…</p>}
//       {error && (
//         <p role="alert" className="text-sauce font-semibold">
//           {error}
//         </p>
//       )}
//       {!loading && !error && products.length === 0 && (
//         <p className="text-ink/70">No items yet. Add your first pizza or burger.</p>
//       )}

//       <ul className="space-y-3">
//         {products.map((p) => {
//           const on = isOn(p);
//           return (
//             <li
//               key={p._id}
//               className="bg-white border-2 border-ink rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
//             >
//               {/* Image + name + price + switch */}
//               <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
//                 <ProductImage
//                   product={p}
//                   className={`w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0 ${on ? "" : "opacity-40 grayscale"}`}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <h2 className={`font-bold truncate ${on ? "" : "text-ink/50"}`}>
//                     {p.name}
//                   </h2>
//                   <p className="font-extrabold text-sauce">{formatPrice(p.price)}</p>

//                   {/* Available / Hidden switch */}
//                   <div className="flex items-center gap-2 mt-1">
//                     <button
//                       type="button"
//                       role="switch"
//                       aria-checked={on}
//                       aria-label={`${p.name} menu me dikhana`}
//                       disabled={busyId === p._id}
//                       onClick={() => toggle(p)}
//                       className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-60 ${
//                         on ? "bg-green-500" : "bg-ink/30"
//                       }`}
//                     >
//                       <span
//                         className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
//                           on ? "translate-x-5" : ""
//                         }`}
//                       />
//                     </button>
//                     <span
//                       className={`text-xs font-semibold truncate ${
//                         on ? "text-green-700" : "text-ink/60"
//                       }`}
//                     >
//                       {on ? "Available" : "Hidden"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Mobile pe full-width row buttons, web pe side mein */}
//               <div className="flex gap-2 sm:flex-col shrink-0">
//                 <button
//                   onClick={() => setEditing(p)}
//                   className="flex-1 sm:flex-none px-3 py-1.5 rounded-md border-2 border-ink font-semibold text-sm hover:bg-ink hover:text-white"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => remove(p)}
//                   className="flex-1 sm:flex-none px-3 py-1.5 rounded-md border-2 border-sauce text-sauce font-semibold text-sm hover:bg-sauce hover:text-white"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       {editing !== undefined && (
//         <ProductForm
//           product={editing}
//           onClose={() => setEditing(undefined)}
//           onSaved={() => {
//             setEditing(undefined);
//             load();
//           }}
//         />
//       )}
//     </div>
//   );
// }





import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import { api as http } from "../api/Adminapi";
import { useAuth } from "../context/AuthContext";
import { formatPrice, ProductImage } from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import type { Product } from "../types";

// DB me field "isAvailable" hai (true = menu me dikhega, false = customers se chhupa)
const isOn = (p: Product) => (p as Product & { isAvailable?: boolean }).isAvailable !== false;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      // API { success, total, page, pages, products } object return karta hai
      const data: any = await api.adminProducts(token);
      const list: Product[] = Array.isArray(data) ? data : (data?.products ?? []);
      setProducts(list);
      setTotal(Array.isArray(data) ? list.length : data?.total ?? list.length);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load items");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // Category tabs + counts (All items, Pizza, Burger...)
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      const c = (p as Product & { category?: string }).category ?? "other";
      counts.set(c, (counts.get(c) ?? 0) + 1);
    });
    return [
      { key: "all", label: `All items (${total || products.length})` },
      ...[...counts.entries()].map(([key, count]) => ({
        key,
        label: `${cap(key)} (${count})`,
      })),
    ];
  }, [products, total]);

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? products
        : products.filter(
            (p) => (p as Product & { category?: string }).category === activeCat
          ),
    [products, activeCat]
  );

  const remove = async (p: Product) => {
    if (!token || !confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.deleteProduct(token, p._id);
      setProducts((list) => list.filter((x) => x._id !== p._id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete item");
    }
  };

  // Available <-> Hidden. Pehle screen turant badalti hai, error aaye to wapas purani ho jati hai
  const toggle = async (p: Product) => {
    if (!token) return;
    const next = !isOn(p);
    setBusyId(p._id);
    setProducts((list) => list.map((x) => (x._id === p._id ? ({ ...x, isAvailable: next } as Product) : x)));
    try {
      await http(`/api/products/${p._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: next }),
      }, token);
    } catch (e) {
      setProducts((list) => list.map((x) => (x._id === p._id ? ({ ...x, isAvailable: !next } as Product) : x)));
      alert(e instanceof Error ? e.message : "Could not update item");
    } finally {
      setBusyId(null);
    }
  };

  const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );

  const ToggleSwitch = ({ p, on }: { p: Product; on: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`${p.name} menu me dikhana`}
      disabled={busyId === p._id}
      onClick={() => toggle(p)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-60 ${on ? "bg-green-500" : "bg-ink/30"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`}
      />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* ===== Header: Menu Management ===== */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Menu Management</h1>
          <p className="text-sm text-ink/60 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="px-4 py-2.5 rounded-md bg-sauce text-white font-bold text-sm whitespace-nowrap hover:bg-sauce-dark"
        >
          + Add Menu Item
        </button>
      </div>

      {/* ===== Category filter tabs ===== */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCat(c.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-colors ${
              activeCat === c.key
                ? "bg-sauce border-sauce text-white"
                : "border-ink/20 text-ink/70 hover:border-ink/40 bg-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {error && (
        <p role="alert" className="text-sauce font-semibold">
          {error}
        </p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-ink/70">No items yet. Add your first pizza or burger.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* ===== DESKTOP: Table (screenshot jaisa) ===== */}
          <div className="hidden md:block bg-white border-2 border-ink/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-ink/60 text-left">
                  <th className="py-3 px-4 font-semibold">Image</th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Availability</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const on = isOn(p);
                  const cat = cap((p as Product & { category?: string }).category ?? "—");
                  return (
                    <tr key={p._id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                      <td className="py-3 px-4">
                        <ProductImage
                          product={p}
                          className={`w-12 h-12 rounded-lg object-cover ${on ? "" : "opacity-40 grayscale"}`}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className={`font-bold ${on ? "" : "text-ink/50"}`}>{p.name}</p>
                        <p className="text-xs text-ink/50">{cat}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-ink/5 text-ink/70 text-xs font-semibold">
                          {cat}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-ink">{formatPrice(p.price)}</td>
                      <td className="py-3 px-4">
                        <ToggleSwitch p={p} on={on} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditing(p)}
                            className="px-3 py-1.5 rounded-md border-2 border-ink/20 text-ink font-semibold text-xs hover:bg-ink hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => remove(p)}
                            aria-label={`Delete ${p.name}`}
                            className="p-1.5 text-sauce hover:bg-sauce/10 rounded-md"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE: Cards ===== */}
          <ul className="md:hidden space-y-3">
            {filtered.map((p) => {
              const on = isOn(p);
              const cat = cap((p as Product & { category?: string }).category ?? "—");
              return (
                <li key={p._id} className="bg-white border-2 border-ink/10 rounded-xl p-3 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ProductImage
                      product={p}
                      className={`w-16 h-16 rounded-lg object-cover shrink-0 ${on ? "" : "opacity-40 grayscale"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${on ? "" : "text-ink/50"}`}>{p.name}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-ink/5 text-ink/60 text-[11px] font-semibold">
                        {cat}
                      </span>
                      <p className="font-extrabold text-ink mt-1">{formatPrice(p.price)}</p>
                    </div>
                    <ToggleSwitch p={p} on={on} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="flex-1 py-2 rounded-md border-2 border-ink/20 font-semibold text-sm hover:bg-ink hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p)}
                      className="flex-1 py-2 rounded-md border-2 border-sauce text-sauce font-semibold text-sm hover:bg-sauce hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {editing !== undefined && (
        <ProductForm
          product={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            load();
          }}
        />
      )}
    </div>
  );
}