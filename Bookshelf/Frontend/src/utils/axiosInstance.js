import axios from 'axios';

// Function to get the token from localStorage
const getAccessToken = () => localStorage.getItem('token');

// Create axios instance
const axiosInstance = axios.create({
  baseURL:  import.meta.env.REACT_APP_API_URL ||'http://localhost:5000',  // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    console.log('Access token in request:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh when access token expires

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Trying to refresh token...');
        const refreshToken = localStorage.getItem('refreshToken'); 
        console.log('Refresh token:', refreshToken); // Get refresh token from local storage
        const res = await axios.post('http://localhost:5000/api/auth/refreshToken', { token: refreshToken });
        console.log('New access token:', res.data.accessToken);

        // Store new tokens
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return axiosInstance(originalRequest); // Retry with new access token
      } catch (err) {
        console.error('Refresh token failed: ', err);
        // Handle logout or session expiration here
      }
    }
    return Promise.reject(error);
  }
);



export default axiosInstance;
