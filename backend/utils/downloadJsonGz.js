const axios = require('axios');
const fs = require('fs');
const zlib = require('zlib');

const downloadJsonGz = async (url, outputPath) => {
  const response = await axios.get(url, { responseType: 'stream' });
  const gunzip = zlib.createGunzip();
  const writeStream = fs.createWriteStream(outputPath);

  response.data.pipe(gunzip).pipe(writeStream);
};

downloadJsonGz('https://example.com/data.json.gz', 'data.json');