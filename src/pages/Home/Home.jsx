import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Star, 
  Plus, 
  Minus, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  Sparkles 
} from 'lucide-react';
import './Home.css';

function Home() {
  const { products, cart, addToCart, removeFromCart } = useApp();
  const navigate = useNavigate();

 
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [forYouMode, setForYouMode] = useState(false);

 
  const categories = ['All', ...new Set(products.map(p => p.category))];

 
  const getPreferredCategories = () => {
    const saved = localStorage.getItem("userPreferences");
    if (!saved) return [];
    const prefs = JSON.parse(saved);
    return prefs.filter(p => p.interested).map(p => p.category);
  };

 
  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (forYouMode) {
      const preferred = getPreferredCategories();
      
      const matchesPref = preferred.length === 0 || preferred.includes(p.category);
      return matchesSearch && matchesPref;
    } else {
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }
  });

  
  if (sortBy === "priceLowHigh") filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "priceHighLow") filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "ratingHighLow") filteredProducts.sort((a, b) => b.rating - a.rating);
  else if (sortBy === "ratingLowHigh") filteredProducts.sort((a, b) => a.rating - b.rating);

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content-wrapper">
          <h1 className="text-gradient">Shop Sphere</h1>
          <p>Premium Quality. Fast Delivery. Secure Payments</p>
          <button 
            className="btn-main" 
            onClick={() => document.getElementById('shop-start').scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Shop Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <div className="home-container" id="shop-start">
        
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
              className={`for-you-btn ${forYouMode ? 'active' : ''}`}
              onClick={() => {
                setForYouMode(!forYouMode);
                setCategoryFilter('All'); 
              }}
            >
              <Sparkles size={16} />
              <span>For You</span>
            </button>

            <div className="select-wrapper" style={{ opacity: forYouMode ? 0.5 : 1 }}>
              <SlidersHorizontal size={16} className="select-icon" />
              <select 
                value={categoryFilter} 
                disabled={forYouMode}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            <div className="select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort By: Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="ratingHighLow">Rating: High to Low</option>
                <option value="ratingLowHigh">Rating: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        
        {forYouMode && (
          <div className="pref-notice">
            ✨ Tailored for you based on your <span onClick={() => navigate('/profile')}>Interests</span>
          </div>
        )}

        
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const cartItem = cart?.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const isOutOfStock = product.stock === 0;

            return (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="image-container">
                  <div className="category-ribbon">{product.category}</div>
                  <div className={`stock-ribbon ${isOutOfStock ? "out" : product.stock < 5 ? "low" : ""}`}>
                    {isOutOfStock ? "Out of Stock" : `${product.stock} in Stock`}
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
                      <div className="quantity-controls" onClick={(e) => e.stopPropagation()}>
                        <button className="qty-btn" type="button" onClick={() => removeFromCart(product.id)}>
                          <Minus size={16} color="#0f172a" strokeWidth={3} />
                        </button>
                        <span className="qty-count">{quantity}</span>
                        <button 
                          className="qty-btn" 
                          type="button"
                          disabled={quantity >= product.stock} 
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={16} color="#0f172a" strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="add-cart-btn" 
                        disabled={isOutOfStock}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                      >
                        <ShoppingCart size={18} color="white" strokeWidth={2.5} />
                        <span>{isOutOfStock ? "Sold Out" : "Add to Cart"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h3>No products found</h3>
            <p className="text-muted">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;