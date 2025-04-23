// src/components/DeleteItem.js
import React, { useState } from "react";
import axios from "axios";
import { FiTrash } from "react-icons/fi";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const DeleteItem = () => {
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!deleteItemId.trim()) {
      setDeleteMessage("Please provide a valid Item ID to delete.");
      return;
    }

    setLoading(true);
    setDeleteMessage("");

    try {
      const response = await axios.delete(`${baseURL}/delete-item-by-itemId/${deleteItemId}`);
      setDeleteMessage(response.data.message || "Item deleted successfully!");
      setDeleteItemId("");
    } catch (error) {
      setDeleteMessage(`Error: ${error.response?.data?.message || "Unable to delete item"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/3 bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleDelete}>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Enter Item ID"
            value={deleteItemId}
            onChange={(e) => setDeleteItemId(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-red-500 flex items-center justify-center text-white px-4 py-2 rounded hover:bg-red-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Deleting..." : "Delete"} <FiTrash  className="text-lg"/>
          </button>
        </div>
      </form>
      {deleteMessage && (
        <p className={`text-center text-sm mt-2 ${deleteMessage.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
          {deleteMessage}
        </p>
      )}
    </div>
  );
};

export default DeleteItem;
