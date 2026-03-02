import React, { useState, useMemo } from "react";
import { useApp, useAuth } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Plus,
  X,
  Package,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Edit2,
  Trash2,
  Upload,
} from "lucide-react";
import { formatMoney } from "../../utils/formatMoney";

const API_BASE_URL = "http://localhost:3000";

const SellerDashboard = () => {
  const {
    sellerProducts,
    addProduct,
    deleteProduct,
    refreshSellerProducts
  } = useApp();
  const { currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    originalPrice: "",
    rescuePrice: "",
    quantity: "",
    expiryDate: "",
    category: "Bakery",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const myProducts = useMemo(() => {
    return sellerProducts.map(p => ({
      ...p,
      id: p.product_id,
      name: p.product_name,
      category: p.category || "Other",
      image: p.image_url
        ? `${API_BASE_URL}${p.image_url}`
        : null,
      originalPrice: p.price_original || 0,
      rescuePrice: p.price_discount || 0,
      quantity: p.quantity || 0,
      expiryDate: p.expiration_date,
      status: p.status,
    }));
  }, [sellerProducts]);


  console.log('🏪 Seller Dashboard:', {
    currentUser: currentUser?.account_id,
    totalProducts: myProducts.length,
    myProducts: myProducts.length,
    firstMyProduct: myProducts[0]

  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = myProducts.length;
    const activeProducts = myProducts.filter(
      (p) => p.status === "active" || p.status === "available",
    ).length;
    const totalInventoryValue = myProducts.reduce(
      (sum, p) => sum + (Number(p.rescuePrice) || 0) * (Number(p.quantity) || 0),
      0,
    );
    const urgentProducts = myProducts.filter((p) => {
      if (!p.expiryDate) return false;
      const hoursLeft = Math.floor(
        (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60),
      );
      return hoursLeft < 24 && hoursLeft > 0;
    }).length;

    return {
      totalProducts,
      activeProducts,
      totalInventoryValue,
      urgentProducts,
    };
  }, [myProducts]);

  // ✅ NEW: Handle image selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PNG, JPG, or GIF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB');
      return;
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ NEW: Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Image uploaded:', data.url);
        return data.url;
      } else {
        console.error('❌ Upload failed:', data.error);
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  };

  // ✅ FIXED: Upload image first, then add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload a product image");
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload image
      console.log('📤 Uploading image...');
      const imageUrl = await uploadImage(selectedFile);
      console.log('✅ Image URL:', imageUrl);

      // Step 2: Add product with image URL
      console.log('📦 Adding product...');
      const result = await addProduct({
        name: newProduct.name,
        originalPrice: parseFloat(newProduct.originalPrice) || 0,
        rescuePrice: parseFloat(newProduct.rescuePrice) || 0,
        quantity: parseInt(newProduct.quantity) || 0,
        expiryDate: newProduct.expiryDate,
        category: newProduct.category,
        description: newProduct.description,
        image: imageUrl,  // ← Use uploaded URL
      });

      if (result.success) {
        alert('✅ Product added successfully!');
        setShowAddModal(false);

        // Reset form
        setNewProduct({
          name: "",
          originalPrice: "",
          rescuePrice: "",
          quantity: "",
          expiryDate: "",
          category: "Bakery",
          description: "",
          image: "",
        });
        setImagePreview(null);
        setSelectedFile(null);

        // Refresh products
        await refreshSellerProducts();
      } else {
        alert('❌ Failed to add product: ' + result.message);
      }
    } catch (error) {
      console.error('❌ Error adding product:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) {
      return { status: "NaNh", color: "bg-gray-100 text-gray-600" };
    }

    const hoursLeft = Math.floor(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60),
    );

    if (hoursLeft < 0)
      return { status: "expired", color: "bg-gray-100 text-gray-600" };
    if (hoursLeft < 6)
      return { status: `${hoursLeft}h`, color: "bg-red-100 text-red-700" };
    if (hoursLeft < 24)
      return { status: `${hoursLeft}h`, color: "bg-orange-100 text-orange-700" };

    const daysLeft = Math.floor(hoursLeft / 24);
    return { status: `${daysLeft}d`, color: "bg-yellow-100 text-yellow-700" };
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const result = await deleteProduct(productId);
      if (result && result.success) {
        alert("✅ Product deleted successfully!");
        await refreshSellerProducts();
      } else {
        const errorMsg = result?.message || "Failed to delete product";
        alert(`❌ ${errorMsg}`);
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      alert(`❌ Error deleting product: ${error.message || "Unknown error"}`);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: editingProduct.name,
            description: editingProduct.description,
            price_original: parseFloat(editingProduct.originalPrice),
            price_discount: parseFloat(editingProduct.rescuePrice),
            quantity: parseInt(editingProduct.quantity),
            expiration_date: editingProduct.expiryDate,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("✅ Product updated successfully!");
        setEditingProduct(null);
        await refreshSellerProducts();
      } else {
        alert("❌ " + (result.error || "Update failed"));
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setUpdating(false);
    }
  };



  return (
    <Layout type="seller">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your inventory and rescue food listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-md">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProducts}
            </p>
            <p className="text-sm text-gray-600 mt-1">Products Listed</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activeProducts}
            </p>
            <p className="text-sm text-gray-600 mt-1">Available Now</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-100 p-3 rounded-md">
                <DollarSign className="h-6 w-6 text-accent-600" />
              </div>
              <span className="text-sm text-gray-500">Value</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatMoney(stats.totalInventoryValue)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Inventory Value</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-md">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">Urgent</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats.urgentProducts}
            </p>
            <p className="text-sm text-gray-600 mt-1">Expiring Soon</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white border-2 border-gray-200 shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              My Products ({myProducts.length})
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 border-b-4 border-primary-800 font-medium hover:bg-primary-700 transition flex items-center space-x-2 rounded-md"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product...</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No products yet. Click "Add Product..." to get started!
                    </td>
                  </tr>
                ) : (
                  myProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => {
                              console.error('❌ Image failed:', product.image);
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                            onLoad={() => {
                              console.log('✅ Image loaded:', product.image);
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {product.originalPrice > 0 && (
                            <p className="text-gray-500 line-through">
                              {formatMoney(product.originalPrice)}
                            </p>
                          )}
                          <p className="text-primary-600 font-semibold">
                            {formatMoney(product.rescuePrice)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getExpiryStatus(product.expiryDate).color
                            }`}
                        >
                          {getExpiryStatus(product.expiryDate).status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() =>
                            setEditingProduct({
                              ...product,
                              originalPrice: product.originalPrice || "",
                              rescuePrice: product.rescuePrice || "",
                              quantity: product.quantity || "",
                              expiryDate: product.expiryDate
                                ? new Date(product.expiryDate).toISOString().slice(0, 16)
                                : "",
                            })
                          }
                          className="text-primary-600 hover:text-primary-800 font-medium transition"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Product
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-md"
                  disabled={uploading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-40 object-cover rounded-lg mx-auto"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-input"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="image-input"
                          className={`inline-block px-4 py-2 rounded-md cursor-pointer transition text-sm font-medium ${uploading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                        >
                          {uploading ? 'Uploading...' : 'Change Image'}
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-input"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="image-input"
                          className="block text-primary-600 font-medium cursor-pointer hover:text-primary-700 transition"
                        >
                          Click to upload image
                        </label>
                        <p className="text-sm text-gray-500">
                          PNG, JPG or GIF (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Fresh Croissants"
                    disabled={uploading}
                  />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.originalPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          originalPrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rescue Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.rescuePrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          rescuePrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Quantity & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={uploading}
                    >
                      <option>Bakery</option>
                      <option>Fresh Produce</option>
                      <option>Dairy</option>
                      <option>Ready Meals</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newProduct.expiryDate}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={uploading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the product"
                    disabled={uploading}
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
                    disabled={uploading}
                  >
                    {uploading ? '⏳ Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">
                  Edit Product
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="p-6 space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rescue Price
                    </label>
                    <input
                      type="number"
                      value={editingProduct.rescuePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          rescuePrice: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="datetime-local"
                    value={editingProduct.expiryDate}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-gray-200 py-2 rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-md"
                  >
                    {updating ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SellerDashboard;