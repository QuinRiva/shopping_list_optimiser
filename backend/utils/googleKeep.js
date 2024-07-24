const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Load environment variables
require('dotenv').config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/oauth2callback';

// Log the client ID and client secret to verify they are loaded correctly
console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret);

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);

const getAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/keep.readonly'],
  });
  return authUrl;
};

const getAccessToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

const stripUnwantedCharacters = (text) => {
  // Example: Replace squares with empty string or any other character you need to strip
  return text.replace(/[□]/g, '');
};

const getKeepNotes = async () => {
  const keep = google.keep({ version: 'v1', auth: oauth2Client });
  const res = await keep.notes.list();
  return res.data.items.map(note => ({
    ...note,
    textContent: stripUnwantedCharacters(note.textContent)
  }));
};

module.exports = {
  getAuthUrl,
  getAccessToken,
  getKeepNotes,
};
