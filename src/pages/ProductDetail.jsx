import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, loading } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ fontSize: '48px' }}>⏳</div>
        <h2>Loading product...</h2>
      </div>
    );
  }

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setNotification(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="product-detail-page">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Products
        </button>

        <div className="product-detail-grid">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>

          <div className="product-details-section">
            <div className="product-badge">{product.category}</div>
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="rating-section">
              <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
              <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="features-section">
              <h3 className="features-title">Key Features:</h3>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="stock-info">
              {product.stock > 10 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">Only {product.stock} left!</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="price-section">
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
            </div>

            <div className="quantity-section">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              <button 
                className="btn-buy-now"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate('/cart'), 500);
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
