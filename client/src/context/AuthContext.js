import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    setSession(t, u);
    return u;
  };

  const register = async (data) => {
    const res = await axios.post('/api/auth/register', data);
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
