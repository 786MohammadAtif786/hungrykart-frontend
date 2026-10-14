import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdminOrders } from "../hooks/useAdminOrders";
import { orderApi } from "../Orderapi";
import { STATUS_LABEL, fmtDateTime, rupees, timeAgo, type Order, type OrderStatus } from "../Ordertypes";
import "../css/Adminorders.css";

type Tab = "ALL" | OrderStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "ALL", label: "All Orders" },
  { key: "PLACED", label: "New" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

interface Action {
  label: string;
  next: OrderStatus;
  kind: "primary" | "ghost";
  askReason?: boolean;
}


const ACTIONS: Record<OrderStatus, Action[]> = {
  PLACED: [
    { label: "Accept Order", next: "CONFIRMED", kind: "primary" },
    { label: "Reject", next: "CANCELLED", kind: "ghost", askReason: true },
  ],
  CONFIRMED: [
    { label: "Start Preparing", next: "PREPARING", kind: "primary" },
    { label: "Cancel Order", next: "CANCELLED", kind: "ghost", askReason: true },
  ],
  PREPARING: [
    { label: "Mark Ready", next: "READY", kind: "primary" },
    { label: "Cancel Order", next: "CANCELLED", kind: "ghost", askReason: true },
  ],
  READY: [{ label: "Cancel Order", next: "CANCELLED", kind: "ghost", askReason: true }], // rider accept karega
  OUT_FOR_DELIVERY: [], // rider deliver karega
  DELIVERED: [],
  CANCELLED: [],
};

const userOf = (o: Order) => (typeof o.user === "string" ? null : o.user);
const riderOf = (o: Order) => (o.deliveryBoy && typeof o.deliveryBoy === "object" ? o.deliveryBoy : null);
const pad = (n: number) => String(n).padStart(2, "0");

export default function AdminOrders() {
  const { token } = useAuth();

  // ---- filters ----
  const [tab, setTab] = useState<Tab>("ALL");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState(""); 
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(t);
  }, [search]);

  // ---- UI state ----
  const [busyId, setBusyId] = useState("");
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number>();
  const [detailSnap, setDetailSnap] = useState<Order | null>(null);
  const [rejecting, setRejecting] = useState<{ order: Order; next: OrderStatus; label: string } | null>(null);
  const [reason, setReason] = useState("");
  const [, setTick] = useState(0); 

  const onNewOrder = useCallback((order: Order) => {
    setToast(`New order received! #${order.orderNumber} • ${rupees(order.total)}`);
    new Audio("/ding.mp3").play().catch(() => undefined);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 6000);
  }, []);

  const { orders, counts, deliveredToday, total, pages, loading, error, connection, reload, patchOrder } =
    useAdminOrders(token, { status: tab, q, date, page }, onNewOrder);

  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30000);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const detail = detailSnap ? orders.find((o) => o._id === detailSnap._id) ?? detailSnap : null;

  const run = async (o: Order, next: OrderStatus, why?: string) => {
    if (!token || busyId) return;
    setBusyId(o._id);
    setActionError("");
    try {
      const updated = await orderApi.updateStatus(token, o._id, next, why);
      patchOrder(o._id, {
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        cancelReason: updated.cancelReason,
        updatedAt: updated.updatedAt,
      });
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Status update fail");
    } finally {
      setBusyId("");
    }
  };

  const onAction = (o: Order, a: Action) => {
    if (a.askReason) {
      setReason("");
      setRejecting({ order: o, next: a.next, label: a.label });
    } else {
      run(o, a.next);
    }
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    const { order, next } = rejecting;
    setRejecting(null);
    await run(order, next, reason.trim() || undefined);
  };

  const changeTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  const count = (k: string) => counts[k] ?? 0;

  return (
    <div className="ao-page">
      <header className="ao-header">
        <div>
          <h1>
            Order Management{" "}
            <span className={`ao-conn ${connection}`}>
              ● {connection === "connected" ? "Connected" : "Reconnecting…"}
            </span>
          </h1>
          <p>View and manage all incoming orders in real-time</p>
        </div>
      </header>

      {toast && (
        <div className="ao-toast" role="status">
          🔔 {toast}
        </div>
      )}

      <section className="ao-stats">
        <div className="ao-stat red">
          <span>New Orders</span>
          <b>{pad(count("PLACED"))}</b>
          <small>Awaiting acceptance</small>
        </div>
        <div className="ao-stat yellow">
          <span>Preparing</span>
          <b>{pad(count("CONFIRMED") + count("PREPARING") + count("READY"))}</b>
          <small>In the kitchen</small>
        </div>
        <div className="ao-stat blue">
          <span>Out for Delivery</span>
          <b>{pad(count("OUT_FOR_DELIVERY"))}</b>
          <small>On the way</small>
        </div>
        <div className="ao-stat green">
          <span>Delivered Today</span>
          <b>{pad(deliveredToday)}</b>
          <small>Successfully delivered</small>
        </div>
      </section>

      <div className="ao-toolbar">
        <input
          className="ao-search"
          type="search"
          placeholder="Search order ID, customer name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ao-date">
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
          />
          {date && (
            <button className="ao-clear" onClick={() => setDate("")}>
              Clear
            </button>
          )}
        </div>
      </div>

      <nav className="ao-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => changeTab(t.key)}>
            {t.label} ({count(t.key)})
          </button>
        ))}
      </nav>

      {actionError && <div className="ao-error">{actionError}</div>}
      {error && (
        <div className="ao-error">
          {error}{" "}
          <button className="ao-link" onClick={reload}>
            Retry
          </button>
        </div>
      )}
      {loading && <p className="ao-muted">Loading orders…</p>}
      {!loading && !error && orders.length === 0 && (
        <div className="ao-empty">
          <b>Koi order nahi mila</b>
          <span>{q || date || tab !== "ALL" ? "Filter badal kar dekho" : "Naya order aate hi yahan apne aap dikhega"}</span>
        </div>
      )}

      {orders.length > 0 && (
        <div className="ao-table">
          <div className="ao-thead">
            <span>Order Details</span>
            <span>Items</span>
            <span>Delivery Address</span>
            <span>Payment</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {orders.map((o) => {
            const u = userOf(o);
            const rider = riderOf(o);
            return (
              <div key={o._id} className={`ao-row st-${o.status}`}>
                <div className="ao-cell" data-label="Order">
                  <div className="ao-num">
                    #{o.orderNumber}{" "}
                    <span className={`ao-tag st-${o.status}`}>{o.status === "PLACED" ? "NEW" : STATUS_LABEL[o.status].toUpperCase()}</span>
                  </div>
                  <div className="ao-muted">{timeAgo(o.createdAt)}</div>
                  <div className="ao-cust">
                    {o.deliveryDetails.fullName}
                    {u && <small> ({u.email})</small>}
                  </div>
                  <div className="ao-muted">📞 {o.deliveryDetails.phone}</div>
                </div>

                <div className="ao-cell" data-label="Items">
                  {o.items.map((i, idx) => (
                    <div key={idx} className="ao-item">
                      {i.name} <span>× {i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="ao-cell" data-label="Address">
                  <div>{o.deliveryDetails.address}</div>
                  {o.deliveryDetails.landmark && <div className="ao-muted">Near {o.deliveryDetails.landmark}</div>}
                  <a
                    className="ao-map"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.deliveryDetails.address)}`}
                  >
                    View on Map
                  </a>
                </div>

                <div className="ao-cell" data-label="Payment">
                  <div>
                    {o.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}{" "}
                    <span className={`ao-paid ${o.paymentStatus === "PAID" ? "yes" : ""}`}>
                      {o.paymentStatus === "PAID" ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="ao-total">{rupees(o.total)}</div>
                </div>

                <div className="ao-cell" data-label="Status">
                  <span className={`ao-status st-${o.status}`}>
                    {o.status === "PLACED" ? "New Order" : STATUS_LABEL[o.status]}
                  </span>
                  {o.status === "CANCELLED" && o.cancelReason && <div className="ao-muted">{o.cancelReason}</div>}

                  {/* Rider ki live status */}
                  {o.status === "READY" && !rider && <div className="ao-muted">⏳ Waiting for a rider…</div>}
                  {o.status === "READY" && rider && <div className="ao-muted">✅ Accepted by {rider.name} </div>}
                  {o.status === "OUT_FOR_DELIVERY" && rider && (
                    <div className="ao-muted">
                      🛵 {rider.name}
                      {rider.phone ? ` (${rider.phone})` : ""}
                    </div>
                  )}
                  {o.status === "DELIVERED" && rider && <div className="ao-muted">Delivered by {rider.name}</div>}
                </div>

                <div className="ao-cell ao-actions">
                  {ACTIONS[o.status].map((a) => (
                    <button
                      key={a.label}
                      className={a.kind === "primary" ? "ao-btn-primary" : "ao-btn-ghost"}
                      disabled={busyId === o._id}
                      onClick={() => onAction(o, a)}
                    >
                      {a.label}
                    </button>
                  ))}
                  <button className="ao-btn-ghost" onClick={() => setDetailSnap(o)}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="ao-pager">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>
            Page {page} of {pages} · {total} orders
          </span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}

      {/* ---- Reject / Cancel reason ---- */}
      {rejecting && (
        <div className="ao-overlay" onClick={() => setRejecting(null)}>
          <div className="ao-modal small" onClick={(e) => e.stopPropagation()}>
            <h3>
              {rejecting.label}: #{rejecting.order.orderNumber}
            </h3>
            <p className="ao-muted">Customer ko ye reason dikhega (optional).</p>
            <textarea
              rows={3}
              maxLength={200}
              placeholder="Jaise: Item stock me nahi hai"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
            <div className="ao-modal-actions">
              <button className="ao-btn-ghost" onClick={() => setRejecting(null)}>
                Back
              </button>
              <button className="ao-btn-primary" onClick={confirmReject}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Order details ---- */}
      {detail && (
        <div className="ao-overlay" onClick={() => setDetailSnap(null)}>
          <div className="ao-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ao-modal-head">
              <div>
                <h3>#{detail.orderNumber}</h3>
                <span className={`ao-status st-${detail.status}`}>{STATUS_LABEL[detail.status]}</span>
              </div>
              <button className="ao-close" onClick={() => setDetailSnap(null)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="ao-grid2">
              <section>
                <h4>Customer</h4>
                <div>{detail.deliveryDetails.fullName}</div>
                {userOf(detail) && <div className="ao-muted">{userOf(detail)?.email}</div>}
                <div className="ao-muted">📞 {detail.deliveryDetails.phone}</div>
              </section>
              <section>
                <h4>Delivery Address</h4>
                <div>{detail.deliveryDetails.address}</div>
                {detail.deliveryDetails.landmark && <div className="ao-muted">Near {detail.deliveryDetails.landmark}</div>}
              </section>
            </div>

            <h4>Items</h4>
            <table className="ao-items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((i, idx) => (
                  <tr key={idx}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>{rupees(i.price)}</td>
                    <td>{rupees(i.price * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ao-sums">
              <div>
                <span>Subtotal</span>
                <span>{rupees(detail.subtotal)}</span>
              </div>
              <div>
                <span>Delivery fee</span>
                <span>{rupees(detail.deliveryFee)}</span>
              </div>
              <div>
                <span>Tax</span>
                <span>{rupees(detail.tax)}</span>
              </div>
              <div className="grand">
                <span>Total</span>
                <span>{rupees(detail.total)}</span>
              </div>
            </div>

            <div className="ao-grid2">
              <section>
                <h4>Payment</h4>
                <div>
                  {detail.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"} ·{" "}
                  <b>{detail.paymentStatus === "PAID" ? "Paid" : "Pending"}</b>
                </div>
                {detail.paymentId && <div className="ao-muted">Payment ID: {detail.paymentId}</div>}
              </section>
              <section>
                <h4>Timeline</h4>
                <div className="ao-muted">Placed: {fmtDateTime(detail.createdAt)}</div>
                <div className="ao-muted">Last update: {fmtDateTime(detail.updatedAt)}</div>
                {riderOf(detail) && (
                  <div className="ao-muted">
                    Rider: {riderOf(detail)!.name}
                    {riderOf(detail)!.phone ? ` · ${riderOf(detail)!.phone}` : ""}
                  </div>
                )}
                {detail.status === "CANCELLED" && (
                  <div className="ao-cancelnote">
                    Cancelled by {detail.cancelledBy === "CUSTOMER" ? "customer" : "admin"}
                    {detail.cancelReason ? `: ${detail.cancelReason}` : ""}
                  </div>
                )}
              </section>
            </div>

            {ACTIONS[detail.status].length > 0 && (
              <div className="ao-modal-actions">
                {ACTIONS[detail.status].map((a) => (
                  <button
                    key={a.label}
                    className={a.kind === "primary" ? "ao-btn-primary" : "ao-btn-ghost"}
                    disabled={busyId === detail._id}
                    onClick={() => onAction(detail, a)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}