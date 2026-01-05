import React from 'react';
import { Dialog, DialogContent, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

export default function StudentDetailDialog({ open, onClose, student }) {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* ID Card Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #0F766E 0%, #06B6D4 100%)',
            color: 'white',
            p: 3,
            position: 'relative'
          }}>
            <IconButton
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PersonIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {student.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Student ID: {student.id}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ID Card Body */}
          <Box sx={{ p: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="h6" sx={{ 
              color: '#0F766E', 
              fontWeight: 'bold', 
              mb: 2,
              textAlign: 'center'
            }}>
              ZAM ZAM COMPUTERS
            </Typography>
            
            <Divider sx={{ mb: 3 }} />

            {/* Student Details */}
            <Box sx={{ display: 'grid', gap: 2 }}>
              <DetailRow label="Mobile Number" value={student.mobileNo} />
              <DetailRow label="Email Address" value={student.email} />
              <DetailRow label="Address" value={student.address} />
              <DetailRow label="Admission Date" value={student.admissionDate} />
              <DetailRow label="Course Name" value={student.courseName} />
              <DetailRow 
                label="Course Completion" 
                value={student.courseCompletionDate || 'In Progress'} 
              />
              <DetailRow 
                label="Certificate Status" 
                value={student.certificateIssueDate ? `Issued on ${student.certificateIssueDate}` : 'Not Issued'} 
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" sx={{ 
              textAlign: 'center', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              Student Information Card
            </Typography>
          </Box>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography variant="body2" sx={{ 
        fontWeight: 'bold', 
        color: '#374151',
        minWidth: '140px'
      }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ 
        color: '#6B7280',
        textAlign: 'right',
        flex: 1,
        ml: 2
      }}>
        {value}
      </Typography>
    </Box>
  );
}
