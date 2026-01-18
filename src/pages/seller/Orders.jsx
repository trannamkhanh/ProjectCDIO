import React, { useState, useMemo } from "react";
import { useApp, useAuth } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const { orders } = useApp();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders for current seller
  const sellerOrders = useMemo(() => {
    return orders.filter((order) => order.sellerId === currentUser.id);
  }, [orders, currentUser.id]);

  // Apply filters
  const filteredOrders = useMemo(() => {
    let filtered = sellerOrders;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          order.buyerName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [sellerOrders, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: sellerOrders.length,
      pending: sellerOrders.filter((o) => o.status === "pending").length,
      completed: sellerOrders.filter((o) => o.status === "completed").length,
      cancelled: sellerOrders.filter((o) => o.status === "cancelled").length,
    };
  }, [sellerOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-orange-100 text-orange-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-md ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Layout type="seller">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage customer orders and pickups</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Orders</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-md">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-sm text-gray-600 mt-1">Pending Pickup</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.completed}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-md">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.cancelled}
            </p>
            <p className="text-sm text-gray-600 mt-1">Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 shadow-md p-12 text-center rounded-lg">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Orders will appear here when customers make purchases"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border-2 border-gray-200 shadow-md p-6 hover:shadow-lg transition rounded-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-md">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(order.createdAt),
                              "MMM dd, yyyy HH:mm",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 border-2 border-gray-200 p-4 mb-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{order.buyerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{order.buyerPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {order.buyerAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {order.products.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm border-b border-gray-200 pb-2"
                      >
                        <div>
                          <span className="font-medium text-gray-900">
                            {item.productName}
                          </span>
                          <span className="text-gray-600 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Info */}
                {order.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {order.paymentMethod === "cash"
                          ? "Cash on Pickup"
                          : order.paymentMethod === "card"
                            ? "Credit Card"
                            : order.paymentMethod === "ewallet"
                              ? "E-Wallet"
                              : "QR Code"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Payment Status:</span>
                      <span
                        className={`font-medium ${
                          order.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {order.status === "pending" && (
                  <div className="flex space-x-3 mt-4">
                    <button className="flex-1 bg-green-600 text-white py-2 border-b-4 border-green-800 font-semibold hover:bg-green-700 transition rounded-md">
                      Mark as Completed
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-2 border-b-4 border-red-800 font-semibold hover:bg-red-700 transition rounded-md">
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
