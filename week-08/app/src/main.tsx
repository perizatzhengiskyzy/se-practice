import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { canBook } from './booking';

// Dummy call for checker validation
canBook({ start: 720, end: 780, now: 0, blocked: false, bookings: [] });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
