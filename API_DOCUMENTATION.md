/**
 * API Service Documentation
 * 
 * Complete guide for using the Axios-based API service layer.
 * This document explains all available endpoints and usage patterns.
 */

# API Service Documentation

## Overview

The `src/services/api.js` file provides a centralized API communication layer using Axios.
It handles all HTTP requests, error management, and authentication.

### Key Features
- ✅ Centralized configuration (base URL, headers, timeout)
- ✅ Request interceptor (automatically adds auth token)
- ✅ Response interceptor (handles 401 errors)
- ✅ Standardized error handling
- ✅ Easy backend migration (change one URL)

---

## Setup & Configuration

### Environment Variables
In `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001  # JSON Server (dev)
# For production:
# VITE_API_BASE_URL=https://api.yourdomain.com
```

### Import in Code
```javascript
import { productAPI, orderAPI, authAPI, handleApiError } from '../services/api';
```

---

## Product API

### Get All Products
```javascript
/**
 * @param {Object} params - Optional query parameters
 * @param {string} params.category - Filter by category
 * @param {number} params._limit - Limit results
 * @param {number} params._page - Pagination
 * @returns {Promise<Object>} Response with products array
 */
const response = await productAPI.getAllProducts({ category: 'Electronics' });
console.log(response.data); // Array of products
```

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 99.99,
    "description": "Premium sound quality",
    "category": "Electronics",
    "stock": 50,
    "image": "url",
    "rating": 4.5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Single Product
```javascript
const response = await productAPI.getProductById(1);
console.log(response.data); // Single product object
```

### Create Product (Admin Only)
```javascript
const newProduct = {
  name: 'New Product',
  price: 149.99,
  description: 'Product description',
  category: 'Electronics',
  stock: 100,
  image: 'image-url'
};

const response = await productAPI.createProduct(newProduct);
console.log(response.data); // Created product with ID
```

### Update Product (Admin Only)
```javascript
const updates = {
  price: 129.99,
  stock: 75
};

const response = await productAPI.updateProduct(1, updates);
console.log(response.data); // Updated product
```

### Delete Product (Admin Only)
```javascript
await productAPI.deleteProduct(1);
console.log('Product deleted');
```

---

## Order API

### Get All Orders
```javascript
// For regular customers: automatically filters by user ID
const response = await orderAPI.getAllOrders();

// For admin: get all orders
// (Requires admin role in currentUser)
```

**Response Example:**
```json
[
  {
    "id": "ORD-1234567890",
    "userId": 123,
    "items": [
      {
        "id": 1,
        "name": "Wireless Headphones",
        "price": 99.99,
        "quantity": 1
      }
    ],
    "total": 99.99,
    "status": "pending",
    "trackingStatus": "Order Placed",
    "shippingAddress": "123 Main St",
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### Get Single Order
```javascript
const response = await orderAPI.getOrderById('ORD-1234567890');
console.log(response.data); // Single order details
```

### Create Order (Place New Order)
```javascript
const newOrder = {
  userId: currentUser.id,
  items: cart,  // Array of cart items
  total: 299.99,
  status: 'pending',
  trackingStatus: 'Order Placed',
  shippingAddress: '123 Main St, City, State 12345',
  paymentMethod: 'credit_card'
};

const response = await orderAPI.createOrder(newOrder);
console.log(response.data); // Created order with ID
```

### Update Order Status (Admin Only)
```javascript
const updates = {
  status: 'shipped',
  trackingStatus: 'In Transit - Expected Delivery: Jan 20'
};

const response = await orderAPI.updateOrder('ORD-1234567890', updates);
console.log(response.data); // Updated order
```

### Delete Order (Admin Only)
```javascript
await orderAPI.deleteOrder('ORD-1234567890');
console.log('Order deleted');
```

---

## Authentication API

### User Registration
```javascript
const userData = {
  email: 'customer@example.com',
  password: 'securePassword123',
  name: 'John Doe'
};

const response = await authAPI.register(userData);
console.log(response.data); // New user object
```

### User Login
```javascript
const response = await authAPI.login('customer@example.com', 'password123');
console.log(response.data); // User object or null if not found
```

**Note**: In demo mode, any email/password combination works.

### Get All Customers (Admin Only)
```javascript
const response = await authAPI.getAllCustomers();
console.log(response.data); // Array of all customers
```

### Get Single Customer
```javascript
const response = await authAPI.getCustomerById(userId);
console.log(response.data); // Customer details
```

### Update Customer Profile
```javascript
const updates = {
  name: 'Updated Name',
  email: 'newemail@example.com'
};

