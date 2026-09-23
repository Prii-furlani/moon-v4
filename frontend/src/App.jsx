import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <div style={{ color: '#D8C5A8', textAlign: 'center', marginTop: '50px' }}>
                <h2>Bem-vindo ao Dashboard Moon Finance!</h2>
                <p>Módulo de controle financeiro a ser implementado aqui.</p>
              </div>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
