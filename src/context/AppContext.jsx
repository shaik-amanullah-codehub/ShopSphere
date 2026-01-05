/**
 * App Context Module
 *
 * Global state management for the entire application.
 * Handles:
 * - User authentication and profile management
 * - Product catalog fetching and caching
 * - Shopping cart operations
 * - Order management and tracking
 * - Loyalty points system
 *
 * State is synchronized with localStorage for persistence
 * and uses Axios to communicate with backend/JSON Server.
 *
 * @module context/AppContext
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { productAPI, orderAPI, authAPI, handleApiError } from "../services/api";
// Create the context
const AppContext = createContext();

/**
 * localStorage keys for consistent data persistence
 */
const STORAGE_KEYS = {
  CURRENT_USER: "currentUser",
  CART: "cart",
  LOYALTY_POINTS: "loyaltyPoints",
  MOBILE_NUMBER: "mobileNumber",
};

/**
 * AppProvider Component
 * Wraps the entire application and provides global state
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
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

  /**
   * Initialize app: Load user from localStorage and fetch products
   * Runs once on component mount
   */
  /**
   * Fetch all products from API/JSON Server
   * Called on app initialization
   */
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setError(null);
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error("Failed to fetch products:", apiError);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load persisted user and cart data
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      const savedPoints = localStorage.getItem(STORAGE_KEYS.LOYALTY_POINTS);

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedPoints) {
        setLoyaltyPoints(JSON.parse(savedPoints));
      }
    } catch (err) {
      console.error("Error loading from localStorage:", err);
    }

    // Fetch products on app initialization
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Persist cart to localStorage whenever it changes
   */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cart]);

  /**
   * Persist loyalty points to localStorage whenever they change
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.LOYALTY_POINTS,
        JSON.stringify(loyaltyPoints)
      );
    } catch (err) {
      console.error("Error saving loyalty points to localStorage:", err);
    }
  }, [loyaltyPoints]);

  /**
   * Persist current user to localStorage whenever they change
   */
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(currentUser)
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (err) {
      console.error("Error saving user to localStorage:", err);
    }
  }, [currentUser]);

  /**
   * Fetch orders when user logs in (admin can see all orders)
   * This ensures dashboard always has fresh data
   */
  useEffect(() => {
    if (currentUser) {
      // Call fetch orders when user changes
      setOrdersLoading(true);
      setError(null);

      (async () => {
        try {
          const params =
            currentUser?.role === "admin" ? {} : { userId: currentUser?.id };
          const response = await orderAPI.getAllOrders(params);
          setOrders(response.data);
        } catch (err) {
          const apiError = handleApiError(err);
          setError(apiError.message);
          console.error("Failed to fetch orders:", apiError);
        } finally {
          setOrdersLoading(false);
        }
      })();
    }
  }, [currentUser]);

  // ===== PRODUCT METHODS =====

  /**
   * Get single product details by ID
   * @param {number} productId - Product ID
   * @returns {Object|null} Product object or null if not found
   */
  const getProductById = useCallback(
    (productId) => {
      return products.find((p) => p.id === productId);
    },
    [products]
  );

  /**
   * Add new product (Admin only)
   * @param {Object} productData - New product details
   */
  const addProduct = useCallback(
    async (productData) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productAPI.createProduct(productData);
        setProducts([...products, response.data]);
        return response.data;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  /**
   * Update existing product (Admin only)
   * @param {number} productId - Product ID to update
   * @param {Object} updates - Updated product data
   */
  const updateProduct = useCallback(
    async (productId, updates) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productAPI.updateProduct(productId, updates);
        setProducts(
          products.map((p) => (p.id === productId ? response.data : p))
        );
        return response.data;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  /**
   * Delete product (Admin only)
   * @param {number} productId - Product ID to delete
   */
  const deleteProduct = useCallback(
    async (productId) => {
      setIsLoading(true);
      setError(null);
      try {
        await productAPI.deleteProduct(productId);
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  // ===== AUTHENTICATION METHODS =====

  /**
   * Customer login
   * Validates credentials against registered customers
   * @param {string} email - Customer email
   * @param {string} password - Customer password
   * @returns {Object} User data
   * @throws {Error} If credentials are invalid
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      // Query customers table to find matching email/password
      const response = await authAPI.getAllCustomers();
      const customers = response.data || [];

      // Find customer with matching email and password
      const customer = customers.find(
        (c) => c.email === email && c.password === password
      );

      if (!customer) {
        throw new Error("Invalid email or password");
      }

      // Authentication successful - set current user
      const userData = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        mobileNumber: customer.mobileNumber,
        role: customer.role || "customer",
        createdAt: customer.createdAt,
      };

      setCurrentUser(userData);

      // Store auth info in localStorage for persistence
      localStorage.setItem("authToken", `token_${customer.id}`);

      return userData;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(
        apiError.message || "Login failed. Please check your credentials."
      );
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Customer logout
   * Clears user session and cart data
   */
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

  /**
   * Customer signup/registration
   * Creates new customer account in database
   * @param {Object} userData - User registration data
   * @param {string} userData.email - Customer email
   * @param {string} userData.password - Customer password
   * @param {string} userData.name - Customer name
   * @param {string} userData.mobi
   * @returns {Object} Created user data
   * @throws {Error} If email already exists or validation fails
   */
  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate input
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error("Email, password, and name are required");
      }

      if (userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Check if email already exists
      const response = await authAPI.getAllCustomers();
      const customers = response.data || [];
      const emailExists = customers.some((c) => c.email === userData.email);

      if (emailExists) {
        throw new Error(
          "Email already registered. Please use a different email or login."
        );
      }

      // Create new customer
      const newCustomer = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        mobileNumber: userData.mobileNumber,
        role: "customer",
        createdAt: new Date().toISOString(),
      };

      // Save to database via API
      const createResponse = await authAPI.register(newCustomer);
      const createdUser = createResponse.data;

      // Auto-login after signup
      const loginData = {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        mobileNumber: createdUser.mobileNumber,
        role: createdUser.role || "customer",
        createdAt: createdUser.createdAt,
      };

      setCurrentUser(loginData);
      localStorage.setItem("authToken", `token_${createdUser.id}`);

      return loginData;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message || "Signup failed. Please try again.");
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== CART METHODS =====

  /**
   * Add product to cart or increase quantity if already exists
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Product already in cart: increase quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // New product: add to cart
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  /**
   * Remove product from cart
   * @param {number} productId - Product ID to remove
   */
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  /**
   * Update product quantity in cart
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   */
  const updateCartQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    },
    [removeFromCart]
  );

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ===== ORDER METHODS =====

  /**
   * Fetch all orders for current user or all orders for admin
   */
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setError(null);
    try {
      const params =
        currentUser?.role === "admin" ? {} : { userId: currentUser?.id };
      const response = await orderAPI.getAllOrders(params);
      setOrders(response.data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setOrdersLoading(false);
    }
  }, [currentUser]);

  /**
   * Place new order
   * Creates order with cart items and shipping info
   * @param {Object} orderData - Order details including items, total, shipping address
   * @returns {Object} Created order
   */
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

        // Save order to API
        const response = await orderAPI.createOrder(newOrder);

        // Update local state
        setOrders((prevOrders) => [...prevOrders, response.data]);
        const points = Math.floor(orderData.total / 10); // 1 point per $10
        setLoyaltyPoints((prevPoints) => prevPoints + points);
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

  /**
   * Update order status (Admin only)
   * @param {number} orderId - Order ID
   * @param {string} newStatus - New order status
   * @param {string} trackingStatus - Updated tracking status
   */
  const updateOrderStatus = useCallback(
    async (orderId, newStatus, trackingStatus) => {
      setIsLoading(true);
      setError(null);
      try {
        const orderToUpdate = orders.find((o) => o.id === orderId);
        if (!orderToUpdate) throw new Error("Order not found");

        const updatedOrder = {
          ...orderToUpdate,
          status: newStatus,
          trackingStatus: trackingStatus || orderToUpdate.trackingStatus,
          updatedAt: new Date().toISOString(),
        };

        const response = await orderAPI.updateOrder(orderId, updatedOrder);
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === orderId ? response.data : o))
        );

        return response.data;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [orders]
  );

  /**
   * Get single order by ID
   * @param {number} orderId - Order ID
   * @returns {Object|null} Order object or null
   */
  const getOrderById = useCallback(
    (orderId) => {
      return orders.find((o) => o.id === orderId);
    },
    [orders]
  );

  // ===== CONTEXT VALUE =====
  const value = {
    // User state
    currentUser,
    isLoading,
    error,

    // Product state and methods
    products,
    productsLoading,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,

    // Cart state and methods
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    // Order state and methods
    orders,
    ordersLoading,
    fetchOrders,
    placeOrder,
    updateOrderStatus,
    getOrderById,

    // Loyalty state
    loyaltyPoints,

    // Auth methods
    login,
    signup,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use AppContext
 * Ensures context is used within AppProvider
 * @returns {Object} Context value
 * @throws {Error} If used outside AppProvider
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default AppContext;
