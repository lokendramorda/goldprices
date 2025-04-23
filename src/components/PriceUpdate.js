// src/components/PriceUpdate.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const PriceUpdate = () => {
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

  const [priceMessage, setPriceMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setPriceMessage("");

    const fullData = { ...prices, ...derived };

    try {
      const response = await axios.post(`${baseURL}/submit-prices`, fullData);
      setPriceMessage(response.data.message || "Prices submitted successfully! ✅");
    } catch (error) {
      setPriceMessage("❌ " + (error.response?.data?.message || "Error submitting prices. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:w-1/2  bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-yellow-700">Upload Daily Prices</h2>
      {priceMessage && (
        <p className={`text-center text-sm mt-2 ${priceMessage.startsWith("❌") ? "text-red-500" : "text-green-600"}`}>
          {priceMessage}
        </p>
      )}
      <form onSubmit={handlePriceSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="goldRtgs"
            value={prices.goldRtgs}
            onChange={handlePriceChange}
            placeholder="Gold Rtgs (₹/10g)"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="goldCash"
            value={prices.goldCash}
            onChange={handlePriceChange}
            placeholder="Gold Cash (₹/10g)"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="silverBank"
            value={prices.silverBank}
            onChange={handlePriceChange}
            placeholder="Silver Bank Peti (₹/kg)"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="silverCash"
            value={prices.silverCash}
            onChange={handlePriceChange}
            placeholder="Silver Cash (₹/kg)"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="marginGold"
            value={prices.marginGold}
            onChange={handlePriceChange}
            placeholder="Margin Gold"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="marginSilver"
            value={prices.marginSilver}
            onChange={handlePriceChange}
            placeholder="Margin Silver"
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="bg-gray-50 mt-4 p-4 rounded-md space-y-1 text-sm">
          <p><strong>Gold Tola:</strong> ₹{derived.goldTola.toFixed(2)} (from Gold Rtgs)</p>
          <p><strong>Gold 22 Carat:</strong> ₹{derived.gold22Carat.toFixed(2)} (from Gold Rtgs)</p>
          <p><strong>Silver Tola:</strong> ₹{derived.silverTola.toFixed(2)} (from Silver Cash)</p>
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className={`w-1/2 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Submitting..." : "Submit Prices"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default PriceUpdate;
