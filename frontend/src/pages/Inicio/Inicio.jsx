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
  const [demoLoading, setDemoLoading] = useState('');

  useEffect(() => {
    setUser(authStorage.getUser());

    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      );
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickLogin = async (roleKey, email, senha, redirectUrl) => {
    try {
      setDemoLoading(roleKey);
      await authApi.login(email, senha);
      navigate(redirectUrl);
    } catch (err) {
      alert('Erro no login de demonstração: ' + err.message);
    } finally {
      setDemoLoading('');
    }
  };

  const handleLogout = () => {
    if (authStorage.clearAuth) authStorage.clearAuth();
    setUser(null);
  };

  const goDashboard = () => {
    if (!user) return;
    if (user.perfil === 'ROLE_GESTAO') navigate('/dashboard/coordenador');
    else if (user.perfil === 'ROLE_PROFESSOR') navigate('/dashboard/professor');
    else navigate('/dashboard/aluno');
  };

  return (
    <div className="page-inicio">
      <header className={`st-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="st-logo" onClick={() => navigate('/')}>
          <div className="st-logo-mark">
            <img
              src="/assets/img/logo.webp"
              alt="Logo Studi+"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <i className="fas fa-graduation-cap" aria-hidden="true"></i>
          </div>
          <span className="st-logo-text">
            Studi<i>+</i>
          </span>
        </div>

        <div className="st-nav-actions">
          <div className="datetime-pill">
            <span>{currentDate}</span>
            <span className="time st-tabular">{currentTime}</span>
          </div>

          <a
            href="/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="st-btn st-btn-outline st-btn-sm"
            title="Documentação Swagger OpenAPI 3"
          >
            <i className="fas fa-code"></i> Swagger API
          </a>

          <button
            type="button"
            className="st-theme-btn"
            onClick={toggleTheme}
            title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>

          {user ? (
            <div className="user-logged-pill">
              <span>
                Olá, <strong>{user.nome?.split(' ')[0]}</strong>
              </span>
              <button type="button" className="st-btn st-btn-primary st-btn-sm" onClick={goDashboard}>
                Meu Painel
              </button>
              <button
                type="button"
                className="st-btn st-btn-danger st-btn-sm"
                onClick={handleLogout}
                title="Sair da conta"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="st-btn st-btn-emerald st-btn-sm" onClick={() => navigate('/login-aluno')}>
                <i className="fas fa-user-graduate"></i> Aluno
              </button>
              <button type="button" className="st-btn st-btn-primary st-btn-sm" onClick={() => navigate('/login-professor')}>
                <i className="fas fa-chalkboard-teacher"></i> Docente / Gestão
              </button>
            </>
          )}
        </div>
      </header>

      <main className="inicio-container">
        {/* Hero Bento */}
        <section className="hero-bento st-animate-up">
          <div className="hero-main-card">
            <span className="hero-kicker">
              <i className="fas fa-sparkles"></i> Colégio Sanquim • Desde 2016
            </span>
            <h1>
              Gestão acadêmica inteligente no <span>Studi+</span>
            </h1>
            <p className="hero-desc">
              A plataforma oficial do cursinho comunitário gratuito do <strong>Colégio Sanquim</strong>.
              Construída com arquitetura RESTful, Spring Security JWT e controle de acesso por perfis para conectar
              alunos, docentes voluntários e coordenação em tempo real.
            </p>
            <div className="hero-ctas">
              <button type="button" className="st-btn st-btn-emerald" onClick={() => navigate('/login-aluno')}>
                <i className="fas fa-sign-in-alt"></i> Portal do Aluno
              </button>
              <button type="button" className="st-btn st-btn-primary" onClick={() => navigate('/login-professor')}>
                <i className="fas fa-door-open"></i> Portal Docente / Gestão
              </button>
              <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="st-btn st-btn-outline">
                <i className="fas fa-book-open"></i> OpenAPI 3
              </a>
            </div>
          </div>

          <div className="hero-media-card">
            <div className="hero-img-wrap">
              <img
                src="/assets/img/sala-de-aula.jpg"
                alt="Sala de aula do cursinho comunitário Colégio Sanquim"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="hero-img-badge">
                <span>
                  <i className="fas fa-shield-check"></i> Arquitetura RBAC &amp; JWT Stateless
                </span>
                <span className="st-badge st-badge-success">Online 24/7</span>
              </div>
            </div>
            <div className="hero-stats-strip">
              <div className="mini-stat">
                <strong>100%</strong>
                <span>Gratuito</span>
              </div>
              <div className="mini-stat">
                <strong>75%+</strong>
                <span>Monitoria LDB</span>
              </div>
              <div className="mini-stat">
                <strong>3 Perfis</strong>
                <span>Acesso RBAC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Acesso Rápido Banca / Demo */}
        <section className="rbac-section st-animate-up">
          <div className="section-heading">
            <span className="st-badge st-badge-warning">
              <i className="fas fa-shield-alt"></i> FATEC ADS — Demo Day &amp; Banca
            </span>
            <h2>Acesso Rápido com Perfis Canônicos</h2>
            <p>
              Selecione um dos perfis pré-configurados do <strong>DataLoader (Seed)</strong> para navegar
              imediatamente pelos painéis:
            </p>
          </div>

          <div className="rbac-grid">
            <div
              className="rbac-card gestao"
              onClick={() => handleQuickLogin('gestao', 'admin@sanquim.br', 'admin123', '/dashboard/coordenador')}
            >
              <div>
                <div className="st-kpi-icon amber">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h3>1. Gestão (Coordenação)</h3>
                <span className="st-badge st-badge-warning">ROLE_GESTAO</span>
                <p className="rbac-email">admin@sanquim.br</p>
                <p className="rbac-desc">
                  KPIs acadêmicos, gestão de turmas, alunos, professores, enturmação e alertas de evasão.
                </p>
              </div>
              <button type="button" className="st-btn st-btn-amber st-btn-block" disabled={!!demoLoading}>
                {demoLoading === 'gestao' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Painel <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>

            <div
              className="rbac-card prof"
              onClick={() =>
                handleQuickLogin('prof', 'carlos.santos@sanquim.br', 'prof123', '/dashboard/professor')
              }
            >
              <div>
                <div className="st-kpi-icon blue">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <h3>2. Professor (Docente)</h3>
                <span className="st-badge st-badge-info">ROLE_PROFESSOR</span>
                <p className="rbac-email">carlos.santos@sanquim.br</p>
                <p className="rbac-desc">
                  Chamada digital em lote, registro de aulas ministradas, notas e planos pedagógicos.
                </p>
              </div>
              <button type="button" className="st-btn st-btn-primary st-btn-block" disabled={!!demoLoading}>
                {demoLoading === 'prof' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Diário <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>

            <div
              className="rbac-card aluno"
              onClick={() => handleQuickLogin('aluno', 'joao.silva@sanquim.br', 'aluno123', '/dashboard/aluno')}
            >
              <div>
                <div className="st-kpi-icon green">
                  <i className="fas fa-user-graduate"></i>
                </div>
                <h3>3. Aluno (Discente)</h3>
                <span className="st-badge st-badge-success">ROLE_ALUNO</span>
                <p className="rbac-email">joao.silva@sanquim.br</p>
                <p className="rbac-desc">
                  Boletim discriminado, assiduidade em tempo real, linha do tempo de aulas e calendário.
                </p>
              </div>
              <button type="button" className="st-btn st-btn-emerald st-btn-block" disabled={!!demoLoading}>
                {demoLoading === 'aluno' ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Portal <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section className="st-animate-up">
          <div className="section-heading">
            <span className="st-badge st-badge-info">Ecossistema Studi+</span>
            <h2>Diferenciais Pedagógicos e Tecnológicos</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="st-kpi-icon blue">
                <i className="fas fa-clipboard-check"></i>
              </div>
              <h3>Chamada em Lote &amp; Diário</h3>
              <p>Registro rápido de presença por turma com justificativas, histórico e prevenção de duplicidade.</p>
            </div>

            <div className="feature-card">
              <div className="st-kpi-icon amber">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Alerta de Evasão (US08)</h3>
              <p>Detecção automática de discentes abaixo de 75% de assiduidade para intervenção preventiva.</p>
            </div>

            <div className="feature-card">
              <div className="st-kpi-icon green">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Boletim &amp; Médias Parciais</h3>
              <p>Cálculo ponderado de avaliações e feedback docente visível imediatamente no portal discente.</p>
            </div>

            <div className="feature-card">
              <div className="st-kpi-icon violet">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Calendário de Vestibulares</h3>
              <p>Organização integrada de provas, simulados, entregas e datas estratégicas do ano letivo.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Colégio Sanquim — Studi+. Projeto Integrador ADS FATEC Arthur de Azevedo (Mogi Mirim).</p>
        <div className="footer-links">
          <a href="/swagger-ui.html" target="_blank" rel="noreferrer">
            Swagger OpenAPI
          </a>
          <span>•</span>
          <a href="/Colegio_Sanquim_API.postman_collection.json" target="_blank" rel="noreferrer">
            Postman Collection
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
