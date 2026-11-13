import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../services/api';
import './LoginAluno.css';

export const LoginAluno = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await authApi.login(email, password);
      if (data.perfil === 'ROLE_ALUNO') navigate('/dashboard/aluno');
      else if (data.perfil === 'ROLE_GESTAO') navigate('/dashboard/coordenador');
      else navigate('/dashboard/professor');
    } catch (err) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemoAluno = () => {
    setEmail('joao.silva@sanquim.br');
    setPassword('aluno123');
    setErrorMessage('');
  };

  return (
    <div className="st-auth-shell login-aluno-container">
      <div className="st-auth-topbar">
        <div className="st-logo" onClick={() => navigate('/')}>
          <div className="st-logo-mark">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="st-logo-text">
            Studi<i>+</i>
          </span>
        </div>
        <button
          type="button"
          className="st-theme-btn"
          onClick={toggleTheme}
          title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>
      </div>

      <div className="st-auth-card">
        <div className="st-auth-header">
          <span className="st-badge st-badge-success">
            <i className="fas fa-user-graduate"></i> Área Discente
          </span>
          <h2>Portal do Aluno</h2>
          <p>Consulte seu boletim escolar, frequência, calendário e aulas</p>
        </div>

        {errorMessage && (
          <div className="st-alert st-alert-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="st-demo-box">
          <span>
            <i className="fas fa-magic"></i> <strong>Teste Rápido:</strong>
          </span>
          <div className="st-demo-actions">
            <button type="button" onClick={autofillDemoAluno} className="st-btn st-btn-emerald st-btn-sm st-btn-block">
              Preencher Aluno de Teste (João Silva)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="st-form">
          <div className="st-field">
            <label htmlFor="email">E-mail ou Usuário</label>
            <div className="st-input-icon">
              <i className="fas fa-envelope"></i>
              <input
                id="email"
                type="text"
                className="st-input"
                placeholder="exemplo@sanquim.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="st-field">
            <label htmlFor="password">Senha de Acesso</label>
            <div className="st-input-icon">
              <i className="fas fa-lock"></i>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="st-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="st-eye-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Mostrar ou ocultar senha"
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
              </button>
            </div>
          </div>

          <div className="forgot-row">
            <Link to="/esqueci-senha">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className="st-btn st-btn-emerald st-btn-block" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Autenticando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Entrar na Plataforma
              </>
            )}
          </button>
        </form>

        <div className="st-auth-footer">
          <span>
            É professor ou coordenador? <Link to="/login-professor">Acesse a Área Docente</Link>
          </span>
          <span>
            <Link to="/">
              <i className="fas fa-arrow-left"></i> Voltar à Página Inicial
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginAluno;
