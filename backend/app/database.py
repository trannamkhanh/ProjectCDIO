"""
Database module - Currently using in-memory storage
TODO: Replace with actual database (SQLite, PostgreSQL, etc.)
"""
from app.utils.security import get_password_hash

# In-memory user database
users_db = []

def init_database():
    """Initialize database with default users"""
    global users_db
    
    if len(users_db) == 0:
        users_db = [
            {
                "id": 1,
                "email": "buyer@test.com",
                "password": get_password_hash("123456"),
                "role": "buyer",
                "name": "John Buyer",
                "phone": "+1234567890",
                "address": "123 Main St, City",
                "active": True,
            },
            {
                "id": 2,
                "email": "seller@test.com",
                "password": get_password_hash("123456"),
                "role": "seller",
                "name": "Jane Seller",
                "storeName": "Fresh Market Corner",
                "phone": "+1234567891",
                "address": "456 Market Ave, City",
                "verified": True,
                "active": True,
            },
            {
                "id": 3,
                "email": "admin@admin.com",
                "password": get_password_hash("admin"),
                "role": "admin",
                "name": "Admin User",
                "phone": "+1234567892",
                "active": True,
            },
        ]
    
    print(f"✅ Database initialized with {len(users_db)} users")
