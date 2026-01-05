import React, { useState, useRef } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { validateForm } from '../utils/validation';
import { addStudent } from '../utils/api';
import dayjs from 'dayjs';

const courses = [
  'Full Stack Development',
  'Data Science',
  'Web Development',
  'Graphic Designing',
  'Cloud Computing'
];

export default function DataEntryForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    address: '',
    admissionDate: null,
    courseName: '',
    courseCompletionDate: null,
    certificateIssueDate: null
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    anime({
      targets: buttonRef.current,
      scale: [1, 1.1, 1],
      duration: 500,
      easing: 'easeInOutQuad'
    });

    try {
      const dataToSend = {
        ...formData,
        admissionDate: dayjs(formData.admissionDate).format('DD/MM/YYYY'),
        courseCompletionDate: formData.courseCompletionDate ? dayjs(formData.courseCompletionDate).format('DD/MM/YYYY') : '',
        certificateIssueDate: formData.certificateIssueDate ? dayjs(formData.certificateIssueDate).format('DD/MM/YYYY') : ''
      };
      
      console.log('Sending data:', dataToSend);
      await addStudent(dataToSend);
      setSuccess(true);
      setFormData({
        name: '',
        mobileNo: '',
        email: '',
        address: '',
        admissionDate: null,
        courseName: '',
        courseCompletionDate: null,
        certificateIssueDate: null
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      setErrors({ submit: error.response?.data?.message || 'Failed to submit data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#0F766E', textAlign: 'center' }}>
            Student Data Entry Form
          </Typography>

          {success && <Alert severity="success" sx={{ mb: 3 }}>Student data submitted successfully!</Alert>}
          {errors.submit && <Alert severity="error" sx={{ mb: 3 }}>{errors.submit}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }}
            />

            <TextField
              label="Mobile No"
              value={formData.mobileNo}
              onChange={(e) => handleChange('mobileNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={!!errors.mobileNo}
              helperText={errors.mobileNo}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }}
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }}
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={3}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }}
            />

            <DatePicker
              label="Admission Date"
              value={formData.admissionDate}
              onChange={(date) => handleChange('admissionDate', date)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.admissionDate,
                  helperText: errors.admissionDate,
                  sx: { '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }
                }
              }}
            />

            <TextField
              select
              label="Course Name"
              value={formData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
              error={!!errors.courseName}
              helperText={errors.courseName}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }}
            >
              {courses.map((course) => (
                <MenuItem key={course} value={course}>{course}</MenuItem>
              ))}
            </TextField>

            <DatePicker
              label="Course Completion Date (Optional)"
              value={formData.courseCompletionDate}
              onChange={(date) => handleChange('courseCompletionDate', date)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }
                }
              }}
            />

            <DatePicker
              label="Certificate Issue Date (Optional)"
              value={formData.certificateIssueDate}
              onChange={(date) => handleChange('certificateIssueDate', date)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' } }
                }
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                ref={buttonRef}
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#fff',
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { boxShadow: '0 0 20px rgba(16,185,129,0.6)' }
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
}
