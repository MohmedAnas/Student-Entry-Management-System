import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DataEntryForm from './components/DataEntryForm';
import ViewList from './components/ViewList';
import About from './components/About';
import Contact from './components/Contact';
import ThreeBackground from './components/ThreeBackground';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F766E',
    },
    secondary: {
      main: '#06B6D4',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setCurrentPage('Home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'Add Entry':
        return isAuthenticated ? <DataEntryForm /> : <Home setCurrentPage={setCurrentPage} />;
      case 'View List':
        return isAuthenticated ? <ViewList /> : <Home setCurrentPage={setCurrentPage} />;
      case 'About':
        return <About />;
      case 'Contact':
        return <Contact />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThreeBackground />
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      {renderPage()}
    </ThemeProvider>
  );
}

export default App;
