import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { fadeIn } from '../utils/animations';

export default function Home({ setCurrentPage }) {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 3 }}>
      <motion.div {...fadeIn}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#0F766E', mb: 2 }}>
          Welcome to Zam Zam Computers
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 4, maxWidth: 600, mx: 'auto' }}>
          Manage student records efficiently with our modern, easy-to-use platform
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setCurrentPage('Add Entry')}
            sx={{
              background: 'linear-gradient(135deg, #0F766E 0%, #06B6D4 100%)',
              color: '#fff',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { boxShadow: '0 0 20px rgba(16,185,129,0.6)' }
            }}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
}
