import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

function GitHubCallback() {
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const user = params.get("user")
      ? JSON.parse(decodeURIComponent(params.get("user")))
      : null;
    if (token && refreshToken && user) {
      handleOAuthCallback(token, refreshToken, user);
      navigate("/bookshelf");
    } else {
      console.error("Failed to retrieve login data");
      navigate("/login");
    }
  }, [navigate]);
  return <p>Processing GitHub login...</p>;
}

export default GitHubCallback;
