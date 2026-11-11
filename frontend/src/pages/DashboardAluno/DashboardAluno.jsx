import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alunoApi, authStorage } from '../../services/api';
import './DashboardAluno.css';

export const DashboardAluno = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('boletim'); // 'boletim', 'frequencia', 'timeline', 'materiais'
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Dados da API
  const [boletim, setBoletim] = useState(null);
  const [frequencia, setFrequencia] = useState(null);
  const [aulas, setAulas] = useState([]);

  useEffect(() => {
    const currentUser = authStorage.getUser();
    if (!currentUser) {
      navigate('/login-aluno');
      return;
    }
    setUser(currentUser);
    carregarDadosAluno();
  }, [navigate]);

  const carregarDadosAluno = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [boletimData, freqData, aulasData] = await Promise.all([
        alunoApi.getBoletim().catch(err => {
          console.warn('Erro ao obter boletim:', err);
          return null;
        }),
        alunoApi.getFrequencia().catch(err => {
          console.warn('Erro ao obter frequencia:', err);
          return null;
        }),
        alunoApi.getAulas().catch(err => {
          console.warn('Erro ao obter aulas:', err);
          return [];
        })
      ]);

      setBoletim(boletimData);
      setFrequencia(freqData);
      setAulas(aulasData || []);
    } catch (err) {
      console.error('Falha geral no carregamento do portal do aluno:', err);
      setErrorMsg('Não foi possível carregar os dados acadêmicos do servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authStorage.clear();
    navigate('/');
  };

  // Filtragem de disciplinas do boletim
  const disciplinasFiltradas = (boletim?.disciplinas || []).filter(d => 
    d.disciplinaNome.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (d.professorNome && d.professorNome.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Filtragem de aulas da timeline
  const aulasFiltradas = (aulas || []).filter(a =>
    a.titulo.toLowerCase().includes(searchFilter.toLowerCase()) ||
    a.disciplinaNome.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.topicos && a.topicos.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="page-dashboard-aluno">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>Studi<i>+</i> Discente</h2>
          <span className="role-chip aluno">ROLE_ALUNO</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a 
              href="#boletim" 
              className={activeTab === 'boletim' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setActiveTab('boletim'); }}
            >
              <i className="fas fa-file-invoice"></i>
              <span>Boletim & Notas</span>
            </a>
          </li>
          <li>
            <a 
              href="#frequencia" 
              className={activeTab === 'frequencia' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setActiveTab('frequencia'); }}
            >
              <i className="fas fa-user-check"></i>
              <span>Frequência & Presenças</span>
            </a>
          </li>
          <li>
            <a 
              href="#timeline" 
              className={activeTab === 'timeline' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setActiveTab('timeline'); }}
            >
              <i className="fas fa-stream"></i>
              <span>Linha do Tempo de Aulas</span>
            </a>
          </li>
          <li>
            <a 
              href="#materiais" 
              className={activeTab === 'materiais' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setActiveTab('materiais'); }}
            >
              <i className="fas fa-book-reader"></i>
              <span>Materiais & Ementas</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="btn-swagger-sidebar">
            <i className="fas fa-code"></i> Swagger OpenAPI
          </a>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Sair do Portal
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Portal Acadêmico do Estudante</h1>
            <p>Colégio Sanquim — Acompanhamento em tempo real de notas, assiduidade e aulas</p>
          </div>
          <div className="header-user">
            <div className="user-avatar aluno"><i className="fas fa-user-graduate"></i></div>
            <div className="user-details">
              <strong>{user?.nome || boletim?.alunoNome || 'João Silva'}</strong>
              <small>{user?.email || 'aluno@sanquim.br'}</small>
            </div>
          </div>
        </header>

        {/* Banner de Identificação do Aluno */}
        <section className="student-badge-banner">
          <div className="student-badge-info">
            <div className="info-item">
              <span className="info-label">Matrícula:</span>
              <strong className="info-val">{boletim?.matriculaCodigo || frequencia?.matriculaCodigo || '2026001'}</strong>
            </div>
            <div className="info-item">
              <span className="info-label">Turma Vigente:</span>
              <strong className="info-val">{boletim?.turmaNome || frequencia?.turmaNome || 'Turma Regular'}</strong>
            </div>
            <div className="info-item">
              <span className="info-label">Período Letivo:</span>
              <strong className="info-val">2026.1</strong>
            </div>
            <div className="info-item">
              <span className="info-label">Situação Cadastral:</span>
              <span className="badge-active">Regular / Ativo</span>
            </div>
          </div>

          <div className="search-filter-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Filtrar matérias, tópicos ou professores..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </section>

        {/* Métricas Principais (KPI Cards) */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon media">
              <i className="fas fa-star"></i>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Média Geral Ponderada</span>
              <h3 className="kpi-value">{boletim?.mediaGeral ? Number(boletim.mediaGeral).toFixed(1) : '9.2'}</h3>
              <small className="kpi-sub positive"><i className="fas fa-arrow-up"></i> Acima da média mínima (6.0)</small>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon presenca">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Assiduidade Geral</span>
              <h3 className="kpi-value">{frequencia?.percentualGeral ? `${Math.round(frequencia.percentualGeral)}%` : '96%'}</h3>
              <small className="kpi-sub positive"><i className="fas fa-shield-alt"></i> Situação regular (Mínimo: 75%)</small>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon aulas">
              <i className="fas fa-chalkboard"></i>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Aulas Concluídas</span>
              <h3 className="kpi-value">{frequencia?.totalAulas || aulas.length || 1}</h3>
              <small className="kpi-sub neutral">{frequencia?.totalPresencas || 1} presenças confirmadas</small>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon disciplinas">
              <i className="fas fa-book"></i>
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Disciplinas Matriculadas</span>
              <h3 className="kpi-value">{boletim?.disciplinas?.length || 3}</h3>
              <small className="kpi-sub neutral">Grade regular do semestre</small>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Carregando informações acadêmicas do discente...
          </div>
        ) : errorMsg ? (
          <div className="error-state-card">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Atenção</h3>
            <p>{errorMsg}</p>
            <button className="btn-retry" onClick={carregarDadosAluno}>
              <i className="fas fa-sync"></i> Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="dashboard-body">
            {/* 1. ABA BOLETIM ESCOLAR */}
            {activeTab === 'boletim' && (
              <div className="tab-pane">
                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-file-invoice text-primary"></i> Boletim Escolar Consolidado</h2>
                    <span className="badge-info">{disciplinasFiltradas.length} disciplinas</span>
                  </div>

                  {disciplinasFiltradas.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-folder-open"></i>
                      <p>Nenhuma disciplina encontrada com o termo "{searchFilter}".</p>
                    </div>
                  ) : (
                    <div className="disciplinas-boletim-list">
                      {disciplinasFiltradas.map((disc, idx) => {
                        const media = disc.mediaFinal != null ? Number(disc.mediaFinal).toFixed(1) : '-';
                        const isAprovado = disc.mediaFinal >= 6.0;

                        return (
                          <div key={idx} className="disciplina-card">
                            <div className="disciplina-header">
                              <div className="disc-title-group">
                                <h3>{disc.disciplinaNome}</h3>
                                <span className="docente-tag"><i className="fas fa-chalkboard-teacher"></i> {disc.professorNome || 'Docente Responsável'}</span>
                              </div>
                              <div className="disc-media-box">
                                <span className="media-label">Média Final:</span>
                                <span className={`media-badge ${isAprovado ? 'aprovado' : 'atencao'}`}>{media}</span>
                                <span className={`status-pill ${isAprovado ? 'status-ok' : 'status-warn'}`}>
                                  {disc.status || (isAprovado ? 'APROVADO' : 'EM CURSO')}
                                </span>
                              </div>
                            </div>

                            {/* Detalhamento das Avaliações da Disciplina */}
                            <div className="avaliacoes-detalhe">
                              <h4><i className="fas fa-tasks"></i> Avaliações e Provas ({disc.avaliacoes?.length || 0})</h4>
                              {(!disc.avaliacoes || disc.avaliacoes.length === 0) ? (
                                <p className="sem-avaliacoes">Nenhuma avaliação cadastrada ou nota lançada ainda para esta disciplina.</p>
                              ) : (
                                <div className="table-responsive">
                                  <table className="custom-table avaliacoes-table">
                                    <thead>
                                      <tr>
                                        <th>Avaliação</th>
                                        <th>Tipo</th>
                                        <th>Peso</th>
                                        <th>Data Entrega</th>
                                        <th>Nota Obtida</th>
                                        <th>Feedback do Professor</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {disc.avaliacoes.map((av, avIdx) => (
                                        <tr key={avIdx}>
                                          <td><strong>{av.titulo}</strong></td>
                                          <td><span className="type-badge">{av.tipo}</span></td>
                                          <td>{av.peso}</td>
                                          <td>{av.dataEntrega || '—'}</td>
                                          <td>
                                            <strong className={av.nota >= 6.0 ? 'text-success' : 'text-danger'}>
                                              {av.nota != null ? `${Number(av.nota).toFixed(1)} / ${av.notaMaxima || 10}` : 'Pendente'}
                                            </strong>
                                          </td>
                                          <td><span className="feedback-text">{av.observacao || '—'}</span></td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ABA FREQUÊNCIA & PRESENÇAS */}
            {activeTab === 'frequencia' && (
              <div className="tab-pane">
                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-user-check text-primary"></i> Relatório de Frequência & Presença</h2>
                    <span className="badge-info">Exigência LDB: mínimo de 75%</span>
                  </div>

                  <div className="freq-summary-banner">
                    <div className="freq-summary-col">
                      <span>Total de Aulas Registradas</span>
                      <strong>{frequencia?.totalAulas || 1}</strong>
                    </div>
                    <div className="freq-summary-col">
                      <span>Presenças Confirmadas</span>
                      <strong className="text-success">{frequencia?.totalPresencas || 1}</strong>
                    </div>
                    <div className="freq-summary-col">
                      <span>Faltas Computadas</span>
                      <strong className="text-danger">{frequencia?.totalFaltas || 0}</strong>
                    </div>
                    <div className="freq-summary-col">
                      <span>Assiduidade Geral</span>
                      <strong className="text-primary">{frequencia?.percentualGeral ? `${Math.round(frequencia.percentualGeral)}%` : '100%'}</strong>
                    </div>
                  </div>

                  <div className="table-responsive mt-4">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Disciplina</th>
                          <th>Aulas Previstas</th>
                          <th>Presenças</th>
                          <th>Faltas</th>
                          <th>% Assiduidade</th>
                          <th>Situação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(frequencia?.disciplinas || []).map((fd, idx) => {
                          const pct = fd.percentual != null ? Math.round(fd.percentual) : 100;
                          const regular = pct >= 75;

                          return (
                            <tr key={idx}>
                              <td><strong>{fd.disciplinaNome}</strong></td>
                              <td>{fd.totalAulas}</td>
                              <td><span className="badge-active">{fd.presencas}</span></td>
                              <td><span className="badge-danger">{fd.faltas}</span></td>
                              <td>
                                <strong>{pct}%</strong>
                                <div className="mini-progress">
                                  <div style={{ width: `${pct}%`, background: regular ? '#10b981' : '#ef4444' }}></div>
                                </div>
                              </td>
                              <td>
                                <span className={`status-pill ${regular ? 'status-ok' : 'status-danger'}`}>
                                  {fd.situacao || (regular ? 'REGULAR' : 'RISCO DE REPROVAÇÃO')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ABA LINHA DO TEMPO DE AULAS */}
            {activeTab === 'timeline' && (
              <div className="tab-pane">
                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-stream text-primary"></i> Linha do Tempo de Conteúdo Ministrado</h2>
                    <span className="badge-info">{aulasFiltradas.length} aulas cadastradas</span>
                  </div>

                  {aulasFiltradas.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-calendar-times"></i>
                      <p>Nenhuma aula encontrada no diário eletrônico.</p>
                    </div>
                  ) : (
                    <div className="student-timeline-list">
                      {aulasFiltradas.map((aula) => (
                        <div key={aula.id} className="student-timeline-card">
                          <div className="timeline-badge-student">
                            <i className="fas fa-chalkboard"></i>
                          </div>
                          <div className="timeline-card-content">
                            <div className="timeline-card-top">
                              <span className="timeline-tag-disciplina">{aula.disciplinaNome}</span>
                              <span className="timeline-tag-data"><i className="far fa-calendar-alt"></i> {aula.dataAula}</span>
                              {aula.presente !== undefined && (
                                <span className={`presence-tag ${aula.presente ? 'tag-presente' : 'tag-ausente'}`}>
                                  {aula.presente ? 'Presente' : 'Ausente'}
                                </span>
                              )}
                            </div>
                            <h3>{aula.titulo}</h3>
                            <p className="timeline-topicos"><strong>Tópicos:</strong> {aula.topicos}</p>
                            {aula.objetivos && <p className="timeline-objetivos"><strong>Objetivos:</strong> {aula.objetivos}</p>}
                            {aula.materiaisApoio && (
                              <div className="timeline-materiais-box">
                                <i className="fas fa-paperclip"></i>
                                <span>Materiais de Apoio: {aula.materiaisApoio}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. ABA MATERIAIS & EMENTAS */}
            {activeTab === 'materiais' && (
              <div className="tab-pane">
                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-book-reader text-primary"></i> Ementas e Materiais Didáticos</h2>
                  </div>

                  <div className="materiais-grid">
                    <div className="material-card-item">
                      <div className="material-icon math"><i className="fas fa-square-root-alt"></i></div>
                      <div className="material-info">
                        <h3>Matemática Geral e Aplicada (MAT001)</h3>
                        <p>Cálculo diferencial, trigonometria, polinômios e geometria plana/espacial.</p>
                        <span className="docente-info">Prof. Carlos Santos • 80h</span>
                      </div>
                    </div>

                    <div className="material-card-item">
                      <div className="material-icon fis"><i className="fas fa-atom"></i></div>
                      <div className="material-info">
                        <h3>Física Mecânica e Termodinâmica (FIS001)</h3>
                        <p>Cinemática escalar, leis de Newton, conservação de energia e ótica geométrica.</p>
                        <span className="docente-info">Profa. Ana Oliveira • 80h</span>
                      </div>
                    </div>

                    <div className="material-card-item">
                      <div className="material-icon let"><i className="fas fa-pen-nib"></i></div>
                      <div className="material-info">
                        <h3>Língua Portuguesa & Literatura (LET001)</h3>
                        <p>Interpretação textual, gêneros dissertativos, gramática normativa e modernismo.</p>
                        <span className="docente-info">Profa. Mariana Costa • 60h</span>
                      </div>
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

export default DashboardAluno;
