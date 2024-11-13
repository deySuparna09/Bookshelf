import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';  // Ensure this import path is correct
import { Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
console.log(import.meta.env.VITE_GOOGLE_BOOKS_API_KEY);

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();  // Get current authenticated user
  const navigate = useNavigate();

  // Fetch books whenever the user is available
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/book', {
          headers: { Authorization: `Bearer ${token}` },  // Send token for user-specific books
        });
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    // Call fetchBooks only if the user is authenticated
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`
      );
      
      setSearchResults(res.data.items || []);
    } catch (error) {
      console.error('Error searching for books:', error);
    }
  };

  const addToBookshelf = async (book) => {
    try {
      const bookData = {
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        description: book.volumeInfo.description,
        thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/book', bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Book added to your bookshelf!');
    } catch (error) {
      console.error('Error adding book:', error.response || error);
    }
  };

  const handleLogout = () => {
    // Clear tokens from localStorage or sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Redirect to login page
    navigate('/login');
  };

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
    <div className="text-center items-center justify-center ">
      <h1 className="font-bold mt-3">My Bookshelf</h1>

      {/* Search for books */}
      <div>
        <input id="text"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="input w-80 py-1 px-3 border rounded-md outline-none"
        />
        <button onClick={handleSearch} className="px-2 py-2 bg-black text-white mt-6 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">Search</button>
      </div>

      {/* Display search results */}
      {searchResults && searchResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.map((book) => (
            <div key={book.id}>
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
              />
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
              <button onClick={() => addToBookshelf(book)} className="px-2 py-2 bg-black text-white mt-3 rounded-md cursor-pointer">Add to Bookshelf</button>
            </div>
          ))}
        </div>
      )}

      {/* Display books in the bookshelf */}
      <div>
        <h3 className="mt-2 text-blue-500 font-medium">Books in Your Bookshelf :</h3>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id}>
              <img src={book.thumbnail} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.authors?.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No books in your bookshelf yet.</p>
        )}
      </div>
      <button onClick={handleLogout} className="logout-button px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer">
        Logout
      </button>
    </div>
    </>
  );
};

export default Bookshelf;





