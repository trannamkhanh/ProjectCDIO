import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, useApp } from "../context/AppContext";
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Shield,
  Menu,
  X,
} from "lucide-react";

// Buyer Navbar
export const BuyerNavbar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartCount } = useApp();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/marketplace" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-primary-700">
              FoodRescue
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for rescue food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  {currentUser?.name?.charAt(0) || "U"}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {currentUser?.name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                  <Link
                    to="/marketplace"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Marketplace
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Seller/Admin Sidebar
export const Sidebar = ({ role }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sellerMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/seller-dashboard" },
    { icon: Package, label: "Inventory", path: "/seller-dashboard" },
    { icon: ShoppingBag, label: "Orders", path: "/seller-orders" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin-dashboard" },
    { icon: Users, label: "Users", path: "/admin-users" },
    { icon: Shield, label: "Products", path: "/admin-products" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : sellerMenuItems;

  return (
    <div
      className={`bg-gradient-to-b from-primary-800 to-primary-900 text-white h-screen sticky top-0 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-primary-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8" />
            <span className="text-xl font-bold">FoodRescue</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-primary-700 rounded-lg"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 bg-primary-700 rounded-lg mb-6">
          <div className="h-10 w-10 rounded-full bg-white text-primary-800 flex items-center justify-center font-bold">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-xs text-primary-200 capitalize">
                {currentUser?.role}
              </p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-primary-800"
                    : "hover:bg-primary-700 text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

// Main Layout Component
const Layout = ({ children, type = "buyer" }) => {
  const { currentUser } = useAuth();

  if (type === "buyer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <main>{children}</main>
      </div>
    );
  }

  // Seller or Admin Layout
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={currentUser?.role} />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout;
