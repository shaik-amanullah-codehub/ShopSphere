import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Truck, CheckCircle, X, Search } from 'lucide-react';
import './OrderFulfillment.css';

function OrderFulfillment() {
  const { orders, updateOrderStatus } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  const trackingOptions = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Ready to Ship',
    'Picked & Packed',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];
  

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending'),
    shipped: filteredOrders.filter(o => o.status === 'shipped'),
    delivered: filteredOrders.filter(o => o.status === 'delivered'),
    cancelled: filteredOrders.filter(o => o.status === 'cancelled')
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingStatus(order.trackingStatus);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus, trackingStatus);
      
      // Force localStorage update to ensure data persists
      const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = updatedOrders.findIndex(o => o.id === selectedOrder.id);
      if (orderIndex !== -1) {
        updatedOrders[orderIndex] = {
          ...updatedOrders[orderIndex],
          status: newStatus,
          trackingStatus: trackingStatus,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      }
      
      handleCloseModal();
    }
  };

  const OrderCard = ({ order }) => (
    <div className="card order-card mb-3 shadow-sm border-0">
      <div className="card-body p-3">
        <div className="row align-items-center">
          <div className="col-md-2">
            <div className="order-id-badge">
              <div className="fw-bold text-truncate">{order.id}</div>
              <small className="text-secondary">
                {new Date(order.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
          <div className="col-md-3">
            <div>
              <p className="mb-1 fw-bold">{order.shippingAddress.fullName}</p>
              <small className="text-secondary">
                {order.items.length} item(s)
              </small>
            </div>
          </div>
          <div className="col-md-2">
            <div className="amount fw-bold text-primary">
              ${order.total.toFixed(2)}
            </div>
          </div>
          <div className="col-md-2">
            <span
              className={`badge p-2 ${
                order.status === 'delivered'
                  ? 'bg-success'
                  : order.status === 'shipped'
                    ? 'bg-info'
                    : order.status === 'pending'
                      ? 'bg-warning'
                      : 'bg-danger'
              }`}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => handleOpenModal(order)}
            >
              <Eye size={16} />
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '0 40px' }} className="order-fulfillment">
      <h1 className="fw-bold mb-4">Order Fulfillment & Tracking</h1>

      {/* Search and Filter */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card stat-mini border-0 shadow-sm">
            <div className="card-body p-3 text-center">
              <h4 className="fw-bold text-warning mb-1">
                {ordersByStatus.pending.length}
              </h4>
              <small className="text-secondary">Pending Orders</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-mini border-0 shadow-sm">
            <div className="card-body p-3 text-center">
              <h4 className="fw-bold text-info mb-1">
                {ordersByStatus.shipped.length}
              </h4>
              <small className="text-secondary">Shipped</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-mini border-0 shadow-sm">
            <div className="card-body p-3 text-center">
              <h4 className="fw-bold text-success mb-1">
                {ordersByStatus.delivered.length}
              </h4>
              <small className="text-secondary">Delivered</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-mini border-0 shadow-sm">
            <div className="card-body p-3 text-center">
              <h4 className="fw-bold text-danger mb-1">
                {ordersByStatus.cancelled.length}
              </h4>
              <small className="text-secondary">Cancelled</small>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Tabs */}
      <div className="mb-4 custom-tabs">
        <nav className="nav nav-tabs" role="tablist">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            role="tab"
          >
            All Orders ({filteredOrders.length})
          </button>
          <button
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
            role="tab"
          >
            Pending ({ordersByStatus.pending.length})
          </button>
          <button
            className={`nav-link ${activeTab === 'shipped' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipped')}
            role="tab"
          >
            Shipped ({ordersByStatus.shipped.length})
          </button>
          <button
            className={`nav-link ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
            role="tab"
          >
            Delivered ({ordersByStatus.delivered.length})
          </button>
        </nav>
        
        <div className="mt-3">
          {activeTab === 'all' && (
            <>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="card text-center py-5 border-0 shadow-sm">
                  <p className="text-secondary mb-0">No orders found</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'pending' && (
            <>
              {ordersByStatus.pending.length > 0 ? (
                ordersByStatus.pending.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="card text-center py-5 border-0 shadow-sm">
                  <p className="text-secondary mb-0">No pending orders</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'shipped' && (
            <>
              {ordersByStatus.shipped.length > 0 ? (
                ordersByStatus.shipped.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="card text-center py-5 border-0 shadow-sm">
                  <p className="text-secondary mb-0">No shipped orders</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'delivered' && (
            <>
              {ordersByStatus.delivered.length > 0 ? (
                ordersByStatus.delivered.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="card text-center py-5 border-0 shadow-sm">
                  <p className="text-secondary mb-0">No delivered orders</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Update Order Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              {selectedOrder && (
                <div className="modal-body">
                  <div className="mb-4 p-3 bg-light rounded">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Order ID:</strong></p>
                        <p className="text-secondary">{selectedOrder.id}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1"><strong>Total:</strong></p>
                        <p className="fw-bold text-primary">
                          ${selectedOrder.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="mb-1 mt-3"><strong>Customer:</strong></p>
                    <p className="text-secondary">
                      {selectedOrder.shippingAddress.fullName}<br />
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Order Status</label>
                    <select
                      className="form-select py-2"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Tracking Status</label>
                    <select
                      className="form-select py-2"
                      value={trackingStatus}
                      onChange={(e) => setTrackingStatus(e.target.value)}
                    >
                      {trackingOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="card bg-light border-0 p-3">
                    <h6 className="fw-bold mb-2">Tracking Timeline:</h6>
                    <small className="text-secondary">
                      Current: <strong>{selectedOrder.trackingStatus}</strong><br />
                      Will update to: <strong className="text-primary">{trackingStatus}</strong>
                    </small>
                  </div>
                </div>
              )}
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleUpdateOrder}
                >
                  <Truck size={18} />
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderFulfillment;
