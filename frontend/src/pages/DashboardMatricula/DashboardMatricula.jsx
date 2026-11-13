import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './DashboardMatricula.css';

export const DashboardMatricula = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [enrollments, setEnrollments] = useState([
    { id: 1, studentId: '2025001', studentName: 'João Silva', course: 'Engenharia de Software', semester: '2025.1', status: 'ativo' },
    { id: 2, studentId: '2025002', studentName: 'Maria Santos', course: 'Ciência da Computação', semester: '2025.1', status: 'ativo' },
    { id: 3, studentId: '2025003', studentName: 'Pedro Oliveira', course: 'Administração', semester: '2025.1', status: 'pendente' }
  ]);

  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    course: '',
    semester: '2025.1',
    status: 'ativo'
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [toast, setToast] = useState(null);

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const clearForm = () => {
    setFormData({ studentName: '', studentId: '', course: '', semester: '2025.1', status: 'ativo' });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.studentId.trim() || !formData.course) {
      notify('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (editingId) {
      setEnrollments((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item)));
      notify('Matrícula atualizada com sucesso!');
    } else {
      setEnrollments((prev) => [{ id: Date.now(), ...formData }, ...prev]);
      notify('Matrícula adicionada com sucesso!');
    }

    clearForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      studentName: item.studentName,
      studentId: item.studentId,
      course: item.course,
      semester: item.semester,
      status: item.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta matrícula?')) {
      setEnrollments((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) clearForm();
      notify('Matrícula removida.');
    }
  };

  const filteredEnrollments = enrollments.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const total = enrollments.length;
  const activeCount = enrollments.filter((e) => e.status === 'ativo').length;
  const pendingCount = enrollments.filter((e) => e.status === 'pendente').length;
  const inactiveCount = enrollments.filter((e) => e.status === 'inativo').length;

  const badgeTone = (status) => {
    if (status === 'ativo') return 'st-badge-success';
    if (status === 'pendente') return 'st-badge-warning';
    return 'st-badge-danger';
  };

  return (
    <div className="st-crud-shell page-matricula">
      {toast && (
        <div className={`st-toast ${toast.type}`}>
          <i className={toast.type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'}></i>
          <span>{toast.msg}</span>
        </div>
      )}

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
            title={isDark ? 'Tema claro' : 'Tema escuro'}
          >
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button type="button" className="st-btn st-btn-primary st-btn-sm" onClick={() => navigate('/')}>
            <i className="fas fa-home"></i> Início
          </button>
        </div>
      </header>

      <main className="st-crud-container">
        <div className="st-crud-hero st-animate-up">
          <div>
            <span className="st-badge st-badge-success">
              <i className="fas fa-id-card"></i> Secretaria Acadêmica
            </span>
            <h1>Gerenciamento de Matrículas</h1>
            <p>Controle ágil de registros discentes, cursos, semestres e situação cadastral</p>
          </div>
        </div>

        {/* KPIs */}
        <section className="st-kpi-grid">
          <div className="st-kpi-card">
            <div className="st-kpi-icon blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="st-kpi-body">
              <span>Total de Matrículas</span>
              <h3>{total}</h3>
            </div>
          </div>
          <div className="st-kpi-card">
            <div className="st-kpi-icon green">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="st-kpi-body">
              <span>Ativos</span>
              <h3>{activeCount}</h3>
            </div>
          </div>
          <div className="st-kpi-card">
            <div className="st-kpi-icon amber">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div className="st-kpi-body">
              <span>Pendentes</span>
              <h3>{pendingCount}</h3>
            </div>
          </div>
          <div className="st-kpi-card">
            <div className="st-kpi-icon red">
              <i className="fas fa-user-times"></i>
            </div>
            <div className="st-kpi-body">
              <span>Inativos</span>
              <h3>{inactiveCount}</h3>
            </div>
          </div>
        </section>

        <div className="st-dual-grid">
          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className={`fas ${editingId ? 'fa-pen' : 'fa-user-plus'}`}></i>{' '}
                {editingId ? 'Editar Matrícula' : 'Cadastro de Matrícula'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="st-form">
              <div className="st-field">
                <label htmlFor="studentName">Nome do Aluno *</label>
                <input
                  className="st-input"
                  type="text"
                  id="studentName"
                  placeholder="Nome completo"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  required
                />
              </div>

              <div className="st-field">
                <label htmlFor="studentId">Código de Matrícula *</label>
                <input
                  className="st-input"
                  type="text"
                  id="studentId"
                  placeholder="Ex: 2026004"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                />
              </div>

              <div className="st-field">
                <label htmlFor="course">Curso *</label>
                <select
                  className="st-select"
                  id="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  required
                >
                  <option value="">Selecione um curso</option>
                  <option value="Engenharia de Software">Engenharia de Software</option>
                  <option value="Ciência da Computação">Ciência da Computação</option>
                  <option value="Sistemas de Informação">Sistemas de Informação</option>
                  <option value="Administração">Administração</option>
                  <option value="Direito">Direito</option>
                </select>
              </div>

              <div className="st-form-row">
                <div className="st-field">
                  <label htmlFor="semester">Semestre *</label>
                  <select
                    className="st-select"
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    required
                  >
                    <option value="2025.1">2025.1</option>
                    <option value="2025.2">2025.2</option>
                    <option value="2026.1">2026.1</option>
                  </select>
                </div>
                <div className="st-field">
                  <label htmlFor="status">Status *</label>
                  <select
                    className="st-select"
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="st-form-row">
                <button type="submit" className="st-btn st-btn-emerald">
                  <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'}`}></i>{' '}
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
                <button type="button" className="st-btn st-btn-outline" onClick={clearForm}>
                  Limpar
                </button>
              </div>
            </form>
          </div>

          <div className="st-card">
            <div className="st-card-header">
              <h2>
                <i className="fas fa-list"></i> Matrículas Realizadas ({filteredEnrollments.length})
              </h2>
            </div>

            <div className="filters-bar">
              <div className="st-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Pesquisar por nome, matrícula ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="st-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="st-table-wrap st-max-h">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>Curso</th>
                    <th>Semestre</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 28, color: 'var(--st-text-muted)' }}>
                        Nenhuma matrícula encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code>{item.studentId}</code>
                        </td>
                        <td>
                          <strong>{item.studentName}</strong>
                        </td>
                        <td>{item.course}</td>
                        <td>{item.semester}</td>
                        <td>
                          <span className={`st-badge ${badgeTone(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="st-btn st-btn-outline st-btn-sm"
                              onClick={() => handleEdit(item)}
                            >
                              <i className="fas fa-pen"></i>
                            </button>
                            <button
                              type="button"
                              className="st-btn st-btn-danger st-btn-sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMatricula;
