import React, { useEffect, useState } from 'react';

const PriceTicker = ({ prices }) => {
  const [priceFluctuations, setPriceFluctuations] = useState({});

  useEffect(() => {
    const keys = Object.keys(prices);
    const fluctuations = {};
    keys.forEach((key) => {
      const direction = Math.random() > 0.5 ? 'up' : 'down';
      fluctuations[key] = direction;
    });
    setPriceFluctuations(fluctuations);
  }, [prices]);

  const getArrow = (direction) =>
    direction === 'up' ? (
      <span className="text-green-500 ml-1">▲</span>
    ) : (
      <span className="text-red-500 ml-1">▼</span>
    );

  const buyGold = prices.goldRtgs - prices.marginGold;
  const buySilver = prices.silverBank - prices.marginSilver;

  const entries = [
    ...Object.entries(prices).filter(
      ([key]) => !['_id', 'marginGold', 'marginSilver'].includes(key)
    ),
    ['buyGold', buyGold],
    ['buySilver', buySilver],
  ];

  const noArrowKeys = ['updatedAt', 'type', ];

  const renderTickerItems = () =>
    entries.map(([key, value], idx) => {
      const noINR = noArrowKeys.includes(key);
      let displayValue = value;

      if (key === 'updatedAt' && value) {
        displayValue = new Date(value).toLocaleString();
      }

      return (
        <div key={idx} className="flex items-center space-x-1 px-4">
          <span className="uppercase text-gray-600">{key}:</span>
          <span className="text-yellow-800 font-bold">
            {noINR
              ? typeof displayValue === 'number'
                ? displayValue.toFixed(0)
                : displayValue
              : `₹${typeof displayValue === 'number' ? displayValue.toFixed(0) : displayValue}`}
          </span>
          {!noArrowKeys.includes(key) && getArrow(priceFluctuations[key])}
        </div>
      );
    });

  return (
    <div className="overflow-hidden w-full border-t border-gray-300 mt-4 py-2 bg-yellow-50 rounded-md shadow-inner">
      <div className="relative w-full">
        <div className="flex animate-smooth-marquee space-x-10 text-sm text-yellow-900 font-medium tracking-wide w-max">
          {renderTickerItems()}
          {renderTickerItems()}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;
