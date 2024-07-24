const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      purchased: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;
