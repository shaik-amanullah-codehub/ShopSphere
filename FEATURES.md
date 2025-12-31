# Shop Sphere - Omnichannel E-Commerce Application

A modern, full-featured e-commerce platform built with React, Bootstrap, and Material UI. Includes complete customer portal with shopping and loyalty points, and a comprehensive admin portal with analytics, inventory management, and order fulfillment.

## 🎯 Features

### Customer Portal
- **Product Browsing**: Search, filter by category, and sort products
- **Product Details**: Detailed product information with ratings and specifications
- **Shopping Cart**: Add/remove items, adjust quantities, view cart summary
- **Checkout**: Secure checkout with shipping and payment information
- **Order Tracking**: Real-time order status and tracking updates
- **User Profile**: View order history, loyalty points, and personal information
- **Loyalty Program**: Earn points on purchases (1 point per $10), redeemable for discounts

### Admin Portal
- **Dashboard**: Analytics with revenue trends, order status distribution, top products
- **Inventory Management**: 
  - Complete CRUD operations for products
  - Real-time stock management
  - Low stock alerts
  - Product categorization
- **Order Fulfillment**: 
  - Order status management (Pending → Shipped → Delivered)
  - Real-time tracking status updates
  - Order details and customer information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 19.2
- **UI Framework**: Bootstrap 5.3
- **Component Library**: Material UI
- **Routing**: React Router v6
- **Charts & Analytics**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🚀 Installation & Setup

1. **Clone or navigate to the project**:
   ```bash
   cd Omnichannel-fakestore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔐 Demo Credentials

### Admin Account
- **Email**: `admin@shop.com`
- **Password**: `admin123`

### Customer Account
- Create a new account with any email and password (minimum 6 characters)
- Or use any email for login (demo authentication)

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx              # Main navigation component
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Auth.css
│   ├── Admin/
│   │   ├── AdminLayout.jsx     # Admin layout wrapper
│   │   ├── Dashboard.jsx       # Analytics & overview
│   │   ├── ProductManager.jsx  # Inventory CRUD
│   │   ├── OrderFulfillment.jsx # Order management
│   │   └── *.css
│   ├── Home.jsx                # Product listing
│   ├── ProductDetail.jsx       # Single product page
│   ├── Cart.jsx                # Shopping cart
│   ├── Profile.jsx             # User profile & orders
│   ├── OrderTracking.jsx       # Order tracking page
│   └── *.css
├── context/
│   └── AppContext.jsx          # Global state management
├── data/
│   └── products.json           # Dummy product data
├── App.jsx                     # Main app with routing
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Bootstrap grid system for responsive layouts
- Touch-friendly buttons and navigation
- Hamburger menu on mobile

### Modern Design Elements
- Gradient backgrounds and accents
- Smooth animations and transitions
- Card-based layouts
- Professional color scheme (Primary: #667eea, Secondary: #764ba2)

### Accessibility
- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast text

## 💾 Data Persistence

All user data is persisted to browser's localStorage:
- User authentication state
- Shopping cart
- Orders
- Loyalty points

## 🔄 State Management

Using React Context API for global state:
- `currentUser`: Current logged-in user
- `products`: All available products
- `cart`: Shopping cart items
- `orders`: User orders history
- `loyaltyPoints`: User loyalty points

## 📊 Dummy Data

### Products
- 8 pre-loaded products with:
  - Product name, price, and description
  - Stock levels
  - Ratings
  - Category (Electronics, Accessories)
  - Unsplash image URLs

### Mock Orders
- Automatically created when checkout is completed
- Includes order status tracking
- Customer shipping information
- Payment method details

## 🎯 Key Functionalities

### Customer Features
1. **Product Search**: Real-time search across product names and descriptions
2. **Category Filter**: Filter products by Electronics or Accessories
3. **Sorting**: Sort by price (low to high, high to low) or rating
4. **Add to Cart**: Smooth cart addition with quantity selection
5. **Checkout**: Complete checkout with shipping information
6. **Order Tracking**: Real-time order status with delivery progress
7. **Loyalty Points**: Automatic point calculation and display

### Admin Features
1. **Dashboard Analytics**:
   - Total revenue, orders, and products
   - 7-day revenue trend chart
   - Order status distribution
   - Top-selling products
   - Stock by category pie chart

2. **Inventory Management**:
   - Add new products
   - Edit existing products
   - Delete products
   - Real-time stock updates
   - Low stock warnings

3. **Order Management**:
   - View all orders
   - Filter by status
   - Update order status
   - Update tracking information
   - View detailed order information

## 🎨 Color Scheme

- **Primary**: `#667eea` (Purple-blue)
- **Secondary**: `#764ba2` (Darker purple)
- **Success**: `#52c41a` (Green)
- **Info**: `#1890ff` (Blue)
- **Warning**: `#faad14` (Orange)
- **Danger**: `#ff4d4f` (Red)

## 📱 Responsive Breakpoints

- **xs**: < 576px (Mobile)
- **sm**: 576px - 767px (Small devices)
- **md**: 768px - 991px (Tablets)
- **lg**: 992px - 1199px (Large devices)
- **xl**: ≥ 1200px (Extra large)

## 🔧 Customization

### Adding New Products
Edit `src/data/products.json` or use the admin inventory panel to add products dynamically.

### Changing Color Scheme
Update CSS variables in `src/index.css` and component-specific CSS files.

### Adding More Categories
Update product data and modify filter options in product listing and inventory management.

## 📖 Usage Examples

### Customer Flow
1. Sign up or login
2. Browse products with search and filters
3. Click "View Details" for product information
4. Add items to cart
5. Proceed to checkout
6. Fill shipping information
7. Complete order
8. View order history and loyalty points in profile

### Admin Flow
1. Login with admin credentials
2. View dashboard analytics
3. Manage inventory (add/edit/delete products)
4. View pending orders
5. Update order status and tracking
6. Monitor analytics in real-time

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 3000
```

### npm install fails
Clear npm cache and try again:
```bash
npm cache clean --force
npm install
```

### Components not updating
Clear browser cache or use Ctrl+Shift+Delete to clear cache and localStorage.

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

Then deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit pull requests.

## 📧 Support

For support, create an issue in the project repository or contact the development team.

---

**Built with ❤️ using React, Bootstrap, and Material UI**
