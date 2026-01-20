import React from "react";
import { useApp, useAuth } from "../../context/AppContext";
import Layout from "../../components/Layout";
import { Package, MapPin, Store, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const Orders = () => {
  const { orders, products } = useApp();
  const { currentUser } = useAuth();

  // Filter orders for current user
  const userOrders = orders
    .filter((order) => order.buyerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Helper function to get product details
  const getProductDetails = (productId) => {
    return products.find((p) => p.id === productId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "confirmed":
        return "Confirmed";
      case "ready":
        return "Ready for Pickup";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <Layout role="buyer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your rescue food orders
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start rescuing food from the marketplace!
            </p>
            <a
              href="/marketplace"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Browse Marketplace
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-400 transition"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Placed on{" "}
                        {format(
                          new Date(order.createdAt),
                          "MMM dd, yyyy 'at' h:mm a",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.products.map((item, index) => {
                      const productDetails = getProductDetails(item.productId);
                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0"
                        >
                          {productDetails && (
                            <>
                              <img
                                src={productDetails.image}
                                alt={item.productName}
                                className="h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.productName}
                                </h4>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <Store className="h-4 w-4 mr-1" />
                                  <span>{productDetails.storeName}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{productDetails.location}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </>
                          )}
                          {!productDetails && (
                            <>
                              <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.productName}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  Product no longer available
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pickup Info */}
                  {(order.status === "ready" ||
                    order.status === "completed") && (
                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900">
                            {order.status === "ready"
                              ? "Ready for Pickup!"
                              : "Order Completed"}
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            {order.status === "ready"
                              ? "Your order is ready. Please pick it up at the store location."
                              : "Thank you for rescuing food and reducing waste!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
