import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star, Filter } from "lucide-react";
import "./Home.css";

function Home() {
  const { products, addToCart, productsLoading, error } = useApp();
  const navigate = useNavigate();

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showRecommended, setShowRecommended] = useState(false);

  // State for user preferences loaded from profile
  const [activePreferences, setActivePreferences] = useState([]);

  // Load preferences from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter only categories where 'interested' is true
      const interestedCategories = parsed
        .filter((p) => p.interested)
        .map((p) => p.category);
      setActivePreferences(interestedCategories);
    } else {
      // Default fallback if nothing saved yet
      setActivePreferences(["Electronics", "Accessories"]);
    }
  }, [showRecommended]); // Reload when toggle changes to ensure freshness

  // Derived State
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Filter Logic
  let filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    // If standard category filter is used
    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;

    // Preference Filter (The "For You" Logic)
    // If toggle is ON, the product category must be in the activePreferences array
    const matchesPreference = showRecommended
      ? activePreferences.includes(p.category)
      : true;

    return matchesSearch && matchesCategory && matchesPreference;
  });

  // Sort Logic
  if (sortBy === "price-low")
    filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high")
    filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating")
    filteredProducts.sort((a, b) => b.rating - a.rating);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Welcome to <span className="text-gradient">Shop Sphere</span>
              </h1>
              <p className="lead mb-4">
                Discover premium electronics and accessories at unbeatable
                prices. Fast shipping, secure checkout, and 30-day returns.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary btn-lg fw-bold"
                  onClick={() =>
                    window.scrollTo(
                      0,
                      document.getElementById("products").offsetTop
                    )
                  }
                >
                  Shop Now
                </button>
                <button className="btn btn-outline-primary btn-lg fw-bold">
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                  alt="Shopping"
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="products-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold display-5">Our Products</h2>

          {productsLoading && (
            <div className="alert alert-info text-center">
              Loading products...
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center">
              Error loading products: {error}
            </div>
          )}

          {/* Filters & Controls */}
          <div className="filters-section mb-4 bg-light p-4 rounded-3">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-md-3">
                <label className="form-label fw-bold">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Category */}
              <div className="col-md-3">
                <label className="form-label fw-bold">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="col-md-3">
                <label className="form-label fw-bold">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Preferences Toggle */}
              <div className="col-md-3">
                <div className="form-check form-switch p-3 border rounded bg-white d-flex align-items-center gap-2">
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    id="recommendToggle"
                    checked={showRecommended}
                    onChange={(e) => setShowRecommended(e.target.checked)}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label fw-bold small m-0"
                    htmlFor="recommendToggle"
                    style={{ cursor: "pointer" }}
                  >
                    For You <Filter size={14} className="ms-1 text-primary" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-xs-12 col-sm-6 col-lg-3 d-flex"
                >
                  <div className="card product-card shadow-sm border-0 w-100 h-100">
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="card-img-top product-image"
                      />
                      <span className="badge bg-danger stock-badge">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-light text-dark mb-2 w-fit">
                        {product.category}
                      </span>
                      <h5 className="card-title mb-2">{product.name}</h5>
                      <p className="card-text text-secondary small flex-grow-1">
                        {product.description}
                      </p>

                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-warning"
                                  : "text-secondary"
                              }
                              fill={
                                i < Math.floor(product.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="ms-2 text-secondary small">
                          ({product.rating})
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-primary fw-bold">
                          ₹{product.price}
                        </h4>
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart size={16} /> Add
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-primary btn-sm mt-2 w-100"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-xs-12 text-center py-5">
                <p className="text-secondary display-6">
                  {showRecommended
                    ? "No products match your profile preferences."
                    : "No products found matching your criteria"}
                </p>
                {showRecommended && (
                  <button
                    className="btn btn-link"
                    onClick={() => navigate("/profile")}
                  >
                    Update Preferences in Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
