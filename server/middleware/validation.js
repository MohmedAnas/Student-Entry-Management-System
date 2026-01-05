const { body, validationResult } = require('express-validator');

const validateStudent = [
  body('name').notEmpty().withMessage('Name is required'),
  body('mobileNo').matches(/^\d{10}$/).withMessage('Mobile No must be exactly 10 digits'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('admissionDate').notEmpty().withMessage('Admission Date is required'),
  body('courseName').notEmpty().withMessage('Course Name is required'),
  body('courseCompletionDate').optional({ checkFalsy: true }),
  body('certificateIssueDate').optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateStudentUpdate = [
  body('mobileNo').optional().isLength({ min: 10, max: 10 }).withMessage('Mobile No must be 10 digits'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateStudent, validateStudentUpdate };
