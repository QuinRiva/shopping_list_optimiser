const fs = require('fs');
const path = require('path');
const axios = require('axios');

const JSON_DATABASE_URL = 'https://hotprices.org/data/latest-canonical.coles.compressed.json.gz';
const JSON_DATABASE_PATH = path.join(__dirname, '../data/groceries.json');

const loadGroceries = async () => {
  const downloadDatabase = async () => {
    console.log('Downloading JSON database...');
    const response = await axios({
      url: JSON_DATABASE_URL,
      method: 'GET',
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(JSON_DATABASE_PATH);
      response.data.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log('Download complete.');
        resolve();
      });
      fileStream.on('error', (err) => {
        console.error('Error downloading file:', err);
        reject(err);
      });
    });
  };

  if (!fs.existsSync(JSON_DATABASE_PATH) || new Date(fs.statSync(JSON_DATABASE_PATH).mtime) < new Date().setHours(0, 0, 0, 0)) {
    await downloadDatabase();
  } else {
    console.log('Using cached JSON database.');
  }

  console.log('Loading groceries from JSON database...');
  const groceriesData = fs.readFileSync(JSON_DATABASE_PATH, 'utf-8');
  const groceries = JSON.parse(groceriesData);
  console.log(`Loaded ${groceries.length} items from the JSON database.`);
  return groceries;
};

module.exports = loadGroceries;
