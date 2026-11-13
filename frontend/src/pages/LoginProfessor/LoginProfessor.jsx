import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../services/api';
import './LoginProfessor.css';

export const LoginProfessor = () => {
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
      if (data.perfil === 'ROLE_GESTAO') navigate('/dashboard/coordenador');
      else if (data.perfil === 'ROLE_PROFESSOR') navigate('/dashboard/professor');
      else navigate('/dashboard/aluno');
    } catch (err) {
      setErrorMessage(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemoProf = () => {
    setEmail('carlos.santos@sanquim.br');
    setPassword('prof123');
    setErrorMessage('');
  };

  const autofillDemoGestao = () => {
    setEmail('admin@sanquim.br');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div className="st-auth-shell login-prof-container">
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
          <span className="st-badge st-badge-info">
            <i className="fas fa-chalkboard-teacher"></i> Corpo Docente &amp; Secretaria
          </span>
          <h2>Portal do Professor &amp; Gestão</h2>
          <p>Acesso restrito ao corpo docente e equipe de coordenação</p>
        </div>

        {errorMessage && (
          <div className="st-alert st-alert-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="st-demo-box">
          <span>
            <i className="fas fa-bolt"></i> <strong>Acesso Rápido para Avaliação:</strong>
          </span>
          <div className="demo-btns-group">
            <button type="button" onClick={autofillDemoProf} className="st-btn st-btn-primary st-btn-sm">
              <i className="fas fa-chalkboard-teacher"></i> Prof. Carlos
            </button>
            <button type="button" onClick={autofillDemoGestao} className="st-btn st-btn-amber st-btn-sm">
              <i className="fas fa-user-shield"></i> Coordenação
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="st-form">
          <div className="st-field">
            <label htmlFor="email">E-mail Institucional</label>
            <div className="st-input-icon">
              <i className="fas fa-envelope"></i>
              <input
                id="email"
                type="text"
                className="st-input"
                placeholder="nome@sanquim.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="st-field">
            <label htmlFor="password">Senha</label>
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

          <button type="submit" className="st-btn st-btn-primary st-btn-block" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Autenticando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Acessar Painel
              </>
            )}
          </button>
        </form>

        <div className="st-auth-footer">
          <span>
            É aluno? <Link to="/login-aluno">Acesse a Área do Aluno</Link>
          </span>
          <span>
            Deseja ser professor voluntário? <Link to="/cadastro-professor">Cadastre-se aqui</Link>
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

export default LoginProfessor;
