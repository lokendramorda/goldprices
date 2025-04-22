import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash } from "react-icons/fi";
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const ItemUpload = () => {
  const [itemId, setItemId] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [priceMessage, setPriceMessage] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  // Price Section
  const [prices, setPrices] = useState({
    goldRtgs: "",
    goldCash: "",
    silverBank: "",
    silverCash: "",
    marginGold: "",
    marginSilver: "",
  });

  const [derived, setDerived] = useState({
    goldTola: 0,
    gold22Carat: 0,
    silverTola: 0,
  });

  useEffect(() => {
    const rtgs = parseFloat(prices.goldRtgs) || 0;
    const silverCash = parseFloat(prices.silverCash) || 0;

    setDerived({
      goldTola: (rtgs * 11.664) / 10,
      gold22Carat: (rtgs * 93.5) / 100,
      silverTola: (silverCash * 11.664) / 1000,
    });
  }, [prices]);

  const handlePriceChange = (e) => {
    setPrices({ ...prices, [e.target.name]: e.target.value });
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    const fullData = { ...prices, ...derived };

    try {
      const response = await axios.post(`${baseURL}/submit-prices`, fullData);
      setPriceMessage(response.data.message || "Prices submitted successfully! ✅");
    } catch (error) {
      setPriceMessage("❌ " + (error.response?.data?.message || "Error submitting prices. Please try again."));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center items-start p-6">
      {/* Item Upload */}
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700">Upload New Item</h2>
        {message && ( <p className={`text-center text-sm ${message.toLowerCase().includes("success") ? "text-green-600": "text-red-500"}`}>{message}</p>)}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Item ID</label>
            <input
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Price (INR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Upload Photo</label>
            <input
              type="file"
              onChange={handlePhotoChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>
        </form>
      </div>

      {/* Price Upload */}
      <div >
      <div className="w-full  bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700">Upload Daily Prices</h2>
        {priceMessage && (
          <p className={`text-center text-sm mt-2 ${priceMessage.startsWith("❌") ? "text-red-500" : "text-green-600"}`}>
            {priceMessage}
          </p>
        )}

        <form onSubmit={handlePriceSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="goldRtgs" value={prices.goldRtgs} onChange={handlePriceChange} placeholder="Gold Rtgs (₹/10g)" className="border p-2 rounded" />
            <input type="number" name="goldCash" value={prices.goldCash} onChange={handlePriceChange} placeholder="Gold Cash (₹/10g)" className="border p-2 rounded" />
            <input type="number" name="silverBank" value={prices.silverBank} onChange={handlePriceChange} placeholder="Silver Bank Peti (₹/kg)" className="border p-2 rounded" />
            <input type="number" name="silverCash" value={prices.silverCash} onChange={handlePriceChange} placeholder="Silver Cash (₹/kg)" className="border p-2 rounded" />
            <input type="number" name="marginGold" value={prices.marginGold} onChange={handlePriceChange} placeholder="Margin Gold" className="border p-2 rounded" />
            <input type="number" name="marginSilver" value={prices.marginSilver} onChange={handlePriceChange} placeholder="Margin Silver" className="border p-2 rounded" />
          </div>

          <div className="bg-gray-50 mt-4 p-4 rounded-md space-y-1 text-sm">
            <p><strong>Gold Tola:</strong> ₹{derived.goldTola.toFixed(2)} (from Gold Rtgs)</p>
            <p><strong>Gold 22 Carat:</strong> ₹{derived.gold22Carat.toFixed(2)} (from Gold Rtgs)</p>
            <p><strong>Silver Tola:</strong> ₹{derived.silverTola.toFixed(2)} (from Silver Cash)</p>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Submit Prices
          </button>
        </form>
      </div>
      {/* Delete Item by ID */}
<div className="w-full mt-12 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700">Delete Item by ID</h2>
  {deleteMessage && (
  <p className={`text-center mt-2 ${deleteMessage.startsWith("❌") ? "text-red-500" : "text-green-600"}`}>
    {deleteMessage}
  </p>
)}
  <div className="mb-4">
        </div>
        <form
 onSubmit={async (e) => {
  e.preventDefault();
  setDeleting(true);
  setDeleteMessage("");

  if (!deleteItemId) {
    setDeleteMessage("Please provide a valid Item ID to delete.");
    setDeleting(false);
    return;
  }

  try {
    const response = await axios.delete(`${baseURL}/delete-item-by-itemId/${deleteItemId}`);
    setDeleteMessage(response.data.message || "Item deleted successfully.");
    setDeleteItemId(""); // Clear input after deletion
  } catch (error) {
    setDeleteMessage(`❌ ${error.response?.data?.message || 'Unable to delete item'}`);
  } finally {
    setDeleting(false);
  }
}}
>
    <div className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="Enter Item ID"
        value={deleteItemId}
        onChange={(e) => setDeleteItemId(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded"
      />
      <button
  type="submit"
  className="bg-red-600 flex items-center justify-center gap-2 text-white px-4 py-2 rounded hover:bg-red-700"
>
  {deleting? <p>Deleting...</p>:<p>Delete</p>} <FiTrash className="text-lg" />
</button>

    </div>
  </form>
</div>

      </div>
    </div>
  );
};

export default ItemUpload;
