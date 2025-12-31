import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState(productsData.products);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');
    const savedPoints = localStorage.getItem('loyaltyPoints');
    const savedProducts = localStorage.getItem('products');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedPoints) setLoyaltyPoints(JSON.parse(savedPoints));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('loyaltyPoints', JSON.stringify(loyaltyPoints));
  }, [loyaltyPoints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const login = (user) => {
    const userData = {
      id: user.id || Date.now(),
      email: user.email,
      name: user.name,
      role: user.role || 'customer',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(userData);
    return userData;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('currentUser');
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      userId: currentUser?.id,
      items: cart,
      total: orderData.total,
      status: 'pending',
      trackingStatus: 'Order Placed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod
    };

    setOrders([...orders, newOrder]);
    const points = Math.floor(orderData.total / 10); // 1 point per $10
    setLoyaltyPoints(loyaltyPoints + points);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, trackingStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? {
          ...order,
          status: newStatus,
          trackingStatus: trackingStatus || order.trackingStatus,
          updatedAt: new Date().toISOString()
        }
        : order
    ));
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, stock: newStock } : product
    ));
  };

  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, product]);
    return product;
  };

  const updateProduct = (productId, updates) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const value = {
    currentUser,
    login,
    logout,
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    orders,
    placeOrder,
    updateOrderStatus,
    loyaltyPoints,
    updateProductStock,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
