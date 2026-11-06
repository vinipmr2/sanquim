import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardAluno.css';

export const DashboardAluno = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('atividades'); // 'atividades', 'materiais', 'duvidas', 'desempenho', 'calendario'
  const [materiaTab, setMateriaTab] = useState('recentes'); // 'recentes', 'disciplina', 'favoritos'
  const [duvidaTab, setDuvidaTab] = useState('minhas'); // 'minhas', 'horarios'
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="page-dashboard-aluno">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/assets/img/logo.webp" alt="Logo da Escola" onError={(e) => { e.target.style.display = 'none'; }} />
          <h2>Portal do Aluno</h2>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a 
              href="#dashboard" 
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
            >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              href="#atividades" 
              className={activeSection === 'atividades' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('atividades'); }}
            >
              <i className="fas fa-tasks"></i>
              <span>Atividades</span>
            </a>
          </li>
          <li>
            <a 
              href="#materiais" 
              className={activeSection === 'materiais' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('materiais'); }}
            >
              <i className="fas fa-book"></i>
              <span>Materiais</span>
            </a>
          </li>
          <li>
            <a 
              href="#duvidas" 
              className={activeSection === 'duvidas' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('duvidas'); }}
            >
              <i className="fas fa-question-circle"></i>
              <span>Dúvidas</span>
            </a>
          </li>
          <li>
            <a 
              href="#desempenho" 
              className={activeSection === 'desempenho' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('desempenho'); }}
            >
              <i className="fas fa-chart-line"></i>
              <span>Desempenho</span>
            </a>
          </li>
          <li>
            <a 
              href="#calendario" 
              className={activeSection === 'calendario' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('calendario'); }}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Calendário</span>
            </a>
          </li>
          <li>
            <a 
              href="#sair" 
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Sair / Início</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="user-name">Aluno Santos</div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            <h1>Dashboard</h1>
            <p>Bem-vindo(a) ao Portal do Aluno</p>
          </div>

          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button><i className="fas fa-search"></i></button>
          </div>
        </header>

        {/* Cards de Atalho */}
        <div className="dashboard">
          <div 
            className={`dashboard-card ${activeSection === 'atividades' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('atividades')}
          >
            <i className="fas fa-tasks"></i>
            <h3>Atividades</h3>
            <p>Visualize suas atividades pendentes</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'materiais' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('materiais')}
          >
            <i className="fas fa-book"></i>
            <h3>Materiais de Estudo</h3>
            <p>Acesse os materiais compartilhados</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'duvidas' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('duvidas')}
          >
            <i className="fas fa-question-circle"></i>
            <h3>Plantão de Dúvidas</h3>
            <p>Tire suas dúvidas com os professores</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'desempenho' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('desempenho')}
          >
            <i className="fas fa-chart-line"></i>
            <h3>Desempenho</h3>
            <p>Acompanhe suas notas e progresso</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'calendario' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('calendario')}
          >
            <i className="fas fa-calendar-alt"></i>
            <h3>Calendário</h3>
            <p>Visualize seu horário e eventos</p>
          </div>
        </div>

        <div className="main-sections">
          {/* Seção de Atividades */}
          {(activeSection === 'atividades' || activeSection === 'dashboard') && (
            <div className="section-card fadeIn" id="atividades-content">
              <div className="section-header">
                <h2>Atividades Pendentes</h2>
                <button className="btn btn-primary" onClick={() => alert('Visualizando histórico completo de atividades.')}>
                  Ver Todas
                </button>
              </div>

              <div className="search-select">
                <select>
                  <option>Todas as Disciplinas</option>
                  <option>Matemática</option>
                  <option>Português</option>
                  <option>Ciências</option>
                  <option>História</option>
                  <option>Geografia</option>
                </select>
                <select>
                  <option>Todos os Status</option>
                  <option>Pendentes</option>
                  <option>Concluídas</option>
                  <option>Atrasadas</option>
                </select>
                <button><i className="fas fa-search"></i> Filtrar</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Atividade</th>
                    <th>Disciplina</th>
                    <th>Data de Entrega</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lista de Exercícios - Equações</td>
                    <td>Matemática</td>
                    <td>25/05/2025</td>
                    <td><span className="status-badge status-pendente">Pendente</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-primary" onClick={() => alert('Abrindo lista de exercícios...')}>
                          Fazer
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Redação - Sustentabilidade</td>
                    <td>Português</td>
                    <td>22/05/2025</td>
                    <td><span className="status-badge status-entregue">Entregue</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Visualizando envio da redação...')}>
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Trabalho - Biomas Brasileiros</td>
                    <td>Ciências</td>
                    <td>30/05/2025</td>
                    <td><span className="status-badge status-pendente">Pendente</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-primary" onClick={() => alert('Abrindo trabalho de biomas...')}>
                          Fazer
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Questionário - Revolução Francesa</td>
                    <td>História</td>
                    <td>28/05/2025</td>
                    <td><span className="status-badge status-pendente">Pendente</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-primary" onClick={() => alert('Iniciando questionário...')}>
                          Fazer
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Seção de Materiais de Estudo */}
          {activeSection === 'materiais' && (
            <div className="section-card fadeIn" id="materiais-content">
              <div className="section-header">
                <h2>Materiais de Estudo</h2>
                <div className="search-bar" style={{ width: '300px' }}>
                  <input type="text" placeholder="Buscar materiais..." />
                  <button><i className="fas fa-search"></i></button>
                </div>
              </div>

              <div className="tab-nav">
                <button 
                  className={`tab-button ${materiaTab === 'recentes' ? 'active' : ''}`}
                  onClick={() => setMateriaTab('recentes')}
                >
                  Recentes
                </button>
                <button 
                  className={`tab-button ${materiaTab === 'disciplina' ? 'active' : ''}`}
                  onClick={() => setMateriaTab('disciplina')}
                >
                  Por Disciplina
                </button>
                <button 
                  className={`tab-button ${materiaTab === 'favoritos' ? 'active' : ''}`}
                  onClick={() => setMateriaTab('favoritos')}
                >
                  Favoritos
                </button>
              </div>

              <div className="material-grid">
                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <div className="material-info">
                    <h3>Resumo - Geometria Espacial</h3>
                    <p>Matemática • PDF • 3MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Baixando material...')}><i className="fas fa-download"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-powerpoint"></i>
                  </div>
                  <div className="material-info">
                    <h3>Slides - Revolução Francesa</h3>
                    <p>História • PPT • 5MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Baixando slides...')}><i className="fas fa-download"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-word"></i>
                  </div>
                  <div className="material-info">
                    <h3>Guia de Redação Nota 1000</h3>
                    <p>Português • DOCX • 1.5MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Baixando guia...')}><i className="fas fa-download"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-video"></i>
                  </div>
                  <div className="material-info">
                    <h3>Vídeo-aula - Funções Quadráticas</h3>
                    <p>Matemática • MP4 • 50MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Assistindo vídeo-aula...')}><i className="fas fa-play"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-excel"></i>
                  </div>
                  <div className="material-info">
                    <h3>Tabela Periódica Interativa</h3>
                    <p>Química • XLSX • 2MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Baixando dados...')}><i className="fas fa-download"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>

                <div className="material-card">
                  <div className="material-thumbnail">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="material-info">
                    <h3>Revisão Geral - Mecânica e Óptica</h3>
                    <p>Física • PDF • 4MB</p>
                    <div className="material-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => alert('Baixando revisão...')}><i className="fas fa-download"></i></button>
                      <button className="btn btn-sm btn-outline"><i className="fas fa-star"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seção de Plantão de Dúvidas */}
          {activeSection === 'duvidas' && (
            <div className="section-card fadeIn" id="duvidas-content">
              <div className="section-header">
                <h2>Plantão de Dúvidas</h2>
                <button className="btn btn-primary" onClick={() => alert('Formulário de nova dúvida aberto.')}>
                  Nova Dúvida
                </button>
              </div>

              <div className="tab-nav">
                <button 
                  className={`tab-button ${duvidaTab === 'minhas' ? 'active' : ''}`}
                  onClick={() => setDuvidaTab('minhas')}
                >
                  Minhas Dúvidas
                </button>
                <button 
                  className={`tab-button ${duvidaTab === 'horarios' ? 'active' : ''}`}
                  onClick={() => setDuvidaTab('horarios')}
                >
                  Horários Disponíveis
                </button>
              </div>

              {duvidaTab === 'minhas' ? (
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Disciplina</th>
                      <th>Professor</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dúvida sobre Teorema de Pitágoras</td>
                      <td>Matemática</td>
                      <td>Prof. Silva</td>
                      <td>18/05/2025</td>
                      <td><span className="status-badge status-presente">Respondido</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline" onClick={() => alert('Exibindo resposta do professor...')}>Ver</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Exercício 5 da página 45 - Termodinâmica</td>
                      <td>Física</td>
                      <td>Prof. Santos</td>
                      <td>20/05/2025</td>
                      <td><span className="status-badge status-ausente">Pendente</span></td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline" onClick={() => alert('Dúvida ainda em análise pelo professor.')}>Ver</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <h3>Próximos Plantões</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Disciplina</th>
                        <th>Professor</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Sala</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Matemática</td>
                        <td>Prof. Silva</td>
                        <td>25/05/2025</td>
                        <td>14:00 - 15:30</td>
                        <td>Sala 103</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => alert('Agendamento confirmado!')}>Agendar</button>
                        </td>
                      </tr>
                      <tr>
                        <td>Física</td>
                        <td>Prof. Santos</td>
                        <td>26/05/2025</td>
                        <td>15:30 - 17:00</td>
                        <td>Lab. Física</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => alert('Agendamento confirmado!')}>Agendar</button>
                        </td>
                      </tr>
                      <tr>
                        <td>Química</td>
                        <td>Profa. Oliveira</td>
                        <td>27/05/2025</td>
                        <td>13:00 - 14:30</td>
                        <td>Lab. Química</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => alert('Agendamento confirmado!')}>Agendar</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Seção de Desempenho e Calendário */}
          {(activeSection === 'desempenho' || activeSection === 'calendario') && (
            <div className="section-card fadeIn" id="desempenho-content">
              <div className="section-header">
                <h2>{activeSection === 'desempenho' ? 'Desempenho Acadêmico' : 'Grade de Horários & Calendário'}</h2>
                <div>
                  <select style={{ width: '200px', marginRight: '10px' }}>
                    <option>1º Bimestre</option>
                    <option>2º Bimestre</option>
                    <option>3º Bimestre</option>
                    <option>4º Bimestre</option>
                    <option>Anual</option>
                  </select>
                </div>
              </div>

              {activeSection === 'desempenho' && (
                <table>
                  <thead>
                    <tr>
                      <th>Disciplina</th>
                      <th>Professor</th>
                      <th>Média</th>
                      <th>Frequência</th>
                      <th>Situação</th>
                      <th>Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Matemática</td>
                      <td>Prof. Silva</td>
                      <td>8.5</td>
                      <td>95%</td>
                      <td><span className="status-badge status-presente">Aprovado</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Notas: P1=8.0, P2=9.0')}>Ver Notas</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Português</td>
                      <td>Profa. Costa</td>
                      <td>7.8</td>
                      <td>90%</td>
                      <td><span className="status-badge status-presente">Aprovado</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Notas: P1=7.5, Redação=8.0')}>Ver Notas</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Física</td>
                      <td>Prof. Santos</td>
                      <td>6.5</td>
                      <td>85%</td>
                      <td><span className="status-badge status-justificado">Atenção</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Notas: P1=6.0, P2=7.0')}>Ver Notas</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Química</td>
                      <td>Profa. Oliveira</td>
                      <td>7.0</td>
                      <td>88%</td>
                      <td><span className="status-badge status-presente">Aprovado</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Notas: P1=7.0, P2=7.0')}>Ver Notas</button>
                      </td>
                    </tr>
                    <tr>
                      <td>História</td>
                      <td>Prof. Lima</td>
                      <td>9.0</td>
                      <td>98%</td>
                      <td><span className="status-badge status-presente">Aprovado</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => alert('Notas: P1=9.0, Seminário=9.0')}>Ver Notas</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              <div style={{ marginTop: '30px' }}>
                <h3>Grade de Horários Semanal</h3>
                <div className="grade-horarios">
                  <div className="dias-semana">
                    <div className="dia">Hora</div>
                    <div className="dia">Segunda</div>
                    <div className="dia">Terça</div>
                    <div className="dia">Quarta</div>
                    <div className="dia">Quinta</div>
                    <div className="dia">Sexta</div>
                  </div>
                  <div className="horarios">
                    <div className="horario">07:30 - 08:20</div>
                    <div className="aula matematica">
                      <div className="disciplina">Matemática</div>
                      <div className="professor">Prof. Silva</div>
                    </div>
                    <div className="aula portugues">
                      <div className="disciplina">Português</div>
                      <div className="professor">Profa. Costa</div>
                    </div>
                    <div className="aula historia">
                      <div className="disciplina">História</div>
                      <div className="professor">Prof. Lima</div>
                    </div>
                    <div className="aula fisica">
                      <div className="disciplina">Física</div>
                      <div className="professor">Prof. Santos</div>
                    </div>
                    <div className="aula geografia">
                      <div className="disciplina">Geografia</div>
                      <div className="professor">Prof. Gomes</div>
                    </div>
                  </div>
                  <div className="horarios">
                    <div className="horario">08:20 - 09:10</div>
                    <div className="aula matematica">
                      <div className="disciplina">Matemática</div>
                      <div className="professor">Prof. Silva</div>
                    </div>
                    <div className="aula portugues">
                      <div className="disciplina">Português</div>
                      <div className="professor">Profa. Costa</div>
                    </div>
                    <div className="aula historia">
                      <div className="disciplina">História</div>
                      <div className="professor">Prof. Lima</div>
                    </div>
                    <div className="aula fisica">
                      <div className="disciplina">Física</div>
                      <div className="professor">Prof. Santos</div>
                    </div>
                    <div className="aula geografia">
                      <div className="disciplina">Geografia</div>
                      <div className="professor">Prof. Gomes</div>
                    </div>
                  </div>
                  <div className="horarios">
                    <div className="horario">09:10 - 10:00</div>
                    <div className="aula portugues">
                      <div className="disciplina">Português</div>
                      <div className="professor">Profa. Costa</div>
                    </div>
                    <div className="aula ciencias">
                      <div className="disciplina">Ciências</div>
                      <div className="professor">Profa. Oliveira</div>
                    </div>
                    <div className="aula matematica">
                      <div className="disciplina">Matemática</div>
                      <div className="professor">Prof. Silva</div>
                    </div>
                    <div className="aula geografia">
                      <div className="disciplina">Geografia</div>
                      <div className="professor">Prof. Gomes</div>
                    </div>
                    <div className="aula historia">
                      <div className="disciplina">História</div>
                      <div className="professor">Prof. Lima</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardAluno;
