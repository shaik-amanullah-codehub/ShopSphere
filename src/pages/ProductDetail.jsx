import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Truck, Lock, RotateCcw } from 'lucide-react';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Product not found</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <div className="product-detail-page py-5">
      <div className="container">
        {addedToCart && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            ✓ Added to cart successfully!
            <button type="button" className="btn-close" onClick={() => setAddedToCart(false)}></button>
          </div>
        )}

        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate('/')}
        >
          ← Back to Products
        </button>

        <div className="row g-4">
          {/* Product Image */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="product-detail-image"
              />
            </div>

            {/* Product Highlights */}
            <div className="row g-3 mt-4">
              <div className="col-xs-6">
                <div className="card highlight-card text-center p-3 border-0 shadow-sm">
                  <Truck className="text-primary mx-auto mb-2" size={32} />
                  <small className="fw-bold">FREE SHIPPING</small>
                  <p className="text-secondary small">On orders over $50</p>
                </div>
              </div>
              <div className="col-xs-6">
                <div className="card highlight-card text-center p-3 border-0 shadow-sm">
                  <RotateCcw className="text-primary mx-auto mb-2" size={32} />
                  <small className="fw-bold">30 DAY RETURNS</small>
                  <p className="text-secondary small">Easy returns policy</p>
                </div>
              </div>
              <div className="col-xs-6">
                <div className="card highlight-card text-center p-3 border-0 shadow-sm">
                  <Lock className="text-primary mx-auto mb-2" size={32} />
                  <small className="fw-bold">SECURE CHECKOUT</small>
                  <p className="text-secondary small">SSL encrypted</p>
                </div>
              </div>
              <div className="col-xs-6">
                <div className="card highlight-card text-center p-3 border-0 shadow-sm">
                  <Star className="text-primary mx-auto mb-2" size={32} />
                  <small className="fw-bold">TRUSTED</small>
                  <p className="text-secondary small">10K+ happy customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-7">
            <div className="product-info">
              <div className="mb-3">
                <span className="badge bg-light text-dark me-2">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="badge bg-success">In Stock</span>
                ) : (
                  <span className="badge bg-danger">Out of Stock</span>
                )}
              </div>

              <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="d-flex align-items-center mb-4">
                <div className="d-flex me-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'text-warning' : 'text-secondary'}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-secondary">
                  {product.rating} out of 5 ({Math.floor(Math.random() * 500) + 100} reviews)
                </span>
              </div>

              <p className="lead text-secondary mb-4">{product.description}</p>

              {/* Price */}
              <div className="price-section mb-4">
                <div className="d-flex align-items-baseline gap-3">
                  <h2 className="display-6 fw-bold text-primary mb-0">
                    ${product.price}
                  </h2>
                  <span className="text-secondary text-decoration-line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="badge bg-danger">Save 20%</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="card bg-light border-0 mb-4 p-3">
                <p className="mb-2"><strong>Stock Available:</strong> {product.stock} units</p>
                <p className="mb-0"><strong>Category:</strong> {product.category}</p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="action-section mb-4">
                <div className="mb-3">
                  <label className="form-label fw-bold">Quantity</label>
                  <select
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={product.stock === 0}
                    className="form-select py-2"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'item' : 'items'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={24} />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-lg py-3 fw-bold"
                  >
                    Add to Wishlist ♡
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="card border-0 bg-light p-3">
                <h6 className="fw-bold mb-3">Why choose this product?</h6>
                <ul className="mb-0">
                  <li>Premium quality and reliability</li>
                  <li>Best price guarantee</li>
                  <li>Fast and secure shipping</li>
                  <li>Excellent customer support</li>
                  <li>Money-back satisfaction guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-5 pt-5 border-top">
          <h3 className="fw-bold mb-4">Related Products</h3>
          <div className="row g-4">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div key={relatedProduct.id} className="col-xs-12 col-sm-6 col-lg-3">
                  <div
                    className="card product-card border-0 shadow-sm cursor-pointer"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{relatedProduct.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-primary">${relatedProduct.price}</strong>
                        <Star size={16} className="text-warning" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetail;
