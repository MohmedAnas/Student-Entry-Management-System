// test-debug.js
const path = require('path');

// 1) Force dotenv to load from ./server/.env (adjust if needed)
require('dotenv').config({
  path: path.join(__dirname, '.env'),
});

console.log('Raw process.env keys:');
console.log(Object.keys(process.env).filter(k => k.startsWith('GOOGLE_') || k === 'PORT'));
console.log('---');

console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY set?:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('---\n');

const { google } = require('googleapis');

async function testConnection() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
        ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
  });

  console.log('✅ Connected to:', response.data.properties.title);
}

testConnection().catch(console.error);
