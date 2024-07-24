const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  itemId: String,
  prices: [
    {
      date: Date,
      price: Number
    }
  ]
});

module.exports = mongoose.model('PriceHistory', priceHistorySchema);