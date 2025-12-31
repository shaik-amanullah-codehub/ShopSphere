/**
 * DEVELOPER QUICK REFERENCE CARD
 * 
 * Essential commands, patterns, and code snippets for quick lookup
 */

# 🚀 Developer Quick Reference Card

## ⚡ Quick Commands

```bash
# Start everything
npm run dev:full

# Start only React app
npm run dev

# Start only JSON Server
npm run json-server

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint

# Install dependencies
npm install --legacy-peer-deps
```

---

## 🏗️ Architecture Quick Reference

```
State: AppContext (src/context/AppContext.jsx)
  ↓
API: api.js (src/services/api.js)
  ↓
Backend: JSON Server / Real API
```

---

## 📍 Where to Find Things

| What | Where |
|------|-------|
| State management | `src/context/AppContext.jsx` |
| API endpoints | `src/services/api.js` |
| Products page | `src/pages/Home.jsx` |
| Mock data | `db.json` |
| Config | `.env.local` |
| Setup help | `SETUP_GUIDE.md` |
| API docs | `API_DOCUMENTATION.md` |
| Team guide | `TEAM_ONBOARDING.md` |

---

## 💻 Code Snippets

### Use AppContext State
```javascript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { 
    products, 
    cart, 
    addToCart, 
    currentUser,
    placeOrder,
    isLoading,
    error 
  } = useApp();
  
  // Use these values
}
```

### Display Products
```javascript
{isLoading && <div>Loading...</div>}
{error && <div>Error: {error}</div>}
{products.map(p => (
  <div key={p.id}>{p.name}</div>
))}
```

### Add to Cart
```javascript
const { addToCart } = useApp();
addToCart(product, 1);  // product object, quantity
```

### Handle Form Submission
```javascript
try {
  const response = await productAPI.createProduct(data);
  alert('Success!');
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.message);
}
```

### Login
```javascript
const { login } = useApp();
await login('email@example.com', 'password123');
```

### Place Order
```javascript
const { placeOrder } = useApp();
const order = await placeOrder({
  total: 299.99,
  shippingAddress: '123 Main St',
  paymentMethod: 'credit_card'
});
```

---

## 🔗 API Endpoints

### Products
```
GET    /products              # Get all
GET    /products/:id          # Get one
POST   /products              # Create
PUT    /products/:id          # Update
DELETE /products/:id          # Delete
```

### Orders
```
GET    /orders                # Get all/filtered
GET    /orders/:id            # Get one
POST   /orders                # Create
PUT    /orders/:id            # Update
DELETE /orders/:id            # Delete
```

### Customers
```
GET    /customers             # Get all
GET    /customers/:id         # Get one
POST   /customers             # Register
PUT    /customers/:id         # Update
```

---

## 🎯 Common Patterns

### Pattern 1: Load Data on Component Mount
```javascript
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Component() {
  const { orders, fetchOrders, ordersLoading } = useApp();
  
  useEffect(() => {
    fetchOrders();
  }, []);  // Empty array = runs once
  
  if (ordersLoading) return <div>Loading...</div>;
  return <div>{/* content */}</div>;
}
```

### Pattern 2: Handle Form with Loading State
```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  try {
    await productAPI.createProduct(formData);
    // Success
  } catch (err) {
    setError(handleApiError(err).message);
  } finally {
    setIsLoading(false);
  }
};
```

### Pattern 3: Use AppContext for Global State
```javascript
// ✅ DO THIS
const { products, cart } = useApp();

// ❌ DON'T DO THIS (prop drilling)
<Product product={product} onAdd={handleAdd} />
<Cart items={cart} onRemove={handleRemove} />
```

---

## 🐛 Debugging Quick Fixes

| Problem | Fix |
|---------|-----|
| "API 404" | Is JSON Server running? `npm run json-server` |
| "No data" | Are you using `useApp()`? |
| "Data disappears on refresh" | Use AppContext, not useState |
| "401 Unauthorized" | Are you logged in? |
| "useApp error" | Is app wrapped in `<AppProvider>`? |
| "Port in use" | `npm run dev -- --port 3000` |

---

## 📝 JSDoc Template

```javascript
/**
 * Brief description
 * 
 * More details (optional)
 * 
 * @param {type} paramName - Description
 * @returns {type} What returns
 * @throws {Error} What errors
 */
```

---

## 🔄 Fetch Patterns

### Fetch Products (Already in AppContext)
```javascript
const { products, fetchProducts, productsLoading } = useApp();

useEffect(() => {
  fetchProducts();  // Fetches from API
}, []);
```

### Fetch Orders
```javascript
const { orders, fetchOrders } = useApp();

useEffect(() => {
  fetchOrders();  // Filters by user if customer
}, []);
```

### Create Something
```javascript
const { addProduct } = useApp();

const response = await addProduct({
  name: 'Product',
  price: 99.99,
  // ... other fields
});
```

---

## 🔑 Environment Variables

```bash
# .env.local

# API Base URL (for JSON Server in dev)
VITE_API_BASE_URL=http://localhost:3001

# App Settings
VITE_APP_NAME=Omnichannel ShopSphere
VITE_DEBUG_MODE=true
```

---

## 📂 Folder Structure at a Glance

```
src/
├── pages/           ← Page components
├── components/      ← Reusable components
├── context/         ← AppContext here
├── services/        ← API service here
├── App.jsx         ← Routing
├── main.jsx        ← Entry point
└── assets/         ← Images, etc
```

---

## 🚀 Deployment Commands

```bash
# Build
npm run build

# This creates optimized bundle in dist/

# To preview locally
npm run preview
```

---

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-reload - no need to restart
2. **localStorage**: Cart and user data persist to browser storage
3. **DevTools**: Press F12 to debug in browser
4. **Network Tab**: See API requests in Network tab (F12)
5. **Console Logs**: Check browser console for errors
6. **Read Comments**: Code has JSDoc comments explaining everything
7. **Check Tests**: Verify changes work before pushing

---

## 📞 Getting Help

1. Check `SETUP_GUIDE.md`
2. Check `API_DOCUMENTATION.md`
3. Check code comments
4. Check example: `src/pages/Home.jsx`
5. Ask team!

---

## 🎯 Daily Workflow

```bash
# Start day
npm run dev:full

# Make changes
# (Hot reload happens automatically)

# Test in browser
# (Check http://localhost:5173)

# Commit when done
git add .
git commit -m "Feature: description"
git push
```

---

## ✨ Remember

- Always use AppContext for shared state
- Always add JSDoc comments
- Always handle errors
- Always show loading states
- Always test your changes
- Ask for help if stuck!

---

**Last Updated**: December 2024  
**Keep this handy!** 📌
