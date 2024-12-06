import { useState, useEffect } from 'react';
import { FaChartLine, FaRegFolderOpen, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={`p-4 z-50 ${
          sticky
            ? "fixed top-0 left-0 w-full shadow-md bg-base-200 dark:bg-slate-700 dark:text-white transition-all duration-300 ease-in-out"
            : "bg-gray-800"
        }`}
      >
        <nav className="flex justify-between items-center">
          <h1 className="text-white text-lg font-bold flex items-center gap-2">
            <span role="img" aria-label="bookshelf-icon" style={{ fontSize: '24px' }}>📚</span> Bookshelf
          </h1>
          {/* Hamburger icon for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          {/* Desktop navbar links */}
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
          </div>
        </nav>
      </div>
      
      {/* Mobile menu (sidebar) */}
      <div
        className={`fixed top-0 right-0 max-w-max bg-gray-800 text-white  z-40 transition-transform transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
        </div>
      </div>

      {/* Spacer div to prevent overlap */}
      {sticky && <div style={{ height: '64px' }} />} {/* Adjust based on your navbar height */}
    </>
  );
}

export default Navbar;
