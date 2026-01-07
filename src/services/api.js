/**
 * API Service Module
 *
 * This module provides centralized API communication using Axios.
 * It handles all requests to the backend/JSON Server with error handling,
 * request/response interceptors, and standardized responses.
 *
 * Usage:
 * - For production: Update API_BASE_URL to your backend API endpoint
 * - For development: Use JSON Server (npm run json-server)
 *
 * @module services/api
 */

import axios from "axios";

/**
 * Base URL for API requests
 * - Development: http://localhost:3001 (JSON Server)
 * - Production: Update to your backend API URL in .env file
 *
 * For Vite projects, use import.meta.env instead of process.env
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Create Axios instance with default configuration
 * Includes timeout, headers, and base URL
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds authentication token to request headers if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add token to headers if it exists in localStorage
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles error responses and token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * PRODUCT API ENDPOINTS
 */
export const productAPI = {
  /**
   * Fetch all products with optional filtering
   * @param {Object} params - Query parameters (limit, sort, etc.)
   * @returns {Promise} Product list
   */
  getAllProducts: (params = {}) => apiClient.get("/products", { params }),

  /**
   * Fetch single product by ID
   * @param {number} id - Product ID
   * @returns {Promise} Product details
   */
  getProductById: (id) => apiClient.get(`/products/${id}`),

  /**
   * Create new product (Admin only)
   * @param {Object} productData - Product details
   * @returns {Promise} Created product
   */
  createProduct: (productData) => apiClient.post("/products", productData),

  /**
   * Update existing product (Admin only)
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product details
   * @returns {Promise} Updated product
   */
  // Use PATCH to perform partial updates so fields are not unintentionally replaced
  updateProduct: (id, productData) =>
    apiClient.patch(`/products/${id}`, productData),

  /**
   * Delete product (Admin only)
   * @param {number} id - Product ID
   * @returns {Promise} Deletion confirmation
   */
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

/**
 * ORDER API ENDPOINTS
 */
export const orderAPI = {
  /**
   * Fetch all orders (Admin) or user's orders (Customer)
   * @param {Object} params - Query parameters (userId, status, etc.)
   * @returns {Promise} Order list
   */
  getAllOrders: (params = {}) => apiClient.get("/orders", { params }),

  /**
   * Fetch single order by ID
   * @param {number} id - Order ID
   * @returns {Promise} Order details
   */
  getOrderById: (id) => apiClient.get(`/orders/${id}`),

  /**
   * Create new order
   * @param {Object} orderData - Order details
   * @returns {Promise} Created order
   */
  createOrder: (orderData) => apiClient.post("/orders", orderData),

  /**
   * Update order status (Admin only)
   * @param {number} id - Order ID
   * @param {Object} orderData - Updated order details
   * @returns {Promise} Updated order
   */
  updateOrder: (id, orderData) => apiClient.put(`/orders/${id}`, orderData),

  /**
   * Delete order (Admin only)
   * @param {number} id - Order ID
   * @returns {Promise} Deletion confirmation
   */
  deleteOrder: (id) => apiClient.delete(`/orders/${id}`),
};

/**
 * CUSTOMER/AUTH API ENDPOINTS
 */
export const authAPI = {
  /**
   * Register new customer
   * @param {Object} customerData - Customer registration details
   * @returns {Promise} Registration response with token
   */
  register: (customerData) => apiClient.post("/customers", customerData),

  /**
   * Login customer
   * @param {string} email - Customer email
   * @param {string} password - Customer password
   * @returns {Promise} Login response with token
   */
  login: (email, password) =>
    apiClient.get("/customers", {
      params: { email, password },
    }),

  /**
   * Fetch all customers (Admin only)
   * @returns {Promise} Customer list
   */
  getAllCustomers: () => apiClient.get("/customers"),

  /**
   * Fetch customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise} Customer details
   */
  getCustomerById: (id) => apiClient.get(`/customers/${id}`),

  /**
   * Update customer profile
   * @param {number} id - Customer ID
   * @param {Object} customerData - Updated customer details
   * @returns {Promise} Updated customer
   */
  updateCustomer: (id, customerData) =>
    apiClient.put(`/customers/${id}`, customerData),

  checkEmailExists: (email) =>
    apiClient.get("/customers", {
      params: { email },
    }),

  // ... (keep getAllCustomers, getCustomerById, etc.)

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise} List of users with that email (empty if none)
   */

  register: (customerData) => apiClient.post("/customers", customerData),
  login: (email, password) =>
    apiClient.get("/customers", { params: { email, password } }),
  getAllCustomers: () => apiClient.get("/customers"),
  getCustomerById: (id) => apiClient.get(`/customers/${id}`),
  updateCustomer: (id, customerData) =>
    apiClient.put(`/customers/${id}`, customerData),
};

/**
 * ERROR HANDLER UTILITY
 * Standardizes error responses across the application
 */
export const handleApiError = (error) => {
  const errorResponse = {
    message: "An error occurred",
    status: null,
    data: null,
  };

  if (error.response) {
    // Server responded with error status
    errorResponse.status = error.response.status;
    errorResponse.message = error.response.data?.message || error.message;
    errorResponse.data = error.response.data;
  } else if (error.request) {
    // Request made but no response
    errorResponse.message = "No response from server. Check your connection.";
    errorResponse.status = "NETWORK_ERROR";
  } else {
    // Error in request setup
    errorResponse.message = error.message;
  }

  console.error("API Error:", errorResponse);
  return errorResponse;
};

export default apiClient;
