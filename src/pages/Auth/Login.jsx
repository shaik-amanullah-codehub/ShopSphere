/**
 * Login Component
 * Handles authentication for both Customers and Admins via a toggle.
 * Includes "Forgot Password" flow with strict database checks.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { authAPI } from "../../services/api"; // Import authAPI for direct DB checks
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login, currentUser, isLoading, error: contextError } = useApp();

  // --- Main Login State ---
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // --- Forgot Password State ---
  // views: 'login' | 'verify_email' | 'reset_password'
  const [authView, setAuthView] = useState("login");
  const [resetEmail, setResetEmail] = useState("");

  // We need to store the FULL user object to ensure we don't wipe data
  // during the PUT request (since api.js uses PUT, not PATCH).
  const [resetUserObject, setResetUserObject] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility Toggles for Reset Flow
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate(currentUser.role === "admin" ? "/admin" : "/");
    return null;
  }

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const user = await login(formData.email, formData.password);

      // Role Mismatch Check
      if (isAdminLogin && user.role !== "admin") {
        setError("Login failed: Invalid credentials");
        return;
      }

      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      // Strict Error Message
      setError("Login failed: Invalid credentials");
    }
  };

  // --- FORGOT PASSWORD LOGIC ---

  // 1. Verify Email Exists
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    try {
      // We fetch all customers to find the match.
      // This is safer given the generic getAllCustomers endpoint.
      const response = await authAPI.getAllCustomers();
      const users = response.data;

      const foundUser = users.find((u) => u.email === resetEmail);

      if (foundUser) {
        setResetUserObject(foundUser); // Save full object for safe update
        setAuthView("reset_password");
      } else {
        setError("User does not exist, please signup");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server. Please try again.");
    }
  };

  // 2. Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!resetUserObject) {
      setError("Session expired. Please start over.");
      setAuthView("login");
      return;
    }

    try {
      // Construct the updated object: Keep all old data, only change password.
      // This matches the safe logic used in AppContext/placeOrder.
      const updatedUserPayload = {
        ...resetUserObject,
        password: newPassword,
      };

      // Call the API with the specific User ID and the Full Payload
      await authAPI.updateCustomer(resetUserObject.id, updatedUserPayload);

      alert("Password updated successfully! Please login.");

      // Cleanup and Redirect to Login
      setAuthView("login");
      setFormData({ ...formData, email: resetEmail }); // Pre-fill email
      setNewPassword("");
      setConfirmPassword("");
      setResetUserObject(null);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update password. Try again.");
    }
  };

  // --- RENDER HELPERS ---

  const renderFormContent = () => {
    // === VIEW 2: VERIFY EMAIL ===
    if (authView === "verify_email") {
      return (
        <form onSubmit={handleVerifyEmail}>
          <div className="mb-3">
            <label className="form-label fw-bold">Enter your Email</label>
            <input
              type="email"
              className="form-control py-2"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                setError("");
              }}
              placeholder="name@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-warning w-100 py-2 fw-bold mb-3"
          >
            Verify Email
          </button>
          <button
            type="button"
            className="btn btn-link w-100 text-decoration-none"
            onClick={() => {
              setAuthView("login");
              setError("");
            }}
          >
            Back to Login
          </button>
        </form>
      );
    }

    // === VIEW 3: RESET PASSWORD ===
    if (authView === "reset_password") {
      return (
        <form onSubmit={handleResetPassword}>
          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-bold">New Password</label>
            <div className="input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control py-2"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-bold">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control py-2"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Re-enter password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold mb-3"
          >
            Update Password
          </button>
          <button
            type="button"
            className="btn btn-link w-100 text-decoration-none"
            onClick={() => {
              setAuthView("login");
              setError("");
            }}
          >
            Cancel
          </button>
        </form>
      );
    }

    // === VIEW 1: DEFAULT LOGIN ===
    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={
              isAdminLogin ? "Enter admin email" : "Enter your email"
            }
            className="form-control py-2"
            disabled={isLoading}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-bold">Password</label>
          <div className="input-group">
            <input
              type={showLoginPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="form-control py-2"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              disabled={isLoading}
            >
              {showLoginPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="d-flex justify-content-end mb-4">
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0 small text-secondary"
            onClick={() => {
              setAuthView("verify_email");
              setError("");
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-bold mb-3"
          disabled={isLoading}
        >
          {isLoading
            ? "Logging in..."
            : `Login as ${isAdminLogin ? "Admin" : "Customer"}`}
        </button>
      </form>
    );
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            <div className="card auth-card shadow-lg">
              <div className="card-body p-5">
                {/* --- HEADER --- */}
                <h2 className="text-center mb-4 fw-bold">Shop Sphere</h2>

                {/* Toggle Buttons (Only visible in Login View) */}
                {authView === "login" && (
                  <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn ${
                          !isAdminLogin ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => setIsAdminLogin(false)}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          isAdminLogin ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => setIsAdminLogin(true)}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                )}

                <h4 className="text-center text-secondary mb-4">
                  {authView === "login"
                    ? isAdminLogin
                      ? "Admin Login"
                      : "Customer Login"
                    : authView === "verify_email"
                    ? "Find Account"
                    : "Reset Password"}
                </h4>

                {/* --- ERROR MESSAGES --- */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {/* Context Error Override (Login only) */}
                {contextError && !error && authView === "login" && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    Login failed: Invalid credentials
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {/* --- FORM CONTENT --- */}
                {renderFormContent()}

                {/* --- FOOTER --- */}
                {!isAdminLogin && authView === "login" && (
                  <p className="text-center text-secondary mb-3">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-primary fw-bold">
                      Sign up here
                    </a>
                  </p>
                )}

                {isAdminLogin && authView === "login" && (
                  <div className="alert alert-info mt-4" role="alert">
                    <small className="fw-bold">Demo Admin Credentials:</small>
                    <br />
                    <small>
                      <strong>Email:</strong> admin@shop.com
                    </small>
                    <br />
                    <small>
                      <strong>Password:</strong> admin123
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
