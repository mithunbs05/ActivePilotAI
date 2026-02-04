import json
from database import get_db

# New products to add
new_products = [
    {
        "name": "Sony WH-1000XM5 Headphones",
        "price": 29999,
        "original_price": 34999,
        "discount": 14,
        "category": "Audio",
        "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=800&h=800&fit=crop&q=80",
        "description": "Industry-leading noise canceling headphones with premium sound quality, 30-hour battery life, and ultra-comfortable design.",
        "rating": 4.8,
        "reviews": 512,
        "stock": 25,
        "delivery_date": "2026-02-06",
        "badge": "Bestseller",
        "features": [
            "Industry-Leading Noise Cancellation",
            "30 Hours Battery Life with Quick Charging",
            "Premium Sound Quality with LDAC",
            "Multipoint Connection - Connect 2 Devices",
            "Speak-to-Chat Technology",
            "Ultra-Comfortable Lightweight Design"
        ]
    },
    {
        "name": "Apple iPad Pro 12.9-inch M2",
        "price": 109999,
        "original_price": 129999,
        "discount": 15,
        "category": "Tablets",
        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop&q=80",
        "description": "Powerful tablet with M2 chip, Liquid Retina XDR display, and support for Apple Pencil. Perfect for creative professionals.",
        "rating": 4.9,
        "reviews": 678,
        "stock": 18,
        "delivery_date": "2026-02-05",
        "badge": "New",
        "features": [
            "Apple M2 Chip with 8-Core CPU",
            "12.9-inch Liquid Retina XDR Display",
            "128GB Storage",
            "12MP Wide + 10MP Ultra Wide Camera",
            "Support for Apple Pencil (2nd gen)",
            "Face ID & USB-C Thunderbolt Port",
            "Up to 10 Hours Battery Life"
        ]
    },
    {
        "name": "Samsung Galaxy Watch 6 Classic",
        "price": 34999,
        "original_price": 39999,
        "discount": 13,
        "category": "Wearables",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop&q=80",
        "description": "Premium smartwatch with rotating bezel, advanced health tracking, and stunning AMOLED display. 43mm stainless steel case.",
        "rating": 4.7,
        "reviews": 234,
        "stock": 30,
        "delivery_date": "2026-02-04",
        "badge": "Trending",
        "features": [
            "1.5-inch Super AMOLED Display (480x480)",
            "Rotating Bezel for Easy Navigation",
            "Advanced Sleep Tracking & Body Composition",
            "Heart Rate, ECG & Blood Pressure Monitoring",
            "5ATM + IP68 Water Resistance",
            "Up to 40 Hours Battery Life",
            "Wireless Charging Support"
        ]
    }
]

with get_db() as (conn, cursor, is_pg):
    for p in new_products:
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
        print(f"✅ Added: {p['name']}")

print(f"\n✅ Successfully added {len(new_products)} new products to the database!")
