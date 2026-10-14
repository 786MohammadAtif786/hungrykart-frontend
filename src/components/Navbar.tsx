
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../types";
import { formatPrice } from "./ProductCard";
import OrdersNavButton from "./OrdersNavButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, subtotal, openCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Role check: uppercase/lowercase ya delivery_boy / delivery / rider, sab chalega
  const role = String((user as { role?: string } | null)?.role ?? "").toLowerCase();
  const isRider = role.includes("deliver") || role.includes("rider");
  const admin = isAdmin(user);

  // Sirf customer (ya logged-out) cart / orders use kar sakta hai
  const canOrder = !admin && !isRider;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-ink">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-tight shrink-0">
          Hungry<span className="text-sauce">Kart</span>
        </Link>

        {/* Search — desktop */}
        <div className="hidden md:block md:w-56 lg:w-72 xl:w-80">
          <HeaderSearch />
        </div>

        {/* Customer ke liye Orders; rider ko Delivery */}
        {canOrder && <OrdersNavButton />}
        {isRider && (
          <Link
            to="/delivery"
            className="px-4 py-1.5 rounded-md border border-ink/30 font-semibold text-sm hover:bg-ink hover:text-white transition-colors"
          >
            Delivery
          </Link>
        )}

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-4 ml-auto">
          {canOrder && (
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative flex items-center gap-1.5 font-semibold text-sm hover:text-sauce transition-colors"
            >
              <span className="text-xl">🛒</span>
              <span className="hidden lg:inline">{formatPrice(subtotal)}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 left-3.5 bg-sauce text-white text-[10px] font-bold min-w-[1.1rem] h-[1.1rem] rounded-full flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </button>
          )}

          {admin && (
            <>
              <Link to="/admin/orders" className="font-semibold text-sm hover:text-sauce">
                Manage orders
              </Link>
              <Link to="/admin" className="font-semibold text-sm hover:text-sauce">
                Manage items
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-sm text-ink/70">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-md border border-ink/30 font-semibold text-sm hover:bg-ink hover:text-white transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-semibold text-sm hover:text-sauce">
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-sauce text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Hamburger — mobile */}
        <button
          className="md:hidden ml-auto border-2 border-ink rounded-md px-3 py-1.5 font-bold"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden w-full flex flex-col gap-3 pt-3 mt-1 border-t-2 border-ink/10">
            <HeaderSearch />

            {canOrder && (
              <button
                onClick={() => {
                  openCart();
                  setOpen(false);
                }}
                className="font-semibold text-left flex items-center gap-2"
              >
                🛒 Cart
                {count > 0 && (
                  <span className="bg-sauce text-white text-[10px] font-bold min-w-[1.1rem] h-[1.1rem] rounded-full flex items-center justify-center px-1">
                    {count}
                  </span>
                )}
                {subtotal > 0 && <span className="text-ink/50 text-sm">({formatPrice(subtotal)})</span>}
              </button>
            )}

            <Link to="/" onClick={() => setOpen(false)} className="font-semibold">Menu</Link>

            {isRider && (
              <Link to="/delivery" onClick={() => setOpen(false)} className="font-semibold">
                Delivery
              </Link>
            )}

            {admin && (
              <>
                <Link to="/admin/orders" onClick={() => setOpen(false)} className="font-semibold">
                  Manage orders
                </Link>
                <Link to="/admin" onClick={() => setOpen(false)} className="font-semibold">
                  Manage items
                </Link>
              </>
            )}

            {user ? (
              <>
                <span className="text-sm text-ink/70">Hi, {user.name}</span>
                <button onClick={handleLogout} className="font-semibold text-left text-sauce">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="font-semibold">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="font-semibold text-sauce">Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}