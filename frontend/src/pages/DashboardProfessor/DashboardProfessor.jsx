import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardProfessor.css';

export const DashboardProfessor = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('frequencia'); // 'frequencia', 'aulas', 'biblioteca', 'plantao', 'questoes', 'faltas-notas', 'plano-docente', 'material-didatico', 'dashboard'

  // Sub tabs
  const [notasTab, setNotasTab] = useState('notas'); // 'notas', 'faltas', 'historico'
  const [planoTab, setPlanoTab] = useState('lista'); // 'lista', 'criar'
  const [materialTab, setMaterialTab] = useState('lista'); // 'lista', 'incluir'

  // Simulated students data
  const [alunos, setAlunos] = useState([
    { id: 1, numero: '01', nome: 'Ana Carolina Silva', nota: '8.5', obs: 'Excelente participação', statusFalta: 'presente', justificativa: '' },
    { id: 2, numero: '02', nome: 'Bruno Almeida Santos', nota: '7.0', obs: '', statusFalta: 'presente', justificativa: '' },
    { id: 3, numero: '03', nome: 'Carla Mendes Oliveira', nota: '9.2', obs: 'Destaque na prova', statusFalta: 'presente', justificativa: '' },
    { id: 4, numero: '04', nome: 'Daniel Ferreira Lima', nota: '6.5', obs: 'Precisa de reforço', statusFalta: 'ausente', justificativa: 'Consulta médica' },
    { id: 5, numero: '05', nome: 'Eduarda Gomes Costa', nota: '8.8', obs: '', statusFalta: 'presente', justificativa: '' },
    { id: 6, numero: '06', nome: 'Felipe Santos Rocha', nota: '7.5', obs: '', statusFalta: 'justificado', justificativa: 'Atestado' },
    { id: 7, numero: '07', nome: 'Gabriela Costa Lima', nota: '9.8', obs: 'Nota máxima no trabalho', statusFalta: 'presente', justificativa: '' },
    { id: 8, numero: '08', nome: 'Henrique Oliveira Silva', nota: '8.0', obs: '', statusFalta: 'presente', justificativa: '' }
  ]);

  // Plano Docente list
  const [planos, setPlanos] = useState([
    { id: 1, disciplina: 'Matemática', turma: '9º Ano A', ano: '2025', status: 'Ativo', cargaHoraria: '80h' },
    { id: 2, disciplina: 'Física', turma: '8º Ano B', ano: '2025', status: 'Rascunho', cargaHoraria: '60h' }
  ]);

  // Material Didático list
  const [materiais, setMateriais] = useState([
    { id: 1, nome: 'Apostila - Funções do 1º e 2º Grau', tipo: 'PDF', disciplina: 'Matemática', serie: '9º Ano', status: 'Ativo' },
    { id: 2, nome: 'Slides - Cinemática Escalar', tipo: 'PPT', disciplina: 'Física', serie: '8º Ano', status: 'Ativo' }
  ]);

  // Aula Form
  const [aulaForm, setAulaForm] = useState({
    turma: '9º Ano A',
    data: '2025-05-20',
    titulo: '',
    conteudo: '',
    observacoes: ''
  });

  const handleSalvarNotas = () => {
    alert(`${alunos.filter(a => a.nota).length} notas salvas com sucesso!`);
  };

  const handleSalvarFaltas = () => {
    alert('Faltas e presenças consolidadas com sucesso!');
  };

  const handleSalvarAula = (e) => {
    e.preventDefault();
    if (!aulaForm.titulo) {
      alert('Informe o título da aula.');
      return;
    }
    alert(`Aula "${aulaForm.titulo}" registrada com sucesso!`);
    setAulaForm({ turma: '9º Ano A', data: '2025-05-20', titulo: '', conteudo: '', observacoes: '' });
  };

  return (
    <div className="page-dashboard-professor">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/assets/img/logo.webp" alt="Logo da Escola" onError={(e) => { e.target.style.display = 'none'; }} />
          <h2>Portal do Professor</h2>
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
              href="#frequencia" 
              className={activeSection === 'frequencia' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('frequencia'); }}
            >
              <i className="fas fa-user-check"></i>
              <span>Frequência</span>
            </a>
          </li>
          <li>
            <a 
              href="#aulas" 
              className={activeSection === 'aulas' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('aulas'); }}
            >
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Aulas</span>
            </a>
          </li>
          <li>
            <a 
              href="#biblioteca" 
              className={activeSection === 'biblioteca' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('biblioteca'); }}
            >
              <i className="fas fa-book"></i>
              <span>Biblioteca</span>
            </a>
          </li>
          <li>
            <a 
              href="#faltas-notas" 
              className={activeSection === 'faltas-notas' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('faltas-notas'); }}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>Faltas e Notas</span>
            </a>
          </li>
          <li>
            <a 
              href="#plano-docente" 
              className={activeSection === 'plano-docente' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('plano-docente'); }}
            >
              <i className="fas fa-file-alt"></i>
              <span>Plano Docente</span>
            </a>
          </li>
          <li>
            <a 
              href="#material-didatico" 
              className={activeSection === 'material-didatico' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); setActiveSection('material-didatico'); }}
            >
              <i className="fas fa-box-open"></i>
              <span>Material Didático</span>
            </a>
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
            <div className="user-avatar">P</div>
            <div className="user-name">Prof. Santos</div>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="main-content">
        <header className="header">
          <div className="page-title">
            <h1>Dashboard</h1>
            <p>Bem-vindo(a) ao Portal do Professor</p>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Pesquisar..." />
            <button><i className="fas fa-search"></i></button>
          </div>
        </header>

        {/* Cards de Atalho */}
        <div className="dashboard">
          <div 
            className={`dashboard-card ${activeSection === 'frequencia' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('frequencia')}
          >
            <i className="fas fa-user-check"></i>
            <h3>Frequência</h3>
            <p>Registre presença dos alunos</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'aulas' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('aulas')}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            <h3>Aulas</h3>
            <p>Registre aulas ministradas</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'biblioteca' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('biblioteca')}
          >
            <i className="fas fa-book"></i>
            <h3>Biblioteca Digital</h3>
            <p>Acesse materiais didáticos</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'faltas-notas' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('faltas-notas')}
          >
            <i className="fas fa-clipboard-list"></i>
            <h3>Faltas e Notas</h3>
            <p>Gerencie faltas e notas</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'plano-docente' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('plano-docente')}
          >
            <i className="fas fa-file-alt"></i>
            <h3>Plano Docente</h3>
            <p>Crie e gerencie seus planos</p>
          </div>

          <div 
            className={`dashboard-card ${activeSection === 'material-didatico' ? 'card-active' : ''}`}
            onClick={() => setActiveSection('material-didatico')}
          >
            <i className="fas fa-box-open"></i>
            <h3>Material Didático</h3>
            <p>Organize seus materiais</p>
          </div>
        </div>

        {/* Seções Principais */}
        <div className="main-sections">
          {/* Seção de Frequência */}
          {activeSection === 'frequencia' && (
            <div className="section-card fadeIn" id="frequencia-content">
              <div className="section-header">
                <h2>Registro de Frequência</h2>
                <button className="btn btn-primary" onClick={handleSalvarFaltas}>Salvar Chamada</button>
              </div>

              <div className="search-select">
                <select defaultValue="9º Ano A">
                  <option>9º Ano A</option>
                  <option>9º Ano B</option>
                  <option>8º Ano A</option>
                  <option>8º Ano B</option>
                </select>
                <input type="date" defaultValue="2025-05-20" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                <button><i className="fas fa-search"></i> Filtrar</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Nome do Aluno</th>
                    <th>Status Presença</th>
                    <th>Justificativa</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map(aluno => (
                    <tr key={aluno.id}>
                      <td>{aluno.numero}</td>
                      <td>{aluno.nome}</td>
                      <td>
                        <select 
                          value={aluno.statusFalta}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, statusFalta: val } : a));
                          }}
                          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="presente">Presente</option>
                          <option value="ausente">Ausente</option>
                          <option value="justificado">Justificado</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Observação / Justificativa..." 
                          value={aluno.justificativa}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, justificativa: val } : a));
                          }}
                          style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleSalvarFaltas}>
                  Confirmar e Salvar Chamada
                </button>
              </div>
            </div>
          )}

          {/* Seção de Aulas */}
          {activeSection === 'aulas' && (
            <div className="section-card fadeIn" id="aulas-content">
              <div className="section-header">
                <h2>Registro de Aulas Ministradas</h2>
              </div>

              <form onSubmit={handleSalvarAula}>
                <div className="form-group">
                  <label htmlFor="aula-turma">Turma</label>
                  <select 
                    id="aula-turma"
                    value={aulaForm.turma}
                    onChange={(e) => setAulaForm({ ...aulaForm, turma: e.target.value })}
                  >
                    <option>9º Ano A</option>
                    <option>9º Ano B</option>
                    <option>8º Ano A</option>
                    <option>8º Ano B</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="aula-data">Data</label>
                  <input 
                    type="date" 
                    id="aula-data"
                    value={aulaForm.data}
                    onChange={(e) => setAulaForm({ ...aulaForm, data: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="aula-titulo">Título da Aula</label>
                  <input 
                    type="text" 
                    id="aula-titulo" 
                    placeholder="Ex: Equações do 2º grau e Fórmula de Bhaskara"
                    value={aulaForm.titulo}
                    onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="aula-conteudo">Conteúdo Trabalhado</label>
                  <textarea 
                    id="aula-conteudo" 
                    rows="5" 
                    placeholder="Descreva o conteúdo trabalhado na aula..."
                    value={aulaForm.conteudo}
                    onChange={(e) => setAulaForm({ ...aulaForm, conteudo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="aula-observacoes">Observações</label>
                  <textarea 
                    id="aula-observacoes" 
                    rows="3" 
                    placeholder="Observações adicionais sobre o engajamento dos alunos..."
                    value={aulaForm.observacoes}
                    onChange={(e) => setAulaForm({ ...aulaForm, observacoes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save"></i> Registrar Aula
                </button>
              </form>
            </div>
          )}

          {/* Seção de Biblioteca */}
          {activeSection === 'biblioteca' && (
            <div className="section-card fadeIn" id="biblioteca-content">
              <div className="section-header">
                <h2>Biblioteca Digital</h2>
              </div>
              <div className="material-grid">
                <div className="material-card">
                  <div className="material-thumbnail"><i className="fas fa-file-pdf"></i></div>
                  <div className="material-info">
                    <h3>Manual do Professor - BNCC</h3>
                    <p>Documento • PDF • 10MB</p>
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Download do arquivo iniciado...')}>Download</button>
                  </div>
                </div>
                <div className="material-card">
                  <div className="material-thumbnail"><i className="fas fa-file-alt"></i></div>
                  <div className="material-info">
                    <h3>Banco de Provas Anteriores</h3>
                    <p>Exames • ZIP • 45MB</p>
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Download do arquivo iniciado...')}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seção de Faltas e Notas */}
          {activeSection === 'faltas-notas' && (
            <div className="section-card fadeIn" id="faltas-notas-content">
              <div className="section-header">
                <h2>Faltas e Notas</h2>
                <div className="action-buttons">
                  <button className="btn btn-primary" onClick={() => alert('Relatório consolidado exportado em PDF!')}>
                    Exportar Relatório
                  </button>
                </div>
              </div>

              <div className="tab-nav">
                <button 
                  className={`tab-button ${notasTab === 'notas' ? 'active' : ''}`}
                  onClick={() => setNotasTab('notas')}
                >
                  Lançamento de Notas
                </button>
                <button 
                  className={`tab-button ${notasTab === 'historico' ? 'active' : ''}`}
                  onClick={() => setNotasTab('historico')}
                >
                  Histórico Consolidado
                </button>
              </div>

              {notasTab === 'notas' ? (
                <div>
                  <div className="search-select" style={{ marginBottom: '20px' }}>
                    <select id="turma-notas">
                      <option>9º Ano A - Matemática</option>
                      <option>9º Ano B - Matemática</option>
                    </select>
                    <select id="bimestre-notas">
                      <option>1º Bimestre</option>
                      <option>2º Bimestre</option>
                      <option>3º Bimestre</option>
                      <option>4º Bimestre</option>
                    </select>
                    <select id="tipo-avaliacao">
                      <option>Prova Bimestral</option>
                      <option>Trabalho em Grupo</option>
                      <option>Lista de Exercícios</option>
                    </select>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Nº</th>
                        <th>Nome do Aluno</th>
                        <th>Nota (0.0 a 10.0)</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map(aluno => (
                        <tr key={aluno.id}>
                          <td>{aluno.numero}</td>
                          <td>{aluno.nome}</td>
                          <td>
                            <input 
                              type="number" 
                              min="0" 
                              max="10" 
                              step="0.1" 
                              value={aluno.nota}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, nota: val } : a));
                              }}
                              style={{ width: '80px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                          <td>
                            <input 
                              type="text" 
                              value={aluno.obs}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAlunos(prev => prev.map(a => a.id === aluno.id ? { ...a, obs: val } : a));
                              }}
                              placeholder="Observações do desempenho..."
                              style={{ width: '250px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button className="btn btn-primary" onClick={handleSalvarNotas}>Salvar Notas</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>Consolidado Anual</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>1º Bim</th>
                        <th>2º Bim</th>
                        <th>3º Bim</th>
                        <th>4º Bim</th>
                        <th>Média Final</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map(aluno => {
                        const m = parseFloat(aluno.nota || '7.5');
                        const sit = m >= 7.0 ? 'Aprovado' : 'Recuperação';
                        return (
                          <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.nota}</td>
                            <td>8.0</td>
                            <td>8.5</td>
                            <td>8.0</td>
                            <td><strong>{aluno.nota}</strong></td>
                            <td>
                              <span className={`status-badge ${sit === 'Aprovado' ? 'status-presente' : 'status-ausente'}`}>
                                {sit}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Seção de Plano Docente */}
          {activeSection === 'plano-docente' && (
            <div className="section-card fadeIn" id="plano-docente-content">
              <div className="section-header">
                <h2>Plano Docente</h2>
                <button className="btn btn-primary" onClick={() => setPlanoTab(planoTab === 'lista' ? 'criar' : 'lista')}>
                  {planoTab === 'lista' ? '+ Novo Plano' : 'Ver Lista de Planos'}
                </button>
              </div>

              {planoTab === 'lista' ? (
                <table>
                  <thead>
                    <tr>
                      <th>Disciplina</th>
                      <th>Turma</th>
                      <th>Ano Letivo</th>
                      <th>Carga Horária</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planos.map(p => (
                      <tr key={p.id}>
                        <td>{p.disciplina}</td>
                        <td>{p.turma}</td>
                        <td>{p.ano}</td>
                        <td>{p.cargaHoraria}</td>
                        <td><span className="status-badge status-presente">{p.status}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline" onClick={() => alert(`Visualizando plano ${p.id}`)}>Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); alert('Plano docente salvo com sucesso!'); setPlanoTab('lista'); }}>
                  <div className="form-group">
                    <label>Disciplina</label>
                    <input type="text" placeholder="Ex: Matemática" required />
                  </div>
                  <div className="form-group">
                    <label>Turma / Ano</label>
                    <input type="text" placeholder="Ex: 9º Ano A - 2025" required />
                  </div>
                  <div className="form-group">
                    <label>Ementa</label>
                    <textarea rows="3" placeholder="Ementa do curso..." required />
                  </div>
                  <div className="form-group">
                    <label>Objetivos Gerais e Específicos</label>
                    <textarea rows="3" placeholder="Objetivos pedagógicos..." required />
                  </div>
                  <button type="submit" className="btn btn-primary">Salvar Plano Docente</button>
                </form>
              )}
            </div>
          )}

          {/* Seção de Material Didático */}
          {activeSection === 'material-didatico' && (
            <div className="section-card fadeIn" id="material-didatico-content">
              <div className="section-header">
                <h2>Material Didático</h2>
                <button className="btn btn-primary" onClick={() => setMaterialTab(materialTab === 'lista' ? 'incluir' : 'lista')}>
                  {materialTab === 'lista' ? '+ Incluir Material' : 'Ver Materiais'}
                </button>
              </div>

              {materialTab === 'lista' ? (
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Disciplina</th>
                      <th>Série</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiais.map(m => (
                      <tr key={m.id}>
                        <td>{m.nome}</td>
                        <td>{m.tipo}</td>
                        <td>{m.disciplina}</td>
                        <td>{m.serie}</td>
                        <td><span className="status-badge status-presente">{m.status}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline" onClick={() => alert(`Baixando ${m.nome}`)}>Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); alert('Material cadastrado!'); setMaterialTab('lista'); }}>
                  <div className="form-group">
                    <label>Nome do Material</label>
                    <input type="text" placeholder="Ex: Apostila de Geometria Plana" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo</label>
                    <select>
                      <option>PDF</option>
                      <option>Vídeo</option>
                      <option>Slides (PPT)</option>
                      <option>Documento (Word)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Disciplina</label>
                    <input type="text" placeholder="Ex: Matemática" required />
                  </div>
                  <button type="submit" className="btn btn-primary">Cadastrar Material</button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardProfessor;
