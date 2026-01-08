import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import CustomNavbar from './components/Navbar';
import Footer from './components/Footer'; // 1. Import Footer

// Customer Pages
import Home from './pages/Home/Home';
import ProductDetail from './pages/Product/ProductDetail';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import OrderTracking from './pages/OrderTracking/OrderTracking';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ProductManager from './pages/Admin/InventoryManagement/ProductManager';
import OrderFulfillment from './pages/Admin/OrderFulfillment/OrderFulfillment';

import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
        {/* The Navbar and Footer stay outside Routes to be visible everywhere */}
        <div className="app-layout">
          <CustomNavbar />
          
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Customer Routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/order/:orderId" element={<OrderTracking />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <AdminLayout>
                    <ProductManager />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminLayout>
                    <OrderFulfillment />
                  </AdminLayout>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Footer /> {/* 2. Place Footer here */}
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;