import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../lib/socket";
import { orderApi } from "../Orderapi";
import {
  PROGRESS_STEPS,
  STATUS_LABEL,
  isActive,
  rupees,
  timeAgo,
  type Order,
  type StatusPayload,
} from "../Ordertypes";
import "../css/Orders.css";


export default function OrdersDropdown() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setOrders(await orderApi.myOrders(token));
    } catch {
      /* chup-chap, dropdown purana data dikha dega */
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on("order:status", (p: StatusPayload) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === p.orderId ? { ...o, status: p.status, paymentStatus: p.paymentStatus, updatedAt: p.updatedAt } : o
        )
      );
      setToast(`Order ${p.orderNumber}: ${STATUS_LABEL[p.status]}`);
      window.setTimeout(() => setToast(""), 4000);
    });

    // reconnect ke baad miss hue updates wapas la lo
    socket.on("connect", load);

    return () => {
      socket.disconnect();
    };
  }, [token, load]);

  // Checkout me order ban jaye to: window.dispatchEvent(new Event("orders:refresh"))
  useEffect(() => {
    const h = () => {
      load();
      setOpen(true);
    };
    window.addEventListener("orders:refresh", h);
    return () => window.removeEventListener("orders:refresh", h);
  }, [load]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!token) return null;

  const activeCount = orders.filter((o) => isActive(o.status)).length;

  return (
    <div className="od-wrap" ref={boxRef}>
      <button className="od-btn" onClick={() => setOpen((v) => !v)}>
        Orders
        {activeCount > 0 && <span className="od-badge">{activeCount}</span>}
      </button>

      {toast && <div className="od-toast">{toast}</div>}

      {open && (
        <div className="od-panel">
          <div className="od-head">
            <strong>My Orders</strong>
            <span className="od-live">● Live</span>
          </div>

          {loading && orders.length === 0 && <p className="od-empty">Loading…</p>}
          {!loading && orders.length === 0 && <p className="od-empty">Abhi koi order nahi hai</p>}

          <div className="od-list">
            {orders.slice(0, 6).map((o) => {
              const step = PROGRESS_STEPS.indexOf(o.status);
              return (
                <div key={o._id} className="od-card">
                  <div className="od-row">
                    <span className="od-num">#{o.orderNumber}</span>
                    <span className={`od-pill st-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                  </div>
                  <div className="od-items">
                    {o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </div>
                  <div className="od-row od-sub">
                    <span>{timeAgo(o.createdAt)}</span>
                    <span>
                      {rupees(o.total)} · {o.paymentMethod === "COD" ? "Cash" : "Paid online"}
                    </span>
                  </div>

                  {o.status !== "CANCELLED" ? (
                    <div className="od-steps">
                      {PROGRESS_STEPS.map((s, idx) => (
                        <div key={s} className={`od-step ${idx <= step ? "done" : ""}`} title={STATUS_LABEL[s]} />
                      ))}
                    </div>
                  ) : (
                    <div className="od-cancel">Order cancel ho gaya</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}