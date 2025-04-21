import React, { useEffect, useState } from "react";
import axios from "axios";

const PriceDisplay = () => {
  const [prices, setPrices] = useState({
    gold: null,
    silver: null,
    gold10g: null,
    silver10g: null,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.metalpriceapi.com/v1/latest?api_key=5d8730c238361fdc764d6c96ecf28ed3&base=INR&currencies=XAU,XAG"
      );

      const goldPerGram = res.data.rates.INRXAU / 31.1035;
      const silverPerGram = res.data.rates.INRXAG / 31.1035;

      setPrices({
        gold: goldPerGram.toFixed(2),
        silver: silverPerGram.toFixed(2),
        gold10g: (goldPerGram * 10).toFixed(2),
        silver10g: (silverPerGram * 10).toFixed(2),
      });

      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error("Error fetching metal prices:", err);
      setError("Could not fetch prices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 3600000); // every 1 hour (3600000 ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 rounded-xl shadow-2xl bg-gradient-to-r from-yellow-200 via-yellow-100 to-white border-t-4 border-yellow-400">
      <h2 className="text-4xl font-extrabold text-yellow-800 mb-8 text-center tracking-wide">
        Precious Metal Prices in INR
      </h2>

      {loading ? (
        <p className="text-gray-400 animate-pulse text-center">Loading latest rates...</p>
      ) : error ? (
        <p className="text-red-600 font-medium text-center">{error}</p>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b-2 pb-6">
            <div>
              <h3 className="text-2xl font-semibold text-yellow-700 mb-2">Gold (XAU)</h3>
              <p className="text-sm text-gray-600">1 gram</p>
              <p className="text-3xl font-bold text-yellow-600">₹{prices.gold}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">10 grams</p>
              <p className="text-3xl font-bold text-yellow-600">₹{prices.gold10g}</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b-2 pb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Silver (XAG)</h3>
              <p className="text-sm text-gray-600">1 gram</p>
              <p className="text-3xl font-bold text-gray-600">₹{prices.silver}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">10 grams</p>
              <p className="text-3xl font-bold text-gray-600">₹{prices.silver10g}</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Last updated at <span className="font-semibold">{lastUpdated}</span></p>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default PriceDisplay;
