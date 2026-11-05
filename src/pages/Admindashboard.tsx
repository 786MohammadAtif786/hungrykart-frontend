import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// NOTE: Yeh sample data hai — API se connect karke replace kar dena
const STATS = [
  { label: "Total Orders", value: "74", delta: "12%", icon: "🛍️", bg: "bg-red-50", ic: "bg-red-100" },
  { label: "Total Revenue", value: "₹12,450", delta: "18%", icon: "🪙", bg: "bg-amber-50", ic: "bg-amber-100" },
  { label: "New Customers", value: "28", delta: "20%", icon: "👥", bg: "bg-blue-50", ic: "bg-blue-100" },
  { label: "Active Delivery", value: "6", delta: "", icon: "🛵", bg: "bg-green-50", ic: "bg-green-100", sub: "On Duty" },
];

const BARS = [18, 22, 16, 24, 14, 18, 34, 40, 20, 16, 24, 14, 22, 16, 30, 18, 14];
const BAR_LABELS = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];

const STATUS = [
  { label: "New Orders", n: 8, color: "#ef4444" },
  { label: "Preparing", n: 12, color: "#f59e0b" },
  { label: "Ready", n: 6, color: "#eab308" },
  { label: "Out for Delivery", n: 5, color: "#3b82f6" },
  { label: "Delivered", n: 48, color: "#22c55e" },
  { label: "Cancelled", n: 4, color: "#9ca3af" },
];

type ApiRecentOrder = {
  _id: string; orderNo: string; customer: string; itemsCount: number;
  amount: number; payment: string; status: string;
};
type ApiTopItem = { _id: string; name: string; price: number; image?: string; orders: number };

const API = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? "";

// Agar tumhare paas already axios instance / api helper hai to isse usse replace kar do
async function getJSON<T>(path: string): Promise<T> {
  const token = localStorage.getItem("hk_token");
  const res = await fetch(`${API}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

const STATUS_STYLE: Record<string, string> = {
  "New Order": "bg-red-100 text-red-600",
  Preparing: "bg-amber-100 text-amber-600",
  Ready: "bg-blue-100 text-blue-600",
  "Out for Delivery": "bg-purple-100 text-purple-600",
  Confirmed: "bg-sky-100 text-sky-600",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-200 text-gray-600",
};

// Recent orders aur top selling ab API se aate hain (neeche useEffect dekho)

const card = "bg-white rounded-xl border border-ink/10 shadow-sm";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<
    { id: string; c: string; items: number; amt: number; pay: string; st: string }[]
  >([]);
  const [top, setTop] = useState<{ id: string; n: string; o: number; p: number; img?: string }[]>([]);

  useEffect(() => {
    getJSON<ApiRecentOrder[]>("/api/orders/admin/recent?limit=4")
      .then((d) =>
        setOrders(
          d.map((o) => ({ id: o.orderNo, c: o.customer, items: o.itemsCount, amt: o.amount, pay: o.payment, st: o.status }))
        )
      )
      .catch((e) => console.error("recent-orders", e));

    getJSON<ApiTopItem[]>("/api/orders/admin/top-selling?range=today&limit=5")
      .then((d) => setTop(d.map((t) => ({ id: t._id, n: t.name, o: t.orders, p: t.price, img: t.image }))))
      .catch((e) => console.error("top-selling", e));
  }, []);

  const total = STATUS.reduce((s, x) => s + x.n, 0);

  let acc = 0;
  const gradient = STATUS.map((s) => {
    const from = (acc / total) * 100;
    acc += s.n;
    return `${s.color} ${from}% ${(acc / total) * 100}%`;
  }).join(", ");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-ink/60">
          Welcome back, {user?.name ?? "Admin"}! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-ink/5 p-4 flex items-center gap-3`}>
            <div className={`${s.ic} w-12 h-12 rounded-full flex items-center justify-center text-xl`}>{s.icon}</div>
            <div>
              <div className="text-xs text-ink/70">{s.label}</div>
              <div className="text-2xl font-extrabold leading-tight">{s.value}</div>
              <div className="text-xs text-ink/50">
                {s.sub ?? "Today"}{" "}
                {s.delta && <span className="text-green-600 font-semibold">↑ {s.delta}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${card} lg:col-span-2 p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">Order Statistics</h2>
            <span className="text-xs border border-ink/15 rounded-md px-3 py-1">Today ▾</span>
          </div>
          <div className="flex items-end gap-2 h-44 border-b border-ink/10">
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{ height: `${(h / 40) * 100}%` }}
                className={`flex-1 rounded-t ${i % 2 === 0 ? "bg-red-500" : "bg-red-300"}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-ink/50 mt-1 px-1">
            {BAR_LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        <div className={`${card} p-4`}>
          <h2 className="font-bold text-sm mb-3">Order Status</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="relative w-32 h-32 rounded-full shrink-0"
              style={{ background: `conic-gradient(${gradient})` }}
            >
              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold leading-none">{total}</span>
                <span className="text-[10px] text-ink/50">Total Orders</span>
              </div>
            </div>
            <ul className="flex-1 min-w-[8rem] space-y-1.5 text-xs">
              {STATUS.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1 text-ink/70">{s.label}</span>
                  <span className="font-bold">{s.n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`${card} lg:col-span-2 p-4 overflow-x-auto`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-sauce">View All</Link>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-ink/50 bg-gray-50">
                {["#", "Customer", "Items", "Amount", "Payment", "Status", "Action"].map((h) => (
                  <th key={h} className="py-2 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-ink/50">No orders yet</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-ink/5">
                  <td className="py-2.5 px-2 font-semibold">{o.id}</td>
                  <td className="px-2">{o.c}</td>
                  <td className="px-2">{o.items} items</td>
                  <td className="px-2 font-semibold">₹{o.amt}</td>
                  <td className="px-2">
                    <span className={`px-2 py-0.5 rounded ${o.pay === "Paid" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {o.pay}
                    </span>
                  </td>
                  <td className="px-2">
                    <span className={`px-2 py-0.5 rounded ${STATUS_STYLE[o.st]}`}>{o.st}</span>
                  </td>
                  <td className="px-2">
                    <Link to="/admin/orders" className="border border-sauce text-sauce rounded px-3 py-1 font-semibold hover:bg-sauce hover:text-white transition-colors">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${card} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">Top Selling Items</h2>
            <span className="text-xs border border-ink/15 rounded-md px-3 py-1">Today ▾</span>
          </div>
          <ul className="space-y-3">
            {top.length === 0 && <li className="text-xs text-ink/50">No sales yet today</li>}
            {top.map((t, i) => (
              <li key={t.id} className="flex items-center gap-3 text-xs">
                <span className="w-4 font-semibold">{i + 1}</span>
                <span className="w-9 h-9 rounded-md bg-amber-50 flex items-center justify-center text-lg overflow-hidden">
                  {t.img ? <img src={t.img} alt={t.n} className="w-full h-full object-cover" /> : "🍽️"}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{t.n}</div>
                  <div className="text-ink/50">{t.o} orders</div>
                </div>
                <span className="font-bold">₹{t.p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}