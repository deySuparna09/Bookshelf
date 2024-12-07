import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './components/AuthContext';
import ThemeProvider  from './components/ThemeContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
