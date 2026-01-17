import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getProfile } from '../utils/api';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Verify token and get user info
          const response = await getProfile();
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { token: newToken, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      const { token: newToken, user: createdUser } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(createdUser);
      
      return { success: true, user: createdUser };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};