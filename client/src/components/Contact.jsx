import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#0F766E', textAlign: 'center' }}>
          Contact Us
        </Typography>
        
        <Paper sx={{ p: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmailIcon sx={{ color: '#0F766E', mr: 2, fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Email</Typography>
              <Typography>sranawadia@gmail.com</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PhoneIcon sx={{ color: '#0F766E', mr: 2, fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Phone</Typography>
              <Typography>+91 9898142823</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ color: '#0F766E', mr: 2, fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Address</Typography>
              <Typography>Mira Compex, Opp. L.I.C Office, Above Phone Wale shworoom, Nyay Mandir Himatnagar</Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
