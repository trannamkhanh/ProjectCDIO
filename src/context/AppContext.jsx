import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";

/* =======================
   AUTH CONTEXT
======================= */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DEBUG currentUser:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === "seller") {
      console.log("🧑‍💼 Seller ID:", currentUser.account_id);
    }
  }, [currentUser]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, message: "Lỗi server" };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
          message: "Tài khoản chưa được duyệt hoặc đã bị khóa",
        };
      }

      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      return {
        success: true,
        role: data.user.role,
        user: data.user,
      };
    } catch (err) {
      console.error("Login error:", err);
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
      value={{
        currentUser,
        isAuthenticated,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =======================
   HOOKS (Di chuyển lên trước khi sử dụng)
======================= */
//    FIX: Move hooks definition before AppProvider
export const useAuth = () => useContext(AuthContext);

/* =======================
   APP CONTEXT
======================= */
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth(); //    FIX: Giờ useAuth đã được định nghĩa

  // State
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);     
  const [cart, setCart] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  
  // Load users (admin)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users`);
        //    FIX: Thêm error handling
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        //    FIX: Thêm error handling
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Load cart when user changes
  useEffect(() => {
    if (currentUser?.buyer_id) {
      const fetchCart = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/cart/${currentUser.buyer_id}`
          );
          //    FIX: Thêm error handling
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          //    FIX: Defensive check cho items array
          setCart(Array.isArray(data.items) ? data.items : []);
          setCartId(data.cart_id || null);
        } catch (err) {
          console.error("Failed to load cart:", err);
          setCart([]);
          setCartId(null);
        }
      };
      fetchCart();
    } else {
      setCart([]);
      setCartId(null);
    }
  }, [currentUser?.buyer_id]);

  // Load orders when user changes
  useEffect(() => {
    if (currentUser?.buyer_id) {
      const fetchOrders = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/orders/${currentUser.buyer_id}`
          );
          //    FIX: Thêm error handling
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load orders:", err);
          setOrders([]);
        }
      };
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [currentUser?.buyer_id]);

  useEffect(() => {
    if (currentUser?.role === "seller" && currentUser?.account_id) {
      const fetchSellerOrders = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/seller/${currentUser.account_id}/orders`
          );

          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

          const data = await res.json();
          setSellerOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load seller orders:", err);
          setSellerOrders([]);
        }
      };

      fetchSellerOrders();
    } else {
      setSellerOrders([]);
    }
  }, [currentUser]);

  // Load all orders (admin)
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/orders`);
        //    FIX: Thêm error handling
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAllOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load all orders:", err);
        setAllOrders([]);
      }
    };
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "seller" && currentUser?.account_id) {
      const fetchSellerProducts = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/seller/${currentUser.account_id}/products`
          );

          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

          const data = await res.json();
          setSellerProducts(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load seller products:", err);
          setSellerProducts([]);
        }
      };

      fetchSellerProducts();
    } else {
      setSellerProducts([]);
    }
  }, [currentUser]);

  // Load stats (admin)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
        //    FIX: Thêm error handling
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        setStats(null);
      }
    };
    fetchStats();
  }, []);

  /* =======================
     CART FUNCTIONS
  ======================= */
  const addToCart = async (productId, quantity = 1) => {
    if (!currentUser?.buyer_id) {
      return { success: false, message: "Vui lòng đăng nhập trước" };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: currentUser.buyer_id,
          product_id: productId,
          quantity,
        }),
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        // Reload cart
        const cartRes = await fetch(
          `${API_BASE_URL}/api/cart/${currentUser.buyer_id}`
        );
        const cartData = await cartRes.json();
        setCart(Array.isArray(cartData.items) ? cartData.items : []);
        setCartId(cartData.cart_id || null);
      }

      return data;
    } catch (err) {
      console.error("Add to cart error:", err);
      return { success: false, message: "Lỗi khi th��m vào giỏ hàng" };
    }
  };

  const removeFromCart = async (productId) => {
    if (!cartId) {
      return { success: false, message: "Giỏ hàng trống" };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId, product_id: productId }),
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        //    FIX: Defensive check cho cart array
        setCart(Array.isArray(cart) ? cart.filter((item) => item.product_id !== productId) : []);
      }

      return data;
    } catch (err) {
      console.error("Remove from cart error:", err);
      return { success: false, message: "Lỗi khi xóa khỏi giỏ hàng" };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!cartId) {
      return { success: false, message: "Giỏ hàng trống" };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: cartId, product_id: productId, quantity }),
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        //    FIX: Defensive check
        setCart(
          Array.isArray(cart) ? cart.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ) : []
        );
      }

      return data;
    } catch (err) {
      console.error("Update cart quantity error:", err);
      return { success: false, message: "Lỗi khi cập nhật số lượng" };
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  //    FIX: Kiểm tra cart là array trước khi reduce
  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0);
  };

  //    FIX: Kiểm tra cart là array trước khi reduce
  const getCartCount = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  /* =======================
     PRODUCT FUNCTIONS
  ======================= */
  const addProduct = async (productData) => {
    try {
      console.log("DEBUG: currentUser:", currentUser);
      console.log("DEBUG: seller_id to send:", currentUser?.account_id);
      
      const res = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData,
           expiryDate: productData.expiryDate
            ? productData.expiryDate.split("T")[0]
            : null,
          seller_id: currentUser?.account_id 
        }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        await refreshSellerProducts();
        const prodsRes = await fetch(`${API_BASE_URL}/api/products`);
        const prods = await prodsRes.json();
        setProducts(Array.isArray(prods) ? prods : []);
      }

      return data;
    } catch (err) {
      console.error("Add product error:", err);
      return { success: false, message: "Lỗi khi thêm sản phẩm" };
    }
  };

  
  const getStats = () => {
    const activeProducts = products.filter(p => 
      p.status === 'active' || p.status === 'available'
    );

    return {
      totalUsers: users.length,
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalOrders: stats?.total_orders || allOrders.length,
      totalRevenue: stats?.revenue || 0,
      foodRescued: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
    };
  };

  const updateProduct = async (productId, productData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        // Reload products
        await refreshSellerProducts();
        const prodsRes = await fetch(`${API_BASE_URL}/api/products`);
        const prods = await prodsRes.json();
        setProducts(Array.isArray(prods) ? prods : []);
      }

      return data;
    } catch (err) {
      console.error("Update product error:", err);
      return { success: false, message: "Lỗi khi cập nhật sản phẩm" };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        await refreshSellerProducts();
        setProducts(Array.isArray(products) ? products.filter((p) => p.product_id !== productId) : []);
        setCart(Array.isArray(cart) ? cart.filter((c) => c.product_id !== productId) : []);
      }

      return data;
    } catch (err) {
      console.error("Delete product error:", err);
      return { success: false, message: "Lỗi khi xóa sản phẩm" };
    }
  };

  const getProductDetail = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Get product detail error:", err);
      return null;
    }
  };

  const searchProducts = async (query) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`
      );
      //   FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Search products error:", err);
      return [];
    }
  };

  /* =======================
     USER FUNCTIONS (ADMIN)
  ======================= */
  const deleteUser = async (buyerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${buyerId}`, {
        method: "DELETE",
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setUsers(Array.isArray(users) ? users.filter((u) => u.buyer_id !== buyerId) : []);
      }

      return data;
    } catch (err) {
      console.error("Delete user error:", err);
      return { success: false, message: "Lỗi khi xóa người dùng" };
    }
  };

  const blockUser = async (buyerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${buyerId}/block`, {
        method: "PATCH",
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setUsers(
          Array.isArray(users) ? users.map((u) =>
            u.buyer_id === buyerId
              ? { ...u, account: { ...u.account, status: "locked" } }
              : u
          ) : []
        );
      }

      return data;
    } catch (err) {
      console.error("Block user error:", err);
      return { success: false, message: "Lỗi khi khóa người dùng" };
    }
  };

  const verifyUser = async (buyerId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${buyerId}/verify`, {
        method: "PATCH",
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setUsers(
          Array.isArray(users) ? users.map((u) =>
            u.buyer_id === buyerId
              ? { ...u, account: { ...u.account, status: "active" } }
              : u
          ) : []
        );
      }

      return data;
    } catch (err) {
      console.error("Verify user error:", err);
      return { success: false, message: "Lỗi khi duyệt người dùng" };
    }
  };

  /* =======================
     ORDER FUNCTIONS
  ======================= */
  const createOrder = async () => {
    if (!currentUser?.buyer_id) {
      return { success: false, message: "Vui lòng đăng nhập trước" };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyer_id: currentUser.buyer_id }),
      });
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        // Reload orders and cart
        const [ordersRes, cartRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/orders/${currentUser.buyer_id}`),
          fetch(`${API_BASE_URL}/api/cart/${currentUser.buyer_id}`),
        ]);

        const ordersData = await ordersRes.json();
        const cartData = await cartRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setCart(Array.isArray(cartData.items) ? cartData.items : []);
        setCartId(cartData.cart_id || null);
      }

      return data;
    } catch (err) {
      console.error("Create order error:", err);
      return { success: false, message: "Lỗi khi tạo đơn hàng" };
    }
  };

  const getOrderDetail = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/detail/${orderId}`);
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Get order detail error:", err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        // Reload all orders
        const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders`);
        const ordersData = await ordersRes.json();
        setAllOrders(Array.isArray(ordersData) ? ordersData : []);
      }

      return data;
    } catch (err) {
      console.error("Update order status error:", err);
      return { success: false, message: "Lỗi khi cập nhật trạng thái đơn hàng" };
    }
  };

  /* =======================
     REFRESH FUNCTIONS
  ======================= */
  const refreshSellerProducts = async () => {
    if (!currentUser?.account_id) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/seller/${currentUser.account_id}/products`
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setSellerProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Refresh seller products error:", err);
    }
  };
  
  const refreshUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Refresh users error:", err);
    }
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Refresh products error:", err);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
      //    FIX: Thêm error handling
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Refresh stats error:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Users
        users,
        deleteUser,
        blockUser,
        verifyUser,
        refreshUsers,

        // Products
        products,
        addProduct,
        updateProduct,
        getStats,
        deleteProduct,
        getProductDetail,
        searchProducts,
        refreshProducts,
        sellerProducts,
        refreshSellerProducts,


        // Cart
        cart,
        cartId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,

        // Orders
        orders,
        allOrders,
        createOrder,
        getOrderDetail,
        updateOrderStatus,
        sellerOrders,

        // Search
        searchQuery,
        setSearchQuery,

        // Stats
        stats,
        refreshStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =======================
   HOOKS
======================= */

export const useApp = () => useContext( AppContext);