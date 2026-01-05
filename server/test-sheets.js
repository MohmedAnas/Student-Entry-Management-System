const { google } = require('googleapis');
require('dotenv').config();

async function testGoogleSheetsConnection() {
  try {
    console.log('🔄 Testing Google Sheets API connection...\n');

    // Debug environment variables
    console.log('🔍 Environment check:');
    console.log('PORT:', process.env.PORT);
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing');
    console.log(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL:',
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Missing'
    );
    console.log(
      'GOOGLE_PRIVATE_KEY:',
      process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing'
    );
    console.log('');

    // Initialize Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Important: fix escaped newlines from .env
        private_key: process.env.GOOGLE_PRIVATE_KEY
          ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
          : undefined,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test 1: Read sheet info
    console.log('📋 Test 1: Reading sheet info...');
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    console.log(`✅ Connected to: ${sheetInfo.data.properties.title}`);
    console.log(`📊 Sheet name: ${sheetInfo.data.sheets[0].properties.title}\n`);

    // Test 2: Read existing data
    console.log('📖 Test 2: Reading existing data...');
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:H',
    });

    const rows = readResponse.data.values || [];
    console.log(`📊 Found ${rows.length} rows (including header)`);
    if (rows.length > 0) {
      console.log('📝 Headers:', rows[0]);
    }
    console.log('');

    // Test 3: Add test data
    console.log('✏️  Test 3: Adding test student data...');
    const testData = [
      [
        'Test Student',
        '9876543210',
        'test@example.com',
        'Test Address, Test City',
        '10/12/2025',
        'Full Stack Development',
        '10/06/2026',
        '25/06/2026',
      ],
    ];

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      requestBody: { values: testData }, // `requestBody` is preferred in newer clients
    });

    console.log(`✅ Test data added successfully!`);
    console.log(`📍 Updated range: ${appendResponse.data.updates.updatedRange}\n`);

    // Test 4: Read updated data
    console.log('🔍 Test 4: Verifying data was added...');
    const verifyResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:H',
    });

    const updatedRows = verifyResponse.data.values || [];
    console.log(`📊 Total rows now: ${updatedRows.length}`);
    if (updatedRows.length > 1) {
      console.log('📝 Last row:', updatedRows[updatedRows.length - 1]);
    }

    console.log('\n🎉 All tests passed! Google Sheets API is working correctly.');
  } catch (error) {
    console.error('❌ Error testing Google Sheets connection:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Extra logging for auth errors
    if (error.response && error.response.data) {
      console.error('Error response data:', error.response.data);
    }

    if (error.message.includes('ENOENT')) {
      console.error('\n💡 Make sure service-account.json exists in credentials/ folder');
    }
    if (error.message.includes('403')) {
      console.error('\n💡 Make sure the service account has access to the sheet');
    }
    if (error.message.includes('404')) {
      console.error('\n💡 Check if GOOGLE_SHEET_ID is correct in .env file');
    }
  }
}

// Run the test
testGoogleSheetsConnection();
