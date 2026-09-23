import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@MoonFinance:user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user session, removing corrupted data.");
        localStorage.removeItem('@MoonFinance:user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('@MoonFinance:user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@MoonFinance:user');
  };

  const login = async (email, senha) => {
    const { data } = await apiFetch('/routes/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    if (data.success) {
      loginUser(data.data);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const register = async (nome, email, senha) => {
    const { data } = await apiFetch('/routes/cadastrar.php', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    });

    if (data.success) {
      loginUser(data.data);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  return (
    <AuthContext.Provider value={{ 
      authenticated: !!user, 
      user, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
