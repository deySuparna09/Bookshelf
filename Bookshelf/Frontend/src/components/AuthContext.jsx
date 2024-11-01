import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import PropTypes from 'prop-types';


const AuthContext = createContext();

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info if token is available
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setLoading(true);
        try {
          const res = await axiosInstance.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching user data:', error.response ? error.response.data : error);
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
  try {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    if (res.status === 200) {
      // Store access and refresh tokens only on successful login
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      console.log('Access Token:', localStorage.getItem('token'));
      console.log('Refresh Token:', localStorage.getItem('refreshToken'));
      // Update user state if necessary
      setUser(res.data.user);
    } else {
      console.warn('Unexpected response status:', res.status);
      throw new Error('Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

  const value = { user, login, loading };

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};

// Prop Types for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,  // Use PropTypes.node to validate any renderable content
};

// Export the AuthContext
export default AuthContext;
