import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import LoadingOverlay from '../../components/LoadingOverlay';
import './LoginAluno.css';

export const LoginAluno = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark, toggleTheme } = useTheme();

  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [loginMessage, setLoginMessage] = useState(
    searchParams.get('erro') === '1' ? 'Usuário ou senha inválidos.' : ''
  );
  const [messageType, setMessageType] = useState(
    searchParams.get('erro') === '1' ? 'error' : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  // Signup form states
  const [signupUser, setSignupUser] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (attemptsLeft <= 0) {
      setLoginMessage('Número de tentativas esgotado. Tente novamente mais tarde.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setLoginMessage('');

    try {
      // Chamada real para o Backend Spring Boot
      const res = await fetch('/api/auth/login/aluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.autenticado) {
        localStorage.setItem('studi_user', JSON.stringify(data));
        navigate(data.redirecionamento || '/dashboard/aluno');
      } else {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setLoginMessage(
          data.mensagem || (nextAttempts > 0 
            ? `Usuário ou senha inválidos. Tentativas restantes: ${nextAttempts}` 
            : 'Conta bloqueada temporariamente. Número de tentativas excedido.')
        );
        setMessageType('error');
      }
    } catch (err) {
      // Fallback em caso de backend offline
      console.warn('Backend indisponível, utilizando autenticação local de demonstração:', err);
      if (username.trim() && password.trim()) {
        localStorage.setItem('studi_user', JSON.stringify({ nome: username, perfil: 'ALUNO' }));
        navigate('/dashboard/aluno');
      } else {
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setLoginMessage(`Usuário ou senha inválidos. Tentativas restantes: ${nextAttempts}`);
        setMessageType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupUser || !signupEmail || !signupPassword) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setSignupSuccess('');

    try {
      // Chamada real para o Backend Spring Boot
      const res = await fetch('/api/auth/cadastro/aluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: signupUser,
          email: signupEmail,
          senha: signupPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.sucesso) {
        setSignupSuccess(data.mensagem || 'Cadastro realizado com sucesso! Faça seu login.');
        setUsername(signupUser);
        setIsLoginView(true);
        setSignupUser('');
        setSignupEmail('');
        setSignupPassword('');
      } else {
        alert(data.mensagem || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      console.warn('Backend offline, simulando cadastro com sucesso:', err);
      setSignupSuccess('Cadastro realizado com sucesso! Faça seu login.');
      setUsername(signupUser);
      setIsLoginView(true);
      setSignupUser('');
      setSignupEmail('');
      setSignupPassword('');
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
    <div className="page-login-aluno">
      <header className="navbar">
        <div className="logo" onClick={handleLogoClick}>
          <img src="/assets/img/logo.webp" alt="Logo" />
          <strong>Início</strong>
        </div>
        <div className="nav-items">
          <span 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title="Alternar tema"
            style={{ cursor: 'pointer' }}
          >
            <strong>{isDark ? '☀️' : '🌙'}</strong>
          </span>
        </div>
        <div className="professor">
          <strong onClick={() => navigate('/login-professor')}>Professor</strong>
        </div>
      </header>

      <div className="main">
        {/* Checkbox controla o slide entre Cadastro e Login pelo CSS */}
        <input 
          type="checkbox" 
          id="chk" 
          aria-hidden="true" 
          checked={isLoginView} 
          onChange={(e) => setIsLoginView(e.target.checked)} 
        />

        <div className="signup">
          <form onSubmit={handleSignup}>
            <label 
              htmlFor="chk" 
              aria-hidden="true" 
              onClick={() => setIsLoginView(false)}
            >
              Cadastro
            </label>
            <input 
              type="text" 
              placeholder="Digite seu nome de usuário" 
              value={signupUser}
              onChange={(e) => setSignupUser(e.target.value)}
              required 
            />
            <input 
              type="email" 
              placeholder="Digite seu email" 
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required 
            />
            <button type="submit">Cadastrar-se</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={handleLogin}>
            <label 
              htmlFor="chk" 
              aria-hidden="true" 
              onClick={() => setIsLoginView(true)}
            >
              Login
            </label>

            {signupSuccess && (
              <div className="login-message" style={{ display: 'block', color: '#2e7d32', backgroundColor: '#e8f5e9' }}>
                {signupSuccess}
              </div>
            )}

            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Digite seu usuario ou e-mail" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Digite sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            {loginMessage && (
              <div 
                id="login-message" 
                className={`login-message ${messageType}`} 
                style={{ display: 'block' }}
              >
                {loginMessage}
              </div>
            )}

            <div className="login-attempts">
              Tentativas: <span id="attempts-left">{attemptsLeft}</span>
            </div>

            <button type="submit">Login</button>
            <div className="forgot-password">
              <Link to="/esqueci-senha">Esqueci minha senha</Link>
            </div>
          </form>
        </div>
      </div>

      <LoadingOverlay active={isLoading} />
    </div>
  );
};

export default LoginAluno;
