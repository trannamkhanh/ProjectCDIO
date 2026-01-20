import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers, mockProducts, mockOrders } from "../data/mockData";

const AuthContext = createContext();
const AppContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      if (!user.active) {
        return {
          success: false,
          message: "Your account has been banned. Please contact support.",
        };
      }
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const register = (userData) => {
    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      storeName: userData.role === "seller" ? userData.storeName : undefined,
      active: true,
      verified: false,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);
    return {
      success: true,
      message: "Registration successful",
      user: newUser,
    };
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// App Provider
export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");

  // Cart Management
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                cartQuantity: Math.min(
                  item.cartQuantity + quantity,
                  product.quantity,
                ),
              }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, cartQuantity: quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, cartQuantity: quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.rescuePrice * item.cartQuantity,
      0,
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cartQuantity, 0);
  };

  // Product Management (Seller)
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length + 1,
      status: "active",
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (productId, updates) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
    // Also remove from cart if present
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Admin: Remove/Delete Product
  const deleteProductByAdmin = (productId) => {
    setProducts(products.filter((p) => p.id !== productId));
    // Also remove from cart if present
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Admin: User Management
  const deleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const verifyUser = (userId) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, verified: true } : u)),
    );
  };

  // Order Management
  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: orders.length + 1,
      createdAt: new Date(),
      status: "pending",
    };
    setOrders([...orders, newOrder]);

    // Update product quantities
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

  // Stats for Admin Dashboard
  const getStats = () => {
    const totalUsers = users.filter((u) => u.role !== "admin").length;
    const totalBuyers = users.filter((u) => u.role === "buyer").length;
    const totalSellers = users.filter((u) => u.role === "seller").length;
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const foodRescued = orders.reduce(
      (sum, order) =>
        sum + order.products.reduce((pSum, p) => pSum + p.quantity, 0),
      0,
    );

    return {
      totalUsers,
      totalBuyers,
      totalSellers,
      totalProducts,
      activeProducts,
      totalRevenue,
      totalOrders,
      foodRescued,
    };
  };

  return (
    <AppContext.Provider
      value={{
        users,
        products,
        cart,
        orders,
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
        verifyUser,
        createOrder,
        getStats,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom Hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
