// Mock Products Data
export const products = [
  {
    id: 1,
    name: "DJI Mini 3 Pro Drone",
    price: 63099,
    originalPrice: 74999,
    discount: 16,
    category: "Drones",
    image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=800&fit=crop&q=80",
    description: "Compact and lightweight drone with 4K HDR video, 34-min flight time, and obstacle sensing. Perfect for aerial photography and content creators.",
    rating: 4.9,
    reviews: 342,
    stock: 12,
    deliveryDate: "2026-02-05",
    badge: "Trending",
    features: [
      "4K HDR Video Recording at 60fps",
      "34 Minutes Maximum Flight Time",
      "Tri-directional Obstacle Sensing",
      "Ultra-Lightweight 249g | No License Required",
      "10km HD Video Transmission Range",
      "ActiveTrack 4.0 with Subject Tracking"
    ]
  },
  {
    id: 2,
    name: "DJI Air 2S Camera Drone",
    price: 82999,
    originalPrice: 99999,
    discount: 17,
    category: "Drones",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=800&fit=crop&q=80",
    description: "Professional drone with 1-inch sensor, 5.4K video, MasterShots, and 31-min flight time. Advanced features for serious photographers.",
    rating: 4.8,
    reviews: 289,
    stock: 8,
    deliveryDate: "2026-02-06",
    badge: "Bestseller",
    features: [
      "5.4K Video at 30fps | 4K at 60fps",
      "1-inch CMOS Sensor with 20MP Photos",
      "31 Minutes Flight Time per Charge",
      "MasterShots & Panorama Modes",
      "4-way Obstacle Avoidance System",
      "12km O3 Video Transmission"
    ]
  },
  {
    id: 3,
    name: "DJI FPV Racing Drone",
    price: 107899,
    originalPrice: 124999,
    discount: 14,
    category: "Drones",
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=800&fit=crop&q=80",
    description: "High-speed FPV drone with immersive goggles, 4K/60fps recording, and speeds up to 87 mph. Built for racing and extreme flying.",
    rating: 4.7,
    reviews: 198,
    stock: 6,
    deliveryDate: "2026-02-07",
    badge: "New",
    features: [
      "4K/60fps Ultra-Wide Video Recording",
      "Maximum Speed 140 kmph (87 mph)",
      "Immersive FPV Goggles V2 Included",
      "20 Minutes High-Speed Flight Time",
      "Emergency Brake & Hover Function",
      "3 Flight Modes: N/S/M for All Skill Levels"
    ]
  },
  {
    id: 4,
    name: "MacBook Pro 14-inch M3",
    price: 165999,
    originalPrice: 189999,
    discount: 13,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&q=80",
    description: "Powerful laptop with Apple M3 chip, 16GB RAM, 512GB SSD, and stunning Liquid Retina XDR display. Perfect for professionals and creators.",
    rating: 4.9,
    reviews: 567,
    stock: 15,
    deliveryDate: "2026-02-04",
    badge: "Bestseller",
    features: [
      "Apple M3 Chip with 8-Core CPU",
      "16GB Unified Memory (RAM)",
      "512GB SSD Storage",
      "14-inch Liquid Retina XDR Display (3024x1964)",
      "Up to 18 Hours Battery Backup",
      "Backlit Magic Keyboard & Touch ID",
      "3x Thunderbolt 4 Ports | HDMI Port",
      "macOS Sonoma Pre-installed"
    ]
  },
  {
    id: 5,
    name: "Dell XPS 15 Gaming Laptop",
    price: 149399,
    originalPrice: 174999,
    discount: 15,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop&q=80",
    description: "High-performance gaming laptop with Intel i9, 32GB RAM, RTX 4060, and 1TB SSD. 15.6-inch 4K OLED display for immersive gaming.",
    rating: 4.8,
    reviews: 423,
    stock: 10,
    deliveryDate: "2026-02-05",
    badge: "Trending",
    features: [
      "Intel Core i9-13900H Processor (13th Gen)",
      "32GB DDR5 RAM | Upgradable to 64GB",
      "NVIDIA GeForce RTX 4060 8GB Graphics",
      "1TB NVMe SSD Storage",
      "15.6-inch 4K OLED Display (3840x2160)",
      "Windows 11 Home Pre-installed",
      "RGB Backlit Keyboard with Numeric Keypad",
      "Dual Cooling Fans | Up to 6 Hours Battery"
    ]
  },
  {
    id: 6,
    name: "HP Pavilion Business Laptop",
    price: 74699,
    originalPrice: 84999,
    discount: 12,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=80",
    description: "Reliable business laptop with Intel i7, 16GB RAM, 512GB SSD, and 14-inch FHD display. Long battery life for productivity on the go.",
    rating: 4.6,
    reviews: 389,
    stock: 20,
    deliveryDate: "2026-02-04",
    badge: null,
    features: [
      "Intel Core i7-1255U Processor (12th Gen)",
      "16GB DDR4 RAM | 3200MHz",
      "512GB PCIe NVMe SSD Storage",
      "14-inch FHD Display (1920x1080) Anti-Glare",
      "Intel Iris Xe Graphics",
      "Windows 11 Pro Pre-installed",
      "Backlit Keyboard | Fingerprint Reader",
      "Up to 10 Hours Battery Life | Fast Charging"
    ]
  }
];

// Mock User Data
export const mockUser = {
  id: 1,
  email: "user@example.com",
  password: "password123",
  name: "John Doe",
  address: "123 Main Street, New York, NY 10001"
};

// Mock Orders Data
export const mockOrders = [
  {
    id: "ORD-2026-001",
    date: "2026-01-28",
    status: "Delivered",
    total: 165999,
    items: [
      {
        productId: 4,
        name: "MacBook Pro 14-inch M3",
        quantity: 1,
        price: 165999,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&q=80"
      }
    ],
    shippingAddress: "123 Main Street, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2026-01-30"
  },
  {
    id: "ORD-2026-002",
    date: "2026-01-30",
    status: "Shipped",
    total: 63099,
    items: [
      {
        productId: 1,
        name: "DJI Mini 3 Pro Drone",
        quantity: 1,
        price: 63099,
        image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=800&fit=crop&q=80"
      }
    ],
    shippingAddress: "123 Main Street, New York, NY 10001",
    paymentMethod: "Credit Card ending in 4242",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2026-02-05"
  },
  {
    id: "ORD-2026-003",
    date: "2026-01-31",
    status: "Processing",
    total: 74699,
    items: [
      {
        productId: 6,
        name: "HP Pavilion Business Laptop",
        quantity: 1,
        price: 74699,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=80"
      }
    ],
    shippingAddress: "123 Main Street, New York, NY 10001",
    paymentMethod: "PayPal",
    trackingNumber: "Pending",
    estimatedDelivery: "2026-02-07"
  }
];
