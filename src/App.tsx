
// import { Navigate, Outlet, Route, Routes } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import AdminRoute from "./components/AdminRoute";
// import AdminLayout from "./components/Adminlayout";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Admin from "./pages/Admin";
// import CartDrawer from "./components/CartDrawer";
// import Checkout from "./pages/Checkout";
// import AdminOrders from "./pages/AdminOrders";
// import MyOrders from "./pages/Myorders";
// import DeliveryOrders from "./pages/Deliveryorders";
// import Footer from "./components/Footer";
// import AdminCoupons from "./pages/AdminCoupons";
// import AdminDashboard from "./pages/Admindashboard";
// import AdminDeliveryPartners from "./pages/Admindeliverypartners";

// // Customer / rider side: Navbar + Cart + Footer
// function PublicLayout() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <CartDrawer />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* Admin panel: sidebar layout, na Navbar na Footer */}
//       <Route
//         path="/admin"
//         element={
//           <AdminRoute>
//             <AdminLayout />
//           </AdminRoute>
//         }
//       >
//         <Route index element={<Admin />} /> {/* Menu Management */}
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="orders" element={<AdminOrders />} />
//         <Route path="coupons" element={<AdminCoupons />} />
//         <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
//         {/* Jo pages abhi bane nahi, unhe dashboard pe bhej do */}
//         <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
//       </Route>

//       {/* Customer / rider side */}
//       <Route element={<PublicLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/orders" element={<MyOrders />} />
//         <Route path="/delivery" element={<DeliveryOrders />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Route>
//     </Routes>
//   );
// }



import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/Adminlayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import MyOrders from "./pages/Myorders";
import DeliveryOrders from "./pages/Deliveryorders";
import Footer from "./components/Footer";
import AdminCoupons from "./pages/AdminCoupons";
import AdminDashboard from "./pages/Admindashboard";
import AdminDeliveryPartners from "./pages/Admindeliverypartners";
// import ApplyOfferBox from "./pages/Applyofferbox";
import OffersPage from './pages/admin/OffersPage';
import ProductDetails from "./pages/ProductDetails";



// Customer / rider side: Navbar + Cart + Footer
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin panel: sidebar layout, na Navbar na Footer */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Admin />} /> {/* Menu Management */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
        {/* <Route path="offers" element={<ApplyOfferBox items={[]} />} /> */}
        {/* Jo pages abhi bane nahi, unhe dashboard pe bhej do */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/offers" element={<OffersPage />} />

      </Route>

      {/* Customer / rider side */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/delivery" element={<DeliveryOrders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}