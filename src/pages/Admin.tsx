import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { formatPrice, ProductImage } from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import type { Product } from "../types";

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setProducts(await api.adminProducts(token));
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

  const remove = async (p: Product) => {
    if (!token || !confirm(`Delete “${p.name}”?`)) return;
    try {
      await api.deleteProduct(token, p._id);
      setProducts((list) => list.filter((x) => x._id !== p._id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete item");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-extrabold">Manage items</h1>
        <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md bg-sauce text-white font-bold hover:bg-sauce-dark">
          + Add item
        </button>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p role="alert" className="text-sauce font-semibold">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-ink/70">No items yet. Add your first pizza or burger.</p>
      )}

      <ul className="space-y-3">
        {products.map((p) => (
          <li key={p._id} className="bg-white border-2 border-ink rounded-lg p-3 flex items-center gap-3 sm:gap-4">
            <ProductImage product={p} className="w-20 h-20 sm:w-24 sm:h-24 rounded-md shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="font-bold truncate">{p.name}</h2>
              <p className="font-extrabold text-sauce">{formatPrice(p.price)}</p>
              {p.isActive === false && <p className="text-xs text-ink/60">Hidden from menu</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={() => setEditing(p)} className="px-3 py-1.5 rounded-md border-2 border-ink font-semibold text-sm hover:bg-ink hover:text-white">
                Edit
              </button>
              <button onClick={() => remove(p)} className="px-3 py-1.5 rounded-md border-2 border-sauce text-sauce font-semibold text-sm hover:bg-sauce hover:text-white">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

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
