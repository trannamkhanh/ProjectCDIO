import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, useAuth } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  QrCode,
  CheckCircle,
  Store,
  MapPin,
  CreditCard,
  Wallet,
  Smartphone,
} from "lucide-react";
import { formatMoney, formatTotal } from "../../utils/formatMoney";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart,
    createOrder,
  } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleQuantityChange = (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateCartQuantity(itemId, newQty);
    }
  };

  const handleCompleteOrder = async () => {
    const order = await createOrder();

    setOrderDetails(order);
    setShowPaymentModal(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <Layout type="buyer">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border-2 border-gray-200 shadow-md p-8 text-center rounded-lg">
            <div className="bg-primary-100 h-20 w-20 flex items-center justify-center mx-auto mb-6 rounded-md">
              <CheckCircle className="h-12 w-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your rescue food has been reserved. Show this QR code to the
              seller when picking up.
            </p>

            {/* QR Code Display */}
            <div className="bg-white border-2 border-gray-200 p-8 rounded-lg inline-block mx-auto mb-8">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            </div>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-lg text-left mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-900">
                      #{orderDetails.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.items?.length || 0}
                    </span>
                  </div>
                  {/* ✅ FIX: Dùng formatMoney */}
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-primary-600">
                      ${formatMoney(orderDetails?.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentMethod === "cash"
                        ? "Cash on Pickup"
                        : paymentMethod === "card"
                          ? "Credit Card"
                          : paymentMethod === "ewallet"
                            ? "E-Wallet"
                            : "QR Code"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/marketplace")}
                className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
              >
                Print QR Code
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (showCheckout) {
    return (
      <Layout type="buyer">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-3 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.cartQuantity}
                  </p>
                </div>
                {/* ✅ FIX: Dùng formatTotal */}
                <p className="font-semibold">
                  ${formatTotal(item.price, item.cartQuantity)}
                </p>
              </div>
            ))}
            <div className="flex justify-between py-3 border-t-2 font-bold text-lg">
              <span>Total:</span>
              {/* ✅ FIX: Dùng formatMoney */}
              <span className="text-primary-600">
                ${formatMoney(getCartTotal())}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "cash", name: "Cash on Pickup", icon: CreditCard },
                { id: "card", name: "Credit Card", icon: CreditCard },
                { id: "ewallet", name: "E-Wallet", icon: Wallet },
                { id: "qrcode", name: "QR Code Payment", icon: QrCode },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <label key={method.id} className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <Icon className="h-5 w-5 ml-3 text-gray-600" />
                    <span className="ml-3 font-medium text-gray-900">
                      {method.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCheckout(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
            >
              Back to Cart
            </button>
            <button
              onClick={handleCompleteOrder}
              className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout type="buyer">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-gray-100 border-2 border-gray-200 h-32 w-32 flex items-center justify-center mx-auto mb-6 rounded-lg">
            <ShoppingCart className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Start rescuing food and saving money!
          </p>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-primary-600 text-white px-8 py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md"
          >
            Browse Marketplace
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout type="buyer">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart ({cart.length} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg"
              >
                <div className="flex space-x-4">
                  <img
                    src={
                      item.image_url
                      ? `${API_BASE_URL}${item.image_url}`
                      : "/placeholder-food.jpg"}
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.storeName}
                    </p>
                    {/* ✅ FIX: Dùng formatMoney */}
                    <p className="text-xl font-bold text-primary-600">
                      ${formatMoney(item.price || 0)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_name)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product_name, item.quantity, -1)
                      }
                      className="bg-gray-100 p-2 border-2 border-gray-300 hover:bg-gray-200 transition rounded-md"
                      disabled={item.quantity  <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product_id, item.quantity, 1)
                      }
                      className="bg-gray-100 p-2 border-2 border-gray-300 hover:bg-gray-200 transition rounded-md"
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {/* ✅ FIX: Dùng formatTotal */}
                  <p className="text-lg font-bold text-gray-900">
                    ${formatTotal(item.price, item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="h-fit">
            <div className="bg-white border-2 border-gray-200 shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  {/* ✅ FIX: Dùng formatMoney */}
                  <span className="font-semibold">
                    ${formatMoney(getCartTotal())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-$0.00</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  {/* ✅ FIX: Dùng formatMoney */}
                  <span className="text-xl font-bold text-primary-600">
                    ${formatMoney(getCartTotal())}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-primary-600 text-white py-3 border-b-4 border-primary-800 font-bold hover:bg-primary-700 transition rounded-md flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/marketplace")}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;