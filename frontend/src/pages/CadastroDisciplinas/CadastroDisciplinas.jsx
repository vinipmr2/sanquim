import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './CadastroDisciplinas.css';

export const CadastroDisciplinas = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [disciplinas, setDisciplinas] = useState([
    {
      id: 1,
      nome: 'Matemática Aplicada',
      codigo: 'MAT001',
      cargaHoraria: '60',
      creditos: '4',
      periodo: '2025.1',
      professor: 'Prof. Carlos Santos',
      departamento: 'Departamento de Exatas',
      ementa: 'Funções, derivadas e aplicações práticas para resolução de problemas.',
      dataCadastro: '10/01/2025'
    },
    {
      id: 2,
      nome: 'Física Clássica',
      codigo: 'FIS001',
      cargaHoraria: '80',
      creditos: '5',
      periodo: '2025.1',
      professor: 'Profa. Ana Oliveira',
      departamento: 'Departamento de Exatas',
      ementa: 'Mecânica newtoniana, leis do movimento e conservação de energia.',
      dataCadastro: '12/01/2025'
    }
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    cargaHoraria: '',
    creditos: '',
    periodo: '',
    professor: '',
    departamento: '',
    ementa: ''
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
      cargaHoraria: '',
      creditos: '',
      periodo: '',
      professor: '',
      departamento: '',
      ementa: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo || !formData.cargaHoraria || !formData.professor) {
      showMessage('Por favor, preencha todos os campos obrigatórios (*)', 'error');
      return;
    }

    if (editingId) {
      setDisciplinas((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...formData } : d)));
      showMessage('Disciplina atualizada com sucesso!', 'success');
    } else {
      const novaDisciplina = {
        id: Date.now(),
        ...formData,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      };
      setDisciplinas((prev) => [novaDisciplina, ...prev]);
      showMessage('Disciplina cadastrada com sucesso!', 'success');
    }

    resetForm();
  };

  const handleEdit = (disciplina) => {
    setEditingId(disciplina.id);
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      cargaHoraria: disciplina.cargaHoraria,
      creditos: disciplina.creditos || '',
      periodo: disciplina.periodo || '',
      professor: disciplina.professor,
      departamento: disciplina.departamento || '',
      ementa: disciplina.ementa || ''
    });
    showMessage('Disciplina carregada para edição. Atualize os campos e salve.', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      setDisciplinas((prev) => prev.filter((d) => d.id !== id));
      if (editingId === id) resetForm();
      showMessage('Disciplina excluída com sucesso!', 'success');
    }
  };

  const filtradas = disciplinas.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.professor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="st-crud-shell page-cadastro-disciplinas">
      <header className="st-navbar">
        <div className="st-logo" onClick={() => navigate('/')}>
          <div className="st-logo-mark">
            <img
              src="/assets/img/logo.webp"
              alt="Logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
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
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
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
            <span className="st-badge st-badge-violet">
              <i className="fas fa-book-open"></i> Grade Curricular
            </span>
            <h1>Gestão de Disciplinas</h1>
            <p>Cadastre matérias, carga horária, docentes responsáveis e ementas do Colégio Sanquim</p>
          </div>
          <span className="st-badge st-badge-info">{disciplinas.length} disciplinas cadastradas</span>
        </div>

        <div className="st-dual-grid">
          {/* Formulário */}
          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className={`fas ${editingId ? 'fa-pen' : 'fa-plus-circle'}`}></i>{' '}
                {editingId ? 'Editar Disciplina' : 'Nova Disciplina'}
              </h2>
              {editingId && (
                <button type="button" className="st-btn st-btn-outline st-btn-sm" onClick={resetForm}>
                  Cancelar Edição
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="st-form">
              <div className="st-field">
                <label htmlFor="nome">Nome da Disciplina *</label>
                <input
                  className="st-input"
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: Matemática Aplicada"
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
                    placeholder="Ex: MAT001"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="cargaHoraria">Carga Horária (h) *</label>
                  <input
                    className="st-input"
                    type="number"
                    id="cargaHoraria"
                    name="cargaHoraria"
                    placeholder="Horas"
                    min="1"
                    value={formData.cargaHoraria}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="creditos">Créditos</label>
                  <input
                    className="st-input"
                    type="number"
                    id="creditos"
                    name="creditos"
                    placeholder="Ex: 4"
                    min="1"
                    value={formData.creditos}
                    onChange={handleChange}
                  />
                </div>
                <div className="st-field">
                  <label htmlFor="periodo">Período/Semestre</label>
                  <input
                    className="st-input"
                    type="text"
                    id="periodo"
                    name="periodo"
                    placeholder="Ex: 2026.1"
                    value={formData.periodo}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                <label htmlFor="departamento">Departamento</label>
                <input
                  className="st-input"
                  type="text"
                  id="departamento"
                  name="departamento"
                  placeholder="Ex: Departamento de Ciências Exatas"
                  value={formData.departamento}
                  onChange={handleChange}
                />
              </div>

              <div className="st-field">
                <label htmlFor="ementa">Ementa / Descrição</label>
                <textarea
                  className="st-textarea"
                  id="ementa"
                  name="ementa"
                  placeholder="Descrição do conteúdo programático da disciplina"
                  value={formData.ementa}
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
                {editingId ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
              </button>
            </form>
          </div>

          {/* Lista */}
          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className="fas fa-layer-group"></i> Disciplinas Cadastradas ({filtradas.length})
              </h2>
              <div className="st-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar código, matéria ou professor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="list-scroll st-scroll">
              {filtradas.length === 0 ? (
                <div className="st-empty">
                  <i className="fas fa-book-open"></i>
                  <p>Nenhuma disciplina encontrada.</p>
                </div>
              ) : (
                filtradas.map((d) => (
                  <div key={d.id} className="st-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ margin: 0 }}>{d.nome}</h3>
                      <span className="st-badge st-badge-info">{d.codigo}</span>
                    </div>
                    <div className="st-item-meta">
                      <span>
                        <strong>Professor:</strong> {d.professor}
                      </span>
                      <span>
                        <strong>Carga:</strong> {d.cargaHoraria}h {d.creditos ? `(${d.creditos} créd.)` : ''}
                      </span>
                      {d.periodo && (
                        <span>
                          <strong>Período:</strong> {d.periodo}
                        </span>
                      )}
                      {d.departamento && (
                        <span>
                          <strong>Depto:</strong> {d.departamento}
                        </span>
                      )}
                    </div>
                    {d.ementa && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--st-text-sec)', margin: '4px 0 6px' }}>{d.ementa}</p>
                    )}
                    <small style={{ color: 'var(--st-text-muted)' }}>Cadastrado em: {d.dataCadastro}</small>

                    <div className="st-item-actions">
                      <button type="button" className="st-btn st-btn-outline st-btn-sm" onClick={() => handleEdit(d)}>
                        <i className="fas fa-pen"></i> Editar
                      </button>
                      <button type="button" className="st-btn st-btn-danger st-btn-sm" onClick={() => handleDelete(d.id)}>
                        <i className="fas fa-trash-alt"></i> Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CadastroDisciplinas;

