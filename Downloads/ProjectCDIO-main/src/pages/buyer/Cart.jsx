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

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCompleteOrder = () => {
    // If online payment, show payment modal
    if (paymentMethod !== "cash") {
      setShowPaymentModal(true);
      // Simulate payment processing
      setTimeout(() => {
        processOrder();
      }, 2000);
    } else {
      processOrder();
    }
  };

  const processOrder = () => {
    // Create order
    const order = createOrder({
      buyerId: currentUser.id,
      products: cart.map((item) => ({
        productId: item.id,
        quantity: item.cartQuantity,
        price: item.rescuePrice,
      })),
      total: getCartTotal(),
      sellerId: cart[0]?.sellerId, // Simplified - assuming one seller
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
    });

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

            {/* Dummy QR Code */}
            <div className="bg-gray-100 p-8 border-2 border-gray-200 mb-6 inline-block rounded-lg">
              <QrCode className="h-48 w-48 text-gray-800" />
              <p className="text-sm font-mono mt-4 text-gray-600">
                Order #{orderDetails?.id}
              </p>
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 p-6 mb-6 text-left rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4">Pickup Details</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Store className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {cart[0]?.storeName}
                    </p>
                    <p className="text-sm text-gray-600">{cart[0]?.location}</p>
                  </div>
                </div>
                <div className="border-t border-primary-200 pt-3">
                  <p className="text-sm text-gray-600">
                    {paymentMethod === "cash" ? "Total to Pay" : "Total Paid"}
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${orderDetails?.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment:{" "}
                    {paymentMethod === "cash"
                      ? "Cash on Pickup"
                      : paymentMethod === "card"
                        ? "Credit Card"
                        : paymentMethod === "ewallet"
                          ? "E-Wallet"
                          : "QR Code"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/marketplace")}
                className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md"
              >
                Back to Marketplace
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
                <p className="font-semibold">
                  ${(item.rescuePrice * item.cartQuantity).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="flex justify-between pt-4 text-xl font-bold">
              <span>Total</span>
              <span className="text-primary-600">
                ${getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* Cash on Pickup */}
              <label
                className={`flex items-center p-4 border-2 cursor-pointer transition rounded-md ${
                  paymentMethod === "cash"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Store className="h-5 w-5 text-gray-700 mr-3" />
                <div>
                  <p className="font-medium">Pay on Pickup</p>
                  <p className="text-sm text-gray-600">
                    Pay when collecting your order
                  </p>
                </div>
              </label>

              {/* Credit/Debit Card */}
              <label
                className={`flex items-center p-4 border-2 cursor-pointer transition rounded-md ${
                  paymentMethod === "card"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-gray-700 mr-3" />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">
                    Pay online with Visa, Mastercard
                  </p>
                </div>
              </label>

              {/* E-Wallet */}
              <label
                className={`flex items-center p-4 border-2 cursor-pointer transition rounded-md ${
                  paymentMethod === "ewallet"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="ewallet"
                  checked={paymentMethod === "ewallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Wallet className="h-5 w-5 text-gray-700 mr-3" />
                <div>
                  <p className="font-medium">E-Wallet</p>
                  <p className="text-sm text-gray-600">Momo, ZaloPay, VNPay</p>
                </div>
              </label>

              {/* Banking QR Code */}
              <label
                className={`flex items-center p-4 border-2 cursor-pointer transition rounded-md ${
                  paymentMethod === "qr"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="qr"
                  checked={paymentMethod === "qr"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <Smartphone className="h-5 w-5 text-gray-700 mr-3" />
                <div>
                  <p className="font-medium">Banking QR Code</p>
                  <p className="text-sm text-gray-600">
                    Scan QR to pay via banking app
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Processing Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white border-2 border-gray-300 shadow-md p-8 max-w-md w-full mx-4 rounded-lg">
                <div className="text-center">
                  <div className="bg-primary-100 h-20 w-20 flex items-center justify-center mx-auto mb-4 rounded-md">
                    {paymentMethod === "qr" ? (
                      <QrCode className="h-10 w-10 text-primary-600" />
                    ) : paymentMethod === "card" ? (
                      <CreditCard className="h-10 w-10 text-primary-600" />
                    ) : (
                      <Wallet className="h-10 w-10 text-primary-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {paymentMethod === "qr" &&
                      "Scan the QR code to complete payment"}
                    {paymentMethod === "card" && "Processing your card payment"}
                    {paymentMethod === "ewallet" && "Redirecting to e-wallet"}
                  </p>
                  {paymentMethod === "qr" && (
                    <div className="bg-gray-100 p-6 border-2 border-gray-200 mb-4 inline-block rounded-lg">
                      <QrCode className="h-32 w-32 text-gray-800" />
                      <p className="text-sm font-mono mt-2 text-gray-600">
                        ${getCartTotal().toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2 justify-center">
                    <div className="h-2 w-2 bg-primary-600 rounded-md"></div>
                    <div className="h-2 w-2 bg-primary-600 rounded-md"></div>
                    <div className="h-2 w-2 bg-primary-600 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                key={item.id}
                className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg"
              >
                <div className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.storeName}
                    </p>
                    <p className="text-xl font-bold text-primary-600">
                      ${item.rescuePrice.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.cartQuantity, -1)
                      }
                      className="bg-gray-100 p-2 border-2 border-gray-300 hover:bg-gray-200 transition rounded-md"
                      disabled={item.cartQuantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.cartQuantity, 1)
                      }
                      className="bg-gray-100 p-2 border-2 border-gray-300 hover:bg-gray-200 transition rounded-md"
                      disabled={item.cartQuantity >= item.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.rescuePrice * item.cartQuantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 shadow-md p-6 sticky top-20 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2 rounded-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate("/marketplace")}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
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
