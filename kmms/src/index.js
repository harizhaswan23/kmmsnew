import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { KMMSProvider } from './context/KMMSContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <KMMSProvider>
      <App />
    </KMMSProvider>
  </React.StrictMode>
);
