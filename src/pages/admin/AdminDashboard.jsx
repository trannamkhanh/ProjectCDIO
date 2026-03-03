import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  UserCheck,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const {
    users,
    products,
    getStats,
    deleteUser,
    verifyUser,
    deleteProductByAdmin,
  } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, users, products

  const stats = getStats();

  // Filter users (exclude admin)
  const buyers = users.filter((u) => u.role === "buyer");
  const sellers = users.filter((u) => u.role === "seller");

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      deleteUser(userId);
    }
  };

  const handleVerifySeller = (userId) => {
    verifyUser(userId);
  };

  const handleDeleteProduct = (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      deleteProductByAdmin(productId);
    }
  };

  return (
    <Layout type="admin">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage the FoodRescue platform
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              activeTab === "dashboard"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              activeTab === "users"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-medium transition border-b-2 ${
              activeTab === "products"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Product Moderation
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border-2 border-blue-200 shadow-md p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-10 w-10 text-blue-600" />
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-gray-700">Total Users</p>
                <p className="text-xs text-gray-600 mt-2">
                  {stats.totalBuyers} Buyers • {stats.totalSellers} Sellers
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 shadow-md p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-10 w-10 text-green-600" />
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-900">
                  {stats.totalProducts}
                </p>
                <p className="text-sm text-gray-700">Total Products</p>
                <p className="text-xs text-gray-600 mt-2">
                  {stats.activeProducts} Active Listings
                </p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 shadow-md p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-10 w-10 text-purple-600" />
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-900">
                  ${stats.totalRevenue.toFixed(0)}
                </p>
                <p className="text-sm text-gray-700">Total Revenue</p>
                <p className="text-xs text-gray-600 mt-2">
                  {stats.totalOrders} Orders Completed
                </p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 shadow-md p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-10 w-10 text-orange-600" />
                  <CheckCircle className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-3xl font-bold mb-1 text-gray-900">
                  {stats.foodRescued}
                </p>
                <p className="text-sm text-gray-700">Food Items Rescued</p>
                <p className="text-xs text-gray-600 mt-2">
                  Fighting Food Waste
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Platform Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Buyers</span>
                    <span className="font-semibold text-gray-900">
                      {buyers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Verified Sellers</span>
                    <span className="font-semibold text-gray-900">
                      {sellers.filter((s) => s.verified).length}/
                      {sellers.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Products</span>
                    <span className="font-semibold text-gray-900">
                      {products.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Discount</span>
                    <span className="font-semibold text-green-600">
                      {products.length > 0
                        ? Math.round(
                            products.reduce(
                              (sum, p) =>
                                sum +
                                ((p.originalPrice - p.rescuePrice) /
                                  p.originalPrice) *
                                  100,
                              0,
                            ) / products.length,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        System Running Smoothly
                      </p>
                      <p className="text-xs text-gray-500">
                        All services operational
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats.totalUsers} Active Users
                      </p>
                      <p className="text-xs text-gray-500">
                        Platform engagement is high
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-md">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stats.activeProducts} Active Listings
                      </p>
                      <p className="text-xs text-gray-500">
                        Products available for rescue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white border-2 border-gray-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                User Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage buyers and sellers on the platform
              </p>
            </div>

            {/* Buyers Section */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Buyers ({buyers.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {buyers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-primary-500 flex items-center justify-center text-white font-semibold rounded-md">
                              {user.name.charAt(0)}
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-4 py-2 font-medium transition bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sellers Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sellers ({sellers.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Store
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Verified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sellers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-accent-500 flex items-center justify-center text-white font-semibold rounded-md">
                              {user.name.charAt(0)}
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.storeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                              user.verified
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          {!user.verified && (
                            <button
                              onClick={() => handleVerifySeller(user.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-medium rounded-md"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 font-medium transition bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white border-2 border-gray-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Product Moderation
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Monitor and moderate all products across the platform
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.storeName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {users.find((u) => u.id === product.sellerId)?.name ||
                          "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-500 line-through text-xs">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                          <p className="text-primary-600 font-semibold">
                            ${product.rescuePrice.toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-4 py-2 font-medium transition bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
