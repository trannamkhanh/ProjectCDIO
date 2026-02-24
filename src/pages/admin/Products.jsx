import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Search,
  Package,
  AlertCircle,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatMoney } from "../../utils/formatMoney";

const AdminProducts = () => {
  // ✅ FIX: Dùng deleteProduct thay vì deleteProductByAdmin
  const { products, deleteProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ✅ Normalize products
  const normalizedProducts = useMemo(() => {
    return products.map(p => ({
      ...p,
      id: p.product_id || p.id,
      name: p.product_name || p.name,
      category: p.category || 'Other',
      image: p.image_url || p.image,
      storeName: p.store_name || p.storeName || 'Unknown Store',
      originalPrice: p.price_original || p.original_price || p.originalPrice || 0,
      rescuePrice: p.price_discount || p.rescue_price || p.rescuePrice || 0,
      quantity: p.quantity || 0,
      expiryDate: p.expiration_date || p.expiry_date || p.expiryDate,
      status: p.status
    }));
  }, [products]);

  const categories = [...new Set(normalizedProducts.map((p) => p.category).filter(Boolean))];

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) {
      return {
        status: "No expiry",
        color: "bg-gray-100 text-gray-600",
        icon: Clock,
      };
    }

    const hoursLeft = Math.floor(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60),
    );
    
    if (hoursLeft < 0)
      return {
        status: "expired",
        color: "bg-gray-100 text-gray-600",
        icon: AlertCircle,
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
      status: `${Math.floor(hoursLeft / 24)}d`,
      color: "bg-yellow-100 text-yellow-700",
      icon: CheckCircle,
    };
  };

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.storeName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [normalizedProducts, searchQuery, categoryFilter]);

  const handleDeleteProduct = async (productId, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      )
    ) {
      // ✅ FIX: Dùng deleteProduct
      const result = await deleteProduct(productId);
      if (result.success) {
        alert('Product deleted successfully');
      } else {
        alert(result.message || 'Failed to delete product');
      }
    }
  };

  // Calculate stats
  const activeProducts = normalizedProducts.filter(p => 
    p.status === 'active' || p.status === 'available'
  );

  const expiringSoon = normalizedProducts.filter((p) => {
    if (!p.expiryDate) return false;
    const hoursLeft = Math.floor(
      (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60),
    );
    return hoursLeft < 6 && hoursLeft > 0;
  });

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
              <div className="bg-blue-100 p-3 rounded-md">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {normalizedProducts.length}
            </p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {activeProducts.length}
            </p>
            <p className="text-sm text-gray-600">Active Listings</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-md">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {expiringSoon.length}
            </p>
            <p className="text-sm text-gray-600">Expiring Soon</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-md">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {categories.length}
            </p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center space-x-1 ${
                          expiryInfo.color
                        }`}
                      >
                        <ExpiryIcon className="h-4 w-4" />
                        <span>{expiryInfo.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      🏪 {product.storeName}
                    </p>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-700">{product.category}</p>
                    </div>

                    <div className="mb-4 pb-3 border-b border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Pricing</p>
                      <div className="flex items-baseline gap-2">
                        {product.originalPrice > 0 && (
                          <p className="text-gray-400 line-through text-sm">
                            ${formatMoney(product.originalPrice)}
                          </p>
                        )}
                        <p className="text-primary-600 font-bold text-lg">
                          ${formatMoney(product.rescuePrice)}
                        </p>
                      </div>
                      {product.originalPrice > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          Save {Math.round(((product.originalPrice - product.rescuePrice) / product.originalPrice) * 100)}%
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-semibold text-gray-900">{product.quantity} units</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-semibold text-gray-900">
                          ${formatMoney(product.rescuePrice * product.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteProduct(product.id, product.name)
                      }
                      className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2.5 border-b-4 border-red-800 hover:bg-red-700 transition rounded-md"
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

export default AdminProducts;