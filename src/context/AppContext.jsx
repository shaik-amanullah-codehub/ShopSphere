/**
 * App Context Module
 *
 * Global state management.
 * * CRITICAL FIXES APPLIED:
 * 1. placeOrder: Now fetches the FULL user record before updating points.
 * 2. Login/Signup: Preserves database integrity.
 * 3. Logout: Safe local-only logout.
 * 4. addToCart: Now handles decrementing and auto-removal.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { productAPI, orderAPI, authAPI, handleApiError } from "../services/api";

const AppContext = createContext();

const STORAGE_KEYS = {
  CURRENT_USER: "currentUser",
  CART: "cart",
  LOYALTY_POINTS: "loyaltyPoints",
  MOBILE_NUMBER: "mobileNumber",
};

export const AppProvider = ({ children }) => {
  // ===== USER STATE =====
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== PRODUCT STATE =====
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // ===== CART STATE =====
  const [cart, setCart] = useState([]);

  // ===== ORDER STATE =====
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ===== LOYALTY STATE =====
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOYALTY_POINTS);
      return saved ? JSON.parse(saved) : 0;
    } catch (err) {
      return 0;
    }
  });

  // ===== INITIALIZATION =====
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setError(null);
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      const savedPoints = localStorage.getItem(STORAGE_KEYS.LOYALTY_POINTS);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);

        if (parsedUser.loyaltyPoints !== undefined) {
          setLoyaltyPoints(parsedUser.loyaltyPoints);
        } else if (savedPoints) {
          setLoyaltyPoints(JSON.parse(savedPoints));
        }
      } else if (savedPoints) {
        setLoyaltyPoints(JSON.parse(savedPoints));
      }

      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }

    fetchProducts();
  }, [fetchProducts]);

  // ===== PERSISTENCE =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.LOYALTY_POINTS,
      JSON.stringify(loyaltyPoints)
    );
  }, [loyaltyPoints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setOrdersLoading(true);
      (async () => {
        try {
          const params =
            currentUser?.role === "admin" ? {} : { userId: currentUser?.id };
          const response = await orderAPI.getAllOrders(params);
          setOrders(response.data);
        } catch (err) {
          console.error("Failed to fetch orders");
        } finally {
          setOrdersLoading(false);
        }
      })();
    }
  }, [currentUser]);

  // ===== PRODUCT METHODS =====
  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const addProduct = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const response = await productAPI.createProduct(data);
        setProducts([...products, response.data]);
        return response.data;
      } catch (err) {
        throw handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  const updateProduct = useCallback(
    async (id, updates) => {
      setIsLoading(true);
      try {
        const response = await productAPI.updateProduct(id, updates);
        setProducts(products.map((p) => (p.id === id ? response.data : p)));
        return response.data;
      } catch (err) {
        throw handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  const deleteProduct = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        await productAPI.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        throw handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  // ===== AUTHENTICATION METHODS =====
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.getAllCustomers();
      const customers = response.data || [];
      const customer = customers.find(
        (c) => c.email === email && c.password === password
      );

      if (!customer) throw new Error("Invalid email or password");

      const userData = {
        ...customer,
        loyaltyPoints: customer.loyaltyPoints || 0,
      };

      setCurrentUser(userData);
      setLoyaltyPoints(userData.loyaltyPoints);
      localStorage.setItem("authToken", `token_${customer.id}`);
      return userData;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "Login failed.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setLoyaltyPoints(0);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.LOYALTY_POINTS);
    localStorage.removeItem("authToken");
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.getAllCustomers();
      if (response.data?.some((c) => c.email === userData.email)) {
        throw new Error("Email already registered.");
      }

      const newCustomer = {
        ...userData,
        role: "customer",
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
      };

      const createResponse = await authAPI.register(newCustomer);
      const createdUser = createResponse.data;
      const loginData = { ...createdUser, loyaltyPoints: 0 };

      setCurrentUser(loginData);
      setLoyaltyPoints(0);
      localStorage.setItem("authToken", `token_${createdUser.id}`);
      return loginData;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "Signup failed.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== CART METHODS (FIXED) =====
  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        const newQuantity = exist.quantity + qty;
        if (newQuantity <= 0) {
          return prev.filter((i) => i.id !== product.id);
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: newQuantity } : i
        );
      }
      return qty > 0 ? [...prev, { ...product, quantity: qty }] : prev;
    });
  }, []);

  const removeFromCart = useCallback(
    (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
    []
  );

  const updateCartQuantity = useCallback(
    (id, qty) => {
      if (qty <= 0) removeFromCart(id);
      else
        setCart((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
        );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  // ===== ORDER METHODS =====
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params =
        currentUser?.role === "admin" ? {} : { userId: currentUser?.id };
      const response = await orderAPI.getAllOrders(params);
      setOrders(response.data);
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setOrdersLoading(false);
    }
  }, [currentUser]);

  const placeOrder = useCallback(
    async (orderData) => {
      setIsLoading(true);
      setError(null);
      try {
        const newOrder = {
          id: `ORD-${Date.now()}`,
          userId: currentUser?.id,
          items: cart,
          total: orderData.total,
          status: "pending",
          trackingStatus: "Order Placed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
        };

        const response = await orderAPI.createOrder(newOrder);
        setOrders((prev) => [...prev, response.data]);

        const earnedPoints = Math.floor(orderData.total / 10);

        if (currentUser && currentUser.id) {
          const userResponse = await authAPI.getAllCustomers();
          const fullUserRecord = userResponse.data.find(
            (u) => u.id === currentUser.id
          );

          if (fullUserRecord) {
            const newTotalPoints = (fullUserRecord.loyaltyPoints || 0) + earnedPoints;
            const updatedUserPayload = { ...fullUserRecord, loyaltyPoints: newTotalPoints };
            await authAPI.updateCustomer(currentUser.id, updatedUserPayload);

            setCurrentUser((prev) => ({ ...prev, loyaltyPoints: newTotalPoints }));
            setLoyaltyPoints(newTotalPoints);
          }
        }

        setCart([]);
        return response.data;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, cart]
  );

  const updateOrderStatus = useCallback(
    async (id, status, track) => {
      setIsLoading(true);
      try {
        const order = orders.find((o) => o.id === id);
        if (!order) throw new Error("Order not found");
        const updated = {
          ...order,
          status,
          trackingStatus: track || order.trackingStatus,
          updatedAt: new Date().toISOString(),
        };
        const response = await orderAPI.updateOrder(id, updated);
        setOrders((prev) => prev.map((o) => (o.id === id ? response.data : o)));
        return response.data;
      } catch (err) {
        throw handleApiError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [orders]
  );

  const getOrderById = useCallback(
    (id) => orders.find((o) => o.id === id),
    [orders]
  );

  const value = {
    currentUser,
    isLoading,
    error,
    products,
    productsLoading,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    orders,
    ordersLoading,
    fetchOrders,
    placeOrder,
    updateOrderStatus,
    getOrderById,
    loyaltyPoints,
    login,
    signup,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export default AppContext;