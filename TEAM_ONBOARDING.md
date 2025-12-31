/**
 * TEAM ONBOARDING GUIDE
 * 
 * For new team members or developers joining the project.
 * This guide covers everything needed to start contributing.
 */

# 👥 Team Onboarding Guide - Omnichannel ShopSphere

Welcome to the Omnichannel ShopSphere development team! This guide will get you up and running in 15 minutes.

## ⚡ Quick Start (5 minutes)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Omnichannel-demo/Omnichannel-fakestore
```

### Step 2: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 3: Start the Application
```bash
npm run dev:full
```

This starts both:
- **JSON Server** (mock backend) → http://localhost:3001
- **React App** (frontend) → http://localhost:5173

Open http://localhost:5173 in your browser. ✅ Done!

---

## 🏗️ Architecture Overview (Understand This First!)

The application is built with modern React architecture:

```
┌─────────────────────────────────────────┐
│    React Components (UI Layer)          │
│  (What users see and interact with)    │
└──────────────┬──────────────────────────┘
               │ useApp() hook
               ▼
┌─────────────────────────────────────────┐
│  AppContext (State Management Layer)    │
│  (Where data lives - products, orders) │
└──────────────┬──────────────────────────┘
               │ calls API functions
               ▼
┌─────────────────────────────────────────┐
│    API Service (api.js)                 │
│  (Talks to backend/JSON Server)        │
└──────────────┬──────────────────────────┘
               │ HTTP requests
               ▼
┌─────────────────────────────────────────┐
│  JSON Server (Development Backend)      │
│  Or Real Backend (Production)           │
└─────────────────────────────────────────┘
```

### Key Files You Need to Know:

| File | Purpose | Notes |
|------|---------|-------|
| `src/context/AppContext.jsx` | Global state management | Handles all app data |
| `src/services/api.js` | API communication layer | Talks to backend |
| `src/pages/Home.jsx` | Example component | Well-commented reference |
| `db.json` | Mock database | JSON Server reads this |
| `.env.local` | Configuration | API URL and settings |

---

## 👨‍💻 Development Workflow

### Day-to-Day Development

1. **Start the app:**
   ```bash
   npm run dev:full
   ```

2. **Make changes** to code (Vite auto-reloads)

3. **Check for errors** in browser console and terminal

4. **Test your changes** in the browser

5. **Commit when done:**
   ```bash
   git add .
   git commit -m "Feature: description"
   git push
   ```

### File Structure You'll Work With

```
src/
├── pages/                 # Page components (Home, Cart, etc.)
│   ├── Home.jsx          # ← Example: Well-commented component
│   ├── Products.jsx
│   ├── Cart.jsx
│   ├── Admin/            # Admin pages
│   │   ├── Dashboard.jsx
│   │   ├── ProductManager.jsx
│   │   └── OrderFulfillment.jsx
│   └── Auth/             # Login/Signup
│       ├── Login.jsx
│       └── Signup.jsx
├── components/           # Reusable components
│   └── Navbar.jsx
├── context/              # State management
│   └── AppContext.jsx    # ← Learn this first
├── services/             # API calls
│   └── api.js            # ← Understand this second
└── App.jsx              # Main app file with routing
```

---

## 🧠 Learning Path

### Phase 1: Understanding State Management (1-2 hours)

**Read these files in order:**
1. `SETUP_GUIDE.md` (Architecture section)
2. `src/context/AppContext.jsx` (read all comments)
3. Try using `useApp()` hook in a component

**Quiz yourself:**
- Where does app data live? → AppContext
- How do components access products? → `const { products } = useApp()`
- How do you add a product to cart? → `addToCart(product)`

### Phase 2: Understanding API Integration (1 hour)

**Read these files:**
1. `API_DOCUMENTATION.md` (read all examples)
2. `src/services/api.js` (read all comments)

**Quiz yourself:**
- What HTTP library is used? → Axios
- How many products API endpoints exist? → 5 (GET all, GET one, POST, PUT, DELETE)
- What happens when user gets 401 error? → Auto redirect to login

### Phase 3: Learn by Example (1-2 hours)

**Study `src/pages/Home.jsx`:**
- Read all JSDoc comments
- Understand how `useApp()` is used
- See how state is filtered and sorted
- Look at error and loading states

**Tasks to practice:**
1. Add a new sorting option to Home.jsx
2. Create a new component that lists all orders
3. Add a "favorites" feature to products

---

## 📝 Coding Standards (Must Follow!)

### 1. JSDoc Comments on Every Function
```javascript
/**
 * Brief description of what this function does
 * 
 * @param {type} paramName - What this parameter is for
 * @returns {type} What this function returns
 * @throws {Error} What errors it might throw
 * 
 * @example
 * doSomething(param); // returns result
 */
function doSomething(param) {
  // implementation
}
```

### 2. Component File Template
```javascript
/**
 * ComponentName - Brief one-liner
 * 
 * What this component does (2-3 sentences)
 * Where it's used in the app
 * 
 * @component
 * @returns {React.ReactElement}
 */
import React from 'react';
import { useApp } from '../context/AppContext';

export default function ComponentName() {
  const { state } = useApp();
  
  return (
    // JSX here
  );
}
```

### 3. Error Handling - Always Use Try-Catch
```javascript
// ❌ DON'T: Async call without error handling
const products = await productAPI.getAllProducts();

// ✅ DO: Use try-catch with proper error handling
try {
  const response = await productAPI.getAllProducts();
  setProducts(response.data);
} catch (error) {
  const apiError = handleApiError(error);
  console.error('Error loading products:', apiError);
  setError(apiError.message);
}
```

### 4. State Management Rules
```javascript
// ✅ DO: Use AppContext for shared state
const { products, cart } = useApp();

