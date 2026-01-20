import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, useAuth } from "../../context/AppContext";
import Layout from "../../components/Layout";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  MapPin,
  Store,
  Plus,
  Minus,
  Filter,
  Grid,
  List,
} from "lucide-react";

const Marketplace = () => {
  const { products, addToCart, searchQuery } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Filter active products only
  const activeProducts = products.filter((p) => p.status === "active");

  // Get unique categories
  const categories = ["all", ...new Set(activeProducts.map((p) => p.category))];

  // Filter products
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.storeName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, selectedCategory, searchQuery]);

  const getExpiryInfo = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const hoursLeft = Math.floor((expiry - now) / (1000 * 60 * 60));

    if (hoursLeft < 0)
      return {
        text: "Expired",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
      };
    if (hoursLeft < 6)
      return {
        text: `${hoursLeft}h left`,
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    if (hoursLeft < 24)
      return {
        text: `${hoursLeft}h left`,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      };
    return {
      text: `${hoursLeft}h left`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    };
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show a simple toast or notification (simplified)
    alert(`${product.name} added to cart!`);
  };

  const ProductCard = ({ product }) => {
    const expiryInfo = getExpiryInfo(product.expiryDate);
    const discountPercent = Math.round(
      ((product.originalPrice - product.rescuePrice) / product.originalPrice) *
        100,
    );

    return (
      <div className="bg-white border-2 border-gray-200 overflow-hidden hover:border-primary-600 transition rounded-lg">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 font-bold text-sm rounded-md">
            -{discountPercent}%
          </div>
          <div
            className={`absolute top-2 left-2 ${expiryInfo.bgColor} ${expiryInfo.color} px-2 py-1 font-semibold text-xs flex items-center space-x-1 rounded-md`}
          >
            <Clock className="h-4 w-4" />
            <span>{expiryInfo.text}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Store className="h-4 w-4 mr-1" />
            <span>{product.storeName}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{product.location}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-between mb-4 border-t-2 border-gray-100 pt-3">
            <div>
              <p className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
              <p className="text-xl font-bold text-primary-600">
                ${product.rescuePrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Stock</p>
              <p className="text-base font-bold text-gray-900">
                {product.quantity}
              </p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.quantity === 0}
            className="w-full bg-primary-600 text-white py-2.5 font-semibold hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed border-b-4 border-primary-800 hover:border-primary-900 disabled:border-gray-400 rounded-md"
          >
            {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout type="buyer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 border-b-4 border-primary-600 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Rescue Food Marketplace
          </h1>
          <p className="text-gray-600 text-sm">Save money and reduce waste</p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 p-4 mb-6 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 font-semibold whitespace-nowrap transition border-2 rounded-md ${
                      selectedCategory === category
                        ? "bg-primary-600 text-white border-primary-800"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 border-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white border-primary-800"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white border-primary-800"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border-2 border-gray-200 bg-gray-50 rounded-lg">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
