import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { authAPI } from "../../services/api"; // Import the API service
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, mobileNumber } = formData;

    if (!name || !email || !password || !confirmPassword || !mobileNumber) return "Please fill in all fields";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
    if (!/^\d{10}$/.test(mobileNumber)) return "Enter a valid 10-digit mobile number";
    if (password.length < 6) return "Password must be at least 6 characters";

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  // --- UPDATED HANDLESUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // 1. CHECK: Use Axios API to check existence
      const response = await authAPI.checkEmailExists(formData.email.trim().toLowerCase());
      const existingUsers = response.data; // Axios stores body in .data

      // 2. VALIDATE: If array is not empty, user exists
      if (existingUsers.length > 0) {
        setError("User already exists, try with a new email");
        return;
      }

      // 3. PROCEED: Context signup
      await signup({
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      // Handle Axios errors (err.response.data.message) or generic errors
      const errMsg = err.response?.data?.message || err.message || "Signup failed";
      setError(errMsg);
    }
  };
  // ----------------------------

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-5">
            <div className="card auth-card shadow-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 fw-bold">Shop Sphere</h2>
                <h4 className="text-center text-secondary mb-4">Create Account</h4>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}
                {contextError && (
                  <div className="alert alert-danger alert-dismissible fade show">
                    {contextError}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="form-control py-2" disabled={isLoading} required />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="form-control py-2" disabled={isLoading} required />
                  </div>

                  {/* Mobile */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Mobile Number</label>
                    <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Enter 10-digit mobile number" className="form-control py-2" disabled={isLoading} required />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <div className="input-group">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" className="form-control py-2" disabled={isLoading} required />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <small className="text-muted" style={{ fontSize: "0.8rem" }}>Must have Uppercase, Lowercase, Number & Special Char</small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Confirm Password</label>
                    <div className="input-group">
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="form-control py-2" disabled={isLoading} required />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading}>
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </button>
                </form>

                <p className="text-center text-secondary">
                  Already have an account? <a href="/login" className="text-primary fw-bold">Login here</a>
                </p>

                <div className="alert alert-info mt-3" role="alert">
                  <small className="fw-bold">Password Requirements:</small>
                  <ul className="mb-0 mt-2 ps-3" style={{ fontSize: "0.85rem" }}>
                    <li>Min 6 characters</li>
                    <li>At least one Uppercase letter (A-Z)</li>
                    <li>At least one Lowercase letter (a-z)</li>
                    <li>At least one Number (0-9)</li>
                    <li>At least one Special character (!@#$...)</li>
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