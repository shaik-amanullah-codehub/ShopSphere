/**
 * Home Page Component
 * 
 * Main landing page displaying featured products with:
 * - Hero section with call-to-action
 * - Product catalog with search, filtering, and sorting
 * - Product cards with ratings, price, and quick add-to-cart
 * 
 * State Management:
 * - Products fetched from API via useApp() hook
 * - Products are cached in AppContext (fetched once on app load)
 * - Local state for search, filter, and sort preferences
 * 
 * Features:
 * - Real-time search across product name and description
 * - Category filtering (dynamically built from products)
 * - Multiple sort options (price, rating, newest)
 * - Stock availability display
 * - Direct add-to-cart functionality
 * - Link to detailed product view
 * 
 * @component
 * @returns {React.ReactElement} Home page JSX
 * 
 * @example
 * return <Home />
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import './Home.css';

function Home() {
  // ===== CONTEXT STATE =====
  // Products are fetched by AppContext on app initialization via fetchProducts()
  // This data is cached in AppContext and persisted to localStorage
  const { products, addToCart, productsLoading, error } = useApp();
  
  // ===== LOCAL STATE =====
  const navigate = useNavigate();
  
  // Search term state - updated as user types in search input
  const [searchTerm, setSearchTerm] = useState('');
  
  // Category filter state - defaults to 'All' to show all products
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Sort preference state - defaults to 'newest'
  const [sortBy, setSortBy] = useState('newest');

  // ===== DERIVED STATE =====
  /**
   * Dynamically build categories list from available products
   * Includes 'All' option + unique categories from products array
   * This updates automatically when products data changes
   */
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // ===== FILTER & SORT LOGIC =====
  /**
   * Filter products based on:
   * 1. Search term (matches product name or description)
   * 2. Selected category
   */
  let filteredProducts = products.filter(p => {
    // Check if search term matches product name or description (case-insensitive)
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if product category matches selected filter
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    
    // Only include products that match both criteria
    return matchesSearch && matchesCategory;
  });

  /**
   * Sort filtered products based on selected sort option
   * Modifies array in-place for performance
   */
  if (sortBy === 'price-low') {
    // Sort by price ascending (lowest first)
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    // Sort by price descending (highest first)
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    // Sort by rating descending (highest first)
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  // 'newest' is default (maintains order from API response)

  // ===== RENDER =====
  return (
    <div className="home-page">
      {/* Hero Section - Welcome banner with CTA */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            {/* Hero Text Content */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Welcome to <span className="text-gradient">Shop Sphere</span>
              </h1>
              <p className="lead mb-4">
                Discover premium electronics and accessories at unbeatable prices. 
                Fast shipping, secure checkout, and 30-day returns.
              </p>
              <div className="d-flex gap-3">
                {/* Scroll to products section on click */}
                <button
                  className="btn btn-primary btn-lg fw-bold"
                  onClick={() => window.scrollTo(0, document.getElementById('products').offsetTop)}
                >
                  Shop Now
                </button>
                <button className="btn btn-outline-primary btn-lg fw-bold">
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Hero Image */}
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

          {/* Loading State */}
          {productsLoading && (
            <div className="alert alert-info text-center">
              <p className="mb-0">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger text-center">
              <p className="mb-0">Error loading products: {error}</p>
            </div>
          )}

          {/* Filters Section */}
          <div className="filters-section mb-4 bg-light p-4 rounded-3">
            <div className="row g-3">
              {/* Search Filter */}
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label fw-bold">Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control py-2"
                    aria-label="Search products"
                  />
                  <small className="text-muted">
                    Search by product name or description
                  </small>
                </div>
              </div>

              {/* Category Filter */}
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="form-select py-2"
                    aria-label="Filter by category"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">
                    Filter by product category
                  </small>
                </div>
              </div>

              {/* Sort Option */}
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label fw-bold">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-select py-2"
                    aria-label="Sort products"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <small className="text-muted">
                    Sort by different criteria
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className="col-xs-12 col-sm-6 col-lg-3 d-flex">
                  {/* Product Card */}
                  <div className="card product-card shadow-sm border-0 w-100 h-100">
                    {/* Product Image Container */}
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="card-img-top product-image"
                      />
                      {/* Stock Badge */}
                      <span className="badge bg-danger stock-badge">
                        {product.stock > 0 
                          ? `${product.stock} in stock` 
                          : 'Out of stock'}
                      </span>
                    </div>

                    {/* Product Information */}
                    <div className="card-body d-flex flex-column">
                      {/* Category Badge */}
                      <span className="badge bg-light text-dark mb-2 w-fit">
                        {product.category}
                      </span>

                      {/* Product Name */}
                      <h5 className="card-title mb-2">
                        {product.name}
                      </h5>

                      {/* Product Description */}
                      <p className="card-text text-secondary small flex-grow-1">
                        {product.description}
                      </p>

                      {/* Star Rating */}
                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex">
                          {/* Render 5 stars, fill based on rating */}
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < Math.floor(product.rating) 
                                ? 'text-warning' 
                                : 'text-secondary'}
                              fill={i < Math.floor(product.rating) 
                                ? 'currentColor' 
                                : 'none'}
                            />
                          ))}
                        </div>
                        <span className="ms-2 text-secondary small">
                          ({product.rating})
                        </span>
                      </div>

                      {/* Price and Add to Cart Button */}
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-primary fw-bold">
                          ${product.price}
                        </h4>
                        {/* Add to Cart Button */}
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
                        >
                          <ShoppingCart size={16} />
                          Add
                        </button>
                      </div>

                      {/* View Details Button */}
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
              // No Products Found Message
              <div className="col-xs-12 text-center py-5">
                <p className="text-secondary display-6">
                  {searchTerm || categoryFilter !== 'All' 
                    ? 'No products found matching your criteria' 
                    : 'Loading products...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
