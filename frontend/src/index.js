// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/animations.css';
import './styles/global.css';
import './index.css';
import './i18n/i18n';  // Internationalisation configuration
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);