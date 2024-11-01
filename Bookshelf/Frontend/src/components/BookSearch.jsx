import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${import.meta.env.VITE_GOOGLE_BOOKS_API_KEY}`);
      setResults(response.data.items);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  return (
    <>
    <div className="book-search-container">
      <input id="text"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books..."
        className="input"
      />
      <button onClick={handleSearch} className="btn-primary">Search</button>

      {results && results.length > 0 && (
        <div className="search-results">
          {results.map((book) => (
            <div key={book.id} className="book-item">
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BookSearch;
