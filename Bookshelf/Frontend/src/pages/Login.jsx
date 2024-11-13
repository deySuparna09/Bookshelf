import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
//import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(email,password);
      navigate('/bookshelf');
    
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    alert('Login failed: ' + (error.response?.data?.message || 'Please try again.'));
  }
};

const handleSocialLogin = async (provider) => {
    try {
      // Redirect to the backend authentication route (Google or GitHub)
      window.location.href = `/api/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} login failed:`, error.message);
      alert(`${provider} login failed: ${error.message}`);
    }
  };


  return (
    <>
    <div className=" mt-7 login-container p-8 text-center items-center justify-center">
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
      <button onClick={() => handleSocialLogin('google')} className="btn-google mr-5 px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">
        Google
      </button>
      <button onClick={() => handleSocialLogin('github')} className="btn-github px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">
        GitHub
      </button>

    </div>
    </>
  );
};

export default Login;  


