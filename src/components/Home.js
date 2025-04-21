import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [searchId, setSearchId] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError("Please enter a valid ID.");
      return;
    }

    setLoading(true);
    setError("");
    setItem(null);

    try {
      const response = await axios.get(`http://localhost:5000/item/${searchId}`);
      setItem(response.data);  // Set the retrieved item data
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Show server error message
      } else {
        setError("Error uploading item. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Search Item by ID</h2>

      <div className="flex mb-4">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter item ID"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Searching...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {item && (
        <div className="mt-6">
          <div className="mb-4">
            <img src={item.photo} alt={item.itemId} className="w-full h-64 object-cover rounded-md shadow-md" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Item ID: {item.itemId}</p>
            <p className="text-sm text-gray-600">Category: {item.category}</p>
            <p className="text-sm text-gray-600">Description: {item.description}</p>
            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
