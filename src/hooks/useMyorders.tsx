import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket } from "../lib/socket";
import { orderApi } from "../Orderapi";
import { STATUS_LABEL, type Order, type StatusPayload } from "../Ordertypes";


export function useMyOrders(token: string | null | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [freshIds, setFreshIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 4000);
  }, []);

  const flash = useCallback((id: string, ms: number) => {
    setFreshIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    window.setTimeout(() => setFreshIds((prev) => prev.filter((x) => x !== id)), ms);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setOrders(await orderApi.myOrders(token));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Orders load nahi hue");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.addEventListener("orders:refresh", load);
    return () => window.removeEventListener("orders:refresh", load);
  }, [load]);

  const patchOrder = useCallback((id: string, patch: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...patch } : o)));
  }, []);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on("orderCreated", (order: Order) => {
      setOrders((prev) => (prev.some((o) => o._id === order._id) ? prev : [order, ...prev]));
      flash(order._id, 6000);
      showToast(`Order #${order.orderNumber} place ho gaya`);
    });

    const onStatus = (p: StatusPayload) => {
  setOrders((prev) =>
    prev.map((o) =>
      o._id === p.orderId
        ? {
            ...o,
            status: p.status,
            paymentStatus: p.paymentStatus,
            updatedAt: p.updatedAt,
            cancelReason: p.cancelReason ?? o.cancelReason,
            deliveryBoy: p.deliveryBoy ?? o.deliveryBoy,
          }
        : o
    )
  );
  flash(p.orderId, 4000);
  showToast(`Order #${p.orderNumber}: ${STATUS_LABEL[p.status]}`);
};
    socket.on("orderUpdated", onStatus);
    socket.on("orderCancelled", onStatus);

    socket.on("connect", load);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      window.clearTimeout(toastTimer.current);
    };
  }, [token, load, showToast, flash]);

  return { orders, loading, error, freshIds, toast, reload: load, patchOrder };
}