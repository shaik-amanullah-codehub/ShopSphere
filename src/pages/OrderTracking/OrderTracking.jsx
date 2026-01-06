import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, Clock, AlertCircle, Package, Store } from 'lucide-react';
import './OrderTracking.css';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();
  const [order, setOrder] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Poll for order updates every 3 seconds
  useEffect(() => {
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId, orders, refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <AlertCircle size={48} className="text-danger mb-3 d-block mx-auto" />
        <h2 className="mb-3 fw-bold">Order Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  // --- Strict 3-Phase Logic for Omnichannel Fulfillment [cite: 3, 34] ---
  const standardSteps = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'payment', label: 'Payment Confirmed', completed: order.status !== 'pending' },
    { status: 'processing', label: 'Processing', completed: order.status !== 'pending' },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
  ];

  const inStoreSteps = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'packed', label: 'Packed & Ready', completed: order.trackingStatus === 'Packed & Ready' || order.status === 'delivered' },
    { status: 'pickedup', label: 'Picked Up', completed: order.status === 'delivered' }
  ];

  // Use requested 3-phase flow if in-store pickup signal is detected
  const statusSteps = order.inStorePickup ? inStoreSteps : standardSteps;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="order-tracking-page py-5 bg-light min-vh-100">
      <div className="container">
        <button
          className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2 shadow-sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0 display-6">Track Your Order</h1>
          {order.inStorePickup && (
            <span className="badge bg-primary p-3 rounded-pill d-flex align-items-center gap-2 shadow-sm">
              <Store size={20} /> IN-STORE PICKUP
            </span>
          )}
        </div>

        <div className="row g-4">
          {/* Order Progress Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="row mb-4 pb-3 border-bottom">
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1 fw-bold text-uppercase">Order ID</p>
                    <h5 className="fw-bold">{order.id}</h5>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="text-secondary small mb-1 fw-bold text-uppercase">Order Date</p>
                    <h5 className="fw-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1 fw-bold text-uppercase">Current Status</p>
                    <span
                      className={`badge bg-${getStatusColor(order.status)} p-2`}
                      style={{ fontSize: '0.95rem' }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="text-secondary small mb-1 fw-bold text-uppercase">Tracking Details</p>
                    <p className="fw-bold text-primary">{order.trackingStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Progress Tracker */}
            
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{order.inStorePickup ? 'Pickup Progress' : 'Delivery Progress'}</h5>

                <div className="tracking-timeline">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="timeline-item mb-4">
                      <div className="d-flex align-items-start">
                        <div className={`timeline-marker shadow-sm ${step.completed ? 'completed bg-success' : 'pending bg-secondary opacity-50'}`}>
                          {step.completed ? (
                            <CheckCircle size={24} className="text-white" />
                          ) : (
                            <Clock size={24} className="text-white" />
                          )}
                        </div>
                        <div className="ms-3 flex-grow-1">
                          <h6 className={`fw-bold mb-1 ${step.completed ? 'text-success' : 'text-secondary'}`}>
                            {step.label}
                          </h6>
                          <p className="text-secondary small mb-0">
                            {step.completed
                              ? `Completed on ${new Date(order.updatedAt).toLocaleDateString()}`
                              : 'Pending Action'}
                          </p>
                        </div>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`timeline-line ${step.completed ? 'bg-success' : 'bg-secondary opacity-25'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Order Items */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Items Summary</h5>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-3 pb-3 border-bottom"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        marginRight: '15px'
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <p className="text-secondary small mb-0">
                        Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold text-primary mb-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Location & Summary */}
          <div className="col-lg-4">
            {/* Pickup or Shipping Details */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MapPin size={20} />
                  {order.inStorePickup ? 'Pickup Location' : 'Shipping Address'}
                </h5>
                <div className="address-box bg-light p-3 rounded-3 border">
                  {order.inStorePickup ? (
                    <>
                      <p className="fw-bold mb-1 text-primary">SHOP SPHERE MAIN OUTLET</p>
                      <p className="text-secondary small mb-0">123 Retail Lane, Hub Plaza</p>
                      <p className="text-secondary small mb-0">Monday - Sunday: 10AM - 9PM</p>
                    </>
                  ) : (
                    <>
                      <p className="fw-bold mb-2">{order.shippingAddress.fullName}</p>
                      <p className="mb-1 text-secondary small">{order.shippingAddress.address}</p>
                      <p className="mb-0 text-secondary small">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Support Contact</h5>
                <div className="d-flex align-items-center mb-3">
                  <Mail size={18} className="text-muted me-3" />
                  <div>
                    <p className="text-secondary small mb-0">Email</p>
                    <p className="fw-bold mb-0 small">{order.shippingAddress.email || 'support@shopsphere.com'}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Phone size={18} className="text-muted me-3" />
                  <div>
                    <p className="text-secondary small mb-0">Phone</p>
                    <p className="fw-bold mb-0 small">{order.shippingAddress.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Financial Summary</h5>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Subtotal</span>
                  <strong>₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-IN')}</strong>
                </div>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Tax (8%)</span>
                  <strong>₹{(order.total * 0.08).toLocaleString('en-IN')}</strong>
                </div>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Delivery</span>
                  <strong className="text-success">{order.inStorePickup ? 'FREE PICKUP' : '₹0.00'}</strong>
                </div>
                <div className="summary-item d-flex justify-content-between py-3 text-primary fw-bold">
                  <span>Grand Total</span>
                  <span style={{ fontSize: '1.4rem' }}>
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="alert alert-info mt-3 p-2 small mb-0 text-center">
                  You earned <strong>{Math.floor(order.total/10)}</strong> Loyalty Points! [cite: 54]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;