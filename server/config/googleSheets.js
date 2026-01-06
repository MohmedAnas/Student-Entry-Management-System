const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    console.log('Student data received in appendToSheet:', studentData);
    console.log('Course price:', studentData.coursePrice);
    
    const values = [
      [
        studentData.admissionNo || '',
        studentData.name || '',
        studentData.mobileNo || '',
        studentData.email || '',
        studentData.address || '',
        studentData.admissionDate || '',
        studentData.courseName || '',
        studentData.coursePrice ? String(studentData.coursePrice) : '',
        studentData.courseCompletionDate || '',
        studentData.certificateIssueDate || '',
        studentData.remarks || ''
      ]
    ];
    
    console.log('Values to append:', values);
    
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:K',
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
      range: 'Sheet1!A:K'
    });
    
    const rows = response.data.values || [];
    // Skip header row and map data correctly with admission number as first column
    return rows.slice(1).map(row => ({
      admissionNo: row[0] || '',
      name: row[1] || '',
      mobileNo: row[2] || '',
      email: row[3] || '',
      address: row[4] || '',
      admissionDate: row[5] || '',
      courseName: row[6] || '',
      coursePrice: row[7] || '',
      courseCompletionDate: row[8] || '',
      certificateIssueDate: row[9] || '',
      remarks: row[10] || ''
    }));
  } catch (error) {
    throw new Error('Failed to read from sheet: ' + error.message);
  }
};

const updateSheet = async (rowIndex, studentData) => {
  try {
    const values = [
      [
        studentData.admissionNo,
        studentData.name,
        studentData.mobileNo,
        studentData.email,
        studentData.address,
        studentData.admissionDate,
        studentData.courseName,
        studentData.coursePrice ? String(studentData.coursePrice) : '',
        studentData.courseCompletionDate || '',
        studentData.certificateIssueDate || '',
        studentData.remarks || ''
      ]
    ];
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Sheet1!A${rowIndex + 2}:K${rowIndex + 2}`,
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
