const express = require('express');
const Preference = require('../models/Preference');
const router = express.Router();

// Get preferences for a user
router.get('/:userId', async (req, res) => {
  try {
    const preferences = await Preference.find({ userId: req.params.userId });
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a new preference
router.post('/', async (req, res) => {
  const preference = new Preference({
    userId: req.body.userId,
    originalItem: req.body.originalItem,
    mappedItem: req.body.mappedItem,
  });

  try {
    const newPreference = await preference.save();
    res.status(201).json(newPreference);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
