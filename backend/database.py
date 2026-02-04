import os
import json
from contextlib import contextmanager
from datetime import datetime

# Use DATABASE_URL environment variable to select PostgreSQL; otherwise fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL")
USE_POSTGRES = bool(DATABASE_URL and DATABASE_URL.startswith("postgres"))

if USE_POSTGRES:
    import psycopg2
    import psycopg2.extras
else:
    import sqlite3


@contextmanager
def get_db():
    """Yield (conn, cursor, is_postgres).

    For Postgres: conn, RealDictCursor, True
    For SQLite: conn, cursor, False
    """
    if USE_POSTGRES:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            yield conn, cursor, True
            conn.commit()
        finally:
            cursor.close()
            conn.close()
    else:
        db_path = os.path.join(os.path.dirname(__file__), "technova.db")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        try:
            yield conn, cursor, False
            conn.commit()
        finally:
            cursor.close()
            conn.close()


def init_database():
    """Create schema and seed data if empty."""
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    original_price INTEGER NOT NULL,
                    discount INTEGER NOT NULL,
                    category TEXT NOT NULL,
                    image TEXT NOT NULL,
                    description TEXT NOT NULL,
                    rating REAL NOT NULL,
                    reviews INTEGER NOT NULL,
                    stock INTEGER NOT NULL,
                    delivery_date DATE NOT NULL,
                    badge TEXT,
                    features JSONB NOT NULL
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    name TEXT NOT NULL,
                    address TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id),
                    date DATE NOT NULL,
                    status TEXT NOT NULL,
                    total INTEGER NOT NULL,
                    items JSONB NOT NULL,
                    shipping_address TEXT NOT NULL,
                    payment_method TEXT NOT NULL,
                    tracking_number TEXT,
                    estimated_delivery DATE
                )
            ''')
        else:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    original_price INTEGER NOT NULL,
                    discount INTEGER NOT NULL,
                    category TEXT NOT NULL,
                    image TEXT NOT NULL,
                    description TEXT NOT NULL,
                    rating REAL NOT NULL,
                    reviews INTEGER NOT NULL,
                    stock INTEGER NOT NULL,
                    delivery_date TEXT NOT NULL,
                    badge TEXT,
                    features TEXT NOT NULL
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    name TEXT NOT NULL,
                    address TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    date TEXT NOT NULL,
                    status TEXT NOT NULL,
                    total INTEGER NOT NULL,
                    items TEXT NOT NULL,
                    shipping_address TEXT NOT NULL,
                    payment_method TEXT NOT NULL,
                    tracking_number TEXT,
                    estimated_delivery TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            ''')

    # Seed if empty
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("SELECT COUNT(*) AS cnt FROM products")
            cnt = cursor.fetchone()["cnt"]
        else:
            cursor.execute("SELECT COUNT(*) FROM products")
            cnt = cursor.fetchone()[0]

        if cnt == 0:
            seed_data()


