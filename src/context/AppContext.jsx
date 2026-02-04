import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUserId = localStorage.getItem('userId');
    if (savedAuth === 'true' && savedUserId) {
      // Restore user session
      fetchUserData(parseInt(savedUserId));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch user data and orders
  const fetchUserData = async (userId) => {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      const userData = await userResponse.json();
      if (userData.success) {
        setUser(userData.data);
        setIsAuthenticated(true);
        
        // Fetch user orders
        const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/${userId}`);
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          setOrders(ordersData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.data);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', data.data.id.toString());
        
        // Fetch user orders
        const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/${data.data.id}`);
        const ordersData = await ordersResponse.json();
        if (ordersData.success) {
          setOrders(ordersData.data);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCart([]);
    setOrders([]);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const placeOrder = async (orderDetails) => {
    try {
      const orderData = {
        userId: user.id,
        total: getCartTotal(),
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: orderDetails.address,
        paymentMethod: orderDetails.paymentMethod,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(prevOrders => [data.data, ...prevOrders]);
        clearCart();
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error placing order:', error);
      return null;
    }
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(prev => !prev);
  };

  const value = {
    isAuthenticated,
    user,
    cart,
    orders,
    products,
    loading,
    isChatbotOpen,
    login,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    placeOrder,
    toggleChatbot
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
