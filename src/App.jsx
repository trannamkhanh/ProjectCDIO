import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Buyer
import Marketplace from "./pages/buyer/Marketplace";
import Cart from "./pages/buyer/Cart";
import BuyerOrders from "./pages/buyer/Orders";

// Seller
import SellerDashboard from "./pages/seller/Dashboard";
import SellerOrders from "./pages/seller/Orders";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProducts from "./pages/admin/Products";

// Common
import Forbidden from "./pages/Forbidden"; // 👈 thêm

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= BUYER ================= */}
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <Marketplace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <BuyerOrders />
                </ProtectedRoute>
              }
            />

            {/* ================= SELLER ================= */}
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/seller-orders"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerOrders />
                </ProtectedRoute>
              }
            />

            {/* ================= ADMIN ================= */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-products"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />

            {/* ================= FORBIDDEN ================= */}
            <Route path="/403" element={<Forbidden />} />

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
