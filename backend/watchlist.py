from pymongo import MongoClient
from datetime import datetime

# MongoDB setup
client = MongoClient("mongodb+srv://praveenkumar:8LdsJNtludfEE8iP@cluster0.aijthkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["pdf_ml_db"]
watchlist_col = db["watchlist"]

# Sample data (10 users with name + country)
default_users = [
    {"name": "Alice", "country": "US"},
    {"name": "Bob", "country": "CA"},
    {"name": "Charlie", "country": "GB"},
    {"name": "David", "country": "AU"},
    {"name": "Eva", "country": "DE"},
    {"name": "Frank", "country": "FR"},
    {"name": "Grace", "country": "IT"},
    {"name": "Hannah", "country": "IN"},
    {"name": "Ivan", "country": "RU"},
    {"name": "Jack", "country": "JP"}
]

# Add timestamp
for user in default_users:
    user["created_at"] = datetime.utcnow()

# Insert only if collection is empty
if watchlist_col.count_documents({}) == 0:
    watchlist_col.insert_many(default_users)
    print("✅ 10 users inserted into watchlist collection")
else:
    print("ℹ️ Watchlist already has data, skipping insert")
