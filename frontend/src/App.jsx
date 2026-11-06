import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './pages/Inicio/Inicio';
import LoginAluno from './pages/LoginAluno/LoginAluno';
import LoginProfessor from './pages/LoginProfessor/LoginProfessor';
import EsqueciSenha from './pages/EsqueciSenha/EsqueciSenha';
import CadastroDisciplinas from './pages/CadastroDisciplinas/CadastroDisciplinas';
import CadastroProfessor from './pages/CadastroProfessor/CadastroProfessor';
import CadastroTurmas from './pages/CadastroTurmas/CadastroTurmas';
import DashboardAluno from './pages/DashboardAluno/DashboardAluno';
import DashboardProfessor from './pages/DashboardProfessor/DashboardProfessor';
import DashboardCoordenador from './pages/DashboardCoordenador/DashboardCoordenador';
import DashboardMatricula from './pages/DashboardMatricula/DashboardMatricula';

export function App() {
  return (
    <Routes>
      {/* Rotas Principais */}
      <Route path="/" element={<Inicio />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/login-aluno" element={<LoginAluno />} />
      <Route path="/login-professor" element={<LoginProfessor />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/cadastro-disciplinas" element={<CadastroDisciplinas />} />
      <Route path="/cadastro-professor" element={<CadastroProfessor />} />
      <Route path="/cadastro-turmas" element={<CadastroTurmas />} />
      <Route path="/dashboard/aluno" element={<DashboardAluno />} />
      <Route path="/dashboard/professor" element={<DashboardProfessor />} />
      <Route path="/dashboard/coordenador" element={<DashboardCoordenador />} />
      <Route path="/dashboard/matricula" element={<DashboardMatricula />} />

      {/* Redirecionamentos de rotas legadas HTML */}
      <Route path="/pages/inicio.html" element={<Navigate to="/" replace />} />
      <Route path="/pages/login-aluno.html" element={<Navigate to="/login-aluno" replace />} />
      <Route path="/pages/login-professor.html" element={<Navigate to="/login-professor" replace />} />
      <Route path="/pages/esqueci-senha.html" element={<Navigate to="/esqueci-senha" replace />} />
      <Route path="/pages/cadastro-disciplinas.html" element={<Navigate to="/cadastro-disciplinas" replace />} />
      <Route path="/pages/cadastro-professor.html" element={<Navigate to="/cadastro-professor" replace />} />
      <Route path="/pages/cadastro-turmas.html" element={<Navigate to="/cadastro-turmas" replace />} />
      <Route path="/pages/dashboard/aluno.html" element={<Navigate to="/dashboard/aluno" replace />} />
      <Route path="/pages/dashboard/professor.html" element={<Navigate to="/dashboard/professor" replace />} />
      <Route path="/pages/dashboard/coordenador.html" element={<Navigate to="/dashboard/coordenador" replace />} />
      <Route path="/pages/dashboard/matricula.html" element={<Navigate to="/dashboard/matricula" replace />} />

      {/* Rota Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
