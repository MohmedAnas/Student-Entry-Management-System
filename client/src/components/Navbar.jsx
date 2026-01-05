import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import LoginDialog from './LoginDialog';

const navItems = ['Home', 'Add Entry', 'View List', 'About', 'Contact'];

export default function Navbar({ currentPage, setCurrentPage, isAuthenticated, onLogin, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleNavClick = (item) => {
    if ((item === 'Add Entry' || item === 'View List') && !isAuthenticated) {
      setLoginOpen(true);
    } else {
      setCurrentPage(item);
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #0F766E 0%, #06B6D4 100%)', boxShadow: '0 4px 20px rgba(15,118,110,0.3)' }}>
        <Toolbar>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ flexGrow: 1 }}>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>Zam Zam Computers</Box>
          </motion.div>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => {
              // Hide Add Entry and View List for non-authenticated users
              if ((item === 'Add Entry' || item === 'View List') && !isAuthenticated) {
                return null;
              }
              
              return (
                <motion.div key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleNavClick(item)}
                    sx={{
                      color: currentPage === item ? '#000' : '#fff',
                      fontWeight: currentPage === item ? 'bold' : 'normal',
                      bgcolor: currentPage === item ? 'rgba(255,255,255,0.3)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    {item}
                  </Button>
                </motion.div>
              );
            })}
            
            {isAuthenticated ? (
              <Button
                onClick={onLogout}
                startIcon={<LogoutIcon />}
                sx={{ color: '#fff', border: '1px solid #fff', ml: 2 }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => setLoginOpen(true)}
                startIcon={<LoginIcon />}
                sx={{ color: '#fff', border: '1px solid #fff', ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>

          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250, bgcolor: '#f5f5f5' }}>
          {navItems.map((item) => {
            // Hide Add Entry and View List for non-authenticated users in mobile menu
            if ((item === 'Add Entry' || item === 'View List') && !isAuthenticated) {
              return null;
            }
            
            return (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => { handleNavClick(item); handleDrawerToggle(); }}>
                  <ListItemText primary={item} sx={{ color: currentPage === item ? '#0F766E' : '#000' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              if (isAuthenticated) {
                onLogout();
              } else {
                setLoginOpen(true);
              }
              handleDrawerToggle();
            }}>
              <ListItemText 
                primary={isAuthenticated ? 'Logout' : 'Login'} 
                sx={{ color: '#0F766E', fontWeight: 'bold' }} 
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={onLogin}
      />
    </>
  );
}
