import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Assuming your axios instance is in src/api.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Basic token decode to get user info (not for validation)
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
        setAuth(true);
      } catch (error) {
        localStorage.removeItem('token');
        setAuth(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', credentials); // Your backend login endpoint
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
      setAuth(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || 'Login failed');
      setAuth(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/register', userData); // Your backend register endpoint
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
      setAuth(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error.response?.data?.msg || 'Registration failed');
      setAuth(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    // No navigation here, as logout might be called from various components
    // Navigation should happen in the component that triggers logout
  };

  const value = { auth, user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};