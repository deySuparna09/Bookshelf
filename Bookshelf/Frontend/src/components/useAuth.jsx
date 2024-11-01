import { useContext } from 'react';
import AuthContext from './AuthContext'; // Adjust the import path based on your folder structure

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);