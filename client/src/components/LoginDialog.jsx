import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Alert, IconButton, InputAdornment, LinearProgress, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../utils/api';

export default function LoginDialog({ open, onClose, onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const attemptDurations = [60, 30, 20]; // seconds for each attempt

  useEffect(() => {
    let interval;
    if (loading && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const duration = attemptDurations[attempt];
          setProgress(((duration - newTime) / duration) * 100);
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading, timeLeft, attempt]);

  const attemptLogin = async (attemptNumber) => {
    const duration = attemptDurations[attemptNumber];
    setTimeLeft(duration);
    setProgress(0);
    
    return new Promise(async (resolve) => {
      try {
        const response = await login(credentials);
        if (response.success) {
          localStorage.setItem('isAuthenticated', 'true');
          onLogin();
          onClose();
          setCredentials({ email: '', password: '' });
          setLoading(false);
          setAttempt(0);
          resolve(true);
          return;
        }
      } catch (err) {
        // Continue with timer even if request fails
      }
      
      // Wait for the full duration
      const timer = setTimeout(() => {
        resolve(false);
      }, duration * 1000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAttempt(0);

    // Try each attempt sequentially
    for (let i = 0; i < attemptDurations.length; i++) {
      setAttempt(i);
      const success = await attemptLogin(i);
      if (success) return;
    }
    
    // All attempts failed
    setError('Server is taking too long to respond. Please try again later.');
    setLoading(false);
    setAttempt(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', color: '#0F766E', fontWeight: 'bold' }}>
        Login to Zam Zam Computers
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0F766E' }}>
              Activating Server...
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Attempt {attempt + 1} of 3 - {timeLeft}s remaining
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                mb: 2, 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': { bgcolor: '#0F766E' }
              }} 
            />
            <Typography variant="body2" color="text.secondary">
              Free server is starting up. Please wait...
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#0F766E', 
                '&:hover': { bgcolor: '#134E4A' },
                py: 1.5
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
