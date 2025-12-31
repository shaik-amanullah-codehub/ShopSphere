/**
 * SETUP GUIDE - Omnichannel ShopSphere with JSON Server & Axios
 * 
 * This document explains the new architectural setup and how to run the application.
 * Complete restructuring with proper API integration and team coding standards.
 * 
 * ======================== FOR TEAM DEVELOPERS ========================
 * Read this guide before starting development!
 */

# Omnichannel ShopSphere - Complete Setup Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Installation & Setup](#installation--setup)
3. [Running the Application](#running-the-application)
4. [Project Structure](#project-structure)
5. [API Integration](#api-integration)
6. [Coding Standards](#coding-standards)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

This application now uses a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    React Components (UI)                │
│    (Home, Products, Cart, Admin Dashboard, etc.)       │
└─────────────────┬───────────────────────────────────────┘
                  │ useApp() hook
                  ▼
┌─────────────────────────────────────────────────────────┐
│            AppContext (Global State Management)         │
│   (Manages products, cart, orders, users, loyalty)     │
└─────────────────┬───────────────────────────────────────┘
                  │ calls
                  ▼
┌─────────────────────────────────────────────────────────┐
│     API Service Layer (src/services/api.js)            │
│  (Axios instance with interceptors & error handling)   │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP requests
                  ▼
┌─────────────────────────────────────────────────────────┐
│    JSON Server (Development) / Backend API (Production) │
│        Serves data from db.json or database            │
└─────────────────────────────────────────────────────────┘
```

### Key Benefits
- ✅ **Separation of Concerns**: UI, State, API Logic are separate
- ✅ **Easy API Migration**: Change VITE_API_BASE_URL to switch backends
- ✅ **Centralized Error Handling**: All API errors handled in one place
- ✅ **Authentication Ready**: Request interceptors add auth tokens automatically
- ✅ **Team-Friendly**: Well-commented code for 6-member collaboration

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager

### Step 1: Install Dependencies
```bash
cd Omnichannel-fakestore
npm install --legacy-peer-deps
```

### Step 2: Verify Installation
```bash
npm list axios json-server concurrently
```

You should see:
- axios: ^1.6.2
- json-server: ^0.17.4 (dev dependency)
- concurrently: ^8.2.2 (dev dependency)

### Step 3: Check Environment Configuration
Verify `.env.local` file exists with:
```
VITE_API_BASE_URL=http://localhost:3001
```

---

## ▶️ Running the Application

### Option 1: Run Everything Together (Recommended for Development)
```bash
npm run dev:full
```
This starts BOTH:
- JSON Server on http://localhost:3001
- Vite dev server on http://localhost:5173

### Option 2: Run Separately (If you need to debug)

**Terminal 1 - Start JSON Server:**
```bash
npm run json-server
```
Output should show:
```
  ✓ JSON Server started (http://localhost:3001)
```

**Terminal 2 - Start React Development Server:**
```bash
npm run dev
```
Output should show:
```
  VITE v7.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

### Option 3: Production Build
```bash
npm run build        # Creates optimized production build
npm run preview      # Preview the production build locally
```

---

## 📁 Project Structure

```
Omnichannel-fakestore/
│
├── db.json                          # JSON Server database (mock data)
├── .env.local                       # Environment configuration (DEV)
├── vite.config.js                   # Vite configuration
├── package.json                     # Dependencies and scripts
│
├── public/                          # Static assets
│
├── src/
│   ├── main.jsx                     # App entry point
│   ├── App.jsx                      # Main App component with routing
│   ├── index.css                    # Global styles
│   │
│   ├── services/
│   │   └── api.js ⭐               # CRITICAL: API service layer with Axios
│   │       ├── apiClient            # Axios instance configuration
│   │       ├── Request interceptor  # Adds auth tokens
│   │       ├── Response interceptor # Handles errors & redirects
│   │       ├── productAPI           # Product API endpoints
│   │       ├── orderAPI             # Order API endpoints
│   │       ├── authAPI              # Auth API endpoints
│   │       └── handleApiError()     # Error standardization
│   │
│   ├── context/
│   │   └── AppContext.jsx ⭐       # CRITICAL: Global state management
│   │       ├── User state           # currentUser, login, logout
│   │       ├── Product methods      # fetchProducts, addProduct, etc.
│   │       ├── Cart methods         # addToCart, removeFromCart, etc.
│   │       ├── Order methods        # placeOrder, updateOrderStatus
│   │       └── useApp() hook        # Custom hook to access context
│   │
│   ├── components/
│   │   └── Navbar.jsx               # Navigation component
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Home page
│   │   ├── Products.jsx             # Products listing page
│   │   ├── ProductDetail.jsx        # Single product details
│   │   ├── Cart.jsx                 # Shopping cart
│   │   ├── OrderTracking.jsx        # Order tracking/history
│   │   ├── Profile.jsx              # User profile
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx            # Customer login
│   │   │   └── Signup.jsx           # Customer registration
│   │   │
│   │   └── Admin/                   # Admin portal
│   │       ├── AdminLayout.jsx      # Admin page layout
│   │       ├── Dashboard.jsx        # Sales analytics & overview
│   │       ├── ProductManager.jsx   # Add/edit/delete products
│   │       └── OrderFulfillment.jsx # Manage customer orders
│   │
│   ├── data/                        # Static data files (optional, for reference)
│   │   └── products.json            # Sample data structure
│   │
│   └── assets/                      # Images, icons, etc.
│
└── node_modules/                    # Installed dependencies
```

### 🌟 Key Files Explained

#### `db.json` - JSON Server Database
- Serves as mock backend data
- Contains collections: products, orders, customers
- JSON Server exposes as REST API endpoints (GET, POST, PUT, DELETE)
- Later replaced by actual backend database

#### `src/services/api.js` - API Service Layer
- **Purpose**: Centralize all API communication
- **Contains**:
  - Axios instance configuration with baseURL, timeout, headers
  - Request interceptor (adds auth token from localStorage)
  - Response interceptor (handles 401 errors, redirects to login)
  - productAPI, orderAPI, authAPI objects with all endpoints
  - handleApiError() utility for standardized error responses
- **Usage**: Import in AppContext and components
- **Easy Migration**: Just change VITE_API_BASE_URL to switch backends

#### `src/context/AppContext.jsx` - Global State Management
- **Purpose**: Single source of truth for app state
- **Contains**:
  - User authentication state (currentUser)
  - Product catalog (fetched from API)
  - Shopping cart (persisted to localStorage)
  - Orders (fetched from API)
  - Loyalty points
  - All methods to modify state
- **Usage**: Access via `useApp()` hook in any component
- **Benefits**: No prop drilling, clean data flow

---

## 🔌 API Integration

### API Endpoints Available

All endpoints communicate with JSON Server (or your backend):

#### Products
```javascript
GET    /products           # Get all products
GET    /products/:id       # Get single product
POST   /products           # Create new product (admin)
PUT    /products/:id       # Update product (admin)
DELETE /products/:id       # Delete product (admin)
```

#### Orders
```javascript
GET    /orders             # Get all orders (or filtered by userId)
GET    /orders/:id         # Get single order
POST   /orders             # Create new order (customer places order)
PUT    /orders/:id         # Update order (admin updates status)
DELETE /orders/:id         # Delete order (admin)
```

#### Customers
```javascript
GET    /customers          # Get all customers
GET    /customers/:id      # Get single customer
POST   /customers          # Register new customer
PUT    /customers/:id      # Update customer profile
```

### Using API in Components

#### Method 1: Using AppContext Hook (Recommended)
```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { products, cart, addToCart, fetchProducts } = useApp();
  
  useEffect(() => {
    fetchProducts(); // Fetch from API
  }, []);
  
  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

#### Method 2: Direct API Calls (For advanced use)
```javascript
import { productAPI } from '../services/api';

async function getProduct() {
  try {
    const response = await productAPI.getProductById(1);
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }
}
```

### Authentication Token Handling

**Automatic (via interceptors):**
```javascript
// Login stores token in localStorage
localStorage.setItem('authToken', 'your_token_here');

// All subsequent API calls automatically include it:
// Authorization: Bearer your_token_here
```

**401 Error Handling:**
- If token expires (401 response), user is redirected to login
- Token is cleared from localStorage
- User must log in again

---

## 📝 Coding Standards & Best Practices

### For 6-Member Team Collaboration

#### 1. JSDoc Comments
Every function should have JSDoc:
```javascript
/**
 * Fetches all products from the API
 * Updates the products state with results
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If API call fails
 * 
 * @example
 * await fetchProducts();
 */
const fetchProducts = async () => {
  // implementation
};
```

#### 2. File Structure
- One component per file
- Related styles in same folder
- Clear naming: `ComponentName.jsx`, `componentName.css`

#### 3. Component Template
```javascript
/**
 * ComponentName - Brief description
 * 
 * Purpose: What this component does
 * Used in: Where it's used
 * Dependencies: What it depends on
 * 
 * @component
 * @returns {React.ReactElement}
 * 
 * @example
 * return <ComponentName prop="value" />
 */

import { useApp } from '../context/AppContext';

export default function ComponentName({ prop }) {
  const { state, method } = useApp();
  
  // Component logic
  
  return (
    // JSX
  );
}
```

#### 4. State Management Rules
- Use AppContext for shared state
- Use useState for component-local state
- Persist important data to localStorage
- Always handle loading and error states

#### 5. Error Handling
```javascript
try {
  const response = await productAPI.getAllProducts();
  setProducts(response.data);
} catch (error) {
  const apiError = handleApiError(error);
  console.error('Error:', apiError.message);
  setError(apiError.message);
}
```

#### 6. Code Review Checklist
- [ ] JSDoc comments on all functions
- [ ] Error handling in try-catch blocks
- [ ] Loading states for async operations
- [ ] No hardcoded API URLs (use .env)
- [ ] localStorage keys are consistent
- [ ] Component is reusable and not too complex
- [ ] No console.log in production code

---

## ✅ Common Tasks

### Task 1: Add a New Product (Admin)
```javascript
const { addProduct, isLoading, error } = useApp();

async function handleAddProduct() {
  try {
    const newProduct = {
      name: 'New Product',
      price: 99.99,
      description: 'Product description',
      category: 'Electronics',
      stock: 100,
      image: 'url'
    };
    await addProduct(newProduct);
    alert('Product added successfully!');
  } catch (err) {
    console.error('Failed to add product:', err);
  }
}
```

### Task 2: Fetch Orders (Customer or Admin)
```javascript
const { orders, fetchOrders, ordersLoading } = useApp();

useEffect(() => {
  fetchOrders(); // Fetches user's orders if customer, all if admin
}, []);

if (ordersLoading) return <div>Loading orders...</div>;

return (
  <div>
    {orders.map(order => (
      <div key={order.id}>{order.id} - {order.status}</div>
    ))}
  </div>
);
```

### Task 3: Update Order Status (Admin)
```javascript
const { updateOrderStatus } = useApp();

async function handleStatusUpdate() {
  try {
    await updateOrderStatus(
      'ORD-123456',           // Order ID
      'shipped',              // New status
      'In Transit'            // Tracking status
    );
    alert('Order updated!');
  } catch (err) {
    console.error('Update failed:', err);
  }
}
```

### Task 4: Place an Order (Customer)
```javascript
const { placeOrder } = useApp();

async function handleCheckout() {
  try {
    const order = await placeOrder({
      total: 299.99,
      shippingAddress: '123 Main St',
      paymentMethod: 'credit_card'
    });
    alert(`Order placed! Order ID: ${order.id}`);
  } catch (err) {
    console.error('Order placement failed:', err);
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "JSON Server not running"
**Solution:**
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Mac/Linux

# If in use, kill the process or use different port
npm run json-server -- --port 3002
```

### Issue: "API_BASE_URL is undefined"
**Solution:**
- Check .env.local file exists
- Verify VITE_API_BASE_URL is set correctly
- Restart dev server: `npm run dev`

### Issue: "useApp() hook error outside AppProvider"
**Solution:**
- Ensure component is wrapped inside `<AppProvider>`
- Check App.jsx has AppProvider wrapper

### Issue: "401 Unauthorized errors"
**Solution:**
- Login first via Login.jsx
- Token is stored in localStorage automatically
- Check browser DevTools -> Application -> localStorage

### Issue: "Port 5173 already in use"
**Solution:**
```bash
npm run dev -- --port 3000  # Use different port
```

### Issue: "CORS errors from JSON Server"
**Solution:**
JSON Server has CORS enabled by default. If still issues:
```bash
npm run json-server -- --cors  # Explicitly enable
```

---

## 📚 Additional Resources

### Learning Resources
- [React Documentation](https://react.dev)
- [Context API Guide](https://react.dev/reference/react/useContext)
- [Axios Documentation](https://axios-http.com)
- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Vite Documentation](https://vitejs.dev)

### Related Files
- [API Service Documentation](./src/services/api.js)
- [AppContext Implementation](./src/context/AppContext.jsx)
- [Database Schema](./db.json)
- [Environment Configuration](./.env.local)

---

## 🎯 Development Workflow

### Daily Development Cycle
1. **Start the app:**
   ```bash
   npm run dev:full
   ```

2. **Make changes** to components, styles, or logic

3. **Hot reload** happens automatically (Vite watches files)

4. **Check console** for errors and warnings

5. **Test features** locally in browser

6. **Commit changes:**
   ```bash
   git add .
   git commit -m "Feature: description"
   git push
   ```

### Before Committing Code
1. ✅ All JSDoc comments added
2. ✅ Error handling implemented
3. ✅ No console.log debug statements
4. ✅ Tests pass (if applicable)
5. ✅ Code follows standards

---

## 📞 Team Communication

### For Team Members
- **Architecture Questions**: Check this guide first
- **API Issues**: Debug using browser Network tab
- **State Problems**: Trace through useApp() hook
- **Deployment Questions**: See README.md

### Common Issues to Check
1. Is JSON Server running on port 3001?
2. Is React app running on port 5173?
3. Is .env.local file present?
4. Are all dependencies installed?

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: ✅ Production Ready
