import { useCallback, useEffect, useState } from "react";
import { api } from "../api/Adminapi";
import { useAuth } from "../context/AuthContext";

type Partner = { _id: string; name: string; email: string; phone: string; delivered: number; active: number };
type Customer = { _id: string; name: string; email: string; phone: string };

const card = "bg-white rounded-xl border border-ink/10 shadow-sm";

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const { token } = useAuth();

  // const loadPartners = useCallback(() => {
  //   api<Partner[]>("/api/admin/delivery-partners")
  //     .then(setPartners)
  //     .catch((e) => setMsg({ type: "err", text: e.message }));
  // }, []);

  // const loadCustomers = useCallback((search: string) => {
  //   api<Customer[]>(`/api/admin/delivery-partners/customers?q=${encodeURIComponent(search)}`)
  //     .then(setCustomers)
  //     .catch((e) => setMsg({ type: "err", text: e.message }));
  // }, []);
    const loadPartners = useCallback(() => {
    if (!token) return;
    api<Partner[]>("/api/admin/delivery-partners", {}, token)
      .then(setPartners)
      .catch((e) => setMsg({ type: "err", text: e.message }));
  }, [token]);

  const loadCustomers = useCallback(
    (search: string) => {
      if (!token) return;
      api<Customer[]>(
        `/api/admin/delivery-partners/customers?q=${encodeURIComponent(search)}`,
        {},
        token
      )
        .then(setCustomers)
        .catch((e) => setMsg({ type: "err", text: e.message }));
    },
    [token]
  );

  useEffect(loadPartners, [loadPartners]);


  // Search me thoda delay (debounce)
  useEffect(() => {
    const t = setTimeout(() => loadCustomers(q), 300);
    return () => clearTimeout(t);
  }, [q, loadCustomers]);

  const changeRole = async (u: { _id: string; name: string }, role: "DELIVERY_PARTNER" | "CUSTOMER") => {
    const ask =
      role === "DELIVERY_PARTNER"
        ? `${u.name} ko Delivery Partner banana hai?`
        : `${u.name} ko wapas Customer banana hai?`;
    if (!window.confirm(ask)) return;

    setBusy(u._id);
    setMsg(null);
    try {
      await api(`/api/admin/delivery-partners/${u._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setMsg({
        type: "ok",
        text: role === "DELIVERY_PARTNER" ? `${u.name} ab Delivery Partner hai` : `${u.name} ab Customer hai`,
      });
      loadPartners();
      loadCustomers(q);
    } catch (e) {
      setMsg({ type: "err", text: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Delivery Partners</h1>
        <p className="text-sm text-ink/60">Apne delivery partners dekho, aur customers ko partner banao.</p>
      </div>

      {msg && (
        <div
          className={`text-sm rounded-lg px-4 py-2 border ${
            msg.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Delivery partners */}
      <div className={`${card} p-4 overflow-x-auto`}>
        <h2 className="font-bold text-sm mb-3">Delivery Partners ({partners.length})</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-ink/50 bg-gray-50">
              {["Name", "Mobile", "Email", "Delivered", "Active", "Action"].map((h) => (
                <th key={h} className="py-2 px-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 && (
              <tr><td colSpan={6} className="py-6 text-center text-ink/50">Abhi koi delivery partner nahi hai</td></tr>
            )}
            {partners.map((p) => (
              <tr key={p._id} className="border-t border-ink/5">
                <td className="py-2.5 px-2 font-semibold">{p.name}</td>
                <td className="px-2">{p.phone || "—"}</td>
                <td className="px-2">{p.email}</td>
                <td className="px-2">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">{p.delivered}</span>
                </td>
                <td className="px-2">
                  {p.active > 0 ? (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">{p.active}</span>
                  ) : (
                    <span className="text-ink/40">0</span>
                  )}
                </td>
                <td className="px-2">
                  <button
                    disabled={busy === p._id}
                    onClick={() => changeRole(p, "CUSTOMER")}
                    className="border border-sauce text-sauce rounded px-3 py-1 font-semibold hover:bg-sauce hover:text-white transition-colors disabled:opacity-50"
                  >
                    Make Customer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customers */}
      <div className={`${card} p-4 overflow-x-auto`}>
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="font-bold text-sm">Customers</h2>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, email ya mobile se dhoondo"
            className="border border-ink/15 rounded-md px-3 py-1.5 text-xs w-full sm:w-64"
          />
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-ink/50 bg-gray-50">
              {["Name", "Mobile", "Email", "Action"].map((h) => (
                <th key={h} className="py-2 px-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-ink/50">Koi customer nahi mila</td></tr>
            )}
            {customers.map((c) => (
              <tr key={c._id} className="border-t border-ink/5">
                <td className="py-2.5 px-2 font-semibold">{c.name}</td>
                <td className="px-2">{c.phone || "—"}</td>
                <td className="px-2">{c.email}</td>
                <td className="px-2">
                  <button
                    disabled={busy === c._id}
                    onClick={() => changeRole(c, "DELIVERY_PARTNER")}
                    className="bg-sauce text-white rounded px-3 py-1 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Make Delivery Partner
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}