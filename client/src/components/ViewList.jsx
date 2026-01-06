import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';
import { getStudents, updateStudent } from '../utils/api';
import EditStudentDialog from './EditStudentDialog';
import StudentDetailDialog from './StudentDetailDialog';

export default function ViewList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, student: null, index: -1 });
  const [detailDialog, setDetailDialog] = useState({ open: false, student: null });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.mobileNo.includes(search) ||
        student.admissionNo.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [search, students]);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      const data = response.data || [];
      console.log('Fetched students data:', data); // Debug log
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student, index) => {
    setEditDialog({ open: true, student, index });
  };

  const handleViewDetails = (student) => {
    setDetailDialog({ open: true, student });
  };

  const handleSave = async (updatedData) => {
    try {
      await updateStudent(editDialog.index, updatedData);
      await fetchStudents();
      setEditDialog({ open: false, student: null, index: -1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#0F766E' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#0F766E', textAlign: 'center' }}>
          Student Records
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <TextField
          label="Search by Name, Mobile No, or Admission No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0F766E' }
          }}
        />

        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#0F766E' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Admission No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Mobile No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Admission Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Course Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Course Completion Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Certificate Issue Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={index}
                  component={TableRow}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  sx={{ '&:nth-of-type(even)': { bgcolor: 'rgba(15,118,110,0.05)' } }}
                >
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: '#0F766E',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#06B6D4'
                        }
                      }}
                      onClick={() => handleViewDetails(student)}
                    >
                      {student.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.mobileNo}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>{student.admissionDate}</TableCell>
                  <TableCell>{student.courseName}</TableCell>
                  <TableCell>{student.courseCompletionDate || 'Not completed'}</TableCell>
                  <TableCell>{student.certificateIssueDate || 'Not issued'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(student, index)} sx={{ color: '#0F766E' }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredStudents.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 4, color: '#666' }}>
            No records found
          </Typography>
        )}
      </motion.div>

      <EditStudentDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, student: null, index: -1 })}
        student={editDialog.student}
        onSave={handleSave}
      />

      <StudentDetailDialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, student: null })}
        student={detailDialog.student}
      />
    </Box>
  );
}
