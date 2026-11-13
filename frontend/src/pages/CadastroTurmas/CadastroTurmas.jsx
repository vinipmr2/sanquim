import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './CadastroTurmas.css';

export const CadastroTurmas = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [turmas, setTurmas] = useState([
    {
      id: 1,
      nome: 'Turma A - Matemática 2025.1',
      codigo: 'MAT001-A',
      disciplina: 'Matemática Aplicada',
      professor: 'Prof. Carlos Santos',
      periodo: '2025.1',
      vagas: 35,
      vagasOcupadas: 28,
      status: 'ativa',
      horario: 'Seg/Qua 14:00-16:00',
      sala: 'Sala 101 - Bloco A',
      dataInicio: '2025-02-10',
      dataFim: '2025-06-25',
      observacoes: 'Turma preparatória focada em exatas.'
    },
    {
      id: 2,
      nome: 'Turma B - Física Vestibular',
      codigo: 'FIS001-B',
      disciplina: 'Física Geral',
      professor: 'Profa. Ana Oliveira',
      periodo: '2025.1',
      vagas: 30,
      vagasOcupadas: 30,
      status: 'ativa',
      horario: 'Ter/Qui 16:00-18:00',
      sala: 'Laboratório 2',
      dataInicio: '2025-02-11',
      dataFim: '2025-06-26',
      observacoes: 'Turma lotada com lista de espera.'
    }
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    disciplina: '',
    professor: '',
    periodo: '',
    vagas: '',
    vagasOcupadas: '0',
    status: 'ativa',
    horario: '',
    sala: '',
    dataInicio: '',
    dataFim: '',
    observacoes: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const showMessage = (text, type = 'success') => {
    setFormMessage({ text, type });
    setTimeout(() => setFormMessage(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      disciplina: '',
      professor: '',
      periodo: '',
      vagas: '',
      vagasOcupadas: '0',
      status: 'ativa',
      horario: '',
      sala: '',
      dataInicio: '',
      dataFim: '',
      observacoes: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo || !formData.disciplina || !formData.professor || !formData.periodo || !formData.vagas) {
      showMessage('Por favor, preencha todos os campos obrigatórios (*)', 'error');
      return;
    }

    const vagasNum = parseInt(formData.vagas, 10);
    const vagasOcupadasNum = parseInt(formData.vagasOcupadas, 10) || 0;

    if (vagasOcupadasNum > vagasNum) {
      showMessage('O número de vagas ocupadas não pode ser maior que o total de vagas.', 'error');
      return;
    }

    if (editingId) {
      setTurmas((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...formData, vagas: vagasNum, vagasOcupadas: vagasOcupadasNum } : t))
      );
      showMessage('Turma atualizada com sucesso!', 'success');
    } else {
      const novaTurma = {
        id: Date.now(),
        ...formData,
        vagas: vagasNum,
        vagasOcupadas: vagasOcupadasNum
      };
      setTurmas((prev) => [novaTurma, ...prev]);
      showMessage('Turma cadastrada com sucesso!', 'success');
    }

    resetForm();
  };

  const handleEdit = (turma) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      codigo: turma.codigo,
      disciplina: turma.disciplina,
      professor: turma.professor,
      periodo: turma.periodo,
      vagas: turma.vagas.toString(),
      vagasOcupadas: turma.vagasOcupadas.toString(),
      status: turma.status,
      horario: turma.horario || '',
      sala: turma.sala || '',
      dataInicio: turma.dataInicio || '',
      dataFim: turma.dataFim || '',
      observacoes: turma.observacoes || ''
    });
    showMessage('Turma carregada para edição. Ajuste os dados e salve.', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      setTurmas((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) resetForm();
      showMessage('Turma excluída com sucesso!', 'success');
    }
  };

  const filtradas = turmas.filter(
    (t) =>
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="st-crud-shell page-cadastro-turmas">
      <header className="st-navbar">
        <div className="st-logo" onClick={() => navigate('/')}>
          <div className="st-logo-mark">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="st-logo-text">
            Studi<i>+</i>
          </span>
        </div>

        <div className="st-nav-actions">
          <button
            type="button"
            className="st-theme-btn"
            onClick={toggleTheme}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
          >
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button type="button" className="st-btn st-btn-emerald st-btn-sm" onClick={() => navigate('/login-aluno')}>
            <i className="fas fa-user-graduate"></i> Aluno
          </button>
        </div>
      </header>

      <main className="st-crud-container">
        <div className="st-crud-hero st-animate-up">
          <div>
            <span className="st-badge st-badge-info">
              <i className="fas fa-users"></i> Organização Acadêmica
            </span>
            <h1>Cadastro &amp; Ocupação de Turmas</h1>
            <p>Gerencie horários, salas, professores e limite de vagas por turma</p>
          </div>
          <span className="st-badge st-badge-success">{turmas.length} turmas registradas</span>
        </div>

        <div className="st-dual-grid">
          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className={`fas ${editingId ? 'fa-pen' : 'fa-plus-circle'}`}></i>{' '}
                {editingId ? 'Editar Turma' : 'Nova Turma'}
              </h2>
              {editingId && (
                <button type="button" className="st-btn st-btn-outline st-btn-sm" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="st-form">
              <div className="st-field">
                <label htmlFor="nome">Nome da Turma *</label>
                <input
                  className="st-input"
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: Turma A - Matemática 2026.1"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="codigo">Código *</label>
                  <input
                    className="st-input"
                    type="text"
                    id="codigo"
                    name="codigo"
                    placeholder="Ex: MAT001-A"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="disciplina">Disciplina *</label>
                  <input
                    className="st-input"
                    type="text"
                    id="disciplina"
                    name="disciplina"
                    placeholder="Ex: Matemática Aplicada"
                    value={formData.disciplina}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="professor">Professor Responsável *</label>
                  <input
                    className="st-input"
                    type="text"
                    id="professor"
                    name="professor"
                    placeholder="Nome do professor"
                    value={formData.professor}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="periodo">Período *</label>
                  <input
                    className="st-input"
                    type="text"
                    id="periodo"
                    name="periodo"
                    placeholder="Ex: 2026.1"
                    value={formData.periodo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="st-form-row-3">
                <div className="st-field">
                  <label htmlFor="vagas">Vagas *</label>
                  <input
                    className="st-input"
                    type="number"
                    id="vagas"
                    name="vagas"
                    min="1"
                    value={formData.vagas}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="vagasOcupadas">Ocupadas</label>
                  <input
                    className="st-input"
                    type="number"
                    id="vagasOcupadas"
                    name="vagasOcupadas"
                    min="0"
                    value={formData.vagasOcupadas}
                    onChange={handleChange}
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="status">Status</label>
                  <select className="st-select" id="status" name="status" value={formData.status} onChange={handleChange}>
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="horario">Horário</label>
                  <input
                    className="st-input"
                    type="text"
                    id="horario"
                    name="horario"
                    placeholder="Seg/Qua 14:00-16:00"
                    value={formData.horario}
                    onChange={handleChange}
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="sala">Sala</label>
                  <input
                    className="st-input"
                    type="text"
                    id="sala"
                    name="sala"
                    placeholder="Sala 101 - Bloco A"
                    value={formData.sala}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="dataInicio">Data Início</label>
                  <input className="st-input" type="date" id="dataInicio" name="dataInicio" value={formData.dataInicio} onChange={handleChange} />
                </div>
                <div className="st-field">
                  <label htmlFor="dataFim">Data Término</label>
                  <input className="st-input" type="date" id="dataFim" name="dataFim" value={formData.dataFim} onChange={handleChange} />
                </div>
              </div>

              <div className="st-field">
                <label htmlFor="observacoes">Observações</label>
                <textarea
                  className="st-textarea"
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações adicionais sobre a turma"
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </div>

              {formMessage && (
                <div className={`st-alert ${formMessage.type === 'error' ? 'st-alert-error' : 'st-alert-success'}`}>
                  <i className={`fas ${formMessage.type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                  <span>{formMessage.text}</span>
                </div>
              )}

              <button type="submit" className="st-btn st-btn-primary st-btn-block">
                <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'}`}></i>{' '}
                {editingId ? 'Salvar Alterações' : 'Cadastrar Turma'}
              </button>
            </form>
          </div>

          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className="fas fa-users"></i> Turmas Cadastradas ({filtradas.length})
              </h2>
              <div className="st-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Filtrar turma, código ou disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="list-scroll st-scroll">
              {filtradas.length === 0 ? (
                <div className="st-empty">
                  <i className="fas fa-users"></i>
                  <p>Nenhuma turma encontrada.</p>
                </div>
              ) : (
                filtradas.map((turma) => {
                  const pct = Math.min(100, Math.round((turma.vagasOcupadas / (turma.vagas || 1)) * 100));
                  const barColor = pct >= 100 ? 'var(--st-danger)' : pct >= 80 ? 'var(--st-amber)' : 'var(--st-emerald)';
                  const badgeTone = turma.status === 'ativa' ? 'st-badge-success' : turma.status === 'inativa' ? 'st-badge-danger' : 'st-badge-neutral';

                  return (
                    <div key={turma.id} className="st-item-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <h3 style={{ margin: 0 }}>{turma.nome}</h3>
                        <span className={`st-badge ${badgeTone}`}>{turma.status.toUpperCase()}</span>
                      </div>

                      <div className="st-item-meta">
                        <span><strong>Código:</strong> {turma.codigo}</span>
                        <span><strong>Disciplina:</strong> {turma.disciplina}</span>
                        <span><strong>Professor:</strong> {turma.professor}</span>
                        <span><strong>Período:</strong> {turma.periodo}</span>
                        {turma.horario && <span><strong>Horário:</strong> {turma.horario}</span>}
                        {turma.sala && <span><strong>Sala:</strong> {turma.sala}</span>}
                      </div>

                      <div className="occupancy-row">
                        <div className="occupancy-label">
                          <span>Ocupação de Vagas</span>
                          <span className="st-tabular">
                            {turma.vagasOcupadas} / {turma.vagas} ({pct}%)
                          </span>
                        </div>
                        <div className="st-progress">
                          <div className="st-progress-fill" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                      </div>

                      {turma.observacoes && (
                        <p style={{ fontSize: '0.83rem', color: 'var(--st-text-muted)', margin: '8px 0 0' }}>
                          {turma.observacoes}
                        </p>
                      )}

                      <div className="st-item-actions">
                        <button type="button" className="st-btn st-btn-outline st-btn-sm" onClick={() => handleEdit(turma)}>
                          <i className="fas fa-pen"></i> Editar
                        </button>
                        <button type="button" className="st-btn st-btn-danger st-btn-sm" onClick={() => handleDelete(turma.id)}>
                          <i className="fas fa-trash-alt"></i> Excluir
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CadastroTurmas;

