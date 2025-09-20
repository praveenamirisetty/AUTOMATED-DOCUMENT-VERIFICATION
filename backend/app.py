from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_bytes
from pymongo import MongoClient
from datetime import datetime
import io
import uuid

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb+srv://praveenkumar:8LdsJNtludfEE8iP@cluster0.sm7otw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["pdf_ml_db"]
documents_col = db["documents"]
users_col = db["users"]
watchlist_col = db["watchlist"]

@app.route("/api/upload_pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Generate unique user ID for this PDF upload
    user_id = str(uuid.uuid4())
    document_ids = []

    # Read PDF in memory
    reader = PdfReader(file)

    for i, page in enumerate(reader.pages):
        # 1. Split single-page PDF in memory
        pdf_writer = PdfWriter()
        pdf_writer.add_page(page)
        single_pdf_bytes = io.BytesIO()
        pdf_writer.write(single_pdf_bytes)
        single_pdf_bytes.seek(0)

        # 2. Convert PDF page to image
        images = convert_from_bytes(single_pdf_bytes.read(), dpi=200)
        img_bytes = io.BytesIO()
        images[0].save(img_bytes, format="PNG")
        img_bytes.seek(0)

        # 3. Send image to ML model, get JSON result
        ml_json = extract_data(img_bytes)

        # 4. Store document in MongoDB
        doc = {
            "user_id": user_id,
            "ml_result": ml_json,
            "uploaded_at": datetime.utcnow()
        }
        doc_id = documents_col.insert_one(doc).inserted_id
        document_ids.append(doc_id)

    # 5. Store user record with references to all documents
    user_doc = {
        "user_id": user_id,
        "document_ids": document_ids,
        "created_at": datetime.utcnow()
    }
    users_col.insert_one(user_doc)

    return jsonify({
        "message": f"PDF processed and stored for user {user_id}",
        "user_id": user_id,
        "document_ids": [str(d) for d in document_ids]
    })

@app.route("/api/upload_json", methods=["POST"])
def upload_json():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON payload received"}), 400

    # Optional: add metadata
    data["uploaded_at"] = datetime.utcnow()

    # Insert directly into MongoDB
    inserted_id = documents_col.insert_one(data).inserted_id

    return jsonify({"message": "Document stored successfully", "document_id": str(inserted_id)})

# Helper function to convert ObjectId to string for JSON serialization
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    if "document_ids" in doc:
        doc["document_ids"] = [str(d) for d in doc["document_ids"]]
    return doc

@app.route("/api/documents", methods=["GET"])
def get_users_with_documents():
    users = users_col.find()
    result = []

    for user in users:
        user = serialize_doc(user)
        documents = documents_col.find({"user_id": user["user_id"]})
        documents_list = [serialize_doc(doc) for doc in documents]
        user["documents"] = documents_list
        result.append(user)
    return jsonify({"users": result})

@app.route("/api/watchlist", methods=["GET"])
def get_watchlist():
    users = list(watchlist_col.find({}, {"_id": 0}))
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
