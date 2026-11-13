import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authApi } from '../../services/api';
import './EsqueciSenha.css';

export const EsqueciSenha = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Por favor, digite seu e-mail.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setErrorMessage('Por favor, digite um e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authApi.esqueciSenha(email.trim());
      setSuccessMessage(
        data?.mensagem || `Instruções de recuperação foram enviadas para ${email.trim()}.`
      );
      setEmail('');
    } catch (err) {
      setErrorMessage(
        err?.message || 'Não foi possível enviar as instruções. Tente novamente em instantes.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="st-auth-shell page-esqueci-senha">
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
            <i className="fas fa-key"></i> Recuperação de Acesso
          </span>
          <h2>Esqueci Minha Senha</h2>
          <p>Informe seu e-mail cadastrado para receber as instruções de recuperação.</p>
        </div>

        {successMessage && (
          <div className="st-alert st-alert-success" id="success-message" role="status">
            <i className="fas fa-check-circle"></i>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="st-alert st-alert-error" id="error-message" role="alert">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <form id="forgot-password-form" onSubmit={handleSubmit} className="st-form" noValidate>
          <div className="st-field">
            <label htmlFor="user_email">E-mail cadastrado</label>
            <div className="st-input-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="user_email"
                id="user_email"
                className="st-input"
                placeholder="exemplo@sanquim.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="st-btn st-btn-emerald st-btn-block"
            id="reset-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Enviar Link de Recuperação
              </>
            )}
          </button>
        </form>

        <div className="st-auth-footer">
          <span>
            Lembrou a senha? <Link to="/login-aluno">Fazer Login</Link>
          </span>
          <span>
            É professor? <Link to="/login-professor">Acesse a Área Docente</Link>
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

export default EsqueciSenha;
