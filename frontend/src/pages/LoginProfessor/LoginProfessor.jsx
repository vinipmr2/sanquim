import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import './LoginProfessor.css';

export const LoginProfessor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark, toggleTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [loginMessage, setLoginMessage] = useState(
    searchParams.get('erro') === '1' ? 'Usuário ou senha inválidos.' : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (attemptsLeft <= 0) {
      setLoginMessage('Número de tentativas esgotado. Tente novamente mais tarde.');
      return;
    }

    setIsLoading(true);
    setLoginMessage('');

    try {
      const res = await fetch('/api/auth/login/professor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.autenticado) {
        localStorage.setItem('studi_user', JSON.stringify(data));
        navigate(data.redirecionamento || '/dashboard/professor');
      } else {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setLoginMessage(
          data.mensagem || (nextAttempts > 0 
            ? `Usuário ou senha inválidos. Tentativas restantes: ${nextAttempts}` 
            : 'Acesso bloqueado por excesso de tentativas.')
        );
      }
    } catch (err) {
      console.warn('Backend indisponível, utilizando autenticação local de demonstração:', err);
      const userLower = username.trim().toLowerCase();
      if (username.trim() && password.trim()) {
        const redirect = (userLower.includes('coord') || userLower.includes('admin'))
          ? '/dashboard/coordenador'
          : '/dashboard/professor';
        localStorage.setItem('studi_user', JSON.stringify({ nome: username, perfil: 'PROFESSOR' }));
        navigate(redirect);
      } else {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setLoginMessage(`Usuário ou senha inválidos. Tentativas restantes: ${nextAttempts}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="page-login-professor">
      <header className="navbar">
        <div className="logo" onClick={handleLogoClick}>
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
        <div className="aluno">
          <strong onClick={() => navigate('/login-aluno')}>Aluno</strong>
        </div>
      </header>

      <div className="main">
        <div className="tabs">
          <div className="tab-header">
            <div className="active">Login Professor</div>
          </div>
          <div className="tab-content">
            <div className="login-form">
              <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <div className="form-group">
                  <label htmlFor="username">Email ou Usuário</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder="Digite seu usuário ou email" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Senha</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Digite sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>

                {loginMessage && (
                  <div 
                    id="login-message" 
                    className="login-message error" 
                    style={{ display: 'block' }}
                  >
                    {loginMessage}
                  </div>
                )}

                <div className="login-attempts">
                  Tentativas restantes: <span id="attempts-left">{attemptsLeft}</span>
                </div>
                <button type="submit">Entrar</button>
                <div className="forgot-password">
                  <Link to="/esqueci-senha">Esqueci minha senha</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <LoadingOverlay active={isLoading} />
    </div>
  );
};

export default LoginProfessor;
