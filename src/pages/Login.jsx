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

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && currentUser) {
      redirectUser(currentUser);
    }
  }, [isAuthenticated, currentUser]);

  const redirectUser = (user) => {
    switch (user.role) {
      case "admin":
        navigate("/admin-dashboard", { replace: true });
        break;
      case "seller":
        navigate("/seller-dashboard", { replace: true });
        break;
      case "buyer":
      default:
        navigate("/marketplace", { replace: true });
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = login(email, password);

    setTimeout(() => {
      setLoading(false);
      if (result.success) {
        redirectUser(result.user);
      } else {
        setError(result.message);
      }
    }, 500);
  };

  const quickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
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

        {/* Login Form */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start space-x-2 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 pl-10 border-2 border-gray-300 focus:outline-none focus:border-primary-600 rounded-md"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 font-semibold hover:bg-primary-700 transition border-b-4 border-primary-800 hover:border-primary-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Quick Login for Demo:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin("buyer@test.com", "123456")}
                className="w-full px-4 py-2 bg-primary-50 border-2 border-primary-600 text-primary-700 hover:bg-primary-100 transition text-sm font-medium rounded-md"
              >
                Login as Buyer
              </button>
              <button
                onClick={() => quickLogin("seller@test.com", "123456")}
                className="w-full px-4 py-2 bg-accent-50 border-2 border-accent-600 text-accent-700 hover:bg-accent-100 transition text-sm font-medium rounded-md"
              >
                Login as Seller
              </button>
              <button
                onClick={() => quickLogin("admin@admin.com", "admin")}
                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-600 text-gray-700 hover:bg-gray-100 transition text-sm font-medium rounded-md"
              >
                Login as Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-semibold border-b-2 border-primary-600 hover:border-primary-700"
              >
                Register now
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-800 border-b border-gray-400 hover:border-gray-800"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
