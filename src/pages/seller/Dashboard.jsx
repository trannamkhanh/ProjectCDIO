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
} from "lucide-react";
import { format } from "date-fns";

const SellerDashboard = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useApp();
  const { currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Filter products for current seller
  const myProducts = products.filter((p) => p.sellerId === currentUser.id);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = myProducts.length;
    const activeProducts = myProducts.filter(
      (p) => p.status === "active",
    ).length;
    const totalInventoryValue = myProducts.reduce(
      (sum, p) => sum + p.rescuePrice * p.quantity,
      0,
    );
    const urgentProducts = myProducts.filter((p) => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.image) {
      alert("Please upload a product image");
      return;
    }
    addProduct({
      ...newProduct,
      originalPrice: parseFloat(newProduct.originalPrice),
      rescuePrice: parseFloat(newProduct.rescuePrice),
      quantity: parseInt(newProduct.quantity),
      expiryDate: new Date(newProduct.expiryDate),
      storeName: currentUser.storeName,
      location: currentUser.address,
      sellerId: currentUser.id,
    });
    setShowAddModal(false);
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
  };

  const getExpiryStatus = (expiryDate) => {
    const hoursLeft = Math.floor(
      (new Date(expiryDate) - new Date()) / (1000 * 60 * 60),
    );
    if (hoursLeft < 0)
      return { status: "expired", color: "bg-gray-100 text-gray-600" };
    if (hoursLeft < 6)
      return { status: `${hoursLeft}h`, color: "bg-red-100 text-red-700" };
    if (hoursLeft < 24)
      return {
        status: `${hoursLeft}h`,
        color: "bg-orange-100 text-orange-700",
      };
    return { status: `${hoursLeft}h`, color: "bg-yellow-100 text-yellow-700" };
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
              <div className="bg-primary-100 p-3">
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
              ${stats.totalInventoryValue.toFixed(0)}
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
            <p className="text-sm text-gray-600 mt-1">Expires Soon</p>
          </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white border-2 border-gray-200 shadow-md rounded-lg">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 border-b-4 border-primary-800 font-medium hover:bg-primary-700 transition flex items-center space-x-2 rounded-md"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
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
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myProducts.map((product) => {
                  const expiryStatus = getExpiryStatus(product.expiryDate);
                  const isUrgent =
                    expiryStatus.color.includes("red") ||
                    expiryStatus.color.includes("orange");

                  return (
                    <tr
                      key={product.id}
                      className={isUrgent ? "bg-red-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
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
                          <p className="text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </p>
                          <p className="text-primary-600 font-semibold">
                            ${product.rescuePrice.toFixed(2)}
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
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold ${expiryStatus.color}`}
                        >
                          <Clock className="h-3 w-3 mr-1 mt-0.5" />
                          {expiryStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {myProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No products yet. Add your first rescue item!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-300 shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-md"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
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
                        />
                        <label
                          htmlFor="image-input"
                          className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary-700 transition text-sm font-medium"
                        >
                          Change Image
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <svg className="h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-2-8h-4m-2-2h-4m2 14l-4-4m-4 4l-4-4m-8 4a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-input"
                        />
                        <label
                          htmlFor="image-input"
                          className="block text-primary-600 font-medium cursor-pointer hover:text-primary-700 transition"
                        >
                          Click to upload image
                        </label>
                        <p className="text-sm text-gray-500">PNG, JPG or GIF (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price ($)
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rescue Price ($)
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
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
                    >
                      <option>Bakery</option>
                      <option>Fresh Produce</option>
                      <option>Dairy</option>
                      <option>Ready Meals</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date & Time
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
                  />
                </div>

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
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 border-2 border-gray-300 font-semibold hover:bg-gray-200 transition rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2.5 border-b-4 border-primary-800 font-semibold hover:bg-primary-700 transition rounded-md"
                  >
                    Add Product
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
