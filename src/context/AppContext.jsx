import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI, orderAPI, authAPI, handleApiError } from '../services/api';

const AppContext = createContext();

const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  CART: 'cart',
  LOYALTY_POINTS: 'loyaltyPoints',
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

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

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedPoints) setLoyaltyPoints(JSON.parse(savedPoints));
    } catch (err) {
      console.error('Error loading from localStorage:', err);
    }
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOYALTY_POINTS, JSON.stringify(loyaltyPoints));
  }, [loyaltyPoints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      setOrdersLoading(true);
      (async () => {
        try {
          const params = currentUser?.role === 'admin' ? {} : { userId: currentUser?.id };
          const response = await orderAPI.getAllOrders(params);
          setOrders(response.data);
        } catch (err) {
          setError(handleApiError(err).message);
        } finally {
          setOrdersLoading(false);
        }
      })();
    }
  }, [currentUser]);

  // ===== UPDATED ORDER METHODS FOR IN-STORE PICKUP =====

  // 1. Updated placeOrder: Points are NO LONGER awarded here
  const placeOrder = useCallback(async (orderData) => {
    setIsLoading(true);
    setError(null);
    try {
      const activeCampaignId = sessionStorage.getItem('activeCampaignId');
      const isPickup = orderData.inStorePickup || false;

      const newOrder = {
        id: `ORD-${Date.now()}`,
        userId: currentUser?.id,
        items: [...cart],
        total: orderData.total,
        status: 'pending',
        // In-store starts as "Order Placed", standard starts as "Processing"
        trackingStatus: isPickup ? 'Order Placed' : 'Processing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        inStorePickup: isPickup,
        campaignId: activeCampaignId || null 
      };

      const response = await orderAPI.createOrder(newOrder);

      // Local state update
      setOrders(prevOrders => [...prevOrders, response.data]);
      
      // SUCCESS: Clear cart and campaign signal, but DO NOT add points yet
      setCart([]);
      sessionStorage.removeItem('activeCampaignId'); 

      return response.data;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, cart]);

  // 2. Updated updateOrderStatus: Award points ONLY on delivery
  const updateOrderStatus = useCallback(async (orderId, newStatus, trackingStatus, awardPoints = false) => {
    setIsLoading(true);
    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) throw new Error('Order not found');

      const updatedOrder = {
        ...orderToUpdate,
        status: newStatus,
        trackingStatus: trackingStatus || orderToUpdate.trackingStatus,
        updatedAt: new Date().toISOString()
      };

      const response = await orderAPI.updateOrder(orderId, updatedOrder);

      // POINT AWARDING LOGIC: Triggered by Admin action
      if (awardPoints) {
        const pointsToEarn = Math.floor(orderToUpdate.total / 10);
        
        // 1. Update Customer record in db.json
        const customerRes = await authAPI.getCustomerById(orderToUpdate.userId);
        const customer = customerRes.data;
        
        const updatedCustomer = {
          ...customer,
          loyaltyPoints: (customer.loyaltyPoints || 0) + pointsToEarn
        };
        
        await authAPI.updateCustomer(customer.id, updatedCustomer);
        
        // 2. If the order belongs to the currently logged-in user, update local state
        if (currentUser && currentUser.id === orderToUpdate.userId) {
          setLoyaltyPoints(prev => prev + pointsToEarn);
        }
      }

      setOrders(prev => prev.map(o => o.id === orderId ? response.data : o));
      return response.data;
    } catch (err) {
      setError(handleApiError(err).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [orders, currentUser]);

  // ===== REMAINING METHODS (AUTHENTICATION & PRODUCTS) =====

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.getAllCustomers();
      const customer = response.data.find(c => c.email === email && c.password === password);
      if (!customer) throw new Error('Invalid credentials');
      const userData = { id: customer.id, email: customer.email, name: customer.name, role: customer.role || 'customer' };
      setCurrentUser(userData);
      return userData;
    } finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setLoyaltyPoints(0);
    localStorage.clear();
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing 
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);
  
  const updateCartQuantity = useCallback((id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeFromCart]);

  const value = {
    currentUser, isLoading, error, products, productsLoading, fetchProducts,
    cart, addToCart, removeFromCart, updateCartQuantity,
    orders, ordersLoading, placeOrder, updateOrderStatus,
    loyaltyPoints, login, logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
export default AppContext;