// import { useEffect, useRef, useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// type Item = { to: string; label: string; icon: string; end?: boolean; badge?: number };

// // Routes jo abhi bane nahi hain (customers, payments, ...) unke pages baad me add kar lena
// const NAV: Item[] = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
//   { to: "/admin/orders", label: "Orders", icon: "📋" },
//   { to: "/admin", label: "Menu Management", icon: "🍴", end: true },
//   { to: "/admin/coupons", label: "Coupons", icon: "🏷️" },
//   { to: "/admin/customers", label: "Customers", icon: "👥" },
//   { to: "/admin/delivery-partners", label: "Delivery Partners", icon: "🛵" },
//    { to: "/admin/offer", label: "Offers", icon: "💳" },
//   { to: "/admin/payments", label: "Payments", icon: "💳" },
//   { to: "/admin/reports", label: "Reports", icon: "📊" },
//   { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
//   { to: "/admin/notifications", label: "Notifications", icon: "🔔" },
//   { to: "/admin/settings", label: "Settings", icon: "⚙️" },
// ];

// export default function AdminLayout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [drawer, setDrawer] = useState(false);
//   const [menu, setMenu] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const onClick = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   const email = (user as { email?: string } | null)?.email ?? "";
//   const name = user?.name ?? "Admin";

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const sidebar = (
//     <nav className="flex flex-col gap-1 p-3">
//       {NAV.map((i) => (
//         <NavLink
//           key={i.to}
//           to={i.to}
//           end={i.end}
//           onClick={() => setDrawer(false)}
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
//               isActive ? "bg-sauce text-white shadow" : "text-ink/80 hover:bg-ink/5"
//             }`
//           }
//         >
//           <span className="text-base w-5 text-center">{i.icon}</span>
//           <span className="flex-1">{i.label}</span>
//           {i.badge ? (
//             <span className="bg-ink/10 text-ink text-xs font-bold rounded-full px-2 py-0.5">{i.badge}</span>
//           ) : null}
//         </NavLink>
//       ))}
//     </nav>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar — desktop */}
//       <aside className="hidden lg:block w-60 shrink-0 bg-white border-r border-ink/10 sticky top-0 h-screen overflow-y-auto">
//         <div className="px-5 pt-5 pb-2 text-xl font-extrabold tracking-tight">
//           Hungry<span className="text-sauce">Kart</span>
//         </div>
//         {sidebar}
//       </aside>

//       {/* Sidebar — mobile drawer */}
//       {drawer && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           <div className="w-64 bg-white h-full overflow-y-auto">
//             <div className="px-5 pt-5 pb-2 text-xl font-extrabold">
//               Hungry<span className="text-sauce">Kart</span>
//             </div>
//             {sidebar}
//           </div>
//           <div className="flex-1 bg-black/40" onClick={() => setDrawer(false)} />
//         </div>
//       )}

//       <div className="flex-1 min-w-0 flex flex-col">
//         {/* Top bar */}
//         <header className="flex items-center justify-between px-4 sm:px-6 py-3">
//           <button
//             className="lg:hidden border-2 border-ink rounded-md px-3 py-1 font-bold"
//             onClick={() => setDrawer(true)}
//             aria-label="Open menu"
//           >
//             ☰
//           </button>
//           <div className="ml-auto relative" ref={menuRef}>
//             <button
//               onClick={() => setMenu(!menu)}
//               className="flex items-center gap-2 bg-white rounded-full border border-ink/10 pl-1 pr-3 py-1 shadow-sm"
//             >
//               <span className="w-8 h-8 rounded-full bg-sauce text-white font-bold flex items-center justify-center">
//                 {name.charAt(0).toUpperCase()}
//               </span>
//               <span className="hidden sm:block text-left leading-tight">
//                 <span className="block text-xs font-bold">{name}</span>
//                 {email && <span className="block text-[10px] text-ink/50">{email}</span>}
//               </span>
//               <span className="text-xs">▾</span>
//             </button>

//             {menu && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-ink/10 py-2 z-50">
//                 <div className="px-4 pb-2 mb-1 border-b border-ink/10">
//                   <div className="text-sm font-bold">{name}</div>
//                   {email && <div className="text-xs text-ink/50">{email}</div>}
//                 </div>
//                 <button
//                   onClick={() => { setMenu(false); navigate("/admin/profile"); }}
//                   className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
//                 >
//                   👤 Profile
//                 </button>
//                 <button
//                   onClick={() => { setMenu(false); navigate("/admin/settings"); }}
//                   className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
//                 >
//                   ⚙️ Settings
//                 </button>
//                 <button
//                   onClick={() => { setMenu(false); navigate("/admin/branches"); }}
//                   className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
//                 >
//                   🔁 Switch Branch
//                 </button>
//                 <div className="border-t border-ink/10 mt-1 pt-1">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-sm font-semibold text-sauce hover:bg-ink/5"
//                   >
//                     ⎋ Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>

//         <main className="flex-1 px-4 sm:px-6 pb-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Item = { to: string; label: string; icon: string; end?: boolean; badge?: number };

// Routes jo abhi bane nahi hain (customers, payments, ...) unke pages baad me add kar lena
const NAV: Item[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/admin/orders", label: "Orders", icon: "📋" },
  { to: "/admin", label: "Menu Management", icon: "🍴", end: true },
  { to: "/admin/coupons", label: "Coupons", icon: "🏷️" },
  { to: "/admin/customers", label: "Customers", icon: "👥" },
  { to: "/admin/delivery-partners", label: "Delivery Partners", icon: "🛵" },
  { to: "/admin/offers", label: "Offers", icon: "🎁" }, // route /admin/offers (plural), icon payments se alag
  { to: "/admin/payments", label: "Payments", icon: "💳" },
  { to: "/admin/reports", label: "Reports", icon: "📊" },
  { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { to: "/admin/notifications", label: "Notifications", icon: "🔔" },
  { to: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Drawer khula ho to background scroll band
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const email = (user as { email?: string } | null)?.email ?? "";
  const name = user?.name ?? "Admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebar = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.end}
          onClick={() => setDrawer(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isActive ? "bg-sauce text-white shadow" : "text-ink/80 hover:bg-ink/5"
            }`
          }
        >
          <span className="text-base w-5 text-center">{i.icon}</span>
          <span className="flex-1">{i.label}</span>
          {i.badge ? (
            <span className="bg-ink/10 text-ink text-xs font-bold rounded-full px-2 py-0.5">{i.badge}</span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:block w-60 shrink-0 bg-white border-r border-ink/10 sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 pt-5 pb-2 text-xl font-extrabold tracking-tight">
          Hungry<span className="text-sauce">Kart</span>
        </div>
        {sidebar}
      </aside>

      {/* Sidebar — mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full overflow-y-auto">
            <div className="px-5 pt-5 pb-2 text-xl font-extrabold">
              Hungry<span className="text-sauce">Kart</span>
            </div>
            {sidebar}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setDrawer(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3">
          <button
            className="lg:hidden border-2 border-ink rounded-md px-3 py-1 font-bold"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="ml-auto relative" ref={menuRef}>
            <button
              onClick={() => setMenu(!menu)}
              className="flex items-center gap-2 bg-white rounded-full border border-ink/10 pl-1 pr-3 py-1 shadow-sm"
            >
              <span className="w-8 h-8 rounded-full bg-sauce text-white font-bold flex items-center justify-center">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-bold">{name}</span>
                {email && <span className="block text-[10px] text-ink/50">{email}</span>}
              </span>
              <span className="text-xs">▾</span>
            </button>

            {menu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-ink/10 py-2 z-50">
                <div className="px-4 pb-2 mb-1 border-b border-ink/10">
                  <div className="text-sm font-bold">{name}</div>
                  {email && <div className="text-xs text-ink/50">{email}</div>}
                </div>
                <button
                  onClick={() => { setMenu(false); navigate("/admin/profile"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => { setMenu(false); navigate("/admin/settings"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => { setMenu(false); navigate("/admin/branches"); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-ink/5"
                >
                  🔁 Switch Branch
                </button>
                <div className="border-t border-ink/10 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-sauce hover:bg-ink/5"
                  >
                    ⎋ Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}