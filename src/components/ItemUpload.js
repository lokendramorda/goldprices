import React, { useState } from "react";
import axios from "axios";

const ItemUpload = () => {
  const [itemId, setItemId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);  // Set base64 string as photo state
      };
      reader.readAsDataURL(file);  // Convert file to base64 string
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemId || !category || !description || !price || !photo) {
      setMessage("All fields are required.");
      return;
    }

    const data = {
      itemId,
      category,
      description,
      price,
      photo,
    };

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/upload", data);
      setMessage(response.data.message);
      setItemId("");
      setCategory("");
      setDescription("");
      setPrice("");
      setPhoto(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message); // Correct message from backend
      } else {
        setMessage("Error uploading item. Please try again.");
      }
     } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Upload New Item</h2>

      {message && (
        <p className="text-center text-sm text-red-500">{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="itemId">
            Item ID
          </label>
          <input
            type="text"
            id="itemId"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="price">
            Price (INR)
          </label>
          <input
            type="number"
            id="price"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="photo">
            Upload Photo
          </label>
          <input
            type="file"
            id="photo"
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={handlePhotoChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Item"}
        </button>
      </form>
    </div>
  );
};

export default ItemUpload;
