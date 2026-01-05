import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#0F766E', textAlign: 'center' }}>
          About Us
        </Typography>
        
        <Paper sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Welcome to Zam Zam Computers - a modern, efficient solution for managing student records.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Our platform is designed to streamline the process of recording and retrieving student information,
            making it easy for educational institutions to maintain accurate and up-to-date records.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Built with cutting-edge technology including React, Material-UI, and Google Sheets integration,
            we provide a reliable, secure, and user-friendly experience.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}
