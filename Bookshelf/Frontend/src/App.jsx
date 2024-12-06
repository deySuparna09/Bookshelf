import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Bookshelf from './components/Bookshelf';
import Dashboard from './components/Dashboard';
import BookDetails from './components/BookDetails'; 
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
//import ShareBook from "./components/ShareBook";
import ViewSharedBook from "./components/ViewSharedBook";
//import Auth from './components/Auth'; // Assuming you still need this for handling authentication
import ProtectedRoute from './components/ProtectedRoute';
import GitHubCallback from './components/GitHubCallback';
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
        <Route path="/github/callback" element={<GitHubCallback />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/book/:id" element={<BookDetails />} /> 

        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route path="/share/:bookId" element={<ViewSharedBook />} />
            
      </Routes>
    </Router>
    </>
  );
};

export default App;


