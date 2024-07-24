const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const shoppingListRouter = require('./routes/shoppingList');
const googleKeepRouter = require('./routes/googleKeep');
const preferenceRouter = require('./routes/preferences');

app.use('/api/shopping-list', shoppingListRouter);
app.use('/api/google-keep', googleKeepRouter);
app.use('/api/preferences', preferenceRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
