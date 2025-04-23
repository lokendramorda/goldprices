import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PriceTicker from './PriceTicker';
const baseURL = process.env.REACT_APP_API_BASE_URL

const PriceDisplay = () => {
  const [prices, setPrices] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(`${baseURL}/get-prices`);
        setPrices(response.data);
        setLastUpdated(new Date(response.data.updatedAt).toLocaleString());
        setLoading(false);
      } catch (err) {
        setError('Error fetching latest prices.');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const calculateBuyGold = () => prices.goldRtgs - prices.marginGold;
  const calculateBuySilver = () => prices.silverBank - prices.marginSilver;

  return (
    <div className=" min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-white to-gray-100 pt-12 pb-4 px-6">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-yellow-800 mb-12 tracking-wide">
          Gold/Silver live price updates
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center text-lg animate-pulse">Loading latest rates...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gold Section */}
            <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 border-t-4 border-yellow-400">
              <h3 className="text-4xl font-bold text-yellow-800 mb-6">Gold<p className="text-sm text-gray-500">/10g</p></h3>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-medium text-yellow-700">Rtgs: ₹{prices.goldRtgs}</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-yellow-700">Cash: ₹{prices.goldCash}</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-yellow-700">Tola: ₹{Math.round(prices.goldTola)}</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-yellow-700">22 Carat: ₹{prices.gold22Carat.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Silver Section */}
            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 border-t-4 border-gray-400">
              <h3 className="text-4xl font-bold text-gray-800 mb-6">Silver <p className="text-sm text-gray-500">/kg</p></h3>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-medium text-gray-700">Bank Peti: ₹{prices.silverBank}</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-gray-700">Cash: ₹{prices.silverCash}</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-gray-700">Tola: ₹{Math.round(prices.silverTola)}</p>
                </div>
              </div>
            </div>

            {/* Buy Section */}
            <div className="bg-green-50 rounded-2xl shadow-lg p-6 border-t-4 border-green-400">
              <h3 className="text-4xl font-bold text-green-800 mb-6">Buy Rates</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-2xl font-semibold text-green-700">Buy Gold: ₹{calculateBuyGold().toFixed(0)}</p>
                  <p className="text-sm text-gray-500">/10g</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-green-700">Buy Silver: ₹{calculateBuySilver().toFixed(0)}</p>
                  <p className="text-sm text-gray-500">/kg</p>
                </div>
              </div>
            </div>
          </div>
        )}

       
      </div>
     
      <div className="text-center text-sm text-gray-600 mt-auto">
        {!loading && !error && prices && (
 <PriceTicker prices={prices} buyGold={calculateBuyGold()}  buySilver={calculateBuySilver()}/>
   )}

          <p>
            Last updated at <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

    </div>
  );
};

export default PriceDisplay;
