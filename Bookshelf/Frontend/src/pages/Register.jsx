import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/bookshelf');
    } catch (error) {
      // Handle error
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className=" mt-7 register-container p-8 text-center items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Register</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="username">Username</label>
          <input id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input w-80 py-1 px-3 border rounded-md outline-none"
          />
        </div>
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
        <button type="submit" className="btn-primary px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Register</button>
      </form>
    </div>
  );
};

export default Register;

