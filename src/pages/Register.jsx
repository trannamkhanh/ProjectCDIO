import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import {
  Leaf,
  Mail,
  Lock,
  User,
  MapPin,
  Store,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "buyer",
    storeName: "", // For sellers
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.role === "seller" && !formData.storeName) {
      setError("Store name is required for sellers");
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        storeName: formData.storeName,
      });

      setLoading(false);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          // Auto redirect to dashboard after successful registration
          switch (formData.role) {
            case "admin":
              navigate("/admin-dashboard");
              break;
            case "seller":
              navigate("/seller-dashboard");
              break;
            case "buyer":
            default:
              navigate("/marketplace");
              break;
          }
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setLoading(false);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 border-4 border-primary-700 rounded-md">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join FoodRescue today</p>
        </div>

        {/* Register Form */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start space-x-2 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-3 flex items-start space-x-2 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  Registration successful! Redirecting to login...
                </p>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Account Type:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "buyer" })}
                  className={`p-4 border-2 text-center transition rounded-md ${
                    formData.role === "buyer"
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
                >
                  <User className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="font-semibold text-gray-900">Buyer</p>
                  <p className="text-xs text-gray-500 mt-1">Shop rescue food</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "seller" })}
                  className={`p-4 border-2 text-center transition rounded-md ${
                    formData.role === "seller"
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
                >
                  <Store className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="font-semibold text-gray-900">Seller</p>
                  <p className="text-xs text-gray-500 mt-1">
                    List surplus food
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+84 123 456 789"
                required
                className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City"
                  required
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Store Name (for sellers only) */}
            {formData.role === "seller" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="My Bakery Shop"
                    required
                    className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                  />
                  <Store className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2.5 border-b-4 border-primary-800 hover:border-primary-900 disabled:border-gray-500 transition rounded-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold border-b-2 border-primary-600 hover:border-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
