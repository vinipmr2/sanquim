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
      setTurmas(prev => prev.map(t => t.id === editingId ? {
        ...t,
        ...formData,
        vagas: vagasNum,
        vagasOcupadas: vagasOcupadasNum
      } : t));
      showMessage('Turma atualizada com sucesso!', 'success');
      setEditingId(null);
    } else {
      const novaTurma = {
        id: Date.now(),
        ...formData,
        vagas: vagasNum,
        vagasOcupadas: vagasOcupadasNum
      };
      setTurmas(prev => [novaTurma, ...prev]);
      showMessage('Turma cadastrada com sucesso!', 'success');
    }

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
      setTurmas(prev => prev.filter(t => t.id !== id));
      showMessage('Turma excluída com sucesso!', 'success');
    }
  };

  return (
    <div className="page-cadastro-turmas">
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
        {/* Formulário de Cadastro de Turmas */}
        <div className="tabs">
          <div className="tab-header">
            <div className="active">
              👥 {editingId ? 'Editar Turma' : 'Cadastro de Turmas'}
            </div>
          </div>
          <div className="tab-content">
            <h2 className="form-title">{editingId ? 'Atualizar Turma' : 'Nova Turma'}</h2>
            <form id="cadastroForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome da Turma *</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  placeholder="Ex: Turma A - Matemática 2024.1" 
                  value={formData.nome}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="codigo">Código da Turma *</label>
                  <input 
                    type="text" 
                    id="codigo" 
                    name="codigo" 
                    placeholder="Ex: MAT001-A" 
                    value={formData.codigo}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="disciplina">Disciplina *</label>
                  <input 
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

              <div className="form-row">
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
                  <label htmlFor="periodo">Período/Semestre *</label>
                  <input 
                    type="text" 
                    id="periodo" 
                    name="periodo" 
                    placeholder="Ex: 2024.1" 
                    value={formData.periodo}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-row-three">
                <div className="form-group">
                  <label htmlFor="vagas">Vagas Disponíveis *</label>
                  <input 
                    type="number" 
                    id="vagas" 
                    name="vagas" 
                    placeholder="Ex: 30" 
                    min="1" 
                    value={formData.vagas}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vagasOcupadas">Vagas Ocupadas</label>
                  <input 
                    type="number" 
                    id="vagasOcupadas" 
                    name="vagasOcupadas" 
                    placeholder="Ex: 25" 
                    min="0" 
                    value={formData.vagasOcupadas}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="horario">Horário</label>
                  <input 
                    type="text" 
                    id="horario" 
                    name="horario" 
                    placeholder="Ex: Seg/Qua 14:00-16:00" 
                    value={formData.horario}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sala">Sala</label>
                  <input 
                    type="text" 
                    id="sala" 
                    name="sala" 
                    placeholder="Ex: Sala 101 - Bloco A" 
                    value={formData.sala}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dataInicio">Data de Início</label>
                  <input 
                    type="date" 
                    id="dataInicio" 
                    name="dataInicio" 
                    value={formData.dataInicio}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dataFim">Data de Término</label>
                  <input 
                    type="date" 
                    id="dataFim" 
                    name="dataFim" 
                    value={formData.dataFim}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="observacoes">Observações</label>
                <textarea 
                  id="observacoes" 
                  name="observacoes" 
                  placeholder="Informações adicionais sobre a turma"
                  value={formData.observacoes}
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
                👥 {editingId ? 'Salvar Alterações' : 'Cadastrar Turma'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Turmas Cadastradas */}
        <div className="lista-cadastrados">
          <div className="lista-header">
            👥 Turmas Cadastradas ({turmas.length})
          </div>
          <div className="lista-content" id="listaContent">
            {turmas.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#379091', fontStyle: 'italic', padding: '20px' }}>
                👥 Nenhuma turma cadastrada ainda.
              </p>
            ) : (
              turmas.map(turma => {
                const percentOcupada = Math.round((turma.vagasOcupadas / turma.vagas) * 100);
                return (
                  <div key={turma.id} className="item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3>👥 {turma.nome}</h3>
                      <span className={`status-badge ${turma.status}`}>
                        {turma.status.toUpperCase()}
                      </span>
                    </div>
                    <p><strong>Código:</strong> {turma.codigo}</p>
                    <p><strong>Disciplina:</strong> {turma.disciplina}</p>
                    <p><strong>Professor:</strong> {turma.professor}</p>
                    <p><strong>Período:</strong> {turma.periodo}</p>
                    {turma.horario && <p><strong>Horário:</strong> {turma.horario}</p>}
                    {turma.sala && <p><strong>Sala:</strong> {turma.sala}</p>}
                    
                    <div style={{ margin: '10px 0' }}>
                      <p><strong>Ocupação:</strong> {turma.vagasOcupadas} de {turma.vagas} vagas ({percentOcupada}%)</p>
                      <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                        <div style={{ width: `${Math.min(percentOcupada, 100)}%`, height: '100%', background: percentOcupada >= 100 ? '#e74c3c' : '#379091' }} />
                      </div>
                    </div>

                    {turma.observacoes && <p><strong>Obs:</strong> {turma.observacoes}</p>}

                    <div className="item-actions">
                      <button className="btn-small btn-edit" onClick={() => handleEdit(turma)}>
                        ✏️ Editar
                      </button>
                      <button className="btn-small btn-delete" onClick={() => handleDelete(turma.id)}>
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroTurmas;
