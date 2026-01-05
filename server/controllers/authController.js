const { getLoginCredentials } = require('../config/googleSheets');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const credentials = await getLoginCredentials();
    const validUser = credentials.find(cred => 
      cred.email === email && cred.password === password
    );
    
    if (validUser) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: 'authenticated' // Simple token for frontend
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

module.exports = { login };
