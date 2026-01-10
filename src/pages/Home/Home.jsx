import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Sparkles,
  Loader2,
  AlertCircle,
  // Footer Icons
  Mail,
  Phone,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import "./Home.css";

function Home() {
  const { products, cart, addToCart, productsLoading, error } = useApp();
  const navigate = useNavigate();

  // --- Home State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [forYouMode, setForYouMode] = useState(false);

  // --- Footer State ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // --- Derived State ---
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // --- Helper: Get preferences ---
  const getPreferredCategories = () => {
    try {
      const saved = localStorage.getItem("userPreferences");
      if (!saved) return [];
      const prefs = JSON.parse(saved);
      return prefs.filter((p) => p.interested).map((p) => p.category);
    } catch (e) {
      console.error("Error parsing preferences", e);
      return [];
    }
  };

  // --- Footer Handler ---
  const handleFooterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your message has been sent.`);
    setFormData({ name: "", email: "", message: "" });
  };

  // --- Filter Logic ---
  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (forYouMode) {
      const preferred = getPreferredCategories();
      const matchesPref =
        preferred.length === 0 || preferred.includes(p.category);
      return matchesSearch && matchesPref;
    } else {
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }
  });

  // --- Sort Logic ---
  if (sortBy === "priceLowHigh")
    filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "priceHighLow")
    filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "ratingHighLow")
    filteredProducts.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "ratingLowHigh")
    filteredProducts.sort((a, b) => a.rating - b.rating);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content-wrapper">
          <h1 className="text-gradient">Shop Sphere</h1>
          <p>Premium Quality. Fast Delivery. Secure Payments.</p>
          <button
            className="btn-main"
            onClick={() =>
              document
                .getElementById("shop-start")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>Shop Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <div className="home-container" id="shop-start">
        {/* Filter & Search Bar */}
        <div className="filter-wrapper">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button
              className={`for-you-btn ${forYouMode ? "active" : ""}`}
              onClick={() => {
                setForYouMode(!forYouMode);
                setCategoryFilter("All");
              }}
              title="Show products based on your profile interests"
            >
              <Sparkles size={16} />
              <span>For You</span>
            </button>

            <div
              className="select-wrapper"
              style={{ opacity: forYouMode ? 0.5 : 1 }}
            >
              <SlidersHorizontal size={16} className="select-icon" />
              <select
                value={categoryFilter}
                disabled={forYouMode}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort By: Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="ratingHighLow">Rating: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {productsLoading && (
          <div className="state-message">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p>Loading your products...</p>
          </div>
        )}

        {error && (
          <div className="state-message text-danger">
            <AlertCircle size={40} />
            <p>Error loading products: {error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!productsLoading && !error && (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const cartItem = cart?.find((item) => item.id === product.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const isOutOfStock = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="image-container">
                    <div className="category-ribbon">{product.category}</div>
                    <div
                      className={`stock-ribbon ${
                        isOutOfStock ? "out" : product.stock < 5 ? "low" : ""
                      }`}
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : `${product.stock} in Stock`}
                    </div>
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="card-info">
                    <h3>{product.name}</h3>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={star <= product.rating ? "#ffc107" : "none"}
                          color={star <= product.rating ? "#ffc107" : "#e2e8f0"}
                        />
                      ))}
                      <span className="rating-number">{product.rating}</span>
                    </div>
                    <p className="price">₹ {product.price}</p>

                    <div className="card-actions">
                      {quantity > 0 ? (
                        <div
                          className="quantity-controls"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* MINUS BUTTON - Explicit White Color */}
                          <button
                            className="qty-btn"
                            type="button"
                            onClick={() => addToCart(product, -1)}
                          >
                            <Minus
                              size={18}
                              strokeWidth={2.5}
                              color="#ffffff"
                            />
                          </button>

                          <span className="qty-count">{quantity}</span>

                          {/* PLUS BUTTON - Explicit White Color */}
                          <button
                            className="qty-btn"
                            type="button"
                            disabled={quantity >= product.stock}
                            onClick={() => addToCart(product, 1)}
                          >
                            <Plus size={18} strokeWidth={2.5} color="#ffffff" />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="add-cart-btn"
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          style={{
                            opacity: isOutOfStock ? 0.6 : 1,
                            cursor: isOutOfStock ? "not-allowed" : "pointer",
                          }}
                        >
                          <ShoppingCart
                            size={18}
                            color="white"
                            strokeWidth={2.5}
                          />
                          <span>
                            {isOutOfStock ? "Sold Out" : "Add to Cart"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!productsLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h3 className="text-secondary">No products found</h3>
            <p className="text-muted">
              {forYouMode
                ? "No products match your profile preferences."
                : "Try adjusting your filters or search term."}
            </p>
          </div>
        )}
      </div>

      {/* --- INTEGRATED FOOTER SECTION --- */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="contact-form-side">
              <h2 className="footer-heading">Message Us</h2>
              <form onSubmit={handleFooterSubmit} className="footer-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
                <button type="submit" className="btn-footer-send">
                  Send <Send size={16} />
                </button>
              </form>
            </div>

            <div className="contact-info-side">
              <div className="contact-block">
                <h3 className="sub-heading">Call us on</h3>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>1234-567-890</span>
                </div>
              </div>
              <div className="contact-block">
                <h3 className="sub-heading">Email us on</h3>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>shopsphere@gmail.com</span>
                </div>
              </div>
              <div className="contact-block">
                <h3 className="sub-heading">Follow us on</h3>
                <div className="footer-social-row">
                  <a href="#" className="social-circle">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="social-circle">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="social-circle">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>&copy; 2026 Shop Sphere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
