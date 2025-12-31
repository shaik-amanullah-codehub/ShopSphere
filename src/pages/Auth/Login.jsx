/**
 * Login Component
 * 
 * Handles customer and admin authentication.
 * Validates credentials against registered customers in database.
 * Auto-redirects to appropriate dashboard based on user role.
 * 
 * @component
 * @returns {React.ReactElement} Login form page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login, currentUser, isLoading, error: contextError } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if (currentUser) {
    navigate(currentUser.role === 'admin' ? '/admin' : '/');
    return null;
  }

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  /**
   * Handle form submission
   * Authenticates user against database credentials
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Call login from AppContext
      // This validates credentials against customers in db.json
      const user = await login(formData.email, formData.password);

      // Navigate based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error is set in AppContext, display it
      setError(err.message || 'Login failed. Please check your credentials.');
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
                <h4 className="text-center text-secondary mb-4">Customer Login</h4>

                {/* Error Messages */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {contextError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {contextError}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
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
                      Use the email you registered with
                    </small>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
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
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <small className="text-muted">
                      At least 6 characters
                    </small>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                {/* Signup Link */}
                <p className="text-center text-secondary mb-3">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-primary fw-bold">
                    Sign up here
                  </a>
                </p>

                {/* Demo Credentials Info */}
                <div className="alert alert-info mt-4" role="alert">
                  <small className="fw-bold">Demo Credentials:</small>
                  <br />
                  <small>
                    <strong>Admin:</strong> admin@shop.com / admin123
                  </small>
                  <br />
                  <small>
                    Or create a new customer account
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
