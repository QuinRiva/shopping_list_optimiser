const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const matchItems = require('../utils/matchItems');

const router = express.Router();

// Handle errors from exec and send appropriate response
const handleExecError = (error, stderr, res) => {
  if (error || stderr) {
    const errorMessage = error ? error.message : stderr;
    console.error(`Error: ${errorMessage}`);
    res.status(500).send({ error: errorMessage });
    return true;
  }
  return false;
};

// Sanitize matched items to remove problematic characters
const sanitizeMatchedItems = (items) => items.map(item => item.replace(/[()]/g, ''));

// Execute a Python script and handle the response
const executePythonScript = (script, env, res, callback) => {
  exec(`python3 ${script}`, { env: { ...process.env, ...env } }, (error, stdout, stderr) => {
    if (handleExecError(error, stderr, res)) return;
    try {
      const result = JSON.parse(stdout);
      callback(result);
    } catch (parseError) {
      console.error(`Parse Error: ${parseError.message}`);
      res.status(500).send({ error: parseError.message });
    }
  });
};

// Route to test item matching
router.get('/test-matching', async (req, res) => {
  try {
    const testItem = 'Nutella'; // Replace with any test item
    const matches = await matchItems(testItem);
    res.json({ item: testItem, matches });
  } catch (error) {
    console.error('Error in test-matching route:', error);
    res.status(500).send('Error matching items');
  }
});

// Route to match a specific item by name
router.get('/match-item/:itemName', async (req, res) => {
  try {
    const { itemName } = req.params;
    const matches = await matchItems(itemName);
    res.json({ item: itemName, matches });
  } catch (error) {
    console.error('Error in match-item route:', error);
    res.status(500).send('Error matching items');
  }
});

// Route to fetch titles of all notes
router.get('/titles', (req, res) => {
  const scriptPath = path.join(__dirname, '../gkeep_integration.py');
  executePythonScript(scriptPath, { ACTION: 'titles' }, res, (titles) => {
    console.log("Sending titles response: ", titles);
    res.json(titles);
  });
});

// Route to fetch backlog and next shop list based on titles
router.get('/lists', (req, res) => {
  const { backlogTitle, nextShopTitle } = req.query;
  console.log(`Received backlogTitle: ${backlogTitle}, nextShopTitle: ${nextShopTitle}`);
  const scriptPath = path.join(__dirname, '../gkeep_integration.py');
  const env = {
    BACKLOG_TITLE: backlogTitle,
    NEXT_SHOP_TITLE: nextShopTitle
  };
  executePythonScript(scriptPath, env, res, (lists) => {
    console.log("Sending lists response: ", lists);
    res.json(lists);
  });
});

// Route to update Google Keep with the lists
router.post('/update', async (req, res) => {
  const { backlog, next_shop } = req.body;

  // Match items and sanitize matched items
  const matchAndUpdate = async (items) => {
    return Promise.all(items.map(async (item) => {
      const matchedItems = await matchItems(item.name);
      console.log(`Matching for item: ${item.name}`);
      console.log(`Matched items: ${JSON.stringify(matchedItems)}`);
      return {
        ...item,
        matchedItems: sanitizeMatchedItems(matchedItems),
      };
    }));
  };

  // Match and update items for backlog and next shop lists
  const updatedBacklog = await matchAndUpdate(backlog);

  // Prepare raw items for updating Google Keep
  const rawBacklog = backlog.map(item => ({ name: item.name, purchased: item.purchased }));
  const rawNextShop = next_shop.map(item => ({ name: item.name, purchased: item.purchased }));

  const scriptPath = path.join(__dirname, '../gkeep_update.py');
  const data = JSON.stringify({ backlog: rawBacklog, next_shop: rawNextShop });

  console.log(`Updating Google Keep with data: ${data}`);

  // Execute the script to update Google Keep
  exec(`python3 ${scriptPath} '${data.replace(/'/g, "\\'")}'`, (error, stdout, stderr) => {
    if (handleExecError(error, stderr, res)) return;
    console.log("Google Keep updated successfully");
    res.send('Google Keep updated successfully');
  });
});

module.exports = router;
