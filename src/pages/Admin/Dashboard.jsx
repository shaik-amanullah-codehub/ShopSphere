import React, { useMemo, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Award, RefreshCw } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { products, orders, loyaltyPoints } = useApp();
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    // Group orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    // Calculate daily revenue (mock data - last 7 days)
    const dailyRevenue = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOrders = orders.filter(o =>
        new Date(o.createdAt).toDateString() === date.toDateString()
      );
      dailyRevenue.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
      });
    }

    // Top selling products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, quantity]) => {
        const product = products.find(p => p.id === parseInt(id));
        return {
          name: product?.name || 'Unknown',
          sales: quantity
        };
      });

    // Category distribution
    const categoryDistribution = {};
    products.forEach(product => {
      categoryDistribution[product.category] = (categoryDistribution[product.category] || 0) + product.stock;
    });

    const categoryData = Object.entries(categoryDistribution).map(([name, value]) => ({
      name,
      value
    }));

    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
      ordersByStatus,
      dailyRevenue,
      topProducts,
      categoryData,
      colors
    };
  }, [products, orders]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'primary',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'success',
      change: `${stats.ordersByStatus.delivered} delivered`
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'info',
      change: `${stats.lowStockProducts} low stock`
    },
    {
      title: 'Loyalty Points',
      value: loyaltyPoints,
      icon: Award,
      color: 'warning',
      change: 'Issued'
    }
  ];

  return (
    <div className="dashboard" style={{ padding: '0 40px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Dashboard</h1>
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          onClick={handleManualRefresh}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-xs-12 col-sm-6 col-lg-3">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <p className="text-secondary small mb-1">{stat.title}</p>
                      <h4 className="fw-bold mb-0">{stat.value}</h4>
                    </div>
                    <div className={`icon-badge bg-${stat.color} text-white p-3 rounded`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <small className={`text-${stat.color} fw-bold`}>↑ {stat.change}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-5">
        {/* Revenue Trend */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Revenue Trend (Last 7 Days)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#667eea"
                    strokeWidth={2}
                    dot={{ fill: '#667eea', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Order Status</h5>
              <div className="status-list">
                <div className="status-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span className="text-secondary">Pending</span>
                  <span className="badge bg-warning">{stats.ordersByStatus.pending}</span>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span className="text-secondary">Shipped</span>
                  <span className="badge bg-info">{stats.ordersByStatus.shipped}</span>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span className="text-secondary">Delivered</span>
                  <span className="badge bg-success">{stats.ordersByStatus.delivered}</span>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center py-2">
                  <span className="text-secondary">Cancelled</span>
                  <span className="badge bg-danger">{stats.ordersByStatus.cancelled}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Top Products */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Top Selling Products</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Stock by Category</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stats.colors[index % stats.colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
