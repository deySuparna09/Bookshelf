import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    if (response.status === 200) {
      // Store access and refresh tokens only on successful login
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log('Access Token:', localStorage.getItem('token'));
      console.log('Refresh Token:', localStorage.getItem('refreshToken'));
      // Update user state if necessary
      navigate('/bookshelf');
    } else {
      console.warn('Unexpected response status:', response.status);
      throw new Error('Login failed. Please try again.');
    }
    
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    alert('Login failed: ' + (error.response?.data?.message || 'Please try again.'));
  }
};


  return (
    <>
    <div className="login-container p-8 text-center items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input w-80 py-1 px-3 border rounded-md outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input w-80 py-1 px-3 border rounded-md outline-none"
          />
        </div>
        <button type="submit" className="btn-primary px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Login</button>
      </form>
    </div>
    </>
  );
};

export default Login;  


