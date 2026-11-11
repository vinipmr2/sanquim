import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diarioApi, adminApi, authStorage } from '../../services/api';
import './DashboardProfessor.css';

export const DashboardProfessor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chamada'); // 'chamada', 'avaliacoes', 'planos', 'historico'
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Turmas do professor
  const [turmas, setTurmas] = useState([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState('');
  const [alunosTurma, setAlunosTurma] = useState([]);

  // Estado da Chamada
  const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0]);
  const [presencas, setPresencas] = useState({}); // { [alunoId]: { presente: boolean, observacao: string } }
  const [historicoChamadas, setHistoricoChamadas] = useState([]);

  // Estado das Avaliações e Notas
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [selectedAvaliacaoId, setSelectedAvaliacaoId] = useState('');
  const [notasLancamento, setNotasLancamento] = useState({}); // { [alunoId]: { nota: number, observacao: string } }
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    titulo: '',
    tipo: 'PROVA',
    peso: 1.0,
    notaMaxima: 10.0,
    dataEntrega: new Date().toISOString().split('T')[0],
    descricao: ''
  });

  // Estado dos Planos de Aula
  const [planosAula, setPlanosAula] = useState([]);
  const [novoPlano, setNovoPlano] = useState({
    dataAula: new Date().toISOString().split('T')[0],
    titulo: '',
    topicos: '',
    objetivos: '',
    materiaisApoio: '',
    observacoes: ''
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const currentUser = authStorage.getUser();
    if (!currentUser) {
      navigate('/login-professor');
      return;
    }
    setUser(currentUser);
    carregarTurmas();
  }, [navigate]);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const turmasData = await diarioApi.getMinhasTurmas();
      setTurmas(turmasData || []);
      if (turmasData && turmasData.length > 0) {
        const primeira = turmasData[0];
        setSelectedTurmaId(primeira.id.toString());
        setSelectedDisciplinaId(primeira.disciplinaId ? primeira.disciplinaId.toString() : '1');
      }
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
      showToast('Erro ao carregar turmas do docente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quando a turma selecionada mudar, carrega os dados vinculados
  useEffect(() => {
    if (!selectedTurmaId) return;

    const t = turmas.find(item => item.id.toString() === selectedTurmaId);
    if (t && t.disciplinaId) {
      setSelectedDisciplinaId(t.disciplinaId.toString());
    }

    carregarDadosTurma(Number(selectedTurmaId), t?.disciplinaId || 1);
  }, [selectedTurmaId, turmas]);

  const carregarDadosTurma = async (tId, dId) => {
    try {
      // 1. Busca alunos matriculados nessa turma
      const [matriculasData, chamadasData, avaliacoesData, planosData] = await Promise.all([
        adminApi.getMatriculas().catch(() => []),
        diarioApi.getChamadas(tId, dId).catch(() => []),
        diarioApi.getAvaliacoes(tId, dId).catch(() => []),
        diarioApi.getPlanosAula(tId, dId).catch(() => [])
      ]);

      const alunosDaTurma = (matriculasData || [])
        .filter(m => m.turmaId === tId && m.usuarioId)
        .map(m => ({
          id: m.usuarioId,
          matriculaCodigo: m.matriculaCodigo,
          nome: m.alunoNome
        }));

      // Se a lista de matrículas estiver vazia no mock local, busca todos os alunos como fallback
      if (alunosDaTurma.length === 0) {
        const todosAlunos = await adminApi.getAlunos().catch(() => []);
        const fallback = todosAlunos.map(a => ({
          id: a.usuarioId,
          matriculaCodigo: a.matriculaCodigo,
          nome: a.nome
        }));
        setAlunosTurma(fallback);
        inicializarPresencasENotas(fallback);
      } else {
        setAlunosTurma(alunosDaTurma);
        inicializarPresencasENotas(alunosDaTurma);
      }

      setHistoricoChamadas(chamadasData || []);
      setAvaliacoes(avaliacoesData || []);
      if (avaliacoesData && avaliacoesData.length > 0) {
        setSelectedAvaliacaoId(avaliacoesData[0].id.toString());
      }
      setPlanosAula(planosData || []);
    } catch (err) {
      console.error('Erro ao carregar dados da turma:', err);
    }
  };

  const inicializarPresencasENotas = (alunosList) => {
    const pInit = {};
    const nInit = {};
    alunosList.forEach(a => {
      pInit[a.id] = { presente: true, observacao: '' };
      nInit[a.id] = { nota: 8.0, observacao: '' };
    });
    setPresencas(pInit);
    setNotasLancamento(nInit);
  };

  // Carrega notas da avaliação selecionada
  useEffect(() => {
    if (!selectedAvaliacaoId) return;
    const fetchNotas = async () => {
      try {
        const notasExistentes = await diarioApi.getNotas(Number(selectedAvaliacaoId));
        if (notasExistentes && notasExistentes.length > 0) {
          const mapaNotas = { ...notasLancamento };
          notasExistentes.forEach(n => {
            mapaNotas[n.alunoId] = { nota: n.valor, observacao: n.observacao || '' };
          });
          setNotasLancamento(mapaNotas);
        }
      } catch (err) {
        console.error('Erro ao buscar notas:', err);
      }
    };
    fetchNotas();
  }, [selectedAvaliacaoId]);

  const handleSalvarChamada = async (e) => {
    e.preventDefault();
    if (!selectedTurmaId || !selectedDisciplinaId) {
      showToast('Selecione uma turma e disciplina válidas.', 'error');
      return;
    }

    try {
      const registros = alunosTurma.map(a => ({
        alunoId: a.id,
        presente: presencas[a.id]?.presente ?? true,
        observacao: presencas[a.id]?.observacao || ''
      }));

      const payload = {
        turmaId: Number(selectedTurmaId),
        disciplinaId: Number(selectedDisciplinaId),
        dataAula: dataAula,
        registros: registros
      };

      const res = await diarioApi.registrarChamada(payload);
      showToast(`Chamada registrada com sucesso! ${res.totalPresentes} presentes, ${res.totalAusentes} ausentes.`);
      
      // Atualiza histórico
      const chData = await diarioApi.getChamadas(Number(selectedTurmaId), Number(selectedDisciplinaId));
      setHistoricoChamadas(chData || []);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleMarcarTodos = (presenteVal) => {
    const updated = { ...presencas };
    alunosTurma.forEach(a => {
      updated[a.id] = { ...updated[a.id], presente: presenteVal };
    });
    setPresencas(updated);
  };

  const handleCriarAvaliacao = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novaAvaliacao,
        turmaId: Number(selectedTurmaId),
        disciplinaId: Number(selectedDisciplinaId),
        peso: Number(novaAvaliacao.peso),
        notaMaxima: Number(novaAvaliacao.notaMaxima)
      };
      const res = await diarioApi.cadastrarAvaliacao(payload);
      showToast(`Atividade avaliativa "${res.titulo}" cadastrada com sucesso!`);
      setNovaAvaliacao({
        titulo: '',
        tipo: 'PROVA',
        peso: 1.0,
        notaMaxima: 10.0,
        dataEntrega: new Date().toISOString().split('T')[0],
        descricao: ''
      });
      // Recarrega avaliações
      const avs = await diarioApi.getAvaliacoes(Number(selectedTurmaId), Number(selectedDisciplinaId));
      setAvaliacoes(avs || []);
      setSelectedAvaliacaoId(res.id.toString());
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSalvarNotas = async (e) => {
    e.preventDefault();
    if (!selectedAvaliacaoId) {
      showToast('Selecione uma avaliação para lançar as notas.', 'error');
      return;
    }

    try {
      const notasList = alunosTurma.map(a => ({
        alunoId: a.id,
        nota: Number(notasLancamento[a.id]?.nota || 0.0),
        observacao: notasLancamento[a.id]?.observacao || ''
      }));

      await diarioApi.lancarNotas(Number(selectedAvaliacaoId), notasList);
      showToast('Notas dos discentes atualizadas com sucesso no diário!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCriarPlanoAula = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novoPlano,
        turmaId: Number(selectedTurmaId),
        disciplinaId: Number(selectedDisciplinaId)
      };
      await diarioApi.registrarPlanoAula(payload);
      showToast(`Plano de aula "${novoPlano.titulo}" registrado com sucesso!`);
      setNovoPlano({
        dataAula: new Date().toISOString().split('T')[0],
        titulo: '',
        topicos: '',
        objetivos: '',
        materiaisApoio: '',
        observacoes: ''
      });
      // Recarrega planos
      const pls = await diarioApi.getPlanosAula(Number(selectedTurmaId), Number(selectedDisciplinaId));
      setPlanosAula(pls || []);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/');
  };

  return (
    <div className="page-dashboard-professor">
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <i className={toast.type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'}></i>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>Studi<i>+</i> Docente</h2>
          <span className="role-chip prof">ROLE_PROFESSOR</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <a href="#chamada" className={activeTab === 'chamada' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('chamada'); }}>
              <i className="fas fa-clipboard-check"></i>
              <span>Chamada em Lote (US03)</span>
            </a>
          </li>
          <li>
            <a href="#avaliacoes" className={activeTab === 'avaliacoes' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('avaliacoes'); }}>
              <i className="fas fa-file-signature"></i>
              <span>Avaliações & Notas</span>
            </a>
          </li>
          <li>
            <a href="#planos" className={activeTab === 'planos' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('planos'); }}>
              <i className="fas fa-calendar-alt"></i>
              <span>Planos de Aula (US04)</span>
            </a>
          </li>
          <li>
            <a href="#historico" className={activeTab === 'historico' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('historico'); }}>
              <i className="fas fa-history"></i>
              <span>Diário de Chamadas</span>
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

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Diário de Classe & Módulo Pedagógico</h1>
            <p>Colégio Sanquim — Gestão de presenças, notas e planejamento de ensino</p>
          </div>
          <div className="header-user">
            <div className="user-avatar prof"><i className="fas fa-chalkboard-teacher"></i></div>
            <div className="user-details">
              <strong>{user?.nome || 'Prof. Carlos Santos'}</strong>
              <small>{user?.email || 'carlos.santos@sanquim.br'}</small>
            </div>
          </div>
        </header>

        {/* Seletor de Turma Ativa */}
        <section className="turma-selector-bar">
          <div className="selector-group">
            <label htmlFor="selectTurma"><i className="fas fa-users-class"></i> Turma em Atividade:</label>
            <select 
              id="selectTurma" 
              value={selectedTurmaId} 
              onChange={(e) => setSelectedTurmaId(e.target.value)}
              className="custom-select"
            >
              {turmas.map(t => (
                <option key={t.id} value={t.id}>{t.nome} — {t.disciplinaNome} ({t.vagasOcupadas} alunos matriculados)</option>
              ))}
            </select>
          </div>

          <div className="turma-quick-info">
            <span>Período: <strong>2026.1</strong></span>
            <span>Total Alunos: <strong>{alunosTurma.length}</strong></span>
          </div>
        </section>

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i> Carregando diário de classe...
          </div>
        ) : (
          <div className="dashboard-body">
            {/* 1. CHAMADA EM LOTE (US03) */}
            {activeTab === 'chamada' && (
              <div className="tab-pane">
                <div className="chamada-action-card">
                  <div className="date-control">
                    <label htmlFor="dataAulaInput"><i className="fas fa-calendar-day"></i> Data da Aula:</label>
                    <input 
                      id="dataAulaInput" 
                      type="date" 
                      value={dataAula} 
                      onChange={(e) => setDataAula(e.target.value)} 
                      className="input-date"
                    />
                  </div>

                  <div className="quick-actions-box">
                    <button type="button" className="btn-toggle-all present" onClick={() => handleMarcarTodos(true)}>
                      <i className="fas fa-check-double"></i> Todos Presentes
                    </button>
                    <button type="button" className="btn-toggle-all absent" onClick={() => handleMarcarTodos(false)}>
                      <i className="fas fa-times-circle"></i> Todos Ausentes
                    </button>
                  </div>
                </div>

                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-user-check text-primary"></i> Lista de Chamada Digital — Turma Ativa</h2>
                    <span className="badge-info">{alunosTurma.length} estudantes enturmados</span>
                  </div>

                  <form onSubmit={handleSalvarChamada}>
                    <div className="table-responsive">
                      <table className="custom-table chamada-table">
                        <thead>
                          <tr>
                            <th>Matrícula</th>
                            <th>Nome do Discente</th>
                            <th className="text-center">Status de Presença</th>
                            <th>Observação / Justificativa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alunosTurma.map((aluno) => {
                            const isPresente = presencas[aluno.id]?.presente ?? true;
                            return (
                              <tr key={aluno.id} className={isPresente ? 'row-present' : 'row-absent'}>
                                <td><code>{aluno.matriculaCodigo || 'S/M'}</code></td>
                                <td><strong>{aluno.nome}</strong></td>
                                <td className="text-center">
                                  <div className="presence-switch">
                                    <button
                                      type="button"
                                      className={`btn-presence ${isPresente ? 'active-present' : ''}`}
                                      onClick={() => setPresencas({
                                        ...presencas,
                                        [aluno.id]: { ...presencas[aluno.id], presente: true }
                                      })}
                                    >
                                      <i className="fas fa-check"></i> Presente
                                    </button>
                                    <button
                                      type="button"
                                      className={`btn-presence ${!isPresente ? 'active-absent' : ''}`}
                                      onClick={() => setPresencas({
                                        ...presencas,
                                        [aluno.id]: { ...presencas[aluno.id], presente: false }
                                      })}
                                    >
                                      <i className="fas fa-times"></i> Ausente
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Ex: Atestado médico, participação em evento..."
                                    value={presencas[aluno.id]?.observacao || ''}
                                    onChange={(e) => setPresencas({
                                      ...presencas,
                                      [aluno.id]: { ...presencas[aluno.id], observacao: e.target.value }
                                    })}
                                    className="input-obs"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="form-submit-footer">
                      <button type="submit" className="btn-salvar-chamada">
                        <i className="fas fa-save"></i> Salvar Chamada em Lote na API (/api/diario/chamada)
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. AVALIAÇÕES E LANÇAMENTO DE NOTAS */}
            {activeTab === 'avaliacoes' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2><i className="fas fa-plus-circle text-primary"></i> Cadastrar Nova Atividade Avaliativa</h2>
                    <form onSubmit={handleCriarAvaliacao} className="compact-form">
                      <div className="form-group">
                        <label>Título da Avaliação *</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Prova Semestral de Matemática" 
                          value={novaAvaliacao.titulo} 
                          onChange={(e) => setNovaAvaliacao({...novaAvaliacao, titulo: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo</label>
                          <select value={novaAvaliacao.tipo} onChange={(e) => setNovaAvaliacao({...novaAvaliacao, tipo: e.target.value})}>
                            <option value="PROVA">Prova Escrita</option>
                            <option value="TRABALHO">Trabalho em Grupo</option>
                            <option value="SEMINARIO">Seminário</option>
                            <option value="SIMULADO">Simulado Vestibular</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Peso</label>
                          <input type="number" step="0.1" min="0.1" value={novaAvaliacao.peso} onChange={(e) => setNovaAvaliacao({...novaAvaliacao, peso: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nota Máxima</label>
                          <input type="number" step="0.5" value={novaAvaliacao.notaMaxima} onChange={(e) => setNovaAvaliacao({...novaAvaliacao, notaMaxima: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Data de Aplicação / Entrega</label>
                          <input type="date" value={novaAvaliacao.dataEntrega} onChange={(e) => setNovaAvaliacao({...novaAvaliacao, dataEntrega: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Descrição e Critérios</label>
                        <textarea rows="3" placeholder="Critérios avaliativos e conteúdo cobrado..." value={novaAvaliacao.descricao} onChange={(e) => setNovaAvaliacao({...novaAvaliacao, descricao: e.target.value})}></textarea>
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-plus"></i> Salvar Avaliação</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <div className="box-header">
                      <h2><i className="fas fa-edit text-success"></i> Lançamento de Notas dos Alunos</h2>
                    </div>

                    <div className="selector-group mb-4">
                      <label htmlFor="selectAvaliacao">Selecione a Avaliação:</label>
                      <select
                        id="selectAvaliacao"
                        value={selectedAvaliacaoId}
                        onChange={(e) => setSelectedAvaliacaoId(e.target.value)}
                        className="custom-select"
                      >
                        {avaliacoes.map(av => (
                          <option key={av.id} value={av.id}>{av.titulo} (Peso {av.peso} • Máx {av.notaMaxima})</option>
                        ))}
                      </select>
                    </div>

                    <form onSubmit={handleSalvarNotas}>
                      <div className="table-responsive max-h">
                        <table className="custom-table">
                          <thead>
                            <tr>
                              <th>Estudante</th>
                              <th style={{ width: '120px' }}>Nota (0-10)</th>
                              <th>Feedback / Observação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alunosTurma.map(aluno => (
                              <tr key={aluno.id}>
                                <td><strong>{aluno.nome}</strong></td>
                                <td>
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={notasLancamento[aluno.id]?.nota ?? ''}
                                    onChange={(e) => setNotasLancamento({
                                      ...notasLancamento,
                                      [aluno.id]: { ...notasLancamento[aluno.id], nota: e.target.value }
                                    })}
                                    className="input-nota"
                                    required
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    placeholder="Ex: Excelente raciocínio"
                                    value={notasLancamento[aluno.id]?.observacao || ''}
                                    onChange={(e) => setNotasLancamento({
                                      ...notasLancamento,
                                      [aluno.id]: { ...notasLancamento[aluno.id], observacao: e.target.value }
                                    })}
                                    className="input-obs"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="form-submit-footer">
                        <button type="submit" className="btn-salvar-chamada">
                          <i className="fas fa-check"></i> Lançar Notas na API (/api/diario/avaliacoes/{'{id}'}/notas)
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PLANOS DE AULA (US04, US05) */}
            {activeTab === 'planos' && (
              <div className="tab-pane">
                <div className="dual-grid">
                  <div className="card-box">
                    <h2><i className="fas fa-plus text-primary"></i> Registrar Plano de Aula & Conteúdo</h2>
                    <form onSubmit={handleCriarPlanoAula} className="compact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Data da Aula *</label>
                          <input type="date" value={novoPlano.dataAula} onChange={(e) => setNovoPlano({...novoPlano, dataAula: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>Título da Aula *</label>
                          <input type="text" placeholder="Ex: Geometria Analítica" value={novoPlano.titulo} onChange={(e) => setNovoPlano({...novoPlano, titulo: e.target.value})} required />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Resumo dos Tópicos Ministrados *</label>
                        <textarea rows="3" placeholder="Detalhamento do conteúdo abordado em sala..." value={novoPlano.topicos} onChange={(e) => setNovoPlano({...novoPlano, topicos: e.target.value})} required></textarea>
                      </div>
                      <div className="form-group">
                        <label>Objetivos Pedagógicos</label>
                        <input type="text" placeholder="Competências e habilidades desenvolvidas" value={novoPlano.objetivos} onChange={(e) => setNovoPlano({...novoPlano, objetivos: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Materiais de Apoio / Referências</label>
                        <input type="text" placeholder="Slides, capítulos de livros, apostilas..." value={novoPlano.materiaisApoio} onChange={(e) => setNovoPlano({...novoPlano, materiaisApoio: e.target.value})} />
                      </div>
                      <button type="submit" className="btn-submit-form"><i className="fas fa-save"></i> Registrar Plano de Aula</button>
                    </form>
                  </div>

                  <div className="card-box">
                    <h2>Linha do Tempo Pedagógica ({planosAula.length})</h2>
                    <div className="timeline-container max-h">
                      {planosAula.map(p => (
                        <div key={p.id} className="timeline-item">
                          <div className="timeline-badge"><i className="fas fa-chalkboard"></i></div>
                          <div className="timeline-content">
                            <span className="timeline-date">{p.dataAula}</span>
                            <h3>{p.titulo}</h3>
                            <p><strong>Tópicos:</strong> {p.topicos}</p>
                            {p.objetivos && <p><strong>Objetivos:</strong> {p.objetivos}</p>}
                            {p.materiaisApoio && <small><strong>Materiais:</strong> {p.materiaisApoio}</small>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. HISTÓRICO DE CHAMADAS */}
            {activeTab === 'historico' && (
              <div className="tab-pane">
                <div className="card-box">
                  <div className="box-header">
                    <h2><i className="fas fa-history text-primary"></i> Diário de Chamadas Realizadas na Turma</h2>
                    <span className="badge-info">{historicoChamadas.length} aulas registradas</span>
                  </div>

                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Data da Aula</th>
                          <th>Turma</th>
                          <th>Disciplina</th>
                          <th>Total Alunos</th>
                          <th>Presentes</th>
                          <th>Ausentes</th>
                          <th>% Assiduidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historicoChamadas.map(ch => {
                          const pct = ch.totalAlunos > 0 ? Math.round((ch.totalPresentes / ch.totalAlunos) * 100) : 0;
                          return (
                            <tr key={ch.id}>
                              <td><strong>{ch.dataAula}</strong></td>
                              <td>{ch.turmaNome}</td>
                              <td>{ch.disciplinaNome}</td>
                              <td>{ch.totalAlunos}</td>
                              <td><span className="badge-active">{ch.totalPresentes} presentes</span></td>
                              <td><span className="badge-danger">{ch.totalAusentes} ausentes</span></td>
                              <td>
                                <strong>{pct}%</strong>
                                <div className="mini-progress"><div style={{ width: `${pct}%`, background: pct < 75 ? '#ef4444' : '#10b981' }}></div></div>
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
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardProfessor;
