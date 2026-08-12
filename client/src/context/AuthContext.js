import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';


// Demo users - work even when backend is offline
const DEMO_USERS = [
  { id:'u1', fullName:'Rahul Sharma', email:'citizen@votewise.in',   password:'password', role:'citizen'   },
  { id:'u2', fullName:'Arjun Patel',  email:'candidate@votewise.in', password:'password', role:'candidate' },
  { id:'u3', fullName:'Priya Nair',   email:'employee@votewise.in',  password:'password', role:'employee'  },
  { id:'u4', fullName:'Admin User',   email:'admin@votewise.in',     password:'password', role:'admin'     },
];

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vw_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const stored = localStorage.getItem('vw_user');
      if (stored) { setUser(JSON.parse(stored)); }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token: t, user: u } = res.data;
      setSession(t, u);
      return u;
    } catch (err) {
      // Fallback: try demo users if backend unreachable
      const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (demo) {
        const fakeToken = btoa(JSON.stringify({ id: demo.id, role: demo.role }));
        const { password: _, ...safe } = demo;
        setSession(fakeToken, safe);
        return safe;
      }
      throw err;
    }
  };

  const register = async (data) => {
    const res = await api.post('/api/auth/register', data);
    const { token: t, user: u } = res.data;
    setSession(t, u);
    return u;
  };

  // Used by both normal login/register AND OAuth callback
  const setSession = (t, u) => {
    localStorage.setItem('vw_token', t);
    localStorage.setItem('vw_user', JSON.stringify(u));
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t); setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('vw_token');
    localStorage.removeItem('vw_user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}
