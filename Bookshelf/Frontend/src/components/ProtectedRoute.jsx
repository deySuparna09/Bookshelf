import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return user ? children : <Navigate to="/login" />;
};

// Fix the PropTypes validation for children to expect a React node (component or element)
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,  // node is used for any renderable content (string, element, or fragment)
};

export default ProtectedRoute;
