import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DashboardCoordenador.css';

export const DashboardCoordenador = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'alunos', 'professores', 'turmas', 'alertas'
  const [alunoSubTab, setAlunoSubTab] = useState('cadastro'); // 'cadastro', 'lista', 'espera'

  const [novoAluno, setNovoAluno] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    telefone: '',
    email: '',
    escolaridade: 'Ensino Médio Cursando',
    objetivo: 'ENEM'
  });

  const handleCadastrarAluno = (e) => {
    e.preventDefault();
    if (!novoAluno.nome || !novoAluno.cpf) {
      alert('Preencha os campos obrigatórios do aluno.');
      return;
    }
    alert(`Aluno ${novoAluno.nome} cadastrado com sucesso na coordenação!`);
    setNovoAluno({
      nome: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      telefone: '',
      email: '',
      escolaridade: 'Ensino Médio Cursando',
      objetivo: 'ENEM'
    });
  };

  return (
    <div className="page-dashboard-coordenador">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>Studi<i>+</i> Coordenação</h2>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a 
              href="#dashboard" 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a 
              href="#alunos" 
              className={activeTab === 'alunos' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab('alunos'); }}
            >
              <i className="fas fa-user-graduate"></i>
              <span>Gestão de Alunos</span>
            </a>
          </li>
          <li>
            <a 
              href="#professores" 
              className={activeTab === 'professores' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab('professores'); }}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Professores</span>
            </a>
          </li>
          <li>
            <a 
              href="#turmas" 
              className={activeTab === 'turmas' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab('turmas'); }}
            >
              <i className="fas fa-users"></i>
              <span>Turmas</span>
            </a>
          </li>
          <li>
            <a 
              href="#alertas" 
              className={activeTab === 'alertas' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveTab('alertas'); }}
            >
              <i className="fas fa-exclamation-triangle"></i>
              <span>Alertas de Evasão</span>
            </a>
          </li>
          <li>
            <Link to="/dashboard/matricula">
              <i className="fas fa-id-card"></i>
              <span>Gerenciar Matrículas</span>
            </Link>
          </li>
          <li>
            <Link to="/cadastro-disciplinas">
              <i className="fas fa-book"></i>
              <span>Cadastrar Disciplinas</span>
            </Link>
          </li>
          <li>
            <Link to="/cadastro-turmas">
              <i className="fas fa-chalkboard"></i>
              <span>Cadastrar Turmas</span>
            </Link>
          </li>
          <li>
            <Link to="/cadastro-professor">
              <i className="fas fa-user-plus"></i>
              <span>Cadastrar Professor</span>
            </Link>
          </li>
          <li>
            <a href="#sair" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Sair / Início</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">C</div>
            <div className="user-name">Coord. Santos</div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            <h1>Dashboard Coordenação</h1>
            <p>Bem-vindo(a) ao Portal de Gestão Studi<i>+</i></p>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Pesquisar alunos, turmas..." />
            <button><i className="fas fa-search"></i></button>
          </div>
        </header>

        {/* Dashboard Principal */}
        {activeTab === 'dashboard' && (
          <div id="dashboard-content">
            {/* Estatísticas Principais */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">247</div>
                <div className="stat-label">Alunos Ativos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">15</div>
                <div className="stat-label">Professores</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">12</div>
                <div className="stat-label">Turmas</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5</div>
                <div className="stat-label">Alertas</div>
              </div>
            </div>

            {/* Alertas de Evasão */}
            <div 
              className="alert-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab('alertas')}
            >
              <h4><i className="fas fa-exclamation-triangle"></i> Alertas de Evasão</h4>
              <p>5 alunos com baixa frequência necessitam intervenção imediata. Clique para ver detalhes.</p>
            </div>

            {/* Cards de Atalho */}
            <div className="dashboard">
              <div 
                className="dashboard-card" 
                onClick={() => setActiveTab('alunos')}
              >
                <i className="fas fa-user-graduate"></i>
                <h3>Cadastrar Aluno</h3>
                <p>Adicione novos estudantes</p>
              </div>

              <div 
                className="dashboard-card" 
                onClick={() => navigate('/dashboard/matricula')}
              >
                <i className="fas fa-users"></i>
                <h3>Matrículas</h3>
                <p>Gerencie matrículas em turmas</p>
              </div>

              <div 
                className="dashboard-card" 
                onClick={() => setActiveTab('professores')}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                <h3>Professores</h3>
                <p>Gerencie voluntários</p>
              </div>

              <div 
                className="dashboard-card" 
                onClick={() => navigate('/cadastro-turmas')}
              >
                <i className="fas fa-calendar-alt"></i>
                <h3>Turmas</h3>
                <p>Organize horários e salas</p>
              </div>

              <div 
                className="dashboard-card" 
                onClick={() => navigate('/cadastro-disciplinas')}
              >
                <i className="fas fa-book"></i>
                <h3>Disciplinas</h3>
                <p>Grade curricular</p>
              </div>

              <div 
                className="dashboard-card" 
                onClick={() => setActiveTab('alertas')}
              >
                <i className="fas fa-chart-bar"></i>
                <h3>Relatórios & Alertas</h3>
                <p>Analise desempenho e frequência</p>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Gestão de Alunos */}
        {activeTab === 'alunos' && (
          <div className="section-card fadeIn" id="alunos-content">
            <div className="section-header">
              <h2>Gestão de Alunos</h2>
              <button className="btn btn-primary" onClick={() => setAlunoSubTab('cadastro')}>
                <i className="fas fa-plus"></i> Cadastrar Novo Aluno
              </button>
            </div>

            <div className="tab-nav">
              <button 
                className={`tab-button ${alunoSubTab === 'cadastro' ? 'active' : ''}`}
                onClick={() => setAlunoSubTab('cadastro')}
              >
                Cadastrar Aluno
              </button>
              <button 
                className={`tab-button ${alunoSubTab === 'lista' ? 'active' : ''}`}
                onClick={() => setAlunoSubTab('lista')}
              >
                Lista de Alunos
              </button>
              <button 
                className={`tab-button ${alunoSubTab === 'espera' ? 'active' : ''}`}
                onClick={() => setAlunoSubTab('espera')}
              >
                Lista de Espera
              </button>
            </div>

            {alunoSubTab === 'cadastro' ? (
              <form onSubmit={handleCadastrarAluno}>
                <div className="form-group">
                  <label htmlFor="nome-aluno">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome-aluno" 
                    placeholder="Digite o nome completo do aluno"
                    value={novoAluno.nome}
                    onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="cpf-aluno">CPF</label>
                    <input 
                      type="text" 
                      id="cpf-aluno" 
                      placeholder="000.000.000-00"
                      value={novoAluno.cpf}
                      onChange={(e) => setNovoAluno({ ...novoAluno, cpf: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="data-nascimento">Data de Nascimento</label>
                    <input 
                      type="date" 
                      id="data-nascimento"
                      value={novoAluno.dataNascimento}
                      onChange={(e) => setNovoAluno({ ...novoAluno, dataNascimento: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="endereco">Endereço Completo</label>
                  <textarea 
                    id="endereco" 
                    rows="3" 
                    placeholder="Rua, número, bairro, cidade - CEP"
                    value={novoAluno.endereco}
                    onChange={(e) => setNovoAluno({ ...novoAluno, endereco: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone</label>
                    <input 
                      type="tel" 
                      id="telefone" 
                      placeholder="(11) 99999-9999"
                      value={novoAluno.telefone}
                      onChange={(e) => setNovoAluno({ ...novoAluno, telefone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="aluno@email.com"
                      value={novoAluno.email}
                      onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label htmlFor="escolaridade">Escolaridade</label>
                    <select 
                      id="escolaridade"
                      value={novoAluno.escolaridade}
                      onChange={(e) => setNovoAluno({ ...novoAluno, escolaridade: e.target.value })}
                    >
                      <option>Ensino Fundamental Completo</option>
                      <option>Ensino Médio Cursando</option>
                      <option>Ensino Médio Completo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="objetivo">Objetivo</label>
                    <select 
                      id="objetivo"
                      value={novoAluno.objetivo}
                      onChange={(e) => setNovoAluno({ ...novoAluno, objetivo: e.target.value })}
                    >
                      <option>Vestibular</option>
                      <option>Vestibulinho</option>
                      <option>ENEM</option>
                      <option>Concurso Público</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveTab('dashboard')}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Cadastrar Aluno
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <p>Lista de alunos cadastrados e situação de matrícula no sistema.</p>
                <div style={{ marginTop: '15px' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/dashboard/matricula')}>
                    Acessar Gestão Completa de Matrículas
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Seção de Professores */}
        {activeTab === 'professores' && (
          <div className="section-card fadeIn" id="professores-content">
            <div className="section-header">
              <h2>Gestão de Professores Voluntários</h2>
              <button className="btn btn-primary" onClick={() => navigate('/cadastro-professor')}>
                <i className="fas fa-plus"></i> Cadastrar Novo Professor
              </button>
            </div>

            <div className="search-select">
              <input type="text" placeholder="Buscar professor..." />
              <select>
                <option>Todas as disciplinas</option>
                <option>Matemática</option>
                <option>Português</option>
                <option>Física</option>
                <option>Química</option>
                <option>História</option>
                <option>Geografia</option>
              </select>
              <button><i className="fas fa-search"></i> Buscar</button>
            </div>

            <div className="professor-card">
              <div className="professor-info">
                <div className="professor-details">
                  <h4>Prof. Ana Maria Silva</h4>
                  <p>Matemática e Física • Mestrado em Educação</p>
                  <div className="disponibilidade">
                    <span className="dia-semana disponivel">SEG</span>
                    <span className="dia-semana disponivel">TER</span>
                    <span className="dia-semana">QUA</span>
                    <span className="dia-semana disponivel">QUI</span>
                    <span className="dia-semana">SEX</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="btn btn-sm btn-outline" onClick={() => navigate('/cadastro-professor')}>Editar</button>
                  <button className="btn btn-sm btn-primary" onClick={() => alert('Professor alocado com sucesso!')}>Alocar</button>
                </div>
              </div>
            </div>

            <div className="professor-card">
              <div className="professor-info">
                <div className="professor-details">
                  <h4>Prof. Carlos Oliveira</h4>
                  <p>Português e Literatura • Licenciatura em Letras</p>
                  <div className="disponibilidade">
                    <span className="dia-semana">SEG</span>
                    <span className="dia-semana disponivel">TER</span>
                    <span className="dia-semana disponivel">QUA</span>
                    <span className="dia-semana disponivel">QUI</span>
                    <span className="dia-semana disponivel">SEX</span>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="btn btn-sm btn-outline" onClick={() => navigate('/cadastro-professor')}>Editar</button>
                  <button className="btn btn-sm btn-primary" onClick={() => alert('Professor alocado com sucesso!')}>Alocar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seção de Alertas de Evasão */}
        {activeTab === 'alertas' && (
          <div className="section-card fadeIn">
            <div className="section-header">
              <h2><i className="fas fa-exclamation-triangle" style={{ color: '#e74c3c' }}></i> Alertas de Evasão Escolar</h2>
              <button className="btn btn-primary" onClick={() => alert('Relatório de risco de evasão exportado!')}>
                Exportar Relatório
              </button>
            </div>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Estes alunos apresentaram mais de 3 faltas consecutivas ou frequência abaixo de 75% no período atual:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Turma</th>
                  <th>Frequência</th>
                  <th>Última Presença</th>
                  <th>Nível de Risco</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marcos Vinicius Ribeiro</td>
                  <td>Turma A - Matemática</td>
                  <td>68%</td>
                  <td>12/04/2025</td>
                  <td><span className="status-badge" style={{ background: '#ffcdd2', color: '#c62828' }}>Alto</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Contato registrado via WhatsApp')}>Contatar</button>
                  </td>
                </tr>
                <tr>
                  <td>Camila Nogueira Santos</td>
                  <td>Turma B - Física</td>
                  <td>72%</td>
                  <td>18/04/2025</td>
                  <td><span className="status-badge" style={{ background: '#fff9c4', color: '#f57f17' }}>Médio</span></td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Contato registrado via WhatsApp')}>Contatar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardCoordenador;
