import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        resetToken: token,
        newPassword,
      });
      setMessage("Password has been reset successfully.");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
