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
      if (data.perfil === 'ROLE_ALUNO') {
        navigate('/dashboard/aluno');
      } else if (data.perfil === 'ROLE_GESTAO') {
        navigate('/dashboard/coordenador');
      } else {
        navigate('/dashboard/professor');
      }
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
    <div className="login-aluno-container">
      <div className="login-aluno-card">
        <div className="login-aluno-header">
          <div className="logo-box" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-text">Studi<i>+</i></span>
          </div>
          <h2>Portal do Aluno</h2>
          <p>Consulte seu boletim escolar, frequência e conteúdos das aulas</p>
        </div>

        {errorMessage && (
          <div className="error-alert">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}

        <div className="demo-fill-box">
          <span>Teste Rápido:</span>
          <button type="button" onClick={autofillDemoAluno} className="btn-demo-autofill">
            <i className="fas fa-magic"></i> Preencher Aluno de Teste (João Silva)
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail ou Usuário</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                id="email"
                type="text"
                placeholder="exemplo@sanquim.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha de Acesso</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/esqueci-senha" className="link-forgot">Esqueceu a senha?</Link>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Autenticando...</> : <><i className="fas fa-sign-in-alt"></i> Entrar na Plataforma</>}
          </button>
        </form>

        <div className="login-aluno-footer">
          <p>É professor ou coordenador? <Link to="/login-professor">Acesse a Área Docente</Link></p>
          <p><Link to="/"><i className="fas fa-arrow-left"></i> Voltar à Página Inicial</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginAluno;
