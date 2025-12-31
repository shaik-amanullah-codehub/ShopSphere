# Shop Sphere - Modern E-Commerce Platform

A complete omnichannel e-commerce application with customer portal and admin dashboard built with React, Bootstrap, and Material UI.

## ✨ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will open at `http://localhost:5173`

## 🎯 Quick Links

- **Customer Portal**: Browse products, manage cart, track orders, view loyalty points
- **Admin Portal**: Dashboard analytics, inventory management, order fulfillment
- **Demo Admin**: `admin@shop.com` / `admin123`

## 📋 Features

### 👥 Customer Features
✅ Product search and filtering  
✅ Shopping cart management  
✅ Secure checkout  
✅ Order tracking with real-time updates  
✅ User profile with order history  
✅ Loyalty points system (1 point per $10)  
✅ Responsive mobile design  

### 👨‍💼 Admin Features
✅ Analytics dashboard with charts  
✅ Revenue trends (7-day view)  
✅ Inventory CRUD operations  
✅ Real-time stock management  
✅ Order fulfillment system  
✅ Manual tracking status updates  
✅ Order status management  

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite** - Build tool
- **Bootstrap 5.3** - CSS framework
- **Material UI** - Component library
- **Recharts** - Charts and analytics
- **React Router v6** - Navigation
- **Lucide React** - Icons
- **React Context** - State management

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
│   ├── Auth/         # Login, Signup pages
│   ├── Admin/        # Admin dashboard, inventory, orders
│   └── ...           # Customer pages
├── context/          # Global state (AppContext)
├── data/             # Dummy product data
└── App.jsx           # Main app with routing
```

## 🚀 Usage

### For Customers
1. Sign up or login
2. Browse products, use search and filters
3. Add items to cart
4. Proceed to checkout
5. View orders and loyalty points in profile

### For Admin
1. Login with `admin@shop.com` / `admin123`
2. Access admin panel
3. View analytics on dashboard
4. Manage products in inventory
5. Update order status and tracking

## 📊 Dummy Data

- **8 Products** pre-loaded with images, prices, ratings
- **Product Categories**: Electronics, Accessories
- **Mock Orders** created on checkout
- **Loyalty Points** auto-calculated

## 💾 Data Persistence

User data is saved to browser localStorage:
- Authentication state
- Shopping cart
- Orders
- Loyalty points

## 🎨 Responsive Design

- Mobile-first approach
- Fully responsive on all devices
- Touch-friendly mobile navigation
- Professional design with gradients

## 📖 Detailed Documentation

See [FEATURES.md](./FEATURES.md) for comprehensive documentation including:
- Complete feature list
- Installation guide
- Customization options
- Troubleshooting
- Deployment guide

## 🔒 Authentication

- Simple demo authentication (any email/password for customer)
- Admin credentials: `admin@shop.com` / `admin123`
- User roles: customer, admin

## 📱 Mobile Optimized

- Responsive Bootstrap layout
- Mobile menu navigation
- Touch-friendly buttons
- Optimized images

## 🎁 Loyalty Program

- Earn 1 point per $10 spent
- 100 points = $10 discount
- Points displayed in user profile
- Auto-calculated on purchase

## 🔄 State Management

Global state using React Context:
```javascript
const { 
  currentUser,      // Current logged-in user
  products,         // All products
  cart,             // Shopping cart items
  orders,           // User orders
  loyaltyPoints,    // Loyalty points
  // ... and more actions
} = useApp();
```

## 🌐 Environment

- **Development**: Vite dev server on port 5173
- **Production**: Static HTML, CSS, JS files

## 📝 License

MIT License - feel free to use in your projects!

---

For detailed features and documentation, see [FEATURES.md](./FEATURES.md)
