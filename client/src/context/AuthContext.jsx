import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (token && role && username) {
      setUser({ token, role, username });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      document.body.setAttribute('data-role', role);
    } else {
      document.body.setAttribute('data-role', 'Student');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('https://sms-server-s2nt.onrender.com/api/auth/login', { username, password });
      const { token, role, username: u } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', u);
      
      setUser({ token, role, username: u });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      document.body.setAttribute('data-role', role);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const googleLogin = async (credential) => {
    try {
      const res = await axios.post('https://sms-server-s2nt.onrender.com/api/auth/google-login', { credential });
      const { token, role, username: u } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', u);
      
      setUser({ token, role, username: u });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      document.body.setAttribute('data-role', role);
      return true;
    } catch (error) {
      console.error('Google Login failed', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
