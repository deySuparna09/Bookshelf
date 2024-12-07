import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { FaGithub } from 'react-icons/fa'; // GitHub logo icon
import { ThemeContext } from '../components/ThemeContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/bookshelf');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
      console.error('Registration failed:', error);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} login failed:`, error.message);
      alert(`${provider} login failed: ${error.message}`);
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div
        className={`login-container p-8 text-center shadow-md rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">Register</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-left text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-80 py-2 px-3 border rounded-md outline-none dark:text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-80 py-2 px-3 border rounded-md outline-none dark:text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-left text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-80 py-2 px-3 border rounded-md outline-none dark:text-black"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer w-full sm:w-80"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm mb-3">Or continue with:</p>
          <div
            onClick={() => handleSocialLogin('github')}
            className="cursor-pointer flex justify-center items-center mt-3"
          >
            <FaGithub
              size={40}
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } hover:${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              } transition duration-300`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

