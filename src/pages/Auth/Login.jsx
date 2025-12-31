import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useApp();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    if (formData.email === 'admin@shop.com' && formData.password === 'admin123') {
      login({ email: formData.email, name: 'Admin', role: 'admin' });
      navigate('/admin');
    } else if (formData.email && formData.password) {
      login({ email: formData.email, name: formData.email.split('@')[0], role: 'customer' });
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            <div className="card auth-card shadow-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 fw-bold">Shop Sphere</h2>
                <h4 className="text-center text-secondary mb-4">Customer Login</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="form-control py-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="form-control py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold mb-3"
                  >
                    Login
                  </button>
                </form>
                <p className="text-center text-secondary mb-2">
                  Don't have an account? <a href="/signup">Sign up</a>
                </p>
                <p className="text-center text-secondary small">
                  Demo Admin: admin@shop.com / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
