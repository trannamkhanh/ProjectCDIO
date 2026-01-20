import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Package,
  Search,
  Filter,
  Trash2,
  Store,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

const Products = () => {
  const { products, deleteProductByAdmin } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.storeName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered.sort(
      (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
    );
  }, [products, categoryFilter, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const urgentProducts = products.filter((p) => {
      const hoursLeft = Math.floor(
        (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60),
      );
      return hoursLeft < 24 && hoursLeft > 0;
    }).length;

    return {
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      urgent: urgentProducts,
      totalValue: products.reduce(
        (sum, p) => sum + p.rescuePrice * p.quantity,
        0,
      ),
    };
  }, [products]);

  const handleDeleteProduct = (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      )
    ) {
      deleteProductByAdmin(productId);
    }
  };

  const getExpiryStatus = (expiryDate) => {
    const hoursLeft = Math.floor(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60),
    );
    if (hoursLeft < 0)
      return {
        status: "Expired",
        color: "bg-gray-100 text-gray-600",
        icon: XCircle,
      };
    if (hoursLeft < 6)
      return {
        status: `${hoursLeft}h`,
        color: "bg-red-100 text-red-700",
        icon: AlertCircle,
      };
    if (hoursLeft < 24)
      return {
        status: `${hoursLeft}h`,
        color: "bg-orange-100 text-orange-700",
        icon: Clock,
      };
    return {
      status: `${hoursLeft}h`,
      color: "bg-yellow-100 text-yellow-700",
      icon: CheckCircle,
    };
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <Layout type="admin">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Moderation
          </h1>
          <p className="text-gray-600">
            Monitor and manage all rescue food listings
          </p>
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
            <p className="text-sm text-gray-600 mt-1">Total Products</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            <p className="text-sm text-gray-600 mt-1">Active Listings</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-md">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.urgent}</p>
            <p className="text-sm text-gray-600 mt-1">Urgent (&lt;24h)</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-md">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.totalValue.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Value</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-gray-200 shadow-md p-12 text-center rounded-lg">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const expiryInfo = getExpiryStatus(product.expiryDate);
              const ExpiryIcon = expiryInfo.icon;

              return (
                <div
                  key={product.id}
                  className="bg-white border-2 border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-md ${expiryInfo.color}`}
                      >
                        <ExpiryIcon className="h-3 w-3" />
                        <span>{expiryInfo.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Store className="h-4 w-4" />
                        <span>{product.storeName}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-gray-900">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-medium text-gray-900">
                          {product.quantity} items
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span className="font-medium text-gray-900">
                          {format(
                            new Date(product.expiryDate),
                            "MMM dd, HH:mm",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                        <p className="text-xl font-bold text-primary-600">
                          ${product.rescuePrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Value</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${(product.rescuePrice * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteProduct(product.id, product.name)
                      }
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 border-b-4 border-red-800 hover:bg-red-700 transition rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remove Product</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
