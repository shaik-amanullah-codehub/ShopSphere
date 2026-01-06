import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Eye, Truck, CheckCircle, X, Search, Package, MapPin, AlertCircle } from 'lucide-react';
import './OrderFulfillment.css';
 
function OrderFulfillment() {
  // Pulling global order data and the update function from AppContext
  const { orders, updateOrderStatus } = useApp();
  
  // UI States for controlling the Modal visibility and selection
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // States to hold the temporary values before "Save Changes" is clicked
  const [newStatus, setNewStatus] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('');
  
  // Filter and Tab states for the dashboard view
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
 
  // --- MODAL HANDLERS ---
  
  /**
   * handleOpenModal: Prepares the modal with current order details.
   * Logic: If it's a pickup order, we map the DB 'status' to our custom 3-phase frontend labels.
   */
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    const isPickupOrder = order?.inStorePickup;
 
    // Logic: Map the internal 'delivered' status to the 'pickedup' label for In-Store orders
    if (isPickupOrder && order.status === 'delivered') {
      setNewStatus('pickedup');
    } else if (isPickupOrder && order.trackingStatus === 'Packed & Ready') {
      setNewStatus('packed');
    } else {
      setNewStatus(order.status); // Default mapping for standard shipping
    }
 
    setTrackingStatus(order.trackingStatus || '');
    setShowModal(true);
  };
 
  /**
   * handleCloseModal: Resets all temporary modal states to avoid data leaking between orders.
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    setTrackingStatus('');
  };
 
  /**
   * handleUpdateOrder: The core logic that sends data back to the database.
   * Maps human-readable phases back to the strict database 'status' keys.
   */
  const handleUpdateOrder = () => {
    if (!selectedOrder) return;
 
    let statusToSave = newStatus;
    let trackingToSave = trackingStatus;
 
    // Special Mapping for In-Store Pickup: 
    // We want the DB to say 'delivered' when the user selects 'Phase 3: Picked Up'
    if (selectedOrder.inStorePickup) {
      if (newStatus === 'pickedup') {
        statusToSave = 'delivered'; // Final state for DB
        trackingToSave = 'Picked Up';
      } else if (newStatus === 'packed') {
        statusToSave = 'pending'; // Stays pending until customer actually arrives
        trackingToSave = 'Packed & Ready';
      }
    }
 
    // Executes the API call defined in AppContext.js
    updateOrderStatus(selectedOrder.id, statusToSave, trackingToSave);
    handleCloseModal();
  };
 
  // Standard labels for the "Detailed Tracking Label" dropdown
  const trackingOptions = [
    'Order Placed', 'Payment Confirmed', 'Processing', 'Packed & Ready',
    'Ready for Pickup', 'Shipped', 'In Transit', 'Out for Delivery',
    'Delivered', 'Picked Up', 'Cancelled'
  ];
 
  // Memoized filter logic: Updates only when 'orders', 'searchTerm', or 'filterStatus' changes
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);
 
  // Categorizes filtered orders for the dashboard stats and tab counts
  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending'),
    shipped: filteredOrders.filter(o => o.status === 'shipped'),
    delivered: filteredOrders.filter(o => o.status === 'delivered'),
    cancelled: filteredOrders.filter(o => o.status === 'cancelled')
  };
 
  // Sub-component for individual order rows
  const OrderCard = ({ order }) => {
    // DEFENSIVE CHECK: Safely grabs name even if shippingAddress object is missing/malformed
    const recipientName = order.shippingAddress?.fullName || order.shippingAddress?.name || order.shippingAddress?.line1 || 'Unknown Recipient';
    
    // Grabs address from multiple possible keys to support legacy or new data structures
    const recipientAddr = order.shippingAddress?.line1 || order.shippingAddress?.address || null;
 
    return (
      <div className="card order-card mb-3 shadow-sm border-0">
        <div className="card-body p-3">
          <div className="row align-items-center">
            {/* ID and Date Column */}
            <div className="col-md-2">
              <div className="order-id-badge">
                <div className="fw-bold text-truncate">{order.id}</div>
                <small className="text-secondary">{new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
            {/* Customer Details Column */}
            <div className="col-md-3">
              <p className="mb-0 fw-bold">{recipientName}</p>
              {recipientAddr && <small className="text-muted">{recipientAddr}</small>}
              <small className="text-muted d-block">{(order.items || []).length} Product(s)</small>
            </div>
            {/* Price Column */}
            <div className="col-md-2 text-primary fw-bold">
              ₹{order.total.toFixed(2)}
            </div>
            {/* Status Badge Column */}
            <div className="col-md-2">
              <span className={`badge ${
                order.status === 'delivered' ? 'bg-success' :
                order.status === 'shipped' ? 'bg-info' :
                order.status === 'pending' ? 'bg-warning' : 'bg-danger'
              } w-100 p-2`}>
                {order.status.toUpperCase()}
              </span>
              {/* Pickup Badge: Shows small icon if order is for in-store pickup */}
              {order.inStorePickup && (
                <div className="text-center mt-1">
                  <small className="text-primary fw-bold" style={{ fontSize: '10px' }}>
                    <MapPin size={10} /> IN-STORE PICKUP
                  </small>
                </div>
              )}
            </div>
            {/* Action Column */}
            <div className="col-md-3">
              {/* Logic: If order is already completed or cancelled, prevent further editing */}
              {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                <button className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => handleOpenModal(order)}>
                  <Eye size={16} /> Update Status
                </button>
              ) : (
                <div className="text-center text-success small fw-bold">
                  <CheckCircle size={16} className="me-1" /> Order Finalized
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  return (
    <div className="order-fulfillment p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 className="fw-bold mb-4">Order Fulfillment & Tracking</h1>
 
      {/* SEARCH & FILTERS: Top row allows finding specific orders */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select className="form-select shadow-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
 
      {/* STATS: Visual overview of current warehouse load */}
      <div className="row g-4 mb-4">
        {[
          { label: 'Pending', count: ordersByStatus.pending.length, color: 'warning' },
          { label: 'Shipped', count: ordersByStatus.shipped.length, color: 'info' },
          { label: 'Delivered', count: ordersByStatus.delivered.length, color: 'success' },
          { label: 'Cancelled', count: ordersByStatus.cancelled.length, color: 'danger' }
        ].map((stat) => (
          <div className="col-md-3" key={stat.label}>
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body p-3">
                <h4 className={`fw-bold text-${stat.color} mb-1`}>{stat.count}</h4>
                <small className="text-secondary">{stat.label} Orders</small>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* TABS: Filtered views for high-volume order management */}
      <div className="mb-4">
        <nav className="nav nav-tabs border-bottom-0 gap-2">
          {['all', 'pending', 'shipped', 'delivered'].map((tab) => (
            <button
              key={tab}
              className={`nav-link rounded-pill px-4 ${activeTab === tab ? 'active bg-primary text-white border-primary' : 'text-secondary bg-white border'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              ({tab === 'all' ? filteredOrders.length : ordersByStatus[tab].length})
            </button>
          ))}
        </nav>
        
        {/* LIST RENDERING: Maps through the active set of orders */}
        <div className="mt-4">
          {(activeTab === 'all' ? filteredOrders : ordersByStatus[activeTab]).length > 0 ? (
            (activeTab === 'all' ? filteredOrders : ordersByStatus[activeTab]).map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="card text-center py-5 border-0 shadow-sm">
              <Package size={48} className="mx-auto text-light mb-3" />
              <p className="text-secondary mb-0">No orders found in this category</p>
            </div>
          )}
        </div>
      </div>
 
      {/* EDIT MODAL: Appears when "Update Status" is clicked */}
      {showModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0">
                <h5 className="fw-bold">Update Order Progress</h5>
                <button className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {/* Header info in modal: ID and Pickup/Shipping type */}
                <div className="p-3 bg-light rounded mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Order ID</span>
                    <span className="fw-bold small">{selectedOrder.id}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Method</span>
                    <span className="badge bg-white text-primary border border-primary small">
                      {selectedOrder.inStorePickup ? 'IN-STORE PICKUP' : 'STANDARD SHIPPING'}
                    </span>
                  </div>
                </div>
 
                {/* Conditional Dropdown: Shows Pickup Phases vs Shipping Status based on order type */}
                {selectedOrder.inStorePickup ? (
                  <div className="mb-4">
                    <label className="form-label fw-bold">Pickup Phase</label>
                    <select className="form-select border-primary" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="pending">Phase 1: Pending (Order Placed)</option>
                      <option value="packed">Phase 2: Packed & Ready</option>
                      <option value="pickedup">Phase 3: Picked Up (Complete)</option>
                    </select>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="form-label fw-bold">Shipping Status</label>
                    <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
 
                {/* Detailed Label Dropdown: Sets the specific text shown to the customer in their tracker */}
                <div className="mb-0">
                  <label className="form-label fw-bold">Detailed Tracking Label</label>
                  <select className="form-select" value={trackingStatus} onChange={(e) => setTrackingStatus(e.target.value)}>
                    {trackingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                <button className="btn btn-primary px-4 fw-bold" onClick={handleUpdateOrder}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default OrderFulfillment;