import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const navigate = useNavigate();
  const{login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);  // Use login function
      navigate('/bookshelf');  // Navigate after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      navigate('/bookshelf'); // Navigate to the dashboard after registration
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
    }
  };

  return (
    <>
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <div>
            <label htmlFor="username">Username</label>
            <input id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
    </>
  );
};

export default Auth;
