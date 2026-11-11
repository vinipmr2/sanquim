import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, authStorage } from '../../services/api';
import './DashboardCoordenador.css';

export const DashboardCoordenador = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'alertas', 'alunos', 'professores', 'turmas', 'disciplinas', 'matriculas'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Dados do backend
  const [stats, setStats] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);

  // Estados de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Formulários de cadastro
  const [novoAluno, setNovoAluno] = useState({ nome: '', email: '', senha: '', matriculaCodigo: '', curso: 'Pré-Vestibular Sanquim', semestre: '2026.1', turmaId: '' });
  const [novoProfessor, setNovoProfessor] = useState({ nome: '', email: '', senha: '', cpf: '', telefone: '', formacao: '', instituicao: '', disciplinasAtuacao: '', experiencia: '' });
  const [novaTurma, setNovaTurma] = useState({ nome: '', codigo: '', disciplinaId: '', professorResponsavel: '', periodo: '2026.1', vagas: 35, horario: 'Seg/Qua 14:00-16:00', sala: 'Sala 101', observacoes: '' });
  const [novaDisciplina, setNovaDisciplina] = useState({ nome: '', codigo: '', cargaHoraria: 60, creditos: 4, periodo: '2026.1', professorResponsavel: '', departamento: 'Departamento de Exatas', ementa: '' });
  const [novaMatricula, setNovaMatricula] = useState({ alunoNome: '', usuarioId: '', curso: 'Pré-Vestibular Sanquim', semestre: '2026.1', turmaId: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [sData, aData, alData, pData, tData, dData, mData] = await Promise.all([
        adminApi.getStats().catch(() => null),
        adminApi.getAlertasEvasao().catch(() => []),
        adminApi.getAlunos().catch(() => []),
        adminApi.getProfessores().catch(() => []),
        adminApi.getTurmas().catch(() => []),
        adminApi.getDisciplinas().catch(() => []),
        adminApi.getMatriculas().catch(() => [])
      ]);

      setStats(sData);
      setAlertas(aData || []);
      setAlunos(alData || []);
      setProfessores(pData || []);
      setTurmas(tData || []);
      setDisciplinas(dData || []);
      setMatriculas(mData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      showToast('Erro ao sincronizar dados com o servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = authStorage.getUser();
    if (!currentUser) {
      navigate('/login-professor');
      return;
    }
    setUser(currentUser);
    carregarDados();
  }, [navigate]);

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/');
  };

  // Submissões de novos registros
  const handleCriarAluno = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novoAluno,
        turmaId: novoAluno.turmaId ? Number(novoAluno.turmaId) : null
      };
      await adminApi.cadastrarAluno(payload);
      showToast(`Aluno ${novoAluno.nome} cadastrado com sucesso!`);
      setNovoAluno({ nome: '', email: '', senha: '', matriculaCodigo: '', curso: 'Pré-Vestibular Sanquim', semestre: '2026.1', turmaId: '' });
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCriarProfessor = async (e) => {
    e.preventDefault();
    try {
      await adminApi.cadastrarProfessor(novoProfessor);
      showToast(`Professor ${novoProfessor.nome} cadastrado com sucesso!`);
      setNovoProfessor({ nome: '', email: '', senha: '', cpf: '', telefone: '', formacao: '', instituicao: '', disciplinasAtuacao: '', experiencia: '' });
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCriarTurma = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novaTurma,
        disciplinaId: novaTurma.disciplinaId ? Number(novaTurma.disciplinaId) : null,
        vagas: Number(novaTurma.vagas)
      };
      await adminApi.cadastrarTurma(payload);
      showToast(`Turma ${novaTurma.nome} criada com sucesso!`);
      setNovaTurma({ nome: '', codigo: '', disciplinaId: '', professorResponsavel: '', periodo: '2026.1', vagas: 35, horario: '', sala: '', observacoes: '' });
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCriarDisciplina = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novaDisciplina,
        cargaHoraria: Number(novaDisciplina.cargaHoraria),
        creditos: Number(novaDisciplina.creditos)
      };
      await adminApi.cadastrarDisciplina(payload);
      showToast(`Disciplina ${novaDisciplina.nome} cadastrada com sucesso!`);
      setNovaDisciplina({ nome: '', codigo: '', cargaHoraria: 60, creditos: 4, periodo: '2026.1', professorResponsavel: '', departamento: '', ementa: '' });
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRealizarMatricula = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        alunoNome: novaMatricula.alunoNome,
        usuarioId: novaMatricula.usuarioId ? Number(novaMatricula.usuarioId) : null,
        curso: novaMatricula.curso,
        semestre: novaMatricula.semestre,
        turmaId: Number(novaMatricula.turmaId)
      };
      await adminApi.realizarMatricula(payload);
      showToast(`Matrícula realizada com sucesso para ${novaMatricula.alunoNome}!`);
      setNovaMatricula({ alunoNome: '', usuarioId: '', curso: 'Pré-Vestibular Sanquim', semestre: '2026.1', turmaId: '' });
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="page-dashboard-coordenador">
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={toast.type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'}></i>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Sidebar de Navegação */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>Studi<i>+</i> Gestão</h2>
          <span className="role-chip">ROLE_GESTAO</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a href="#dashboard" className={activeTab === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
              <i className="fas fa-chart-pie"></i>
              <span>Visão Geral & KPIs</span>
            </a>
          </li>
          <li>
            <a href="#alertas" className={activeTab === 'alertas' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('alertas'); }}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>Alerta de Evasão</span>
              {alertas.length > 0 && <span className="counter-badge warning">{alertas.length}</span>}
            </a>
          </li>
          <li>
            <a href="#alunos" className={activeTab === 'alunos' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('alunos'); }}>
              <i className="fas fa-user-graduate"></i>
              <span>Alunos ({alunos.length})</span>
            </a>
          </li>
          <li>
            <a href="#professores" className={activeTab === 'professores' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('professores'); }}>
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Professores ({professores.length})</span>
            </a>
          </li>
          <li>
            <a href="#turmas" className={activeTab === 'turmas' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('turmas'); }}>
              <i className="fas fa-users-class"></i>
              <span>Turmas & Vagas ({turmas.length})</span>
            </a>
          </li>
          <li>
            <a href="#disciplinas" className={activeTab === 'disciplinas' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('disciplinas'); }}>
              <i className="fas fa-book"></i>
              <span>Disciplinas ({disciplinas.length})</span>
            </a>
          </li>
          <li>
            <a href="#matriculas" className={activeTab === 'matriculas' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('matriculas'); }}>
              <i className="fas fa-id-card"></i>
              <span>Enturmação ({matriculas.length})</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="btn-swagger-sidebar">
            <i className="fas fa-code"></i> Swagger OpenAPI
          </a>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Painel de Gestão e Secretaria Acadêmica</h1>
            <p>Colégio Sanquim — Gestão estrutural de discentes, corpo docente e indicadores</p>
          </div>
          <div className="header-user">
            <div className="user-avatar"><i className="fas fa-user-shield"></i></div>
            <div className="user-details">
              <strong>{user?.nome || 'Coordenação Geral'}</strong>
              <small>{user?.email || 'admin@sanquim.br'}</small>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Sincronizando com a API REST...
          </div>
        ) : (
          <div className="dashboard-body">
            {/* 1. VISÃO GERAL */}
            {activeTab === 'dashboard' && (
              <div className="tab-pane">
                <div className="kpi-grid">
                  <div className="kpi-card blue">
                    <div className="kpi-icon"><i className="fas fa-user-graduate"></i></div>
                    <div className="kpi-data">
                      <h3>{stats?.totalAlunos ?? alunos.length}</h3>
                      <p>Alunos Matriculados</p>
                    </div>
                  </div>
                  <div className="kpi-card green">
                    <div className="kpi-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                    <div className="kpi-data">
                      <h3>{stats?.totalProfessores ?? professores.length}</h3>
                      <p>Professores Voluntários</p>
                    </div>
                  </div>
                  <div className="kpi-card purple">
                    <div className="kpi-icon"><i className="fas fa-users-class"></i></div>
                    <div className="kpi-data">
                      <h3>{stats?.totalTurmas ?? turmas.length}</h3>
                      <p>Turmas em Andamento</p>
                    </div>
                  </div>
                  <div className="kpi-card orange">
                    <div className="kpi-icon"><i className="fas fa-chart-line"></i></div>
                    <div className="kpi-data">
                      <h3>{stats?.taxaMediaFrequencia ?? 92.5}%</h3>
                      <p>Frequência Global Média</p>
                    </div>
                  </div>
                  <div className="kpi-card red">
                    <div className="kpi-icon"><i className="fas fa-exclamation-circle"></i></div>
                    <div className="kpi-data">
                      <h3>{stats?.totalAlunosRisco ?? alertas.length}</h3>
                      <p>Alunos com Risco de Evasão</p>
                    </div>
                  </div>
                </div>

                <div className="dash-row">
                  <div className="dash-box">
                    <div className="box-header">
                      <h2><i className="fas fa-bell text-warning"></i> Alertas Recentes de Evasão (US08)</h2>
                      <button className="btn-link" onClick={() => setActiveTab('alertas')}>Ver todos &rarr;</button>
                    </div>
                    {alertas.length === 0 ? (
                      <p className="empty-notice">Nenhum aluno em situação de risco no momento. Ótima assiduidade!</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Aluno</th>
                              <th>Turma</th>
                              <th>Faltas</th>
                              <th>Frequência</th>
                              <th>Nível de Risco</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alertas.slice(0, 5).map((al) => (
                              <tr key={al.alunoId}>
                                <td><strong>{al.alunoNome}</strong></td>
                                <td>{al.turmaNome}</td>
                                <td><span className="badge-danger">{al.totalFaltas} faltas</span></td>
                                <td><strong>{al.percentualFrequencia}%</strong></td>
                                <td><span className={`risk-tag ${al.statusRisco.toLowerCase()}`}>{al.statusRisco}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="dash-box">
                    <div className="box-header">
                      <h2><i className="fas fa-chalkboard text-primary"></i> Turmas e Ocupação (US02)</h2>
                      <button className="btn-link" onClick={() => setActiveTab('turmas')}>Gerenciar &rarr;</button>
                    </div>
                    <div className="turmas-occupancy-list">
                      {turmas.slice(0, 4).map((t) => (
                        <div key={t.id} className="turma-occupancy-item">
                          <div className="item-info">
                            <strong>{t.nome}</strong>
                            <span>{t.vagasOcupadas} / {t.vagas} alunos ({Math.round((t.vagasOcupadas / (t.vagas || 1)) * 100)}%)</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${Math.min(100, Math.round((t.vagasOcupadas / (t.vagas || 1)) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ALERTAS DE EVASÃO (US08) */}
            {activeTab === 'alertas' && (
              <div className="tab-pane">
                <div className="section-banner warning">
                  <div className="banner-icon"><i className="fas fa-shield-alt"></i></div>
                  <div className="banner-text">
                    <h2>Sistema Preditivo e Preventivo de Evasão Escolar</h2>
                    <p>Mapeamento automático de estudantes com frequência abaixo do limite regulamentar (75%) ou faltas excessivas consecutivas.</p>
                  </div>
                </div>

                <div className="card-box">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>Contato</th>
                        <th>Turma</th>
                        <th>Faltas</th>
                        <th>Frequência</th>
                        <th>Risco</th>
                        <th>Recomendação da Coordenação</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertas.length === 0 ? (
                        <tr><td colSpan="8" className="text-center">Nenhum estudante em risco identificado.</td></tr>
                      ) : (
                        alertas.map((al) => (
                          <tr key={al.alunoId}>
                            <td><strong>{al.alunoNome}</strong></td>
                            <td><small>{al.email}</small></td>
                            <td>{al.turmaNome}</td>
                            <td><span className="badge-danger">{al.totalFaltas}</span></td>
                            <td><strong style={{ color: al.percentualFrequencia < 60 ? '#ef4444' : '#f59e0b' }}>{al.percentualFrequencia}%</strong></td>
                            <td><span className={`risk-tag ${al.statusRisco.toLowerCase()}`}>{al.statusRisco}</span></td>
                            <td><small>{al.recomendacao}</small></td>
                            <td>
                              <button className="btn-action primary" onClick={() => showToast(`Contato registrado para ${al.alunoNome}. Família notificada.`)}>
                                <i className="fas fa-phone"></i> Contatar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. ALUNOS (US01) */}
            {activeTab === 'alunos' && (
              <div className="tab-pane">
                <div className="action-bar">
                  <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                      type="text" 
                      placeholder="Buscar por nome do aluno..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="dual-grid">
                  <div className="card-box">
                    <h2>Cadastrar Novo Aluno</h2>
                    <form onSubmit={handleCriarAluno} className="compact-form">
                      <div className="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" value={novoAluno.nome} onChange={(e) => setNovoAluno({...novoAluno, nome: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>E-mail Institucional / Pessoal *</label>
                        <input type="email" value={novoAluno.email} onChange={(e) => setNovoAluno({...novoAluno, email: e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Senha Inicial</label>
                          <input type="text" placeholder="Padrão: aluno123" value={novoAluno.senha} onChange={(e) => setNovoAluno({...novoAluno, senha: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Turma de Ingresso</label>
                          <select value={novoAluno.turmaId} onChange={(e) => setNovoAluno({...novoAluno, turmaId: e.target.value})}>
                            <option value="">Sem turma vinculada</option>
                            {turmas.map(t => (
                              <option key={t.id} value={t.id}>{t.nome} ({t.vagasOcupadas}/{t.vagas} vagas)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-plus"></i> Salvar Aluno na API</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Relação de Alunos Cadastrados ({alunos.length})</h2>
                    <div className="table-responsive max-h">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Matrícula</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Turma</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alunos
                            .filter(a => !searchTerm || a.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(a => (
                              <tr key={a.id}>
                                <td><code>{a.matriculaCodigo || 'S/M'}</code></td>
                                <td><strong>{a.nome}</strong></td>
                                <td><small>{a.email}</small></td>
                                <td>{a.turmaNome || 'Não enturmado'}</td>
                                <td><span className="badge-active">{a.status || 'Ativo'}</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PROFESSORES (US06) */}
            {activeTab === 'professores' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2>Cadastrar Professor Docente / Voluntário</h2>
                    <form onSubmit={handleCriarProfessor} className="compact-form">
                      <div className="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" value={novoProfessor.nome} onChange={(e) => setNovoProfessor({...novoProfessor, nome: e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>E-mail *</label>
                          <input type="email" value={novoProfessor.email} onChange={(e) => setNovoProfessor({...novoProfessor, email: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Telefone / WhatsApp</label>
                          <input type="text" placeholder="(19) 99999-9999" value={novoProfessor.telefone} onChange={(e) => setNovoProfessor({...novoProfessor, telefone: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Formação Acadêmica</label>
                          <input type="text" placeholder="Ex: Licenciatura em Matemática" value={novoProfessor.formacao} onChange={(e) => setNovoProfessor({...novoProfessor, formacao: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Instituição</label>
                          <input type="text" placeholder="Ex: FATEC / UNICAMP" value={novoProfessor.instituicao} onChange={(e) => setNovoProfessor({...novoProfessor, instituicao: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Disciplinas de Atuação</label>
                        <input type="text" placeholder="Ex: Matemática, Física, Química" value={novoProfessor.disciplinasAtuacao} onChange={(e) => setNovoProfessor({...novoProfessor, disciplinasAtuacao: e.target.value})} />
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-plus"></i> Cadastrar Docente</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Corpo Docente Sanquim ({professores.length})</h2>
                    <div className="table-responsive max-h">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Professor</th>
                            <th>E-mail</th>
                            <th>Formação</th>
                            <th>Disciplinas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {professores.map(p => (
                            <tr key={p.id}>
                              <td><strong>{p.nome}</strong></td>
                              <td><small>{p.email}</small></td>
                              <td>{p.formacao || 'Docente voluntário'}</td>
                              <td><span className="badge-info">{p.disciplinasAtuacao || 'Geral'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TURMAS (US02) */}
            {activeTab === 'turmas' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2>Criar Turma Letiva</h2>
                    <form onSubmit={handleCriarTurma} className="compact-form">
                      <div className="form-group">
                        <label>Nome da Turma *</label>
                        <input type="text" placeholder="Ex: 1º Ano EM - Turma B" value={novaTurma.nome} onChange={(e) => setNovaTurma({...novaTurma, nome: e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Código Único *</label>
                          <input type="text" placeholder="Ex: 1EM-B2026" value={novaTurma.codigo} onChange={(e) => setNovaTurma({...novaTurma, codigo: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Vagas Máximas *</label>
                          <input type="number" min="1" max="100" value={novaTurma.vagas} onChange={(e) => setNovaTurma({...novaTurma, vagas: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Disciplina</label>
                          <select value={novaTurma.disciplinaId} onChange={(e) => setNovaTurma({...novaTurma, disciplinaId: e.target.value})}>
                            <option value="">Selecione...</option>
                            {disciplinas.map(d => (
                              <option key={d.id} value={d.id}>{d.nome} ({d.codigo})</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Professor Responsável *</label>
                          <input type="text" placeholder="Nome do Professor" value={novaTurma.professorResponsavel} onChange={(e) => setNovaTurma({...novaTurma, professorResponsavel: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Horário</label>
                          <input type="text" placeholder="Seg/Qua 14:00-16:00" value={novaTurma.horario} onChange={(e) => setNovaTurma({...novaTurma, horario: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Sala</label>
                          <input type="text" placeholder="Sala 101" value={novaTurma.sala} onChange={(e) => setNovaTurma({...novaTurma, sala: e.target.value})} />
                        </div>
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-plus"></i> Salvar Turma</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Turmas Cadastradas ({turmas.length})</h2>
                    <div className="table-responsive max-h">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Turma</th>
                            <th>Professor</th>
                            <th>Vagas / Ocupação</th>
                            <th>Horário & Sala</th>
                          </tr>
                        </thead>
                        <tbody>
                          {turmas.map(t => (
                            <tr key={t.id}>
                              <td><code>{t.codigo}</code></td>
                              <td><strong>{t.nome}</strong></td>
                              <td>{t.professorResponsavel}</td>
                              <td>
                                <strong>{t.vagasOcupadas} / {t.vagas}</strong>
                                <div className="mini-progress"><div style={{ width: `${Math.min(100, Math.round((t.vagasOcupadas / (t.vagas || 1)) * 100))}%` }}></div></div>
                              </td>
                              <td><small>{t.horario} • {t.sala}</small></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. DISCIPLINAS */}
            {activeTab === 'disciplinas' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2>Cadastrar Disciplina</h2>
                    <form onSubmit={handleCriarDisciplina} className="compact-form">
                      <div className="form-group">
                        <label>Nome da Disciplina *</label>
                        <input type="text" placeholder="Ex: Matemática Aplicada" value={novaDisciplina.nome} onChange={(e) => setNovaDisciplina({...novaDisciplina, nome: e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Código Único *</label>
                          <input type="text" placeholder="Ex: MAT001" value={novaDisciplina.codigo} onChange={(e) => setNovaDisciplina({...novaDisciplina, codigo: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Carga Horária (h) *</label>
                          <input type="number" value={novaDisciplina.cargaHoraria} onChange={(e) => setNovaDisciplina({...novaDisciplina, cargaHoraria: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Professor Responsável *</label>
                        <input type="text" placeholder="Ex: Prof. Carlos Santos" value={novaDisciplina.professorResponsavel} onChange={(e) => setNovaDisciplina({...novaDisciplina, professorResponsavel: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Ementa / Programa Curricular</label>
                        <textarea rows="3" placeholder="Resumo dos tópicos curriculares abordados" value={novaDisciplina.ementa} onChange={(e) => setNovaDisciplina({...novaDisciplina, ementa: e.target.value})}></textarea>
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-plus"></i> Cadastrar Disciplina</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Grade Curricular Ativa ({disciplinas.length})</h2>
                    <div className="table-responsive max-h">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Disciplina</th>
                            <th>Carga Horária</th>
                            <th>Professor Responsável</th>
                            <th>Departamento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {disciplinas.map(d => (
                            <tr key={d.id}>
                              <td><code>{d.codigo}</code></td>
                              <td><strong>{d.nome}</strong></td>
                              <td>{d.cargaHoraria}h ({d.creditos} créditos)</td>
                              <td>{d.professorResponsavel}</td>
                              <td><small>{d.departamento}</small></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. MATRÍCULAS / ENTURMAÇÃO (US02) */}
            {activeTab === 'matriculas' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2>Realizar Enturmação (Matrícula)</h2>
                    <form onSubmit={handleRealizarMatricula} className="compact-form">
                      <div className="form-group">
                        <label>Nome do Estudante *</label>
                        <input type="text" placeholder="Nome completo" value={novaMatricula.alunoNome} onChange={(e) => setNovaMatricula({...novaMatricula, alunoNome: e.target.value})} required />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Curso</label>
                          <input type="text" value={novaMatricula.curso} onChange={(e) => setNovaMatricula({...novaMatricula, curso: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Semestre Letivo</label>
                          <input type="text" value={novaMatricula.semestre} onChange={(e) => setNovaMatricula({...novaMatricula, semestre: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Turma de Destino *</label>
                        <select value={novaMatricula.turmaId} onChange={(e) => setNovaMatricula({...novaMatricula, turmaId: e.target.value})} required>
                          <option value="">Selecione uma turma com vagas disponíveis...</option>
                          {turmas.map(t => (
                            <option key={t.id} value={t.id} disabled={t.vagasOcupadas >= t.vagas}>
                              {t.nome} — {t.vagasOcupadas}/{t.vagas} vagas ocupadas {t.vagasOcupadas >= t.vagas ? '(LOTADA)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-user-plus"></i> Efetivar Matrícula</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Enturmações Confirmadas ({matriculas.length})</h2>
                    <div className="table-responsive max-h">
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Código Matrícula</th>
                            <th>Estudante</th>
                            <th>Turma</th>
                            <th>Curso / Semestre</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matriculas.map(m => (
                            <tr key={m.id}>
                              <td><code>{m.matriculaCodigo}</code></td>
                              <td><strong>{m.alunoNome}</strong></td>
                              <td>{m.turmaNome || 'Turma ' + m.turmaId}</td>
                              <td><small>{m.curso} ({m.semestre})</small></td>
                              <td><span className="badge-active">{m.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardCoordenador;
