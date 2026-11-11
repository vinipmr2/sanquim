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
      if (data.perfil === 'ROLE_GESTAO') {
        navigate('/dashboard/coordenador');
      } else if (data.perfil === 'ROLE_PROFESSOR') {
        navigate('/dashboard/professor');
      } else {
        navigate('/dashboard/aluno');
      }
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
    <div className="login-prof-container">
      <div className="login-prof-card">
        <div className="login-prof-header">
          <div className="logo-box" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-text">Studi<i>+</i></span>
          </div>
          <h2>Portal do Professor & Gestão</h2>
          <p>Acesso restrito ao corpo docente e equipe de coordenação</p>
        </div>

        {errorMessage && (
          <div className="error-alert">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}

        <div className="demo-fill-box">
          <span>Acesso Rápido para Avaliação:</span>
          <div className="demo-btns-group">
            <button type="button" onClick={autofillDemoProf} className="btn-demo-autofill prof">
              <i className="fas fa-chalkboard-teacher"></i> Prof. Carlos (ROLE_PROFESSOR)
            </button>
            <button type="button" onClick={autofillDemoGestao} className="btn-demo-autofill gestao">
              <i className="fas fa-user-shield"></i> Coordenação (ROLE_GESTAO)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail Institucional</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                id="email"
                type="text"
                placeholder="nome@sanquim.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
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
            {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Autenticando...</> : <><i className="fas fa-sign-in-alt"></i> Acessar Painel</>}
          </button>
        </form>

        <div className="login-prof-footer">
          <p>É aluno? <Link to="/login-aluno">Acesse a Área do Aluno</Link></p>
          <p>Deseja ser professor voluntário? <Link to="/cadastro-professor">Cadastre-se aqui</Link></p>
          <p><Link to="/"><i className="fas fa-arrow-left"></i> Voltar à Página Inicial</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginProfessor;
