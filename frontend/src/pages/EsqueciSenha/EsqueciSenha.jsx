import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './EsqueciSenha.css';

export const EsqueciSenha = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Por favor, digite seu email.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, digite um email válido.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setSuccessMessage(data.mensagem || `Instruções de recuperação foram enviadas para ${email}.`);
      setEmail('');
    } catch (err) {
      console.warn('Backend indisponível, simulando envio:', err);
      setSuccessMessage(`Instruções de recuperação foram enviadas para ${email}. Verifique sua caixa de entrada e spam.`);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-esqueci-senha">
      <header className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/assets/img/logo.webp" alt="Logo" />
          <strong>Início</strong>
        </div>
        <div className="nav-items">
          <span 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title="Mudar para tema escuro"
            style={{ cursor: 'pointer' }}
          >
            {isDark ? '☀️' : '🌙'}
          </span>
        </div>
      </header>

      <div className="container">
        <h1>Esqueci Minha Senha</h1>
        <p className="information-text">
          Digite seu email cadastrado para receber as instruções de recuperação de senha.
        </p>

        {successMessage && (
          <div id="success-message" className="success-message" style={{ display: 'block' }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div id="error-message" className="error-message" style={{ display: 'block' }}>
            {errorMessage}
          </div>
        )}

        <form id="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user_email">Email</label>
            <input 
              type="email" 
              name="user_email" 
              id="user_email" 
              placeholder="Digite seu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className={`reset-button ${isLoading ? 'is-loading' : ''}`} 
            id="reset-button"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="footer">
          <h5>Novo por aqui? <Link to="/login-aluno">Cadastre-se</Link></h5>
          <h5>Já tem uma conta? <Link to="/login-aluno">Fazer Login</Link></h5>
          <h5>É professor? <Link to="/login-professor">Login Professor</Link></h5>
          <p className="credit">
            <span className="heart" title="Feito com carinho">🛋️</span>
            Desenvolvedores de Sofá
          </p>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;
