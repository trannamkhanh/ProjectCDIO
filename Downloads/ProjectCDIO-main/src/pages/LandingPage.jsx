import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  ShoppingBag,
  Store,
  TrendingDown,
  Heart,
  ArrowRight,
  Check,
  Users,
  Package,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-md shadow-lg hover:shadow-xl transition-shadow">
                <Leaf className="h-8 w-8 text-primary-600" />
              </div>
              <span className="text-2xl font-bold text-white hover:text-primary-100 transition-colors cursor-pointer">
                FoodRescue
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="text-white hover:text-primary-100 font-medium transition hidden md:inline-block border-b-2 border-transparent hover:border-white pb-1"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-600 px-6 py-2.5 rounded-md font-medium hover:bg-gray-100 transition shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white pt-12 lg:pt-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Save Food.
                <br />
                Save Money.
                <br />
                <span className="text-accent-300">Save Planet.</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-xl">
                Rescue delicious near-expiry food at up to 70% off. Fight food
                waste while saving money! 🎉
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-accent-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-accent-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Start Rescuing Food
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-primary-600 border-2 border-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="hover:scale-105 transition-transform cursor-default">
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-primary-100 text-sm">Active Users</p>
                </div>
                <div className="hover:scale-105 transition-transform cursor-default">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-primary-100 text-sm">Partner Stores</p>
                </div>
                <div className="hover:scale-105 transition-transform cursor-default">
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-primary-100 text-sm">Meals Saved</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden lg:block overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop"
                alt="Fresh Food"
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Rescue food in 3 simple steps and make a difference today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-transparent hover:border-primary-600 p-4 -m-4 transition-all hover:shadow-md rounded-lg">
            <div className="overflow-hidden mb-4 rounded-md">
              <img
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=250&fit=crop"
                alt="Browse Food"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Browse & Discover
            </h3>
            <p className="text-gray-600">
              Explore rescue food from local stores with amazing discounts
            </p>
          </div>

          <div className="border-2 border-transparent hover:border-accent-500 p-4 -m-4 transition-all hover:shadow-md rounded-lg">
            <div className="overflow-hidden mb-4 rounded-md">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
                alt="Reserve Food"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-accent-500 text-white w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Reserve & Pay
            </h3>
            <p className="text-gray-600">
              Add items to cart and checkout securely
            </p>
          </div>

          <div className="border-2 border-transparent hover:border-primary-600 p-4 -m-4 transition-all hover:shadow-md rounded-lg">
            <div className="overflow-hidden mb-4 rounded-md">
              <img
                src="https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400&h=250&fit=crop"
                alt="Pickup Food"
                className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center mb-3">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              Pickup & Enjoy
            </h3>
            <p className="text-gray-600">
              Show your QR code and collect your food
            </p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing deals across all food types
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cursor-pointer shadow hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop"
                  alt="Bakery"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="bg-white p-3 text-center">
                <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  Bakery
                </h3>
              </div>
            </div>

            <div className="cursor-pointer shadow hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop"
                  alt="Fresh Produce"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="bg-white p-3 text-center">
                <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  Fresh Produce
                </h3>
              </div>
            </div>

            <div className="cursor-pointer shadow hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop"
                  alt="Meat & Dairy"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="bg-white p-3 text-center">
                <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  Meat & Dairy
                </h3>
              </div>
            </div>

            <div className="cursor-pointer shadow hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"
                  alt="Ready Meals"
                  className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="bg-white p-3 text-center">
                <h3 className="font-bold text-gray-900 hover:text-primary-600 transition-colors">
                  Ready Meals
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Our Impact Together 🌟
                </h2>
                <p className="text-xl text-primary-100 mb-8">
                  Join thousands making a real difference in fighting food waste
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform">
                    <div className="bg-white/20 p-3 rounded-md hover:bg-white/30 transition-colors">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">10,000+</p>
                      <p className="text-primary-100">Happy Food Rescuers</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform">
                    <div className="bg-white/20 p-3 rounded-md hover:bg-white/30 transition-colors">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">50,000+</p>
                      <p className="text-primary-100">
                        Meals Rescued from Waste
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 hover:translate-x-2 transition-transform">
                    <div className="bg-white/20 p-3 rounded-md hover:bg-white/30 transition-colors">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">75 tons</p>
                      <p className="text-primary-100">
                        CO2 Emissions Prevented
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    to="/register"
                    className="inline-block bg-accent-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-accent-600 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Start Your Impact
                  </Link>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop"
                  alt="Community Impact"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white mb-8">
            Join our community and start saving food today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-accent-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white/20 transition-all transform hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-bold">FoodRescue</span>
          </div>
          <p className="text-gray-400">
            © 2026 FoodRescue. All rights reserved. Fighting food waste
            together.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
