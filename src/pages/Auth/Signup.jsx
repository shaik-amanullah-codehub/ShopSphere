/**
 * Signup Component
 *
 * Handles customer registration with:
 * - Form validation (email format, password strength)
 * - Duplicate email detection
 * - Auto-login after successful signup
 * - Comprehensive error handling
 *
 * @component
 * @returns {React.ReactElement} Signup form page
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const { signup, currentUser, isLoading, error: contextError } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate("/");
    return null;
  }

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  /**
   * Validate form data before submission
   * @returns {string|null} Error message if validation fails, null if valid
   */
  const validateForm = () => {
    const { name, email, password, confirmPassword, mobileNumber } = formData;

    // Required fields check
    if (!name || !email || !password || !confirmPassword || !mobileNumber) {
      return "Please fill in all fields";
    }

    // Name validation
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }

    // Password validation
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    // Password match validation
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    // Password strength (at least one number or special character)
    if (!/[0-9!@#$%^&*]/.test(password)) {
      return "Password should contain at least one number or special character";
    }
    //mobile validation (must contains only number and length should be equal to 10)
    if (!/[0-9]/.test(mobileNumber) && mobileNumber.length == 10) {
      return "Enter a vaild 10 Digit mobile number";
    }

    return null;
  };

  /**
   * Handle form submission
   * Creates new customer account and auto-logs in
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Call signup from AppContext
      // This creates account and auto-logs in
      await signup({
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Redirect to home page (auto-login happened)
      navigate("/");
    } catch (err) {
      // Error is caught and displayed
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            <div className="card auth-card shadow-lg">
              <div className="card-body p-5">
                {/* Header */}
                <h2 className="text-center mb-4 fw-bold">Shop Sphere</h2>
                <h4 className="text-center text-secondary mb-4">
                  Create Account
                </h4>

                {/* Error Messages */}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {contextError && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {contextError}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-control py-2"
                      disabled={isLoading}
                      required
                    />
                    <small className="text-muted">At least 2 characters</small>
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="form-control py-2"
                      disabled={isLoading}
                      required
                    />
                    <small className="text-muted">
                      Use a valid email address
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="form-control py-2"
                      disabled={isLoading}
                      required
                    />
                    <small className="text-muted">
                      Enter a valid mobile number
                    </small>
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
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
                    <small className="text-muted">
                      At least 6 characters with number or special character
                    </small>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="form-control py-2"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Signup Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-secondary">
                  Already have an account?{" "}
                  <a href="/login" className="text-primary fw-bold">
                    Login here
                  </a>
                </p>

                {/* Password Requirements Info */}
                <div className="alert alert-info mt-3" role="alert">
                  <small className="fw-bold">Password Requirements:</small>
                  <ul className="mb-0 mt-2 ps-3">
                    <li>
                      <small>At least 6 characters</small>
                    </li>
                    <li>
                      <small>
                        Include a number (0-9) or special character (!@#$%^&*)
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
