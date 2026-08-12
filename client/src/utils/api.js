import axios from 'axios';

// Production backend (Render). Update here if the Render URL ever changes.
const RENDER_URL = 'https://votewise-india.onrender.com';

// Priority:
// 1. REACT_APP_API_URL env var, if explicitly set (e.g. on Vercel)
// 2. localhost:5001, automatically, when running `npm start` locally
// 3. RENDER_URL, as the production fallback for any other build
const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : RENDER_URL);

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('vw_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// NOTE: No response interceptor here on purpose — each caller handles
// its own .catch() so login failures, fallback data, etc. work correctly.

export default api;
