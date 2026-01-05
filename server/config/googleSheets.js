const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

const appendToSheet = async (studentData) => {
  try {
    // Get all data to find the highest ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I'
    });
    
    const rows = response.data.values || [];
    
    // Generate next ID by finding the highest existing ID
    let nextId = 1;
    if (rows.length > 1) {
      // Skip header row and find max ID
      const existingIds = rows.slice(1)
        .map(row => parseInt(row[0]))
        .filter(id => !isNaN(id));
      
      if (existingIds.length > 0) {
        nextId = Math.max(...existingIds) + 1;
      }
    }
    
    console.log('Generated ID:', nextId);
    
    const values = [
      [
        nextId,
        studentData.name || '',
        studentData.mobileNo || '',
        studentData.email || '',
        studentData.address || '',
        studentData.admissionDate || '',
        studentData.courseName || '',
        studentData.courseCompletionDate || '',
        studentData.certificateIssueDate || ''
      ]
    ];
    
    console.log('Appending values:', values);
    
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I',
      valueInputOption: 'RAW',
      resource: { values }
    });
    
    return appendResponse.data;
  } catch (error) {
    console.error('Error in appendToSheet:', error);
    throw new Error('Failed to add student to sheet: ' + error.message);
  }
};

const readFromSheet = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:I'
    });
    
    const rows = response.data.values || [];
    // Skip header row and map data correctly with ID as first column
    return rows.slice(1).map(row => ({
      id: row[0] || '',
      name: row[1] || '',
      mobileNo: row[2] || '',
      email: row[3] || '',
      address: row[4] || '',
      admissionDate: row[5] || '',
      courseName: row[6] || '',
      courseCompletionDate: row[7] || '',
      certificateIssueDate: row[8] || ''
    }));
  } catch (error) {
    throw new Error('Failed to read from sheet: ' + error.message);
  }
};

const updateSheet = async (rowIndex, studentData) => {
  try {
    const values = [
      [
        studentData.id, // Keep existing ID
        studentData.name,
        studentData.mobileNo,
        studentData.email,
        studentData.address,
        studentData.admissionDate,
        studentData.courseName,
        studentData.courseCompletionDate || '',
        studentData.certificateIssueDate || ''
      ]
    ];
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet1!A${rowIndex + 2}:I${rowIndex + 2}`,
      valueInputOption: 'RAW',
      resource: { values }
    });
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to update student in sheet: ' + error.message);
  }
};

const getLoginCredentials = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet2!A:B' // Email in A, Password in B
    });
    
    const rows = response.data.values || [];
    // Skip header row and return credentials
    return rows.slice(1).map(row => ({
      email: row[0] || '',
      password: row[1] || ''
    }));
  } catch (error) {
    console.error('Failed to read login credentials:', error);
    return [];
  }
};

module.exports = { appendToSheet, readFromSheet, updateSheet, getLoginCredentials };
