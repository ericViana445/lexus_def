import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Elemento com id 'root' não encontrado no HTML.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
