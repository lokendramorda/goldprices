import React, { useState } from "react";
import axios from "axios";
import DeleteItem from "./DeleteItem";
import PriceUpdate from "./PriceUpdate";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemId || !category || !description || !price || !photo) {
      setMessage("All fields are required.");
      return;
    }

    const data = { itemId, category, description, price, photo };

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${baseURL}/upload`, data);
      setMessage(response.data.message);
      setItemId("");
      setCategory("");
      setDescription("");
      setPrice("");
      setPhoto(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error uploading item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="justify-center flex">
      <DeleteItem />
      </div>
        
    <div className="flex flex-row justify-between gap-8 w-full px-4 mx-auto space-y-12">
      <div className="w-1/2  bg-white p-8 mt-12 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 mb-4 text-yellow-700">Upload Item</h2>
        {message && (
          <p className={`text-center text-sm mb-2 ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full"
          />
          <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-1/2 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>
          </div>
          
        </form>
      
      </div>
        <PriceUpdate />
    </div>
    </>
  );
};

export default ItemUpload;
