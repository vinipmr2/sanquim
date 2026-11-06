import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardMatricula.css';

export const DashboardMatricula = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([
    {
      id: 1,
      studentId: '2025001',
      studentName: 'João Silva',
      course: 'Engenharia de Software',
      semester: '2025.1',
      status: 'ativo'
    },
    {
      id: 2,
      studentId: '2025002',
      studentName: 'Maria Santos',
      course: 'Ciência da Computação',
      semester: '2025.1',
      status: 'ativo'
    },
    {
      id: 3,
      studentId: '2025003',
      studentName: 'Pedro Oliveira',
      course: 'Administração',
      semester: '2025.1',
      status: 'pendente'
    }
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

  const clearForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      course: '',
      semester: '2025.1',
      status: 'ativo'
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.studentId.trim() || !formData.course) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingId) {
      setEnrollments(prev => prev.map(item => item.id === editingId ? {
        ...item,
        ...formData
      } : item));
      alert('Matrícula atualizada com sucesso!');
    } else {
      const newEnrollment = {
        id: Date.now(),
        ...formData
      };
      setEnrollments(prev => [newEnrollment, ...prev]);
      alert('Matrícula adicionada com sucesso!');
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
      setEnrollments(prev => prev.filter(item => item.id !== id));
      if (editingId === id) clearForm();
    }
  };

  const filteredEnrollments = enrollments.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const total = enrollments.length;
  const activeCount = enrollments.filter(e => e.status === 'ativo').length;
  const pendingCount = enrollments.filter(e => e.status === 'pendente').length;
  const inactiveCount = enrollments.filter(e => e.status === 'inativo').length;

  return (
    <div className="page-matricula">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      <header className="header">
        <div className="logo">
          <div onClick={() => navigate('/')} className="logo-link" style={{ cursor: 'pointer' }}>
            <img src="/assets/img/logo.webp" alt="Logo" />
          </div>
        </div>
        <button onClick={() => navigate('/')} className="home-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          Início
        </button>
      </header>

      <div className="container">
        <div className="title">
          <h1><b>Sistema de Gerenciamento</b></h1>
          <p><i>Matrículas Acadêmicas</i></p>
        </div>

        <div className="main-content">
          <div className="form-section">
            <h2>{editingId ? 'Editar Matrícula' : 'Cadastro de Matrícula'}</h2>
            <form id="enrollmentForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentName">Nome do Aluno</label>
                <input 
                  type="text" 
                  id="studentName" 
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentId">Matrícula</label>
                <input 
                  type="text" 
                  id="studentId" 
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Curso</label>
                <select 
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

              <div className="form-group">
                <label htmlFor="semester">Semestre</label>
                <select 
                  id="semester" 
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                >
                  <option value="">Selecione o semestre</option>
                  <option value="2025.1">2025.1</option>
                  <option value="2025.2">2025.2</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select 
                  id="status" 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" id="submitBtn">
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={clearForm}>
                  Limpar
                </button>
              </div>
            </form>
          </div>

          <div className="table-section">
            <h2>Matrículas Realizadas</h2>
            
            <div className="filters">
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou matrícula..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>

            <table className="enrollment-table">
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
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Nenhuma matrícula encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.studentId}</td>
                      <td>{item.studentName}</td>
                      <td>{item.course}</td>
                      <td>{item.semester}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEdit(item)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="stats">
              <div className="stat-card">
                <h3>Total</h3>
                <p>{total}</p>
              </div>
              <div className="stat-card">
                <h3>Ativos</h3>
                <p>{activeCount}</p>
              </div>
              <div className="stat-card">
                <h3>Pendentes</h3>
                <p>{pendingCount}</p>
              </div>
              <div className="stat-card">
                <h3>Inativos</h3>
                <p>{inactiveCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMatricula;
