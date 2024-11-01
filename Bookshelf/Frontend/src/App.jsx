import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bookshelf from './components/Bookshelf';
import Dashboard from './components/Dashboard';
import BookDetails from './components/BookDetails'; 
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register'; 
import Auth from './components/Auth'; // Assuming you still need this for handling authentication
import ProtectedRoute from './components/ProtectedRoute';
const App = () => {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route
          path="/bookshelf"
          element={
            <ProtectedRoute>
              <Bookshelf />
            </ProtectedRoute>
          }
        /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/book/:id" element={<BookDetails />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/auth" element={<Auth />} /> 
      </Routes>
    </Router>
    </>
  );
};

export default App;


