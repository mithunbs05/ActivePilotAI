import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const Home = () => {
  const { products, addToCart, loading } = useApp();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [notification, setNotification] = useState('');
  const [compareItems, setCompareItems] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCompareToggle = (productId) => {
    setCompareItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : prev.length < 4 ? [...prev, productId] : prev
    );
  };

  const handleWishlistToggle = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSortBy('featured');
  };

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div className="loading-spinner" style={{ fontSize: '48px' }}>⏳</div>
          <h2>Loading products...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {notification && (
        <div className="notification">
          <span className="notification-icon">✓</span>
          {notification}
        </div>
      )}

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Premium Tech at Your Fingertips</h1>
          <p className="hero-subtitle">Discover the latest drones and laptops with exclusive deals</p>
          <button className="hero-cta-btn" onClick={() => document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' })}>
            Shop Now
          </button>
          <div className="trust-signals">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <span className="trust-text">Free Shipping</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">↩️</span>
              <span className="trust-text">30-Day Returns</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">100% Secure</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="controls-bar">
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="sort-section">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select 
              id="sort-select"
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="filter-info-bar">
          <div className="results-count">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </div>
          {selectedCategory !== 'All' && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear all filters
            </button>
          )}
        </div>

        {sortedProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="empty-state-title">No products found</h2>
            <p className="empty-state-text">Try adjusting your filters or search criteria</p>
            <button className="empty-state-btn" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map((product, index) => (
              <div key={product.id} className="product-card" style={{ animationDelay: `${index * 50}ms` }}>
                {product.badge && (
                  <span className={`product-badge ${product.badge.toLowerCase()}`}>
                    {product.badge}
                  </span>
                )}
                
                <button 
                  className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                  onClick={() => handleWishlistToggle(product.id)}
                  aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {wishlist.includes(product.id) ? '❤️' : '🤍'}
                </button>

                <div className="product-image-link">
                  <Link to={`/product/${product.id}`} className="product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-image" 
                      loading="lazy"
                    />
                  </Link>
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="stock-badge low-stock">Only {product.stock} left</span>
                  )}
                  {product.stock === 0 && (
                    <span className="stock-badge out-of-stock">Out of Stock</span>
                  )}
                  {product.stock >= 10 && (
                    <span className="stock-badge in-stock">In Stock</span>
                  )}
                  <button 
                    className="quick-view-btn"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    Quick View
                  </button>
                </div>
                
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <Link to={`/product/${product.id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                  </Link>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">{product.rating} ({product.reviews})</span>
                  </div>

                  {product.deliveryDate && (
                    <div className="delivery-info">
                      🚚 Delivery by {formatDeliveryDate(product.deliveryDate)}
                    </div>
                  )}
                  
                  <div className="product-footer">
                    <div className="price-section">
                      {product.originalPrice && (
                        <>
                          <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          <span className="discount-badge">{product.discount}% OFF</span>
                        </>
                      )}
                      <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="savings-text">
                          Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      <label className="compare-checkbox">
                        <input
                          type="checkbox"
                          checked={compareItems.includes(product.id)}
                          onChange={() => handleCompareToggle(product.id)}
                          aria-label={`Compare ${product.name}`}
                        />
                        <span>Compare</span>
                      </label>
                      
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <span className="cart-icon">🛒</span>
                        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {compareItems.length > 0 && (
        <div className="comparison-toolbar">
          <div className="comparison-content">
            <span className="comparison-text">
              {compareItems.length} {compareItems.length === 1 ? 'item' : 'items'} selected for comparison
            </span>
            <div className="comparison-actions">
              <button 
                className="compare-btn"
                disabled={compareItems.length < 2}
                onClick={() => alert('Comparison feature coming soon!')}
              >
                Compare Now
              </button>
              <button 
                className="clear-comparison-btn"
                onClick={() => setCompareItems([])}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {quickViewProduct && (
        <div className="quick-view-modal" onClick={() => setQuickViewProduct(null)}>
          <div className="quick-view-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setQuickViewProduct(null)}>×</button>
            <div className="quick-view-grid">
              <img src={quickViewProduct.image} alt={quickViewProduct.name} className="quick-view-image" />
              <div className="quick-view-details">
                <div className="product-category">{quickViewProduct.category}</div>
                <h2 className="quick-view-title">{quickViewProduct.name}</h2>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(quickViewProduct.rating) ? 'star filled' : 'star'}>★</span>
                    ))}
                  </div>
                  <span className="rating-text">{quickViewProduct.rating} ({quickViewProduct.reviews} reviews)</span>
                </div>
                <p className="quick-view-description">{quickViewProduct.description}</p>
                <div className="price-section">
                  {quickViewProduct.originalPrice && (
                    <span className="original-price">₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  <span className="product-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                  {quickViewProduct.originalPrice && (
                    <span className="savings-text">Save ₹{(quickViewProduct.originalPrice - quickViewProduct.price).toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="quick-view-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    disabled={quickViewProduct.stock === 0}
                  >
                    <span className="cart-icon">🛒</span>
                    Add to Cart
                  </button>
                  <button 
                    className="view-details-btn"
                    onClick={() => {
                      navigate(`/product/${quickViewProduct.id}`);
                      setQuickViewProduct(null);
                    }}
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
