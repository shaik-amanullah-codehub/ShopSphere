import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
// Added 'Gift' icon to imports
import { ArrowLeft, MapPin, Phone, Mail, CheckCircle, Clock, AlertCircle, Gift } from 'lucide-react';
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
        <h2 className="mb-3">Order Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'payment', label: 'Payment Confirmed', completed: order.status !== 'pending' },
    { status: 'processing', label: 'Processing', completed: order.status !== 'pending' },
    { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Calculate points for this specific order
  const pointsEarned = Math.floor(order.total / 10);

  return (
    <div className="order-tracking-page py-5 bg-light">
      <div className="container">
        <button
          className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <h1 className="fw-bold mb-4">Track Your Order</h1>

        <div className="row g-4">
          {/* Order Header */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="row mb-4 pb-3 border-bottom">
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1">Order ID</p>
                    <h5 className="fw-bold">{order.id}</h5>
                  </div>
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1">Order Date</p>
                    <h5 className="fw-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h5>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1">Status</p>
                    <span
                      className={`badge bg-${getStatusColor(order.status)} p-2`}
                      style={{ fontSize: '0.95rem' }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <p className="text-secondary small mb-1">Current Tracking</p>
                    <p className="fw-bold text-primary">{order.trackingStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Steps */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Delivery Progress</h5>

                <div className="tracking-timeline">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="timeline-item mb-4">
                      <div className="d-flex align-items-start">
                        <div className={`timeline-marker ${step.completed ? 'completed' : 'pending'}`}>
                          {step.completed ? (
                            <CheckCircle size={24} className="text-white" />
                          ) : (
                            <Clock size={24} className="text-white" />
                          )}
                        </div>
                        <div className="ms-3 flex-grow-1">
                          <h6 className={`fw-bold ${step.completed ? 'text-success' : 'text-secondary'}`}>
                            {step.label}
                          </h6>
                          <p className="text-secondary small mb-0">
                            {step.completed
                              ? new Date(order.updatedAt).toLocaleDateString()
                              : 'Pending'}
                          </p>
                        </div>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className="timeline-line" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Items</h5>
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
                        borderRadius: '8px',
                        marginRight: '15px'
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <p className="text-secondary small mb-0">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold text-primary mb-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            {/* Shipping Address */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MapPin size={20} />
                  Shipping Address
                </h5>
                <div className="address-box bg-light p-3 rounded">
                  <p className="fw-bold mb-2">
                    {order.shippingAddress?.fullName || order.shippingAddress?.name || 'Unknown Recipient'}
                  </p>
                  <p className="mb-1 text-secondary small">
                    {order.shippingAddress?.address || order.shippingAddress?.line1 || 'Address not available'}
                  </p>
                  <p className="mb-2 text-secondary small">
                    {order.shippingAddress?.city || ''}{order.shippingAddress?.city && ', '}{order.shippingAddress?.state || ''}{' '}
                    {order.shippingAddress?.zipCode || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Contact Information</h5>
                <div className="d-flex align-items-center mb-3">
                  <Mail size={18} className="text-secondary me-3" />
                  <div>
                    <p className="text-secondary small mb-0">Email</p>
                    <p className="fw-bold mb-0">
                      {order.shippingAddress.email || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Phone size={18} className="text-secondary me-3" />
                  <div>
                    <p className="text-secondary small mb-0">Phone</p>
                    <p className="fw-bold mb-0">
                      {order.shippingAddress.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Subtotal</span>
                  <strong>
                    $
                    {order.items
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </strong>
                </div>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Tax</span>
                  <strong>${(order.total * 0.08).toFixed(2)}</strong>
                </div>
                <div className="summary-item d-flex justify-content-between py-2 border-bottom">
                  <span className="text-secondary">Shipping</span>
                  <strong>
                    $
                    {order.total -
                      order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) -
                      (order.total * 0.08) >
                    0
                      ? (
                          order.total -
                          order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          ) -
                          (order.total * 0.08)
                        ).toFixed(2)
                      : '0.00'}
                  </strong>
                </div>

                {/* --- ADDED: Points Earned Row --- */}
                <div className="summary-item d-flex justify-content-between py-2 border-bottom bg-light px-2 rounded mt-2">
                  <span className="text-success d-flex align-items-center gap-2">
                    <Gift size={16} /> Points Earned
                  </span>
                  <strong className="text-success">+{pointsEarned}</strong>
                </div>

                <div className="summary-item d-flex justify-content-between py-3 text-primary fw-bold">
                  <span>Total</span>
                  <span style={{ fontSize: '1.2rem' }}>
                    ${order.total.toFixed(2)}
                  </span>
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