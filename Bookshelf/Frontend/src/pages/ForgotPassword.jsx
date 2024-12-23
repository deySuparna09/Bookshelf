import { useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ThemeContext } from "../components/ThemeContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email });
      setMessage("If the email exists, a reset link has been sent.");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setMessage("Error sending reset email.");
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
    >
      <div
        className={`shadow-md rounded-lg p-8 w-full max-w-sm ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} mb-1`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
