const express = require('express');
const { addStudent, getStudents, updateStudent } = require('../controllers/studentController');
const { validateStudent, validateStudentUpdate } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateStudent, addStudent);
router.get('/', getStudents);
router.put('/:index', validateStudentUpdate, updateStudent);

module.exports = router;
