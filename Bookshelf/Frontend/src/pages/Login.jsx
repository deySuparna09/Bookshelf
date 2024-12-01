import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import { FaGithub } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/bookshelf');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login failed: ' + (error.response?.data?.message || 'Please try again.'));
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="login-container p-8 text-center bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-80 py-2 px-3 border rounded-md outline-none"
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
              className="w-80 py-2 px-3 border rounded-md outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer w-full sm:w-80"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Create a New Account
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm mb-3">Or continue with:</p>
          <div
            onClick={() => handleSocialLogin('github')}
            className="cursor-pointer flex justify-center items-center mt-3"
          >
            <FaGithub size={40} className="text-black hover:text-gray-700 transition duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



