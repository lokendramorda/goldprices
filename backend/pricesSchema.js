const mongoose = require('mongoose');

const pricesSchema = new mongoose.Schema({
  goldRtgs: { type: Number, required: true },
  goldCash: { type: Number, required: true },
  silverBank: { type: Number, required: true },
  silverCash: { type: Number, required: true },
  goldTola: { type: Number, required: true },
  gold22Carat: { type: Number, required: true },
  silverTola: { type: Number, required: true },
  marginGold: { type: Number, required: true },
  marginSilver: { type: Number, required: true },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Prices = mongoose.model('Prices', pricesSchema);

module.exports = Prices;