// ✅ DO: Use useState for local component state
const [isOpen, setIsOpen] = useState(false);

// ❌ DON'T: Pass data through 20 props (prop drilling)
// Use AppContext instead!
```

### 5. No Hardcoded URLs or Secrets
```javascript
// ❌ DON'T
const API_URL = 'http://localhost:3001';

// ✅ DO
const API_URL = import.meta.env.VITE_API_BASE_URL;

// ❌ DON'T
const API_KEY = 'abc123secret456';

// ✅ DO (put in .env.local)
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 6. Code Review Checklist
Before committing, verify:
- ✅ JSDoc comments on all functions
- ✅ Error handling in try-catch blocks
- ✅ Loading states for async operations
- ✅ No console.log debugging code
- ✅ No hardcoded URLs or API keys
- ✅ Component name starts with Capital letter
- ✅ File names match component names

---

## 🔧 Common Tasks & Examples

### Task 1: Display Products in a Component
```javascript
import { useApp } from '../context/AppContext';

export default function ProductList() {
  // Get products from global state (AppContext)
  const { products, productsLoading, error } = useApp();
  
  // Handle loading state
  if (productsLoading) return <div>Loading...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error}</div>;
  
  // Display products
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Task 2: Add Product to Cart
```javascript
import { useApp } from '../context/AppContext';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  
  const handleAddToCart = () => {
    addToCart(product, 1); // product, quantity
    alert('Added to cart!');
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Task 3: Handle Form Submission (Create/Update)
```javascript
const [formData, setFormData] = useState({
  name: '',
  price: ''
});
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  try {
    // Call API
    const response = await productAPI.createProduct(formData);
    
    // Success handling
    alert('Product created!');
    // Clear form, redirect, etc.
  } catch (err) {
    // Error handling
    const apiError = handleApiError(err);
    setError(apiError.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🐛 Debugging Tips

### 1. Check Browser Console
Press F12 → Console tab
- Look for red error messages
- Read error stack traces
- Look for warning messages

### 2. Check Network Requests
Press F12 → Network tab
- Click on API request
- Check Request headers (should include Authorization)
- Check Response (what data came back?)
- Check Status (should be 200 for success, 401 for auth error)

### 3. React DevTools
Install "React Developer Tools" browser extension
- See component tree
- Check props and state
- Track component updates

### 4. Check AppContext State
In any component:
```javascript
const { products, cart, orders, currentUser } = useApp();
console.log('Products:', products);
console.log('Cart:', cart);
console.log('Current User:', currentUser);
```

### 5. Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| "API is 404 Not Found" | JSON Server not running | `npm run json-server` in new terminal |
| "useApp is not a function" | Component not in AppProvider | Wrap app in `<AppProvider>` |
| "Data disappears on page refresh" | Not using API | Use `useApp()` instead of local state |
| "401 Unauthorized errors" | Not logged in | Login via Login.jsx first |
| "Port 5173 already in use" | Another app using it | `npm run dev -- --port 3000` |

---

## 🎯 First Task: Modify Home.jsx

Let's make sure you understand the architecture by making a small change:

### Task: Add a "Clear Filters" Button to Home.jsx

**Steps:**
1. Open `src/pages/Home.jsx`
2. After the filters section, add a reset button
3. The button should reset search, category, and sort to defaults
4. Add JSDoc comments explaining what it does

**Template:**
```javascript
// Add this function inside Home component
const resetFilters = () => {
  setSearchTerm('');
  setCategoryFilter('All');
  setSortBy('newest');
};

// Add this button to the filters HTML
<button 
  className="btn btn-secondary"
  onClick={resetFilters}
>
  Clear Filters
</button>
```

**After completing:**
- Take a screenshot
- Commit: `git commit -m "Feature: Add clear filters button"`
- Push: `git push`

---

## 📚 Resources

### Documentation Files
- `SETUP_GUIDE.md` - How to run the app
- `API_DOCUMENTATION.md` - All API endpoints
- This file - Team onboarding

### Code Examples
- `src/pages/Home.jsx` - Well-commented reference
- `src/context/AppContext.jsx` - State management
- `src/services/api.js` - API integration

### External Resources
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [JavaScript Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

---

## 💬 Team Communication

### Questions to Ask
- Architecture questions → Check `SETUP_GUIDE.md`
- API questions → Check `API_DOCUMENTATION.md`
- Code questions → Read the JSDoc comments
- Stuck? → Ask team members on Slack/Discord

### Before Asking for Help
1. Read the relevant documentation
2. Check if there's similar code you can learn from
3. Try adding `console.log()` to understand flow
4. Check the browser Network tab for API errors
5. Then ask team!

---

## ✅ Onboarding Checklist

Mark these as you complete them:

- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm install`)
- [ ] App runs successfully (`npm run dev:full`)
- [ ] App loads in browser (http://localhost:5173)
- [ ] Can add products to cart
- [ ] Understand AppContext architecture (read comments)
- [ ] Understand API layer (read api.js)
- [ ] Know where products data comes from
- [ ] Know how to use `useApp()` hook
- [ ] Complete first task (Clear Filters button)
- [ ] First commit pushed to repository

---

## 🎉 You're Ready!

Once you've completed the checklist above, you're ready to start contributing to the project!

**Next steps:**
1. Check JIRA/GitHub Issues for tasks
2. Pick a task labeled "Good First Issue"
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make changes
5. Test thoroughly
6. Commit: `git commit -m "Feature: description"`
7. Push: `git push`
8. Create Pull Request for code review

Welcome to the team! 🚀

---

**Questions?** Reach out to the team lead or check the documentation files.

**Last Updated**: December 2024
**Version**: 1.0.0
