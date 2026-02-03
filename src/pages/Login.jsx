import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { Leaf, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  // Nếu đã login thì auto redirect
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      redirectByRole(currentUser.role);
    }
  }, [isAuthenticated, currentUser]);

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard", { replace: true });
        break;
      case "seller":
        navigate("/seller-dashboard", { replace: true });
        break;
      default:
        navigate("/marketplace", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Login button clicked!", { email, password });
    setError("");
    setLoading(true);

    const result = await login(email, password);
    console.log("📊 Login result:", result);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    redirectByRole(result.role);
  };

  const quickLogin = (email, password) => {
    console.log("⚡ Quick login:", { email, password });
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 border-4 border-primary-700 rounded-md">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FoodRescue Login
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 flex gap-2 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 pl-10 border-2 rounded-md focus:border-primary-600 focus:outline-none"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pl-10 border-2 rounded-md focus:border-primary-600 focus:outline-none"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 font-semibold rounded-md border-b-4 border-primary-800 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Login */}
          <div className="mt-6 pt-6 border-t-2">
            <p className="text-sm mb-3 font-medium">Quick Login (Demo)</p>

            <div className="space-y-2">
              <button
                onClick={() => quickLogin("buyer1@cdio.com", "123456")}
                className="w-full py-2 border-2 rounded-md text-sm hover:bg-gray-100"
              >
                Login as Buyer
              </button>

              <button
                onClick={() => quickLogin("seller1@cdio.com", "123456")}
                className="w-full py-2 border-2 rounded-md text-sm hover:bg-gray-100"
              >
                Login as Seller
              </button>

              <button
                onClick={() => quickLogin("admin@cdio.com", "123456")}
                className="w-full py-2 border-2 rounded-md text-sm hover:bg-gray-100"
              >
                Login as Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold">
              Register
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-600">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