const response = await authAPI.updateCustomer(userId, updates);
console.log(response.data); // Updated customer
```

---

## Error Handling

### Using handleApiError()
```javascript
import { handleApiError } from '../services/api';

try {
  const response = await productAPI.getAllProducts();
  // Success
} catch (error) {
  const apiError = handleApiError(error);
  console.error('Error:', apiError.message);
  console.error('Status:', apiError.status);
  console.error('Data:', apiError.data);
}
```

**Response Format:**
```javascript
{
  message: 'Failed to fetch products',  // User-friendly message
  status: 500,                           // HTTP status code
  data: error.response?.data             // Server response data
}
```

### Common Error Codes
- **400**: Bad Request - Invalid data format
- **401**: Unauthorized - Invalid or expired auth token
- **403**: Forbidden - User doesn't have permission
- **404**: Not Found - Resource doesn't exist
- **500**: Server Error - Backend issue

---

## Request Interceptor (Automatic)

The request interceptor automatically adds authentication:

```javascript
// Automatically happens before every request:
// Authorization: Bearer <token_from_localStorage>

// Login stores token:
localStorage.setItem('authToken', 'your_token_here');

// All subsequent requests include it automatically
```

---

## Response Interceptor (Automatic)

Handles 401 errors automatically:

```javascript
// If response is 401 (Unauthorized):
// 1. Token is removed from localStorage
// 2. User is redirected to /login
// 3. Session is cleared
```

---

## Usage in React Components

### Pattern 1: Via AppContext (Recommended)
```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { products, fetchProducts, isLoading, error } = useApp();

  useEffect(() => {
    fetchProducts(); // Uses productAPI internally
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

### Pattern 2: Direct API Call (For specific use cases)
```javascript
import { productAPI, handleApiError } from '../services/api';

async function fetchProductDetails(productId) {
  try {
    const response = await productAPI.getProductById(productId);
    setProduct(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    setError(apiError.message);
  }
}
```

---

## Backend Migration Guide

### Switching from JSON Server to Real Backend

**Current Setup (Development):**
```
.env.local: VITE_API_BASE_URL=http://localhost:3001
```

**For Production (Real Backend):**
```
.env.local: VITE_API_BASE_URL=https://api.yourdomain.com
```

**That's it!** No code changes needed because:
- All API calls go through `apiClient` (Axios instance)
- `apiClient` uses `API_BASE_URL` from environment
- Just change the URL in `.env` and redeploy

### Backend API Contract

Your backend should implement these endpoints:

```
GET    /api/products           # List all products
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product

GET    /api/orders             # List orders
GET    /api/orders/:id         # Get single order
POST   /api/orders             # Create order
PUT    /api/orders/:id         # Update order
DELETE /api/orders/:id         # Delete order

GET    /api/customers          # List customers
GET    /api/customers/:id      # Get single customer
POST   /api/customers          # Register customer
PUT    /api/customers/:id      # Update customer
```

---

## Performance Tips

### Optimize API Calls
```javascript
// ❌ Bad: Fetches every render
useEffect(() => {
  fetchProducts();
});

// ✅ Good: Fetches only once
useEffect(() => {
  fetchProducts();
}, []); // Empty dependency array
```

### Pagination (for large datasets)
```javascript
// Get page 2 with 10 items per page
const response = await productAPI.getAllProducts({
  _page: 2,
  _limit: 10
});
```

### Filtering
```javascript
// Get only Electronics category
const response = await productAPI.getAllProducts({
  category: 'Electronics'
});
```

---

## Debugging API Issues

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Make a request
4. Click on request to see:
   - Request headers (includes auth token)
   - Request body
   - Response status
   - Response data

### Common Issues & Fixes

**Issue: 401 Unauthorized**
```javascript
// Fix: User needs to login first
const userData = await login('email@example.com', 'password');
// Token is now in localStorage and will be sent with next requests
```

**Issue: CORS Error**
```javascript
// Fix: Ensure JSON Server is running with CORS enabled
npm run json-server -- --cors
```

**Issue: 404 Not Found**
```javascript
// Fix: Check if resource ID exists in db.json
// Verify JSON Server is running and db.json is valid
```

---

## Related Files
- [AppContext](./src/context/AppContext.jsx) - Uses this API service
- [db.json](./db.json) - JSON Server data source
- [.env.local](./.env.local) - Environment configuration
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup guide

---

**Last Updated**: December 2024
**API Version**: 1.0.0
