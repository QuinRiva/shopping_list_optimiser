const axios = require('axios');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'shoppinglist';

const downloadJson = async (url, outputPath) => {
  try {
    console.log('Starting download...');
    const response = await axios.get(url, { responseType: 'stream' });

    console.log('Download started, writing to file...');
    const writeStream = fs.createWriteStream(outputPath);

    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        console.log('File written successfully.');
        resolve();
      });
      writeStream.on('error', (error) => {
        console.error('WriteStream error:', error);
        reject(error);
      });
      response.data.on('error', (error) => {
        console.error('Response stream error:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

const populateMongoDB = async (filePath) => {
  const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('shoppinglists');

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    await collection.deleteMany({});
    await collection.insertMany(data);

    console.log('Database populated successfully');
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    await client.close();
  }
};

const main = async () => {
    const url = 'https://hotprices.org/data/latest-canonical.coles.compressed.json.gz';
  const outputPath = 'data.json';

  try {
    console.log('Downloading JSON file...');
    await downloadJson(url, outputPath);
    console.log('Download complete.');

    console.log('Populating MongoDB...');
    await populateMongoDB(outputPath);
    console.log('MongoDB population complete.');
  } catch (err) {
    console.error('Error in main function:', err);
  }
};

main();
  