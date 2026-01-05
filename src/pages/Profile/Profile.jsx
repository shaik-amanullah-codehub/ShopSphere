import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { LogOut, Gift, ShoppingBag, IndianRupee } from "lucide-react";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, orders, loyaltyPoints } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
                <h4 className="fw-bold">{loyaltyPoints}</h4>
                <p className="text-secondary mb-0">Loyalty Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loyalty Points Section */}
        <div className="card shadow-sm border-0 mb-4 loyalty-card">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Gift size={24} className="text-warning" />
              Loyalty Program
            </h5>
            <div className="row">
              <div className="col-md-8">
                <p className="text-secondary mb-2">
                  Your Loyalty Points:{" "}
                  <strong className="text-primary h5">
                    {loyaltyPoints} pts
                  </strong>
                </p>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{
                      width: `${Math.min((loyaltyPoints / 500) * 100, 100)}%`,
                    }}
                    aria-valuenow={loyaltyPoints}
                    aria-valuemin="0"
                    aria-valuemax="500"
                  />
                </div>
                <small className="text-secondary">
                  Next milestone: 500 points
                </small>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <span className="badge bg-success p-2">✓ Active Member</span>
              </div>
            </div>
            <hr className="my-3" />
            <p className="text-secondary small mb-0">
              <strong>How it works:</strong> Earn 1 loyalty point for every ₹10
              spent. Redeem 100 points for ₹ 10 discount on your next purchase!
            </p>
          </div>
        </div>

        {/* Orders Section */}
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
                          ${order.total.toFixed(2)}
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

      {/* Order Details Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              {selectedOrder && (
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <p>
                        <strong>Order ID:</strong> {selectedOrder.id}
                      </p>
                      <p>
                        <strong>Order Date:</strong>{" "}
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`badge ${
                            selectedOrder.status === "delivered"
                              ? "bg-success"
                              : selectedOrder.status === "shipped"
                              ? "bg-info"
                              : "bg-warning"
                          }`}
                        >
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Tracking:</strong>{" "}
                        {selectedOrder.trackingStatus}
                      </p>
                      <p>
                        <strong>Payment:</strong> {selectedOrder.paymentMethod}
                      </p>
                      <p className="fw-bold text-primary">
                        Total: ${selectedOrder.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3">Shipping Address:</h6>
                  <div className="card bg-light p-3 mb-3 border-0">
                    <p className="mb-1">
                      <strong>{selectedOrder.shippingAddress.fullName}</strong>
                    </p>
                    <p className="mb-1">
                      {selectedOrder.shippingAddress.address}
                    </p>
                    <p className="mb-1">
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p className="mb-0">
                      {selectedOrder.shippingAddress.phone}
                    </p>
                  </div>

                  <h6 className="fw-bold mb-3">Order Items:</h6>
                  <div className="table-responsive">
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td className="fw-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
