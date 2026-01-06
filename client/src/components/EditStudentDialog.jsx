import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { validateEditForm } from '../utils/validation';

const courses = [
  { name: 'MS - Office 2007', price: 1500 },
  { name: 'Logo Design', price: 1000 },
  { name: 'D.T.P', price: 2500 },
  { name: 'Tally ERP 9', price: 1500 },
  { name: 'KIDS Course', price: 1000 },
  { name: 'CCC GOVT.', price: 2200 },
  { name: 'AUTO - CAD 2D/3D', price: 3500 },
  { name: 'Digital Photo', price: 2000 },
  { name: 'ASP.NET', price: 7000 },
  { name: 'C, C++', price: 4500 },
  { name: 'Hardware', price: 10000 },
  { name: 'ADCA + DIH', price: 10000 },
  { name: 'Busy + Tally', price: 3500 }
];

export default function EditStudentDialog({ open, onClose, student, onSave }) {
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    mobileNo: '',
    email: '',
    address: '',
    admissionDate: null,
    courseName: '',
    coursePrice: '',
    courseCompletionDate: null,
    certificateIssueDate: null,
    remarks: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        admissionNo: student.admissionNo || '',
        name: student.name || '',
        mobileNo: student.mobileNo || '',
        email: student.email || '',
        address: student.address || '',
        admissionDate: student.admissionDate ? dayjs(student.admissionDate, 'DD/MM/YYYY') : null,
        courseName: student.courseName || '',
        coursePrice: student.coursePrice || '',
        courseCompletionDate: student.courseCompletionDate ? dayjs(student.courseCompletionDate, 'DD/MM/YYYY') : null,
        certificateIssueDate: student.certificateIssueDate ? dayjs(student.certificateIssueDate, 'DD/MM/YYYY') : null,
        remarks: student.remarks || ''
      });
    }
  }, [student]);

  const handleChange = (field, value) => {
    if (field === 'courseName') {
      const selectedCourse = courses.find(course => course.name === value);
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        coursePrice: selectedCourse ? selectedCourse.price : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    const validationErrors = validateEditForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSave = {
      ...formData,
      admissionDate: formData.admissionDate ? dayjs(formData.admissionDate).format('DD/MM/YYYY') : '',
      courseCompletionDate: formData.courseCompletionDate ? dayjs(formData.courseCompletionDate).format('DD/MM/YYYY') : '',
      certificateIssueDate: formData.certificateIssueDate ? dayjs(formData.certificateIssueDate).format('DD/MM/YYYY') : ''
    };

    onSave(dataToSave);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Student Details</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Admission No"
            value={formData.admissionNo}
            onChange={(e) => handleChange('admissionNo', e.target.value)}
            fullWidth
          />
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
          />
          <TextField
            label="Mobile No"
            value={formData.mobileNo}
            onChange={(e) => handleChange('mobileNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
          <DatePicker
            label="Admission Date"
            value={formData.admissionDate}
            onChange={(date) => handleChange('admissionDate', date)}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            select
            label="Course Name"
            value={formData.courseName}
            onChange={(e) => handleChange('courseName', e.target.value)}
            fullWidth
            SelectProps={{
              renderValue: (selected) => selected
            }}
          >
            {courses.map((course) => (
              <MenuItem key={course.name} value={course.name}>
                {course.name} - ₹{course.price}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Course Price"
            value={formData.coursePrice ? `₹${formData.coursePrice}` : ''}
            disabled
            fullWidth
            sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#0F766E', fontWeight: 'bold' } }}
          />
          <DatePicker
            label="Course Completion Date"
            value={formData.courseCompletionDate}
            onChange={(date) => handleChange('courseCompletionDate', date)}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="Certificate Issue Date"
            value={formData.certificateIssueDate}
            onChange={(date) => handleChange('certificateIssueDate', date)}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true } }}
          />
          <TextField
            label="Remarks"
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#0F766E' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
