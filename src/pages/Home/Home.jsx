import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Plus, Minus, ArrowRight } from 'lucide-react';
import './Home.css';

function Home() {
  const { products, cart, wishlist, addToCart, removeFromCart, toggleWishlist } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
            onClick={() => window.scrollTo({ top: 750, behavior: 'smooth' })}
          >
            <span>Shop Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </header>

      <div className="home-container">
        <div className="filter-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort By: Featured</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="ratingHighLow">Rating: High to Low</option>
            <option value="ratingLowHigh">Rating: Low to High</option>
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => {
            const isFav = wishlist?.some(item => item.id === product.id);
            const cartItem = cart?.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="image-container">
                  <div className="category-ribbon">{product.category}</div>
                  <div className={`stock-ribbon ${product.stock === 0 ? "out" : product.stock < 5 ? "low" : ""}`}>
                    {product.stock === 0 ? "Out of Stock" : `${product.stock} in Stock`}
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
                          <Minus size={16} color="#0f172a" strokeWidth={3} style={{ display: 'block' }} />
                        </button>
                        <span className="qty-count">{quantity}</span>
                        <button 
                          className="qty-btn" 
                          type="button"
                          disabled={quantity >= product.stock} 
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={16} color="#0f172a" strokeWidth={3} style={{ display: 'block' }} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="add-cart-btn" 
                        disabled={product.stock === 0}
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      >
                        <ShoppingCart size={18} color="white" strokeWidth={2.5} style={{ display: 'block' }} />
                        <span>{product.stock === 0 ? "Sold Out" : "Add"}</span>
                      </button>
                    )}
                    <button 
                      className={`wishlist-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    >
                      <Heart 
                        size={20} 
                        fill={isFav ? "#ff4d4d" : "none"} 
                        color={isFav ? "#ff4d4d" : "#0f172a"} 
                        strokeWidth={2.5}
                        style={{ display: 'block' }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;