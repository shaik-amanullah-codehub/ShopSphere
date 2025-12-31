# 🚀 Shop Sphere - Quick Start Guide

## Installation & Running

### 1. Install Dependencies
```bash
cd Omnichannel-fakestore
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will start on:
- **Local**: `http://localhost:5173/` (or next available port like 5174)
- **Network**: Available on your local network

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📱 How to Use

### Customer Portal
1. **Homepage**: Browse all products with search and filters
2. **Product Details**: Click on any product for detailed information
3. **Shopping Cart**: Add items, adjust quantities, view cart
4. **Checkout**: Enter shipping info and complete purchase
5. **Profile**: View order history and loyalty points
6. **Order Tracking**: Track order status and delivery progress

### Admin Portal

1. **Login**: Use credentials:
   - Email: `admin@shop.com`
   - Password: `admin123`

2. **Dashboard**: View analytics and metrics
   - Total revenue
   - Order statistics
   - Revenue trends
   - Top selling products
   - Stock distribution

3. **Inventory Management**:
   - View all products
   - Add new products
   - Edit product details
   - Adjust stock levels
   - Delete products

4. **Order Fulfillment**:
   - View all orders
   - Filter by status
   - Update order status
   - Update tracking information
   - View customer details

---

## 🎯 Demo Features

### Products Included
✅ 8 pre-loaded products  
✅ Electronics & Accessories categories  
✅ Real product images from Unsplash  
✅ Prices ranging from $12.99 to $199.99  
✅ Stock levels and ratings  

### Dummy Data
- All data persists in browser localStorage
- Orders created on checkout
- Loyalty points auto-calculated
- Customer info stored securely

---

## 🔐 Authentication

### Customer Login
- Create new account with any email/password
- Or use any email/password (demo mode)
- Account saved in localStorage

### Admin Login
- **Email**: `admin@shop.com`
- **Password**: `admin123`

---

## 💡 Key Features

### Customer Features
✅ Search products  
✅ Filter by category  
✅ Sort by price/rating  
✅ View product details  
✅ Add to cart  
✅ Checkout process  
✅ Order tracking  
✅ Loyalty points program  
✅ Order history  
✅ Profile management  

### Admin Features
✅ Dashboard with charts  
✅ Revenue analytics  
✅ Inventory CRUD  
✅ Stock management  
✅ Order management  
✅ Tracking updates  
✅ Order status tracking  
✅ Sales analytics  
✅ Product management  

---

## 🎨 UI Components Used

- **Bootstrap 5.3**: Responsive layouts and components
- **Material UI**: Icons and advanced components
- **Recharts**: Analytics charts
- **Lucide React**: Beautiful icons
- **Custom CSS**: Gradient effects and animations

---

## 📊 Technical Stack

- React 19.2
- Vite (build tool)
- React Router v6 (navigation)
- Bootstrap 5.3 (UI)
- Material UI (components)
- Recharts (charts)
- Context API (state management)
- LocalStorage (data persistence)

---

## 🔗 Navigation Structure

```
/ (Home)
├── /product/:id (Product Detail)
├── /cart (Shopping Cart)
├── /profile (User Profile)
├── /order/:orderId (Order Tracking)
├── /login (Login)
├── /signup (Sign Up)
└── /admin (Admin Dashboard)
    ├── /admin/inventory (Inventory Management)
    └── /admin/orders (Order Fulfillment)
```

---

## 💾 Data Persistence

All data is stored in browser localStorage:
```javascript
localStorage.getItem('currentUser')      // Logged-in user
localStorage.getItem('cart')             // Shopping cart
localStorage.getItem('orders')           // User orders
localStorage.getItem('loyaltyPoints')    // Loyalty points
```

---

## 🎯 Test Scenarios

### Scenario 1: Customer Shopping
1. Sign up with new account
2. Browse products on home page
3. Click "View Details" on a product
4. Add items to cart
5. Go to cart and adjust quantities
6. Checkout and fill shipping info
7. Complete order
8. View order in profile

### Scenario 2: Admin Management
1. Login with admin credentials
2. View dashboard analytics
3. Add a new product in inventory
4. Edit product stock
5. View orders in order fulfillment
6. Update order status and tracking
7. Monitor sales metrics

---

## 🌐 Responsive Design

Works perfectly on:
- ✅ Desktop (1200px+)
- ✅ Tablets (768px - 1199px)
- ✅ Mobile (< 768px)
- ✅ Mobile phones (< 576px)

---

## 🚨 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port (5174, 5175, etc.)

### Clear Cache
To reset all data:
```javascript
localStorage.clear()
// Then refresh page
```

### Rebuild Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Project Files

Important files to explore:
- `src/App.jsx` - Main app with routing
- `src/context/AppContext.jsx` - Global state management
- `src/pages/` - All page components
- `src/components/Navbar.jsx` - Navigation component
- `src/data/products.json` - Product data
- `package.json` - Dependencies

---

## 🎁 Loyalty Points System

- Earn 1 point per $10 spent
- 100 points can be redeemed for $10 discount
- Points shown in user profile
- Tracked across sessions (localStorage)

Example:
- Order $50 → Earn 5 points
- Order $100 → Earn 10 points
- 100 points → $10 discount

---

## 📞 Support

For issues or questions:
1. Check the FEATURES.md for detailed documentation
2. Review the code in src/ directory
3. Check browser console for errors
4. Verify localStorage data with DevTools

---

## 🎉 Enjoy Shopping!

Thank you for using Shop Sphere. Happy shopping and admin management!

For detailed documentation, see [FEATURES.md](./FEATURES.md)

**Built with ❤️ using React, Bootstrap & Material UI**
