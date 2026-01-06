import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Megaphone, ChevronRight, ChevronLeft } from 'lucide-react';
import { campaignAPI } from '../../services/api';
import './Home.css';

function Home() {
  const { products, addToCart, productsLoading, error } = useApp();
  const navigate = useNavigate();
  
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [currentCampIdx, setCurrentCampIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await campaignAPI.getAllCampaigns();
        // Only show Active campaigns that haven't been soft-deleted
        const active = res.data.filter(c => c.active && c.status === 'Active');
        setActiveCampaigns(active);
      } catch (err) {
        console.error("Banner fetch error:", err);
      }
    };
    fetchBanners();
  }, []);

  const handleBannerClick = (campaign) => {
    // Save campaignId to track conversion for ROI reporting
    sessionStorage.setItem('activeCampaignId', campaign.id);
    
    if (campaign.targetAudience === "All Customers") {
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    } else {
      // Filter for core category (Fashion/Apparel) as per requirements
      const isFashion = campaign.targetAudience.includes('Fashion');
      setCategoryFilter(isFashion ? "Electronics" : "All"); 
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextCamp = (e) => {
    e.stopPropagation();
    setCurrentCampIdx((prev) => (prev + 1) % activeCampaigns.length);
  };

  const prevCamp = (e) => {
    e.stopPropagation();
    setCurrentCampIdx((prev) => (prev === 0 ? activeCampaigns.length - 1 : prev - 1));
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-low') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filteredProducts.sort((a, b) => b.rating - a.rating);

  return (
    <div className="home-page">
      {/* Campaign Banner Section */}
      {activeCampaigns.length > 0 && (
        <div className="campaign-slider bg-primary text-white py-4 shadow-sm position-relative" 
             style={{ cursor: 'pointer' }}
             onClick={() => handleBannerClick(activeCampaigns[currentCampIdx])}>
          <div className="container text-center">
            <Megaphone size={36} className="mb-2 d-inline-block animate-bounce" />
            <h2 className="fw-bold display-6 mb-1">{activeCampaigns[currentCampIdx].name}</h2>
            <p className="lead opacity-75 mb-0">Targeted offer for {activeCampaigns[currentCampIdx].targetAudience}!</p>
          </div>
          <button className="btn btn-link text-white position-absolute start-0 top-50 translate-middle-y ms-4" onClick={prevCamp}>
            <ChevronLeft size={40} />
          </button>
          <button className="btn btn-link text-white position-absolute end-0 top-50 translate-middle-y me-4" onClick={nextCamp}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Welcome to <span className="text-gradient">Shop Sphere</span>
              </h1>
              <p className="lead mb-4">
                Omnichannel inventory management and real-time order fulfillment.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-primary btn-lg fw-bold px-5" 
                        onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                  Shop Now
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                alt="ShopSphere" className="img-fluid rounded-4 shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <section id="products" className="products-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold display-5">Our Catalog</h2>

          <div className="filters-section mb-4 bg-white p-4 rounded-4 shadow-sm">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold small text-muted">SEARCH</label>
                <input type="text" placeholder="Search..." value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)} className="form-control py-2" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold small text-muted">CATEGORY</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="form-select py-2">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold small text-muted">SORT BY</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select py-2">
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className="col-sm-6 col-lg-3 d-flex">
                  <div className="card product-card shadow-sm border-0 w-100">
                    <img src={product.image} alt={product.name} className="card-img-top" />
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-light text-dark mb-2 w-fit">{product.category}</span>
                      <h5 className="fw-bold mb-2">{product.name}</h5>
                      <p className="text-secondary small flex-grow-1">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <h5 className="text-primary fw-bold mb-0">₹{product.price.toLocaleString('en-IN')}</h5>
                        <button className="btn btn-primary btn-sm px-3" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          Add <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 w-100">
                <p className="text-secondary display-6">No products found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;