import React, { useEffect, useState } from "react";
import { fetchDocuments } from "./api";

function Dashboard({ onBack }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments()
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-600">Loading documents...</p>;

  const filteredDocs = documents.filter((doc) => {
    const statusMatch = statusFilter === "All" || doc.status === statusFilter;
    const riskMatch = riskFilter === "All" || doc.riskScore === riskFilter;
    const searchMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && riskMatch && searchMatch;
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition"
        onClick={onBack}
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Uploaded Documents
      </h2>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-end justify-between mb-6">
        <div className="flex gap-6 flex-wrap">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option>All</option>
              <option>Verified</option>
              <option>Flagged</option>
              <option>Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Filter by Risk:
            </label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Search by Name:
          </label>
          <input
            type="text"
            placeholder="Enter name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Table */}
      {filteredDocs.length === 0 ? (
        <p className="text-gray-500 text-center">No documents found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Country</th>
                <th className="px-4 py-2 border">Gender</th>
                <th className="px-4 py-2 border">Date of Birth</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-2 border">{doc.name}</td>
                  <td className="px-4 py-2 border">{doc.country}</td>
                  <td className="px-4 py-2 border">{doc.gender}</td>
                  <td className="px-4 py-2 border">{doc.dob}</td>
                  <td className="px-4 py-2 border">{doc.status}</td>
                  <td className="px-4 py-2 border">{doc.riskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;