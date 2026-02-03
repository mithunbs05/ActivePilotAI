import { useApp } from '../context/AppContext';
import './Orders.css';

const Orders = () => {
  const { orders } = useApp();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { label: 'Order Placed', icon: '📋', key: 'placed' },
      { label: 'Confirmed', icon: '✓', key: 'confirmed' },
      { label: 'Shipped', icon: '📦', key: 'shipped' },
      { label: 'Out for Delivery', icon: '🚚', key: 'delivery' },
      { label: 'Delivered', icon: '✓', key: 'delivered' }
    ];

    let activeStep = 0;
    switch (status.toLowerCase()) {
      case 'processing':
        activeStep = 1;
        break;
      case 'shipped':
        activeStep = 2;
        break;
      case 'out for delivery':
        activeStep = 3;
        break;
      case 'delivered':
        activeStep = 4;
        break;
      default:
        activeStep = 0;
    }

    return steps.map((step, index) => ({
      ...step,
      completed: index <= activeStep,
      active: index === activeStep
    }));
  };

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-content">
          <div className="empty-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Start shopping now!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>
        
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-header-left">
                  <h3 className="order-id">Order #{order.id}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="order-header-right">
                  <span className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <h4 className="order-item-name">{item.name}</h4>
                      <p className="order-item-qty">Quantity: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-tracking-section">
                <h4 className="tracking-title">Order Tracking</h4>
                <div className="tracking-timeline">
                  {getTrackingSteps(order.status).map((step, index) => (
                    <div key={step.key} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                      <div className="step-icon-wrapper">
                        <div className="step-icon">{step.icon}</div>
                        {index < 4 && <div className="step-line"></div>}
                      </div>
                      <div className="step-label">{step.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-footer">
                <div className="order-info">
                  <div className="info-item">
                    <span className="info-label">Shipping Address:</span>
                    <span className="info-value">{order.shippingAddress}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">{order.paymentMethod}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tracking Number:</span>
                    <span className="info-value tracking">{order.trackingNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Estimated Delivery:</span>
                    <span className="info-value">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="order-total-section">
                  <span className="order-total-label">Total:</span>
                  <span className="order-total-amount">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
