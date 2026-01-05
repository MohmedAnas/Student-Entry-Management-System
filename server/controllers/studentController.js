const { appendToSheet, readFromSheet, updateSheet } = require('../config/googleSheets');

const addStudent = async (req, res) => {
  try {
    console.log('Received student data:', req.body);
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.name || !studentData.mobileNo || !studentData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile number, and email are required'
      });
    }
    
    const result = await appendToSheet(studentData);
    console.log('Successfully added student to sheet:', result);
    
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: studentData
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await readFromSheet();
    
    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { index } = req.params;
    const studentData = req.body;
    
    await updateSheet(parseInt(index), studentData);
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: studentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

module.exports = { addStudent, getStudents, updateStudent };
