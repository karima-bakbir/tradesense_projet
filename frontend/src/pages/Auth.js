import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../utils/api';

const Auth = () => {
  const { t } = useAppContext();
  const { login, register, isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  
  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'login'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to make a simple request to the backend to check if it's reachable
        // We'll try to ping the server with a HEAD request to minimize data transfer
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('http://127.0.0.1:5000', {
          method: 'HEAD', // Use HEAD method to minimize data transfer
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        setIsCheckingConnection(false);
        
        // Don't set connection error if the server is just busy - just note that connection status is unknown
        // This prevents the scary error message from appearing
      } catch (err) {
        console.log('Connection check failed - server may not be running (this is OK during development)');
        setIsCheckingConnection(false);
        // Don't show error message, just set a subtle warning
        setConnectionError('connection-check-not-completed');
      }
    };
    
    checkConnection();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (!formData.username || !formData.email || !formData.password) {
      setError(t.requiredFields);
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsDontMatch);
      setLoading(false);
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setSuccess(t.registrationSuccess);
        setError('');
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Redirect to dashboard immediately after successful registration
        navigate('/dashboard');
      } else {
        // Show registration failure feedback
        console.error("Registration failed:", result.error);
        setError(result.error || "Registration failed");
        setSuccess("");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Registration error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.username || !formData.password) {
      setError(t.loginRequiredFields);
      setLoading(false);
      return;
    }
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      });

      if (result.success) {
        setSuccess(t.loginSuccess);
        setError('');
        // Redirect to dashboard immediately after successful login
        navigate('/dashboard');
      } else {
        // Show login failure feedback
        console.error("Login failed:", result.error);
        setError(result.error || "Invalid credentials");
        setSuccess("");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`${t.loginError}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {t.tradeSenseAuth}
          </Typography>
          
          {/* Connection status */}
          {isCheckingConnection && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Checking connection...
              </Typography>
            </Box>
          )}
          
          {connectionError && connectionError !== 'connection-check-not-completed' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {t.connectionWarning || 'Note: Backend server connection status unknown. Please ensure it is running on port 5000 if authentication fails.'}
              </Typography>
            </Alert>
          )}
          
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab value="register" label={t.register} />
            <Tab value="login" label={t.login} />
          </Tabs>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          {activeTab === 'register' ? (
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label={t.username}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={t.email}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={t.password}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={t.confirmPassword}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t.registering || 'Registering...'}
                  </>
                ) : (
                  t.register
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(e); }}>
              <TextField
                fullWidth
                label={t.username}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label={t.password}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t.loggingIn || 'Logging In...'}
                  </>
                ) : (
                  t.login
                )}
              </Button>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;