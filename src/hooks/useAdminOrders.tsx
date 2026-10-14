import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket } from "../lib/socket";
import { orderApi } from "../Orderapi";
import type { Order, OrderStatus, StatusPayload } from "../Ordertypes";

export type Connection = "connected" | "reconnecting";

export interface AdminFilters {
  status: "ALL" | OrderStatus;
  q: string;
  date: string; // YYYY-MM-DD ya ""
  page: number;
}

const PAGE_SIZE = 20;

function matches(o: Order, f: AdminFilters) {
  if (f.status !== "ALL" && o.status !== f.status) return false;
  if (f.date && new Date(o.createdAt).toLocaleDateString("en-CA") !== f.date) return false;
  if (f.q) {
    const hay = `${o.orderNumber} ${o.deliveryDetails.fullName} ${o.deliveryDetails.phone}`.toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}

export function useAdminOrders(
  token: string | null | undefined,
  filters: AdminFilters,
  onNewOrder?: (order: Order) => void
) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [deliveredToday, setDeliveredToday] = useState(0);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connection, setConnection] = useState<Connection>("reconnecting");

  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const onNewRef = useRef(onNewOrder);
  onNewRef.current = onNewOrder;
  const ordersRef = useRef<Order[]>([]);
  ordersRef.current = orders;
  const seenNew = useRef(new Set<string>());
  const reqId = useRef(0);
  const reloadTimer = useRef<number | undefined>(undefined);

  const load = useCallback(
    async (silent = false) => {
      if (!token) return;
      const id = ++reqId.current;
      if (!silent) setLoading(true);
      try {
        const f = filtersRef.current;
        const data = await orderApi.adminOrders(token, {
          status: f.status === "ALL" ? undefined : f.status,
          q: f.q || undefined,
          date: f.date || undefined,
          page: f.page,
          limit: PAGE_SIZE,
        });
        if (id !== reqId.current) return;
        setOrders(data.orders);
        setCounts(data.counts);
        setDeliveredToday(data.deliveredToday);
        setTotal(data.total);
        setPages(Math.max(1, data.pages));
        setError("");
      } catch (e) {
        if (id === reqId.current) setError(e instanceof Error ? e.message : "Orders load nahi hue");
      } finally {
        if (id === reqId.current && !silent) setLoading(false);
      }
    },
    [token]
  );

  const loadRef = useRef(load);
  loadRef.current = load;

  const scheduleReload = useCallback(() => {
    window.clearTimeout(reloadTimer.current);
    reloadTimer.current = window.setTimeout(() => loadRef.current(true), 300);
  }, []);

  useEffect(() => {
    load(false);
  }, [load, filters.status, filters.q, filters.date, filters.page]);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    setConnection(socket.connected ? "connected" : "reconnecting");

    socket.on("connect", () => {
      setConnection("connected");
      loadRef.current(true);
    });
    socket.on("disconnect", () => setConnection("reconnecting"));
    socket.on("connect_error", () => setConnection("reconnecting"));

    socket.on("newOrder", (order: Order) => {
      if (seenNew.current.has(order._id) || ordersRef.current.some((o) => o._id === order._id)) return;
      seenNew.current.add(order._id);

      const f = filtersRef.current;
      if (f.page === 1 && matches(order, f)) {
        setOrders((prev) => (prev.some((o) => o._id === order._id) ? prev : [order, ...prev]));
      }
      onNewRef.current?.(order);
      scheduleReload();
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
      scheduleReload();
    };
    socket.on("orderUpdated", onStatus);
    socket.on("orderCancelled", onStatus);

    return () => {
      window.clearTimeout(reloadTimer.current);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [token, scheduleReload]);

  const patchOrder = useCallback(
    (id: string, patch: Partial<Order>) => {
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...patch } : o)));
      scheduleReload();
    },
    [scheduleReload]
  );

  return {
    orders,
    counts,
    deliveredToday,
    total,
    pages,
    loading,
    error,
    connection,
    reload: () => load(false),
    patchOrder,
  };
}