require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
const PORT = 3000;

// Set up OAuth2 client using credentials from .env
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 🔐 1️⃣ Route to redirect user to Google's consent screen
app.get('/login', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent',
  });
  res.redirect(authUrl);
});

// 🔑 2️⃣ Route to handle Google OAuth2 callback
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.send('✅ Authentication successful! You can now transfer file ownership.');
    console.log('Access Token:', tokens.access_token);
  } catch (err) {
    console.error('❌ Error retrieving access token:', err);
    res.status(500).send('Authentication failed.');
  }
});

// 🚀 Start the Express server
app.listen(PORT, () => {
  console.log(`🌍 Visit http://localhost:${PORT}/login to start the OAuth process.`);
});
