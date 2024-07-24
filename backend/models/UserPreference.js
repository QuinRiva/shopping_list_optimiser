const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: String,
  mappings: [
    {
      genericItem: String,
      storeItem: String
    }
  ]
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);