def seed_data():
    """Insert initial products, a user, and some orders."""
    products = [
        {
            "name": "DJI Mini 3 Pro Drone",
            "price": 63099,
            "original_price": 74999,
            "discount": 16,
            "category": "Drones",
            "image": "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=800&fit=crop&q=80",
            "description": "Compact and lightweight drone with 4K HDR video, 34-min flight time, and obstacle sensing. Perfect for aerial photography and content creators.",
            "rating": 4.9,
            "reviews": 342,
            "stock": 12,
            "delivery_date": "2026-02-05",
            "badge": "Trending",
            "features": [
                "4K HDR Video Recording at 60fps",
                "34 Minutes Maximum Flight Time",
                "Tri-directional Obstacle Sensing",
                "Ultra-Lightweight 249g | No License Required",
                "10km HD Video Transmission Range",
                "ActiveTrack 4.0 with Subject Tracking"
            ]
        },
        {
            "name": "DJI Air 2S Camera Drone",
            "price": 82999,
            "original_price": 99999,
            "discount": 17,
            "category": "Drones",
            "image": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=800&fit=crop&q=80",
            "description": "Professional drone with 1-inch sensor, 5.4K video, MasterShots, and 31-min flight time. Advanced features for serious photographers.",
            "rating": 4.8,
            "reviews": 289,
            "stock": 8,
            "delivery_date": "2026-02-06",
            "badge": "Bestseller",
            "features": [
                "5.4K Video at 30fps | 4K at 60fps",
                "1-inch CMOS Sensor with 20MP Photos",
                "31 Minutes Flight Time per Charge",
                "MasterShots & Panorama Modes",
                "4-way Obstacle Avoidance System",
                "12km O3 Video Transmission"
            ]
        },
        {
            "name": "DJI FPV Racing Drone",
            "price": 107899,
            "original_price": 124999,
            "discount": 14,
            "category": "Drones",
            "image": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=800&fit=crop&q=80",
            "description": "High-speed FPV drone with immersive goggles, 4K/60fps recording, and speeds up to 87 mph. Built for racing and extreme flying.",
            "rating": 4.7,
            "reviews": 198,
            "stock": 6,
            "delivery_date": "2026-02-07",
            "badge": "New",
            "features": [
                "4K/60fps Ultra-Wide Video Recording",
                "Maximum Speed 140 kmph (87 mph)",
                "Immersive FPV Goggles V2 Included",
                "20 Minutes High-Speed Flight Time",
                "Emergency Brake & Hover Function",
                "3 Flight Modes: N/S/M for All Skill Levels"
            ]
        },
        {
            "name": "MacBook Pro 14-inch M3",
            "price": 165999,
            "original_price": 189999,
            "discount": 13,
            "category": "Laptops",
            "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&q=80",
            "description": "Powerful laptop with Apple M3 chip, 16GB RAM, 512GB SSD, and stunning Liquid Retina XDR display. Perfect for professionals and creators.",
            "rating": 4.9,
            "reviews": 567,
            "stock": 15,
            "delivery_date": "2026-02-04",
            "badge": "Bestseller",
            "features": [
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
            "name": "Dell XPS 15 Gaming Laptop",
            "price": 149399,
            "original_price": 174999,
            "discount": 15,
            "category": "Laptops",
            "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop&q=80",
            "description": "High-performance gaming laptop with Intel i9, 32GB RAM, RTX 4060, and 1TB SSD. 15.6-inch 4K OLED display for immersive gaming.",
            "rating": 4.8,
            "reviews": 423,
            "stock": 10,
            "delivery_date": "2026-02-05",
            "badge": "Trending",
            "features": [
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
            "name": "HP Pavilion Business Laptop",
            "price": 74699,
            "original_price": 84999,
            "discount": 12,
            "category": "Laptops",
            "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=80",
            "description": "Reliable business laptop with Intel i7, 16GB RAM, 512GB SSD, and 14-inch FHD display. Long battery life for productivity on the go.",
            "rating": 4.6,
            "reviews": 389,
            "stock": 20,
            "delivery_date": "2026-02-04",
            "badge": None,
            "features": [
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
    ]

    with get_db() as (conn, cursor, is_pg):
        for p in products:
            if is_pg:
                cursor.execute(
                    """
                    INSERT INTO products (name, price, original_price, discount, category, image, description, rating, reviews, stock, delivery_date, badge, features)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (p['name'], p['price'], p['original_price'], p['discount'], p['category'], p['image'], p['description'], p['rating'], p['reviews'], p['stock'], p['delivery_date'], p['badge'], json.dumps(p['features']))
                )
            else:
                cursor.execute('''
                    INSERT INTO products (name, price, original_price, discount, category, image, description, rating, reviews, stock, delivery_date, badge, features)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (p['name'], p['price'], p['original_price'], p['discount'], p['category'], p['image'], p['description'], p['rating'], p['reviews'], p['stock'], p['delivery_date'], p['badge'], json.dumps(p['features'])))

        # Insert default user
        if is_pg:
            cursor.execute("""
                INSERT INTO users (email, password, name, address)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            """, ("user@example.com", "password123", "John Doe", "123 Main Street, New York, NY 10001"))
            user_id = cursor.fetchone()["id"]
        else:
            cursor.execute('''
                INSERT INTO users (email, password, name, address)
                VALUES (?, ?, ?, ?)
            ''', ("user@example.com", "password123", "John Doe", "123 Main Street, New York, NY 10001"))
            user_id = cursor.lastrowid

        orders = [
            {
                "id": "ORD-2026-001",
                "user_id": user_id,
                "date": "2026-01-28",
                "status": "Delivered",
                "total": 165999,
                "items": [
                    {"productId": 4, "name": "MacBook Pro 14-inch M3", "quantity": 1, "price": 165999, "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&q=80"}
                ],
                "shipping_address": "123 Main Street, New York, NY 10001",
                "payment_method": "Credit Card ending in 4242",
                "tracking_number": "TRK123456789",
                "estimated_delivery": "2026-01-30"
            },
            {
                "id": "ORD-2026-002",
                "user_id": user_id,
                "date": "2026-01-30",
                "status": "Shipped",
                "total": 63099,
                "items": [
                    {"productId": 1, "name": "DJI Mini 3 Pro Drone", "quantity": 1, "price": 63099, "image": "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800&h=800&fit=crop&q=80"}
                ],
                "shipping_address": "123 Main Street, New York, NY 10001",
                "payment_method": "Credit Card ending in 4242",
                "tracking_number": "TRK987654321",
                "estimated_delivery": "2026-02-05"
            },
            {
                "id": "ORD-2026-003",
                "user_id": user_id,
                "date": "2026-01-31",
                "status": "Processing",
                "total": 74699,
                "items": [
                    {"productId": 6, "name": "HP Pavilion Business Laptop", "quantity": 1, "price": 74699, "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&q=80"}
                ],
                "shipping_address": "123 Main Street, New York, NY 10001",
                "payment_method": "PayPal",
                "tracking_number": "Pending",
                "estimated_delivery": "2026-02-07"
            }
        ]

        for o in orders:
            if is_pg:
                cursor.execute(
                    """
                    INSERT INTO orders (id, user_id, date, status, total, items, shipping_address, payment_method, tracking_number, estimated_delivery)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (o['id'], o['user_id'], o['date'], o['status'], o['total'], json.dumps(o['items']), o['shipping_address'], o['payment_method'], o['tracking_number'], o['estimated_delivery'])
                )
            else:
                cursor.execute('''
                    INSERT INTO orders (id, user_id, date, status, total, items, shipping_address, payment_method, tracking_number, estimated_delivery)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (o['id'], o['user_id'], o['date'], o['status'], o['total'], json.dumps(o['items']), o['shipping_address'], o['payment_method'], o['tracking_number'], o['estimated_delivery']))

    print("Database seeded successfully!")


# ============ Database Query Functions ============

def get_all_products():
    with get_db() as (conn, cursor, is_pg):
        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        products = []
        for row in rows:
            if is_pg:
                product = dict(row)
                product['originalPrice'] = product.pop('original_price')
                product['deliveryDate'] = product.pop('delivery_date').isoformat() if product.get('delivery_date') else None
                if isinstance(product.get('features'), str):
                    product['features'] = json.loads(product['features'])
            else:
                product = dict(row)
                product['originalPrice'] = product.pop('original_price')
                product['deliveryDate'] = product.pop('delivery_date')
                product['features'] = json.loads(product['features'])
            products.append(product)
        return products


def get_product_by_id(product_id: int):
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            row = cursor.fetchone()
            if not row:
                return None
            product = dict(row)
            product['originalPrice'] = product.pop('original_price')
            product['deliveryDate'] = product.pop('delivery_date').isoformat() if product.get('delivery_date') else None
            if isinstance(product.get('features'), str):
                product['features'] = json.loads(product['features'])
            return product
        else:
            cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
            row = cursor.fetchone()
            if not row:
                return None
            product = dict(row)
            product['originalPrice'] = product.pop('original_price')
            product['deliveryDate'] = product.pop('delivery_date')
            product['features'] = json.loads(product['features'])
            return product


def get_user_by_email(email: str):
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            row = cursor.fetchone()
            return dict(row) if row else None
        else:
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            row = cursor.fetchone()
            return dict(row) if row else None


def get_user_by_id(user_id: int):
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
        else:
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None


def get_orders_by_user_id(user_id: int):
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("SELECT * FROM orders WHERE user_id = %s ORDER BY date DESC", (user_id,))
            rows = cursor.fetchall()
            orders = []
            for r in rows:
                o = dict(r)
                if isinstance(o.get('items'), str):
                    o['items'] = json.loads(o['items'])
                o['shippingAddress'] = o.pop('shipping_address')
                o['paymentMethod'] = o.pop('payment_method')
                o['trackingNumber'] = o.pop('tracking_number')
                o['estimatedDelivery'] = o.pop('estimated_delivery')
                o.pop('user_id', None)
                orders.append(o)
            return orders
        else:
            cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC", (user_id,))
            rows = cursor.fetchall()
            orders = []
            for row in rows:
                order = dict(row)
                order['items'] = json.loads(order['items'])
                order['shippingAddress'] = order.pop('shipping_address')
                order['paymentMethod'] = order.pop('payment_method')
                order['trackingNumber'] = order.pop('tracking_number')
                order['estimatedDelivery'] = order.pop('estimated_delivery')
                order.pop('user_id', None)
                orders.append(order)
            return orders


def create_order(user_id: int, order_data: dict):
    with get_db() as (conn, cursor, is_pg):
        # generate order id using count
        if is_pg:
            cursor.execute("SELECT COUNT(*) AS cnt FROM orders")
            cnt = cursor.fetchone()['cnt']
        else:
            cursor.execute("SELECT COUNT(*) FROM orders")
            cnt = cursor.fetchone()[0]
        order_id = f"ORD-2026-{str(cnt + 1).zfill(3)}"

        if is_pg:
            cursor.execute(
                """
                INSERT INTO orders (id, user_id, date, status, total, items, shipping_address, payment_method, tracking_number, estimated_delivery)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (order_id, user_id, datetime.now().date(), 'Processing', order_data['total'], json.dumps(order_data['items']), order_data['shippingAddress'], order_data['paymentMethod'], 'Pending', order_data.get('estimatedDelivery'))
            )
        else:
            cursor.execute('''
                INSERT INTO orders (id, user_id, date, status, total, items, shipping_address, payment_method, tracking_number, estimated_delivery)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (order_id, user_id, datetime.now().strftime('%Y-%m-%d'), 'Processing', order_data['total'], json.dumps(order_data['items']), order_data['shippingAddress'], order_data['paymentMethod'], 'Pending', order_data.get('estimatedDelivery')))

        return {
            'id': order_id,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'status': 'Processing',
            'total': order_data['total'],
            'items': order_data['items'],
            'shippingAddress': order_data['shippingAddress'],
            'paymentMethod': order_data['paymentMethod'],
            'trackingNumber': 'Pending',
            'estimatedDelivery': order_data.get('estimatedDelivery')
        }


def update_product_stock(product_id: int, quantity: int):
    with get_db() as (conn, cursor, is_pg):
        if is_pg:
            cursor.execute("UPDATE products SET stock = stock - %s WHERE id = %s AND stock >= %s", (quantity, product_id, quantity))
            return cursor.rowcount > 0
        else:
            cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?", (quantity, product_id, quantity))
            return cursor.rowcount > 0


if __name__ == '__main__':
    init_database()
    print('Database initialized successfully!')
