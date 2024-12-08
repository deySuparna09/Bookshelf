import { useState, useContext } from 'react';
import { FaChartLine, FaRegFolderOpen, FaHome, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar Container */}
      <div
        className={`p-4 z-50 fixed top-0 left-0 w-full shadow-md ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-800 text-white'}`}
      >
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-white text-lg font-bold flex items-center gap-2">
            <span role="img" aria-label="bookshelf-icon" style={{ fontSize: '24px' }}>
              📚
            </span>
            Bookshelf
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
            <Link to="/" className="text-white flex items-center gap-2">
              <FaHome style={{ color: '#4caf50' }} /> Home
            </Link>
            <Link to="/dashboard" className="text-white flex items-center gap-2">
              <FaChartLine style={{ color: '#ff9800' }} /> Dashboard
            </Link>
            <Link to="/bookshelf" className="text-white flex items-center gap-2">
              <FaRegFolderOpen style={{ color: '#03a9f4' }} /> My Bookshelf
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700"
            >
              <span
                className={`transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : ''}`}
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
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
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } dark:bg-gray-900`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">📚 Bookshelf</h1>
          <button onClick={() => setMobileMenuOpen(false)} className="text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <Link to="/" className="text-white flex items-center gap-2" onClick={handleLinkClick}>
            <FaHome style={{ color: '#4caf50' }} /> Home
          </Link>
          <Link to="/dashboard" className="text-white flex items-center gap-2" onClick={handleLinkClick}>
            <FaChartLine style={{ color: '#ff9800' }} /> Dashboard
          </Link>
          <Link to="/bookshelf" className="text-white flex items-center gap-2" onClick={handleLinkClick}>
            <FaRegFolderOpen style={{ color: '#03a9f4' }} /> My Bookshelf
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-700"
          >
            <span
              className={`transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : ''}`}
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: '#fff',
                borderRadius: '50%',
              }}
            />
            <FaSun className="absolute left-1 text-yellow-500 text-xs" />
            <FaMoon className="absolute right-1 text-gray-800 text-xs" />
          </button>
        </div>
      </div>

      {/* Spacer to Prevent Content Overlap */}
      <div style={{ height: '64px' }} />
    </>
  );
}

export default Navbar;
