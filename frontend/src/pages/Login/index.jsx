import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import '../../assets/styles/auth.css';

const Login = () => {
  const { login, authenticated, loading: contextLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!contextLoading && authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !senha) {
      return setError('Preencha e-mail e senha.');
    }

    setLoading(true);
    const result = await login(email, senha);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Moon Finance</h2>
        <p className="auth-subtitle">Faça login para continuar</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="auth-input"
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="auth-button"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-footer-text">
          Novo por aqui? <a href="/register" className="auth-link">Crie uma conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
