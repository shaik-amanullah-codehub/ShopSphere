/**
 * Login Component
 * Handles authentication for both Customers and Admins via a toggle.
 * Shows a strict, simple error message on failure.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login, currentUser, isLoading, error: contextError } = useApp();

  // State for form data
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State to toggle between Customer and Admin login
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate(currentUser.role === "admin" ? "/admin" : "/");
    return null;
  }

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
      // Attempt login
      const user = await login(formData.email, formData.password);

      // Role Mismatch Check
      if (isAdminLogin && user.role !== "admin") {
        setError("Login failed: Invalid credentials"); // Treat role mismatch as invalid creds too
        return;
      }

      // Navigate based on actual user role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // --- STRICT ERROR MESSAGE ---
      // Regardless of the actual error (404, 401, etc.), show this specific message
      setError("Login failed: Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            <div className="card auth-card shadow-lg">
              <div className="card-body p-5">
                {/* --- HEADER & TOGGLE --- */}
                <h2 className="text-center mb-4 fw-bold">Shop Sphere</h2>

                {/* Toggle Buttons */}
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

                <h4 className="text-center text-secondary mb-4">
                  {isAdminLogin ? "Admin Login" : "Customer Login"}
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

                {/* Also override context error if it exists to keep message consistent */}
                {contextError && !error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    Login failed: Invalid credentials
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {/* --- LOGIN FORM --- */}
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

                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
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
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
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

                {/* --- FOOTER CONTENT --- */}
                {!isAdminLogin && (
                  <p className="text-center text-secondary mb-3">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-primary fw-bold">
                      Sign up here
                    </a>
                  </p>
                )}

                {isAdminLogin && (
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
