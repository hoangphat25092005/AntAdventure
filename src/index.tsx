import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ updated import
import App from './App';
import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root')!); // ✅ createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);