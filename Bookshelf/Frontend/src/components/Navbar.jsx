import {Link} from 'react-router-dom';
import { useEffect,useState } from 'react';
function Navbar() {
    const [sticky, setSticky] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <>
    <div className={`p-4 ${sticky ? "sticky-navbar fixed top-0 left-0 w-full shadow-md bg-base-200 dark:bg-slate-700 dark:text-white transition-all duration-300 ease-in-out" : "bg-gray-800"
            }`}>
      <nav className="flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Bookshelf</h1>
        <div>
          <Link to="/" className="text-white mr-4">Home</Link>
          <Link to="/dashboard" className="text-white mr-4">Dashboard</Link>
          <Link to="/bookshelf" className="text-white mr-4">My Bookshelf</Link>
          <Link to="/auth" className="text-white">Login/Register</Link>
        </div>
      </nav>
    </div>
    </>
  );
};

export default Navbar;
