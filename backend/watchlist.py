from pymongo import MongoClient
from datetime import datetime

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["pdf_ml_db"]
watchlist_col = db["watchlist"]

# Sample data (10 users with name + country)
default_users = [
    {"name": "Alice", "country": "USA"},
    {"name": "Bob", "country": "Canada"},
    {"name": "Charlie", "country": "UK"},
    {"name": "David", "country": "Australia"},
    {"name": "Eva", "country": "Germany"},
    {"name": "Frank", "country": "France"},
    {"name": "Grace", "country": "Italy"},
    {"name": "Hannah", "country": "India"},
    {"name": "Ivan", "country": "Russia"},
    {"name": "Jack", "country": "Japan"}
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
