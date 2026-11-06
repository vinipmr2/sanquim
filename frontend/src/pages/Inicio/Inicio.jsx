import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentDate(now.toLocaleDateString('pt-BR', dateOptions));
      setCurrentTime(now.toLocaleTimeString('pt-BR', timeOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page-inicio">
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/assets/img/logo.webp" alt="Logo" />
          <strong>Studi<i>+</i></strong>
        </div>
        <div className="nav-items">
          <div className="datetime-info">
            <div className="current-date">{currentDate}</div>
            <div className="current-time">{currentTime}</div>
          </div>
          <span 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title="Alternar tema"
            style={{ cursor: 'pointer' }}
          >
            <strong>{isDark ? '☀️' : '🌙'}</strong>
          </span>
        </div>
        <div className="login_cadastro">
          <strong className="login-btn" onClick={() => navigate('/login-aluno')}>
            Aluno
          </strong>
          <strong className="login-btn" onClick={() => navigate('/login-professor')}>
            Professor
          </strong>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-image">
              <img src="/assets/img/sala-de-aula.jpg" alt="Sala de aula do cursinho gratuito" />
            </div>
            <div className="hero-text">
              <h1>Bem-vindo ao Studi<i>+</i></h1>
              <p className="description">
                Studi<i>+</i> é uma plataforma gratuita com iniciativa do Colégio Sanquim, que visa proporcionar educação de qualidade para todos.
                Sua missão é facilitar os processos acadêmicos tanto para alunos quanto para professores, promovendo mais produtividade e organização. Assim, todos podem focar no principal objetivo: a aprovação!
              </p>
              <p className="history">
                O projeto Colégio Sanquim foi iniciado em 2016 e desenvolvemos este site para facilitar o acesso dos alunos 
                e permitir que os professores gerenciem as aulas e horários de forma mais eficiente.
              </p>
              <div className="cta-buttons">
                <button className="cta-btn primary" onClick={() => navigate('/login-aluno')}>
                  Área do Aluno
                </button>
                <button className="cta-btn secondary" onClick={() => navigate('/login-professor')}>
                  Área do Professor
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <h2>Por que escolher nosso cursinho?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>100% Gratuito</h3>
                <p>Educação de qualidade sem custos para o estudante</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👨‍🏫</div>
                <h3>Professores Qualificados</h3>
                <p>Equipe dedicada e experiente em preparação para vestibular</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <h3>Horários Flexíveis</h3>
                <p>Sistema online para gerenciar aulas e horários</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Studi<i>+</i>. Educação para todos desde 2016.</p>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
