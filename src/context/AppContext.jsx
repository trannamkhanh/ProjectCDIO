import React, { createContext, useContext, useEffect, useState } from "react";
import { mockProducts, mockOrders } from "../data/mockData";

/* =======================
   AUTH CONTEXT
======================= */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load lại session khi F5
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // REGISTER (API)
  const register = async (userData) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      return { success: false, message: "Lỗi server" };
    }
  };

  // LOGIN (API)
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      if (data.user.status !== "active") {
        return {
          success: false,
          message: "Tài khoản đã bị khóa",
        };
      }

      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      return {
        success: true,
        role: data.user.role,
      };
    } catch (err) {
      return { success: false, message: "Lỗi server" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   APP CONTEXT
======================= */
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");

  // Load users cho ADMIN
  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Load users failed:", err));
  }, []);

  /* =======================
     CART
  ======================= */
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id
            ? {
                ...i,
                cartQuantity: Math.min(
                  i.cartQuantity + quantity,
                  product.quantity,
                ),
              }
            : i,
        ),
      );
    } else {
      setCart([...cart, { ...product, cartQuantity: quantity }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));

  const updateCartQuantity = (id, quantity) =>
    setCart(
      cart.map((i) => (i.id === id ? { ...i, cartQuantity: quantity } : i)),
    );

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((sum, i) => sum + i.rescuePrice * i.cartQuantity, 0);

  const getCartCount = () => cart.reduce((sum, i) => sum + i.cartQuantity, 0);

  /* =======================
     PRODUCT
  ======================= */
  const addProduct = async (product) => {
    try {
      // Get seller_id from currentUser
      const sellerId = currentUser?.seller_id || 1; // Default to 1 if not found

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: sellerId,
          productName: product.name,
          description: product.description || "",
          priceOriginal: product.originalPrice,
          priceDiscount: product.rescuePrice,
          quantity: product.quantity,
          expirationDate: product.expiryDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add to local state with the returned productId
        setProducts([
          ...products,
          {
            ...product,
            id: data.productId,
            status: "active",
          },
        ]);
        console.log("✅ Product added to database:", data.productId);
      } else {
        console.error("❌ Failed to add product:", data.message);
        alert("Không thể thêm sản phẩm: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setCart(cart.filter((c) => c.id !== id));
  };

  // Admin
  const deleteProductByAdmin = deleteProduct;

  /* =======================
     USER (ADMIN)
  ======================= */
  const deleteUser = async (userId) => {
    await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: "DELETE",
    });
    setUsers(users.filter((u) => u.account_id !== userId));
  };

  const blockUser = async (userId) => {
    await fetch(`http://localhost:3000/api/users/${userId}/block`, {
      method: "PATCH",
    });

    setUsers(
      users.map((u) =>
        u.account_id === userId ? { ...u, status: "blocked" } : u,
      ),
    );
  };

  /* =======================
     ORDER
  ======================= */
  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: orders.length + 1,
      createdAt: new Date(),
      status: "pending",
    };

    setOrders([...orders, newOrder]);

    orderData.products.forEach((item) => {
      updateProduct(item.productId, {
        quantity:
          products.find((p) => p.id === item.productId).quantity -
          item.quantity,
      });
    });

    clearCart();
    return newOrder;
  };

  /* =======================
     ADMIN STATS
  ======================= */
  const getStats = () => ({
    totalUsers: users.filter((u) => u.role !== "admin").length,
    totalBuyers: users.filter((u) => u.role === "buyer").length,
    totalSellers: users.filter((u) => u.role === "seller").length,
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    totalRevenue: orders.reduce((s, o) => s + o.total, 0),
    totalOrders: orders.length,
  });

  return (
    <AppContext.Provider
      value={{
        users,
        products,
        cart,
        orders,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        addProduct,
        updateProduct,
        deleteProduct,
        deleteProductByAdmin,
        deleteUser,
        blockUser,
        createOrder,
        getStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =======================
   HOOKS
======================= */
export const useAuth = () => useContext(AuthContext);
export const useApp = () => useContext(AppContext);
