import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../lib/socket";
import { deliveryApi } from "../Deliveryapi";

export default function DeliveryNavButton({ onClick }: { onClick?: () => void }) {
  const { token } = useAuth();
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setCount((await deliveryApi.available(token)).length);
    } catch {
      /* badge optional, chup-chaap ignore */
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    load();

    const socket = connectSocket(token);
    socket.on("orderReady", load);
    socket.on("orderTaken", load);
    socket.on("orderCancelled", load);
    socket.on("connect", load);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [token, load]);

  const active = pathname.startsWith("/delivery");

  return (
    <Link
      to="/delivery"
      onClick={onClick}
      aria-label={`Deliveries, ${count} new orders`}
      className={`relative flex items-center gap-1.5 font-semibold text-sm hover:text-sauce transition-colors ${
        active ? "text-sauce" : ""
      }`}
    >
      <span className="text-xl">🛵</span>
      <span>Deliveries</span>
      {count > 0 && (
        <span className="bg-sauce text-white text-[10px] font-bold min-w-[1.1rem] h-[1.1rem] rounded-full flex items-center justify-center px-1 animate-pulse motion-reduce:animate-none">
          {count}
        </span>
      )}
    </Link>
  );
}