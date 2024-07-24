const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList'); // Ensure this path is correct

const { ObjectId } = mongoose.Types;

// Get shopping list by ID
router.get('/:id', async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findById(new ObjectId(req.params.id));
    if (!shoppingList) return res.status(404).send('Shopping list not found');
    res.send(shoppingList);
  } catch (err) {
    res.status(500).send(`Error fetching shopping list: ${err.message}`);
  }
});

// Add other routes as needed

module.exports = router;
