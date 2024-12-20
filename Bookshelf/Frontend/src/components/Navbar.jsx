import { useState, useContext } from "react";
import {
  FaChartLine,
  FaRegFolderOpen,
  FaHome,
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation(); // Get the current location

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Function to check if the link is active
  const isActive = (path) =>
    location.pathname === path ? "text-green-500" : "text-white"; // Default to white text for inactive links

  return (
    <>
      {/* Navbar Container */}
      <div
        className={`p-4 z-50 fixed top-0 left-0 w-full shadow-md ${
          theme === "dark"
            ? "bg-slate-700 text-white"
            : "bg-gray-800 text-white"
        }`}
      >
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <h1
            className="text-white text-lg font-bold flex items-center gap-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: "700",
              fontSize: "1.5rem",
              lineHeight: "1.2",
            }}
          >
            <span
              role="img"
              aria-label="bookshelf-icon"
              style={{ fontSize: "24px" }}
            >
              📚
            </span>
            BookHaven
          </h1>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className={`flex items-center gap-2 ${isActive("/")}`}>
              <FaHome style={{ color: "#4caf50" }} /> HOME
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 ${isActive("/dashboard")}`}
            >
              <FaChartLine style={{ color: "#ff9800" }} /> DASHBOARD
            </Link>
            <Link
              to="/bookshelf"
              className={`flex items-center gap-2 ${isActive("/bookshelf")}`}
            >
              <FaRegFolderOpen style={{ color: "#03a9f4" }} /> MY BOOKSHELF
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700"
            >
              <span
                className={`transform transition-transform duration-300 ease-in-out ${
                  theme === "dark" ? "translate-x-6" : ""
                }`}
                style={{
                  width: "18px",
                  height: "18px",
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                }}
              />
              <FaSun className="absolute left-1 text-yellow-500 text-xs" />
              <FaMoon className="absolute right-1 text-gray-800 text-xs" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-gray-800 text-white z-40 transition-transform transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } dark:bg-gray-900`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">📚 BookHaven</h1>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white"
          >
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link
            to="/"
            className={`flex items-center gap-2 ${isActive("/")}`}
            onClick={handleLinkClick}
          >
            <FaHome style={{ color: "#4caf50" }} /> HOME
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 ${isActive("/dashboard")}`}
            onClick={handleLinkClick}
          >
            <FaChartLine style={{ color: "#ff9800" }} /> DASHBOARD
          </Link>
          <Link
            to="/bookshelf"
            className={`flex items-center gap-2 ${isActive("/bookshelf")}`}
            onClick={handleLinkClick}
          >
            <FaRegFolderOpen style={{ color: "#03a9f4" }} /> MY BOOKSHELF
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700"
          >
            <span
              className={`transform transition-transform duration-300 ease-in-out ${
                theme === "dark" ? "translate-x-6" : ""
              }`}
              style={{
                width: "18px",
                height: "18px",
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            />
            <FaSun className="absolute left-1 text-yellow-500 text-xs" />
            <FaMoon className="absolute right-1 text-gray-800 text-xs" />
          </button>
        </div>
      </div>

      {/* Spacer to Prevent Content Overlap */}
      <div style={{ height: "64px" }} />
    </>
  );
}

export default Navbar;
