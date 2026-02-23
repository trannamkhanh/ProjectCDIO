import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { formatMoney, formatTotal } from "../../utils/formatMoney";

const SellerOrders = () => {
  const { orders } = useApp();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-6 w-6 text-yellow-500" />,
      confirmed: <CheckCircle className="h-6 w-6 text-blue-500" />,
      shipped: <Truck className="h-6 w-6 text-purple-500" />,
      delivered: <CheckCircle className="h-6 w-6 text-green-500" />,
      cancelled: <XCircle className="h-6 w-6 text-red-500" />,
    };
    return icons[status] || <Clock className="h-6 w-6 text-gray-500" />;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status] || "bg-gray-100 text-gray-800"}`}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Track and manage all orders from your rescue food customers
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex gap-2">
          {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  statusFilter === status
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
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
                You don't have any orders yet. Once customers purchase your products,
                their orders will appear here.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
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
                  <div className="flex items-start space-x-4 flex-1 text-left">
                    {getStatusIcon(order.status)}
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
                          {/* ✅ FIX: Dùng formatMoney */}
                          <span className="font-semibold">
                            ${formatMoney(order.total || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 p-6 space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{order.customer?.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customer?.phone}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{order.customer?.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.products?.map((item, index) => (
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
                            {/* ✅ FIX: Dùng formatTotal */}
                            <span className="font-semibold text-gray-900">
                              ${formatTotal(item.price, item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                        <span className="font-bold text-gray-900">Total</span>
                        {/* ✅ FIX: Dùng formatMoney */}
                        <span className="text-xl font-bold text-primary-600">
                          ${formatMoney(order.total || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <button className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md">
                        Update Status
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md">
                        Contact Customer
                      </button>
                    </div>
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

export default SellerOrders;