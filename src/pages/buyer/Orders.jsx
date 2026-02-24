import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Search,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
} from "lucide-react";
import { formatMoney } from "../../utils/formatMoney";

const Orders = () => {
  const { orders } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        String(order.id).includes(searchQuery) ||
        order.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-5 w-5 text-yellow-500" />,
      completed: <CheckCircle className="h-5 w-5 text-green-500" />,
      cancelled: <AlertCircle className="h-5 w-5 text-red-500" />,
    };
    return icons[status] || <Package className="h-5 w-5 text-gray-500" />;
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  return (
    <Layout type="buyer">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">
            Track your rescue food purchases and orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-md">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {orderStats.total}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Orders</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-md">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {orderStats.pending}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {orderStats.completed}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-md">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {orderStats.cancelled}
            </p>
            <p className="text-sm text-gray-600 mt-1">Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline-block h-4 w-4 mr-2" />
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order ID or seller name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 shadow-md p-12 text-center rounded-lg">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {orders.length === 0
                ? "No orders yet"
                : "No orders matching your search"}
            </h3>
            <p className="text-gray-600">
              {orders.length === 0
                ? "Start rescuing food to place your first order"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border-2 border-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4 flex-1 text-left">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.seller?.name || "Unknown Seller"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* ✅ FIX: Dùng formatMoney */}
                    <p className="font-bold text-gray-900">
                      ${formatMoney(order.total || 0)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Eye className="h-5 w-5 text-gray-400 ml-4" />
                </button>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Items
                        </h4>
                        <div className="space-y-2 text-sm">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="text-gray-600">
                              {item.productName} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Details
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium text-gray-900">
                              Seller:
                            </span>{" "}
                            {order.seller?.name}
                          </p>
                          <p>
                            <span className="font-medium text-gray-900">
                              Location:
                            </span>{" "}
                            {order.shippingAddress}
                          </p>
                          <p>
                            <span className="font-medium text-gray-900">
                              Date:
                            </span>{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">
                          Total Amount:
                        </span>
                        {/* ✅ FIX: Dùng formatMoney */}
                        <span className="text-xl font-bold text-primary-600">
                          ${formatMoney(order.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;