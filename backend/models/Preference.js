const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalItem: { type: String, required: true },
  mappedItem: { type: String, required: true },
});

const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = Preference;
