import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  LogOut,
  Gift,
  ShoppingBag,
  IndianRupee,
  Settings,
  Package,
  X,
  Calendar,
  CheckCircle,
  CreditCard,
  TrendingUp, // Added icon for milestone
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  // Ensure loyaltyPoints is destructured from context
  const { currentUser, logout, orders, loyaltyPoints } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Default Categories
  const defaultPreferences = [
    { id: 1, category: "Electronics", interested: true, purchases: 12 },
    { id: 2, category: "Accessories", interested: true, purchases: 8 },
    { id: 3, category: "Fashion", interested: false, purchases: 3 },
    { id: 4, category: "Home & Living", interested: false, purchases: 1 },
  ];

  // Initialize state from LocalStorage
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-3">Please login to view profile</h2>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  const userOrders = orders.filter((order) => order.userId === currentUser.id);
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

  // Calculate Next Milestone (Next multiple of 500)
  const nextMilestone = Math.ceil((loyaltyPoints + 1) / 500) * 500;
  const progressPercentage = (loyaltyPoints / nextMilestone) * 100;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeOrderDetails = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const togglePreference = (id) => {
    setPreferences(
      preferences.map((pref) =>
        pref.id === id ? { ...pref, interested: !pref.interested } : pref
      )
    );
  };

  return (
    <div className="profile-page py-5 bg-light">
      <div className="container">
        {/* User Header */}
        <div className="card shadow-sm border-0 mb-4 user-header-card">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div
                    className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center me-4"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      fontSize: "32px",
                      fontWeight: "bold",
                    }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="fw-bold mb-1">{currentUser.name}</h2>
                    <p className="text-secondary mb-0">{currentUser.email}</p>
                    <p className="text-secondary mb-0">
                      {currentUser.mobileNumber}
                    </p>
                    <small className="text-secondary">
                      Member since{" "}
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <button
                  className="btn btn-outline-danger d-flex align-items-center gap-2 ms-auto"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card stat-card shadow-sm border-0 text-center">
              <div className="card-body p-4">
                <ShoppingBag
                  className="text-primary mb-3 mx-auto d-block"
                  size={32}
                />
                <h4 className="fw-bold">{userOrders.length}</h4>
                <p className="text-secondary mb-0">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card stat-card shadow-sm border-0 text-center">
              <div className="card-body p-4">
                <IndianRupee
                  className="text-success mb-3 mx-auto d-block"
                  size={32}
                />
                <h4 className="fw-bold">₹ {totalSpent.toFixed(2)}</h4>
                <p className="text-secondary mb-0">Total Spent</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card stat-card shadow-sm border-0 text-center">
              <div className="card-body p-4">
                <Gift className="text-warning mb-3 mx-auto d-block" size={32} />
                {/* Use loyaltyPoints from Context */}
                <h4 className="fw-bold">{loyaltyPoints}</h4>
                <p className="text-secondary mb-0">Loyalty Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Points Detailed Card */}
        <div className="card shadow-sm border-0 mb-4 loyalty-card">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Gift size={24} className="text-warning" />
              Loyalty Program
            </h5>
            <div className="row">
              <div className="col-md-8">
                <p className="text-secondary mb-2">
                  Total Points Balance:{" "}
                  <strong className="text-primary h5">
                    {loyaltyPoints} pts
                  </strong>
                </p>

                {/* Visual Progress Bar */}
                <div className="progress mb-2" style={{ height: "12px" }}>
                  <div
                    className="progress-bar bg-warning progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${progressPercentage}%` }}
                    aria-valuenow={loyaltyPoints}
                    aria-valuemin="0"
                    aria-valuemax={nextMilestone}
                  />
                </div>

                <div className="d-flex justify-content-between text-muted small">
                  <span>{loyaltyPoints} pts</span>
                  <span>
                    <TrendingUp size={14} className="me-1" />
                    Next Tier: {nextMilestone}
                  </span>
                </div>

                <div className="alert alert-light border mt-3 mb-0 py-2 d-flex align-items-center">
                  <small className="text-muted">
                    💡 <strong>Tip:</strong> You earn 1 Point for every ₹10
                    spent on purchases.
                  </small>
                </div>
              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex flex-column justify-content-center align-items-end">
                <span className="badge bg-success p-2 mb-2">
                  ✓ Active Member
                </span>
                <span className="text-muted small">ID: {currentUser.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card shadow-sm border-0 mb-4 preference-card">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Settings size={24} className="text-secondary" />
              Shopping Preferences
            </h5>
            <p className="text-muted small mb-3">
              Select categories you are interested in to personalize your home
              feed.
            </p>
            <div className="row g-3">
              {preferences.map((pref) => (
                <div key={pref.id} className="col-md-6 col-lg-3">
                  <div
                    className={`p-3 border rounded pref-item ${
                      pref.interested ? "active-pref" : ""
                    }`}
                    onClick={() => togglePreference(pref.id)}
                  >
                    <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                      <label
                        className="form-check-label fw-bold cursor-pointer"
                        htmlFor={`pref-${pref.id}`}
                      >
                        {pref.category}
                      </label>
                      <input
                        className="form-check-input ms-2 cursor-pointer"
                        type="checkbox"
                        id={`pref-${pref.id}`}
                        checked={pref.interested}
                        onChange={() => togglePreference(pref.id)}
                      />
                    </div>
                    <small className="text-secondary d-block mt-1">
                      {pref.interested
                        ? "Currently showing"
                        : "Hidden from feed"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <ShoppingBag size={24} />
              Your Orders
            </h5>

            {userOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr className="border-bottom">
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Tracking</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.id} className="align-middle">
                        <td className="fw-bold">{order.id}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>{order.items.length} item(s)</td>
                        <td className="fw-bold text-primary">
                          ₹{order.total.toFixed(2)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              order.status === "delivered"
                                ? "bg-success"
                                : order.status === "shipped"
                                ? "bg-info"
                                : order.status === "pending"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <small className="text-secondary">
                            {order.trackingStatus}
                          </small>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openOrderDetails(order)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <ShoppingBag
                  size={48}
                  className="text-secondary mb-3 opacity-50 d-block mx-auto"
                />
                <p className="text-secondary mb-3">
                  You haven't placed any orders yet
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === CUSTOM ORDER DETAILS MODAL === */}
      {showModal && selectedOrder && (
        <div className="custom-modal-overlay" onClick={closeOrderDetails}>
          <div
            className="custom-modal-box shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header border-bottom px-5 py-3 d-flex justify-content-between align-items-center bg-white">
              <div>
                <h4 className="fw-bold mb-0">Order Details</h4>
                <p className="text-muted small mb-0">
                  ID:{" "}
                  <span className="font-monospace text-dark">
                    #{selectedOrder.id}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="btn btn-light rounded-circle p-2 border"
                onClick={closeOrderDetails}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-0 d-flex flex-column flex-lg-row h-100 overflow-hidden">
              {/* LEFT SIDE: Items List */}
              <div className="col-lg-8 p-5 overflow-auto custom-scrollbar bg-white">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <Package className="text-primary" size={24} />
                  <h5 className="fw-bold mb-0">Items in Shipment</h5>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="text-uppercase text-muted small bg-light">
                      <tr>
                        <th className="border-0 py-3 ps-3 rounded-start">
                          Product Info
                        </th>
                        <th className="border-0 py-3 text-center">Qty</th>
                        <th className="border-0 py-3 text-end">Price</th>
                        <th className="border-0 py-3 text-end rounded-end pe-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4 ps-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-light rounded-3 p-3 me-3 d-flex align-items-center justify-content-center border"
                                style={{ width: "60px", height: "60px" }}
                              >
                                <ShoppingBag
                                  size={28}
                                  className="text-secondary"
                                />
                              </div>
                              <div>
                                <span className="fw-bold d-block text-dark h6 mb-1">
                                  {item.name}
                                </span>
                                <span className="badge bg-light text-secondary border">
                                  ID: {item.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 fs-5">
                            {item.quantity}
                          </td>
                          <td className="text-end py-4 text-muted">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="text-end fw-bold py-4 pe-3 fs-5">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT SIDE: Summary */}
              <div className="col-lg-4 bg-light border-start p-5 d-flex flex-column justify-content-between h-100 overflow-auto">
                <div>
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <CheckCircle size={20} className="text-success" /> Order
                    Summary
                  </h5>

                  {/* Status Card */}
                  <div className="bg-white p-4 rounded-3 border mb-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted small fw-bold text-uppercase">
                        Current Status
                      </span>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          selectedOrder.status === "delivered"
                            ? "bg-success"
                            : selectedOrder.status === "shipped"
                            ? "bg-info"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Calendar size={14} />
                      <span>
                        Placed on{" "}
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Details Stack */}
                  <div className="vstack gap-4">
                    {/* Address */}
                    <div>
                      <h6 className="text-uppercase text-muted small fw-bold mb-2">
                        Shipping Address
                      </h6>
                      <div className="bg-white p-3 rounded border">
                        <p className="fw-bold mb-1 text-dark">
                          {currentUser.name}
                        </p>
                        {selectedOrder?.shippingAddress && (
                          <>
                            <p className="text-muted mb-1 small">
                              {selectedOrder.shippingAddress.address}
                            </p>
                            <p className="text-muted mb-0 small">
                              {selectedOrder.shippingAddress.line1},{" "}
                              {selectedOrder.shippingAddress.state} -{" "}
                              {selectedOrder.shippingAddress.pinCode}
                            </p>
                          </>
                        )}
                        <p className="text-primary mt-2 mb-0 small fw-bold">
                          <span className="text-muted fw-normal">Phone:</span>{" "}
                          {currentUser.mobileNumber}
                        </p>
                      </div>
                    </div>

                    {/* Payment */}
                    <div>
                      <h6 className="text-uppercase text-muted small fw-bold mb-2">
                        Payment Info
                      </h6>
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                        <span className="text-dark small d-flex align-items-center gap-2">
                          <CreditCard size={16} /> Method
                        </span>
                        <span className="fw-bold text-dark text-uppercase">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Total Area */}
                <div className="mt-4 pt-4 border-top">
                  {/* ADDED: Points Earned for this specific order */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success small fw-bold d-flex align-items-center gap-2">
                      <Gift size={16} /> Points Earned
                    </span>
                    <span className="text-success fw-bold">
                      +{Math.floor(selectedOrder.total / 10)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-end mb-3">
                    <span className="text-muted">Total Amount</span>
                    <span className="display-6 fw-bold text-primary">
                      ₹{selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
