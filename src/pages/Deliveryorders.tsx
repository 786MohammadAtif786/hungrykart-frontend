import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../lib/socket";
import { deliveryApi, type DeliveryOrder, type StatusPayload } from "../Deliveryapi";
import { rupees, timeAgo } from "../Ordertypes";
import "../css/Delivery.css";

type Tab = "new" | "active" | "done";

const mapUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const itemsText = (o: DeliveryOrder) => o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ");

const ding = () => {
  try {
    new Audio("/ding.mp3").play().catch(() => {});
  } catch {
    
  }
};

const mergeStatus = (o: DeliveryOrder, p: StatusPayload): DeliveryOrder => ({
  ...o,
  status: p.status,
  paymentStatus: p.paymentStatus,
  updatedAt: p.updatedAt,
  deliveryBoy: p.deliveryBoy ?? o.deliveryBoy,
});

export default function DeliveryOrders() {
  const { token } = useAuth();
  const [available, setAvailable] = useState<DeliveryOrder[]>([]);
  const [mine, setMine] = useState<DeliveryOrder[]>([]);
  const [tab, setTab] = useState<Tab>("new");
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [a, m] = await Promise.all([deliveryApi.available(token), deliveryApi.mine(token)]);
      setAvailable(a);
      setMine(m);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Orders load nahi hue");
    }
  }, [token, flash]);

  useEffect(() => {
    if (!token) return;
    load();

    const socket = connectSocket(token);
    let first = true;

    const onConnect = () => {
      setLive(true);
      if (first) {
        first = false; 
        return;
      }
      load(); 
    };
    const onDisconnect = () => setLive(false);

    const onReady = (o: DeliveryOrder) => {
      setAvailable((p) => (p.some((x) => x._id === o._id) ? p : [o, ...p]));
      ding();
      flash(`New order #${o.orderNumber}`);
    };
    const onTaken = ({ orderId }: { orderId: string }) =>
      setAvailable((p) => p.filter((x) => x._id !== orderId));

    const onStatus = (p: StatusPayload) => {
      if (p.status === "CANCELLED") {
        setAvailable((prev) => prev.filter((x) => x._id !== p.orderId));
        setMine((prev) => prev.filter((x) => x._id !== p.orderId));
        flash(`Order #${p.orderNumber} cancel ho gaya`);
        return;
      }
      setMine((prev) => prev.map((o) => (o._id === p.orderId ? mergeStatus(o, p) : o)));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("orderReady", onReady);
    socket.on("orderTaken", onTaken);
    socket.on("orderUpdated", onStatus);
    socket.on("orderCancelled", onStatus);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("orderReady", onReady);
      socket.off("orderTaken", onTaken);
      socket.off("orderUpdated", onStatus);
      socket.off("orderCancelled", onStatus);
      socket.disconnect();
    };
  }, [token, load, flash]);

  const act = async (id: string, action: "accept" | "outForDelivery" | "delivered") => {
    if (!token || busy) return;
    setBusy(id);
    try {
      await deliveryApi[action](token, id);
      await load();
      if (action === "accept") setTab("active");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Action fail ho gaya");
      load();
    } finally {
      setBusy("");
    }
  };

  const active = mine.filter((o) => o.status === "READY" || o.status === "OUT_FOR_DELIVERY");
  const done = mine.filter((o) => o.status === "DELIVERED");
  const list = tab === "new" ? available : tab === "active" ? active : done;

  return (
    <div className="ord-page">
      <header className="ord-head">
        <h1>Deliveries</h1>
        <span className={`ord-live ${live ? "on" : ""}`}>{live ? "Live" : "Connecting…"}</span>
      </header>

      <nav className="ord-tabs">
        <button className={tab === "new" ? "on" : ""} onClick={() => setTab("new")}>
          New orders <b>{available.length}</b>
        </button>
        <button className={tab === "active" ? "on" : ""} onClick={() => setTab("active")}>
          My active <b>{active.length}</b>
        </button>
        <button className={tab === "done" ? "on" : ""} onClick={() => setTab("done")}>
          Delivered <b>{done.length}</b>
        </button>
      </nav>

      {list.length === 0 && (
        <p className="ord-empty">
          {tab === "new" && "No new orders right now. Orders will appear here as soon as they are ready."}
          {tab === "active" && "You haven’t accepted any orders yet."}
          {tab === "done" && "You haven't delivered any orders yet."}
        </p>
      )}

      {list.map((o) => {
        const d = o.deliveryDetails;
        const cash = o.paymentMethod === "COD" && o.paymentStatus !== "PAID";
        return (
          <article key={o._id} className={`ord-card ${o.status === "OUT_FOR_DELIVERY" ? "going" : ""}`}>
            <div className="ord-row">
              <strong>#{o.orderNumber}</strong>
              <span className="ord-ago">{timeAgo(o.updatedAt)}</span>
            </div>

            <p className="ord-items">{itemsText(o)}</p>

            <div className="ord-block">
              <div className="ord-label">Deliver to</div>
              <div>
                <b>{d.fullName}</b>
              </div>
              <div>{d.address}</div>
              {d.landmark && <div className="ord-muted">Near {d.landmark}</div>}
              <div className="ord-links">
                <a href={`tel:${d.phone}`}>Call {d.phone}</a>
                <a href={mapUrl(d.address)} target="_blank" rel="noreferrer">
                  View on map
                </a>
              </div>
            </div>

            <div className="ord-row">
              <span className={`ord-pay ${cash ? "cash" : "paid"}`}>
                {cash ? `Collect cash ${rupees(o.total)}` : o.paymentMethod === "ONLINE" ? "Paid online" : "Cash received"}
              </span>
              <strong>{rupees(o.total)}</strong>
            </div>

            {tab === "new" && (
              <button className="ord-btn" disabled={busy === o._id} onClick={() => act(o._id, "accept")}>
                {busy === o._id ? "Accepting…" : "Accept order"}
              </button>
            )}
            {tab === "active" && o.status === "READY" && (
              <button className="ord-btn" disabled={busy === o._id} onClick={() => act(o._id, "outForDelivery")}>
                Picked up, out for delivery
              </button>
            )}
            {tab === "active" && o.status === "OUT_FOR_DELIVERY" && (
              <button className="ord-btn green" disabled={busy === o._id} onClick={() => act(o._id, "delivered")}>
                Mark delivered
              </button>
            )}
          </article>
        );
      })}

      {toast && <div className="ord-toast">{toast}</div>}
    </div>
  );
}