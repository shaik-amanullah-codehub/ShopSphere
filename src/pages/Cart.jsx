import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, placeOrder, currentUser } = useApp();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Please login to proceed</h2>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      alert('Please fill all shipping information');
      return;
    }
    setShowConfirm(true);
  };

  const confirmOrder = () => {
    const order = placeOrder({
      total,
      shippingAddress: shippingInfo,
      paymentMethod
    });
    
    // Force localStorage update
    const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    updatedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    setOrderPlaced(true);
    setShowConfirm(false);
    setTimeout(() => {
      navigate(`/order/${order.id}`);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="container py-5 text-center">
        <div className="success-message">
          <CheckCircle size={64} className="text-success mb-3" />
          <h2 className="mb-3">Order Placed Successfully!</h2>
          <p className="lead text-secondary mb-4">
            Your order has been placed. You'll receive a confirmation email shortly.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-3">Your cart is empty</h2>
          <button
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page py-5 bg-light">
      <div className="container">
        <h1 className="fw-bold mb-4">Shopping Cart</h1>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Cart Items ({cart.length})</h5>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr className="border-bottom">
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id} className="align-middle">
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  marginRight: '10px'
                                }}
                              />
                              <div>
                                <p className="mb-1 fw-bold">{item.name}</p>
                                <small className="text-secondary">{item.category}</small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold">${item.price.toFixed(2)}</td>
                          <td>
                            <select
                              style={{ width: '70px' }}
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartQuantity(item.id, parseInt(e.target.value))
                              }
                              className="form-select"
                            >
                              {[...Array(item.stock)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="fw-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Summary and Checkout */}
          <div className="col-lg-4">
            {/* Order Summary */}
            <div className="card shadow-sm border-0 mb-4 sticky-top" style={{ top: '20px' }}>
              <div className="card-body">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>Tax (8%):</span>
                  <strong>${tax.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <strong className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </strong>
                </div>
                {shipping === 0 && (
                  <span className="badge bg-success mb-3 d-block">
                    ✓ Free Shipping Applied
                  </span>
                )}
                <div className="summary-row border-top pt-3">
                  <strong>Total:</strong>
                  <strong className="h5 text-primary">${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Shipping Information</h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      className="form-control py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="form-control py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="form-control py-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="form-control py-2"
                    />
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className="form-control py-2"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          className="form-control py-2"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className="form-control py-2"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Payment Method</label>
                    <div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          id="paymentCard"
                        />
                        <label className="form-check-label" htmlFor="paymentCard">
                          Credit/Debit Card
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          id="paymentPaypal"
                        />
                        <label className="form-check-label" htmlFor="paymentPaypal">
                          PayPal
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Order</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to place this order?</p>
                <div className="summary-preview">
                  <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                  <p><strong>Shipping to:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
                  <p><strong>Payment Method:</strong> {paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal'}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmOrder}>
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
