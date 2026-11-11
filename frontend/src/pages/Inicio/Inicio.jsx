import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { authStorage, authApi } from '../../services/api';
import './Inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    setUser(authStorage.getUser());

    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setCurrentDate(now.toLocaleDateString('pt-BR', dateOptions));
      setCurrentTime(now.toLocaleTimeString('pt-BR', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickLogin = async (email, senha, redirectUrl) => {
    try {
      setDemoLoading(true);
      await authApi.login(email, senha);
      navigate(redirectUrl);
    } catch (err) {
      alert('Erro no login de demonstração: ' + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    setUser(null);
  };

  return (
    <div className="page-inicio">
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/assets/img/logo.webp" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <strong>Studi<i>+</i></strong>
        </div>

        <div className="nav-items">
          <div className="datetime-info">
            <div className="current-date">{currentDate}</div>
            <div className="current-time">{currentTime}</div>
          </div>
          <a 
            href="/swagger-ui.html" 
            target="_blank" 
            rel="noreferrer" 
            className="swagger-link-btn"
            title="Acessar Documentação Viva Swagger OpenAPI 3"
          >
            <i className="fas fa-book-open"></i> Swagger API
          </a>
          <span 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title="Alternar tema claro/escuro"
            style={{ cursor: 'pointer' }}
          >
            <strong>{isDark ? '☀️' : '🌙'}</strong>
          </span>
        </div>

        <div className="login_cadastro">
          {user ? (
            <div className="user-logged-box">
              <span className="user-greeting">Olá, <strong>{user.nome?.split(' ')[0]}</strong> ({user.perfil?.replace('ROLE_', '')})</span>
              <button 
                className="dashboard-direct-btn"
                onClick={() => {
                  if (user.perfil === 'ROLE_GESTAO') navigate('/dashboard/coordenador');
                  else if (user.perfil === 'ROLE_PROFESSOR') navigate('/dashboard/professor');
                  else navigate('/dashboard/aluno');
                }}
              >
                Meu Painel
              </button>
              <button className="logout-direct-btn" onClick={handleLogout} title="Sair da conta">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <>
              <button className="login-btn aluno" onClick={() => navigate('/login-aluno')}>
                <i className="fas fa-user-graduate"></i> Aluno
              </button>
              <button className="login-btn professor" onClick={() => navigate('/login-professor')}>
                <i className="fas fa-chalkboard-teacher"></i> Docente / Gestão
              </button>
            </>
          )}
        </div>
      </header>

      <main className="inicio-main-container">
        {/* Banner de Demonstração Rápida para Avaliação / Banca */}
        <section className="demo-banca-card">
          <div className="demo-header">
            <span className="badge-banca"><i className="fas fa-shield-alt"></i> FATEC ADS — DEMO DAY & BANCA</span>
            <h2>Acesso Rápido com Perfis Canônicos (RBAC)</h2>
            <p>Selecione um dos perfis pré-configurados do <strong>DataLoader (Seed)</strong> para navegar imediatamente:</p>
          </div>
          <div className="demo-profiles-grid">
            <div className="demo-card gestao" onClick={() => handleQuickLogin('admin@sanquim.br', 'admin123', '/dashboard/coordenador')}>
              <div className="demo-icon"><i className="fas fa-user-shield"></i></div>
              <div className="demo-info">
                <h3>1. Perfil Gestão (Coordenação)</h3>
                <span className="demo-badge gestao">ROLE_GESTAO</span>
                <p>admin@sanquim.br</p>
                <small>Acesso total a turmas, alunos, professores, matrículas e alertas de evasão.</small>
              </div>
              <button className="btn-enter" disabled={demoLoading}>Entrar no Painel &rarr;</button>
            </div>

            <div className="demo-card professor" onClick={() => handleQuickLogin('carlos.santos@sanquim.br', 'prof123', '/dashboard/professor')}>
              <div className="demo-icon"><i className="fas fa-chalkboard-teacher"></i></div>
              <div className="demo-info">
                <h3>2. Perfil Professor (Docente)</h3>
                <span className="demo-badge prof">ROLE_PROFESSOR</span>
                <p>carlos.santos@sanquim.br</p>
                <small>Chamada digital em lote, lançamento de notas e cadastro de planos de aula.</small>
              </div>
              <button className="btn-enter" disabled={demoLoading}>Entrar no Diário &rarr;</button>
            </div>

            <div className="demo-card aluno" onClick={() => handleQuickLogin('joao.silva@sanquim.br', 'aluno123', '/dashboard/aluno')}>
              <div className="demo-icon"><i className="fas fa-user-graduate"></i></div>
              <div className="demo-info">
                <h3>3. Perfil Aluno (Discente)</h3>
                <span className="demo-badge aluno">ROLE_ALUNO</span>
                <p>joao.silva@sanquim.br</p>
                <small>Consulta discriminada ao boletim com média parcial, frequência e linha do tempo.</small>
              </div>
              <button className="btn-enter" disabled={demoLoading}>Entrar no Portal &rarr;</button>
            </div>
          </div>
        </section>

        <section className="hero">
          <div className="hero-content">
            <div className="hero-image">
              <img src="/assets/img/sala-de-aula.jpg" alt="Sala de aula do cursinho gratuito" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'; }} />
            </div>
            <div className="hero-text">
              <h1>Bem-vindo ao Studi<i>+</i></h1>
              <p className="description">
                Studi<i>+</i> é a plataforma acadêmica oficial do <strong>Colégio Sanquim</strong>, cursinho comunitário gratuito que transforma trajetórias desde 2016.
                Construído sob uma arquitetura <strong>RESTful escalável com Spring Boot 3 e Spring Security JWT</strong>, nosso ecossistema garante segurança, integridade contratual e alta produtividade para alunos, professores e coordenação.
              </p>
              <div className="cta-buttons">
                <button className="cta-btn primary" onClick={() => navigate('/login-aluno')}>
                  <i className="fas fa-sign-in-alt"></i> Acessar Portal do Aluno
                </button>
                <button className="cta-btn secondary" onClick={() => navigate('/login-professor')}>
                  <i className="fas fa-door-open"></i> Acessar Portal Docente / Gestão
                </button>
                <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="cta-btn outline">
                  <i className="fas fa-code"></i> Swagger OpenAPI
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <h2>Diferenciais do Ecossistema Studi+</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-clipboard-check"></i></div>
                <h3>Chamada em Lote & Diário</h3>
                <p>Registro instantâneo de presença por aula com prevenção de duplicidade e histórico analítico.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
                <h3>Alerta Preventivo de Evasão</h3>
                <p>Monitoramento automático de discentes com frequência inferior a 75% ou faltas consecutivas.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-graduation-cap"></i></div>
                <h3>Boletim & Médias Parciais</h3>
                <p>Cálculo ponderado automático de notas e visualização imediata da situação acadêmica.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
                <h3>Segurança RBAC com JWT</h3>
                <p>Autenticação stateless baseada em perfis estritos (ROLE_GESTAO, ROLE_PROFESSOR, ROLE_ALUNO).</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Colégio Sanquim — Studi+. Projeto Integrador ADS FATEC Arthur de Azevedo (Mogi Mirim).</p>
          <div className="footer-links">
            <a href="/swagger-ui.html" target="_blank" rel="noreferrer">Swagger OpenAPI</a>
            <span>•</span>
            <a href="/Colegio_Sanquim_API.postman_collection.json" target="_blank" rel="noreferrer">Postman Collection</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
