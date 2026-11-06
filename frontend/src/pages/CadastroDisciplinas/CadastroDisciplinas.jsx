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

  const showMessage = (text, type = 'success') => {
    setFormMessage({ text, type });
    setTimeout(() => {
      setFormMessage(null);
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo || !formData.cargaHoraria || !formData.professor) {
      showMessage('Por favor, preencha todos os campos obrigatórios (*)', 'error');
      return;
    }

    if (editingId) {
      setDisciplinas(prev => prev.map(d => d.id === editingId ? {
        ...d,
        ...formData
      } : d));
      showMessage('Disciplina atualizada com sucesso!', 'success');
      setEditingId(null);
    } else {
      const novaDisciplina = {
        id: Date.now(),
        ...formData,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      };
      setDisciplinas(prev => [novaDisciplina, ...prev]);
      showMessage('Disciplina cadastrada com sucesso!', 'success');
    }

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
      setDisciplinas(prev => prev.filter(d => d.id !== id));
      showMessage('Disciplina excluída com sucesso!', 'success');
    }
  };

  return (
    <div className="page-cadastro-disciplinas">
      <header className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/assets/img/logo.webp" alt="Logo" />
          <strong>Início</strong>
        </div>
        <div className="nav-items">
          <span 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title="Mudar para tema escuro"
            style={{ cursor: 'pointer' }}
          >
            {isDark ? '☀️' : '🌙'}
          </span>
        </div>
        <div className="aluno">
          <strong onClick={() => navigate('/login-aluno')}>Aluno</strong>
        </div>
      </header>

      <div className="main">
        {/* Formulário de Cadastro de Disciplinas */}
        <div className="tabs">
          <div className="tab-header">
            <div className="active">
              📚 {editingId ? 'Editar Disciplina' : 'Cadastro de Disciplinas'}
            </div>
          </div>
          <div className="tab-content">
            <h2 className="form-title">
              {editingId ? 'Atualizar Disciplina' : 'Nova Disciplina'}
            </h2>
            <form id="cadastroForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome da Disciplina *</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  placeholder="Ex: Matemática Aplicada" 
                  value={formData.nome}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo">Código *</label>
                  <input 
                    type="text" 
                    id="codigo" 
                    name="codigo" 
                    placeholder="Ex: MAT001" 
                    value={formData.codigo}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cargaHoraria">Carga Horária *</label>
                  <input 
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="creditos">Créditos</label>
                  <input 
                    type="number" 
                    id="creditos" 
                    name="creditos" 
                    placeholder="Ex: 4" 
                    min="1" 
                    value={formData.creditos}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="periodo">Período/Semestre</label>
                  <input 
                    type="text" 
                    id="periodo" 
                    name="periodo" 
                    placeholder="Ex: 2024.1" 
                    value={formData.periodo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="professor">Professor Responsável *</label>
                <input 
                  type="text" 
                  id="professor" 
                  name="professor" 
                  placeholder="Nome do professor" 
                  value={formData.professor}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="departamento">Departamento</label>
                <input 
                  type="text" 
                  id="departamento" 
                  name="departamento" 
                  placeholder="Ex: Departamento de Ciências Exatas" 
                  value={formData.departamento}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ementa">Ementa/Descrição</label>
                <textarea 
                  id="ementa" 
                  name="ementa" 
                  placeholder="Descrição do conteúdo programático da disciplina"
                  value={formData.ementa}
                  onChange={handleChange}
                />
              </div>

              {formMessage && (
                <div 
                  id="form-message" 
                  className={`form-message ${formMessage.type}`} 
                  style={{ display: 'block' }}
                >
                  {formMessage.text}
                </div>
              )}

              <button type="submit">
                📚 {editingId ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Disciplinas Cadastradas */}
        <div className="lista-cadastrados">
          <div className="lista-header">
            📚 Disciplinas Cadastradas ({disciplinas.length})
          </div>
          <div className="lista-content" id="listaContent">
            {disciplinas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#379091', fontStyle: 'italic', padding: '20px' }}>
                📚 Nenhuma disciplina cadastrada ainda.
              </p>
            ) : (
              disciplinas.map(disciplina => (
                <div key={disciplina.id} className="item-card">
                  <h3>📚 {disciplina.nome}</h3>
                  <p><strong>Código:</strong> {disciplina.codigo}</p>
                  <p><strong>Professor:</strong> {disciplina.professor}</p>
                  <p><strong>Carga Horária:</strong> {disciplina.cargaHoraria}h</p>
                  {disciplina.creditos && <p><strong>Créditos:</strong> {disciplina.creditos}</p>}
                  {disciplina.periodo && <p><strong>Período:</strong> {disciplina.periodo}</p>}
                  {disciplina.departamento && <p><strong>Departamento:</strong> {disciplina.departamento}</p>}
                  {disciplina.ementa && <p><strong>Ementa:</strong> {disciplina.ementa}</p>}
                  <p><strong>Cadastrado em:</strong> {disciplina.dataCadastro}</p>
                  <div className="item-actions">
                    <button className="btn-small btn-edit" onClick={() => handleEdit(disciplina)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-small btn-delete" onClick={() => handleDelete(disciplina.id)}>
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroDisciplinas;
