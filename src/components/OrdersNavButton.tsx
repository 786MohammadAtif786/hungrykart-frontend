import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyOrders } from "../hooks/useMyorders";
import { isActive } from "../Ordertypes";
import "../css/Orders.css";

export default function OrdersNavButton() {
  const { token } = useAuth();
  const { orders, toast } = useMyOrders(token);

  if (!token) return null;
  const active = orders.filter((o) => isActive(o.status)).length;

  return (
    <div className="od-wrap">
      <Link to="/orders" className="od-btn" style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
        Orders
        {active > 0 && <span className="od-badge">{active}</span>}
      </Link>
      {toast && <div className="od-toast">{toast}</div>}
    </div>
  );
}