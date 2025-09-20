from pymongo import MongoClient
from datetime import datetime
import uuid
import random

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["pdf_ml_db"]
documents_col = db["documents"]
users_col = db["users"]

def mock_ml_model(page_number):
    """
    Simulates ML model JSON output for a page.
    """
    names = ["Praveen Kumar", "John Doe", "Alice Smith"]
    genders = ["Male", "Female", "Other"]
    return {
        "name": random.choice(names),
        "dob": f"{random.randint(1,28):02d}-{random.randint(1,12):02d}-200{random.randint(0,5)}",
        "gender": random.choice(genders),
        "aadharid": f"{random.randint(100000000000, 999999999999)}"
    }

def mock_pdf_processing(num_pages=3):
    """
    Simulates splitting PDF pages, ML model output, and storing in MongoDB.
    """
    # 1. Generate unique user ID
    user_id = str(uuid.uuid4())
    document_ids = []

    # 2. Simulate multiple pages
    for i in range(1, num_pages + 1):
        # Simulate ML model result
        ml_json = mock_ml_model(i)

        # Store document in MongoDB
        doc = {
            "user_id": user_id,
            "ml_result": ml_json,
            "page_number": i,
            "uploaded_at": datetime.utcnow()
        }
        doc_id = documents_col.insert_one(doc).inserted_id
        document_ids.append(doc_id)

    # 3. Store user record with references to all documents
    user_doc = {
        "user_id": user_id,
        "pdf_file": f"mock_pdf_{user_id}.pdf",
        "document_ids": document_ids,
        "created_at": datetime.utcnow()
    }
    users_col.insert_one(user_doc)

    print(f"Mock user created: {user_id}")
    print(f"Document IDs: {[str(d) for d in document_ids]}")

# Example usage
if __name__ == "__main__":
    mock_pdf_processing(num_pages=5)
