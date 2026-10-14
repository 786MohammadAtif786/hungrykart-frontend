import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMyOrders } from "../hooks/useMyorders";
import { orderApi } from "../Orderapi";
import { PROGRESS_STEPS, STATUS_LABEL, isActive, rupees, timeAgo, type Order } from "../Ordertypes";
import "../css/Myorders.css";

type Tab = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";

const TABS: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All Orders" },
  { key: "ACTIVE", label: "Active" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

const matches = (o: Order, t: Tab) =>
  t === "ALL" ? true : t === "ACTIVE" ? isActive(o.status) : o.status === t;

export default function MyOrders() {
  const { token } = useAuth();
  const { orders, loading, error, freshIds, patchOrder } = useMyOrders(token);
  const [tab, setTab] = useState<Tab>("ALL");
  const [busyId, setBusyId] = useState("");
  const [cancelError, setCancelError] = useState("");

  // Customer cancel: only allowed for PLACED / CONFIRMED (the backend checks this too)
  const cancelOrder = async (o: Order) => {
    if (!token || busyId) return;
    const reason = window.prompt("Reason for cancellation (optional)");
    if (reason === null) return; // user pressed Cancel
    setBusyId(o._id);
    setCancelError("");
    try {
      const updated = await orderApi.cancelMyOrder(token, o._id, reason.trim() || undefined);
      patchOrder(o._id, { status: updated.status, cancelReason: updated.cancelReason, updatedAt: updated.updatedAt });
    } catch (e) {
      setCancelError(e instanceof Error ? e.message : "Could not cancel the order");
    } finally {
      setBusyId("");
    }
  };

  const counts = useMemo(
    () => ({
      ALL: orders.length,
      ACTIVE: orders.filter((o:any) => isActive(o.status)).length,
      DELIVERED: orders.filter((o:any) => o.status === "DELIVERED").length,
      CANCELLED: orders.filter((o:any) => o.status === "CANCELLED").length,
      PREPARING: orders.filter((o:any) => o.status === "CONFIRMED" || o.status === "PREPARING").length,
      ON_WAY: orders.filter((o:any) => o.status === "OUT_FOR_DELIVERY").length,
    }),
    [orders]
  );

  const visible = orders.filter((o:any) => matches(o, tab));

  return (
    <div className="mo-page">
      <header className="mo-header">
        <h1>
          My Orders <span className="mo-live">● Live</span>
        </h1>
        <p>All your orders appear here. Status updates automatically, no need to refresh.</p>
      </header>

      <section className="mo-stats">
        <div className="mo-stat red">
          <span>Active Orders</span>
          <b>{String(counts.ACTIVE).padStart(2, "0")}</b>
          <small>Currently in progress</small>
        </div>
        <div className="mo-stat yellow">
          <span>Preparing</span>
          <b>{String(counts.PREPARING).padStart(2, "0")}</b>
          <small>Being prepared in the kitchen</small>
        </div>
        <div className="mo-stat blue">
          <span>Out for Delivery</span>
          <b>{String(counts.ON_WAY).padStart(2, "0")}</b>
          <small>On the way</small>
        </div>
        <div className="mo-stat green">
          <span>Delivered</span>
          <b>{String(counts.DELIVERED).padStart(2, "0")}</b>
          <small>Arrived</small>
        </div>
      </section>

      <nav className="mo-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </nav>

      {error && <div className="mo-error">{error}</div>}
      {cancelError && <div className="mo-error">{cancelError}</div>}
      {loading && <p className="mo-muted">Loading orders…</p>}
      {!loading && visible.length === 0 && <p className="mo-muted">No orders in this tab</p>}

      <div className="mo-list">
        {visible.map((o) => {
          const step = PROGRESS_STEPS.indexOf(o.status);
          return (
            <article key={o._id} className={`mo-card st-${o.status} ${freshIds.includes(o._id) ? "fresh" : ""}`}>
              <div className="mo-top">
                <div>
                  <div className="mo-num">#{o.orderNumber}</div>
                  <div className="mo-muted">{timeAgo(o.createdAt)}</div>
                </div>
                <span className={`mo-status st-${o.status}`}>{STATUS_LABEL[o.status]}</span>
              </div>

              <div className="mo-body">
                <div className="mo-col">
                  <h4>Items</h4>
                  {o.items.map((i:any, idx:any) => (
                    <div key={idx} className="mo-item">
                      <span>
                        {i.name} <em>× {i.quantity}</em>
                      </span>
                      <span>{rupees(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mo-col">
                  <h4>Delivery Address</h4>
                  <div>{o.deliveryDetails.fullName}</div>
                  <div className="mo-muted">{o.deliveryDetails.address}</div>
                  {o.deliveryDetails.landmark && <div className="mo-muted">Near {o.deliveryDetails.landmark}</div>}
                  <div className="mo-muted">📞 {o.deliveryDetails.phone}</div>
                </div>

                <div className="mo-col">
                  <h4>Payment</h4>
                  <div>
                    {o.paymentMethod === "COD" ? "Cash on Delivery" : "Paid online"}{" "}
                    <span className={`mo-paid ${o.paymentStatus === "PAID" ? "yes" : ""}`}>
                      {o.paymentStatus === "PAID" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="mo-total">{rupees(o.total)}</div>
                </div>
              </div>

              {o.status === "CANCELLED" ? (
                <div className="mo-cancel">
                  This order has been cancelled{o.cancelReason ? `: ${o.cancelReason}` : ""}
                </div>
              ) : (
                <div className="mo-steps">
                  {PROGRESS_STEPS.map((s, idx) => (
                    <div key={s} className={`mo-step ${idx <= step ? "done" : ""} ${idx === step ? "now" : ""}`}>
                      <i />
                      <span>{STATUS_LABEL[s as keyof typeof STATUS_LABEL]}</span>
                    </div>
                  ))}
                </div>
              )}

              {(o.status === "PLACED" || o.status === "CONFIRMED") && (
                <div className="mo-actions">
                  <button disabled={busyId === o._id} onClick={() => cancelOrder(o)}>
                    Cancel Order
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}