-- ======================================================
-- Studi+ — Cursinho Gratuito
-- Esquema de Banco de Dados PostgreSQL
-- ======================================================

-- Criação das tabelas

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    usuario VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('ALUNO', 'PROFESSOR', 'COORDENADOR', 'ADMIN')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplina (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    carga_horaria INT NOT NULL,
    creditos INT,
    periodo VARCHAR(20),
    professor_responsavel VARCHAR(150) NOT NULL,
    departamento VARCHAR(150),
    ementa TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turma (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    disciplina_id INT REFERENCES disciplina(id) ON DELETE SET NULL,
    disciplina_nome VARCHAR(150),
    professor_responsavel VARCHAR(150) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    vagas INT NOT NULL DEFAULT 30,
    vagas_ocupadas INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA' CHECK (status IN ('ATIVA', 'INATIVA', 'FINALIZADA')),
    horario VARCHAR(100),
    sala VARCHAR(100),
    data_inicio DATE,
    data_fim DATE,
    observacoes TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matricula (
    id SERIAL PRIMARY KEY,
    matricula_codigo VARCHAR(50) NOT NULL UNIQUE,
    aluno_nome VARCHAR(150) NOT NULL,
    curso VARCHAR(150) NOT NULL,
    semestre VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
    turma_id INT REFERENCES turma(id) ON DELETE SET NULL,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS professor_detalhes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    cpf VARCHAR(20),
    telefone VARCHAR(30),
    data_nascimento DATE,
    genero VARCHAR(30),
    endereco TEXT,
    formacao VARCHAR(200),
    instituicao VARCHAR(200),
    disciplinas_atuacao TEXT,
    experiencia VARCHAR(50),
    registro_profissional VARCHAR(100),
    experiencia_detalhada TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- Dados Iniciais (Seed)
-- ======================================================

-- Senha padrão para usuários iniciais: 123456
INSERT INTO usuario (nome, email, usuario, senha, perfil, ativo)
VALUES 
    ('Aluno Santos', 'aluno@sanquim.edu.br', 'aluno', '123456', 'ALUNO', TRUE),
    ('Prof. Carlos Santos', 'professor@sanquim.edu.br', 'professor', '123456', 'PROFESSOR', TRUE),
    ('Coord. Santos', 'coordenador@sanquim.edu.br', 'coordenador', '123456', 'COORDENADOR', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO disciplina (nome, codigo, carga_horaria, creditos, periodo, professor_responsavel, departamento, ementa)
VALUES 
    ('Matemática Aplicada', 'MAT001', 60, 4, '2025.1', 'Prof. Carlos Santos', 'Departamento de Exatas', 'Funções, derivadas e aplicações práticas para resolução de problemas.'),
    ('Física Geral', 'FIS001', 80, 5, '2025.1', 'Profa. Ana Oliveira', 'Departamento de Exatas', 'Mecânica newtoniana, leis do movimento e conservação de energia.'),
    ('Redação e Literatura', 'LET001', 60, 4, '2025.1', 'Profa. Costa', 'Departamento de Humanas', 'Técnicas de redação dissertativo-argumentativa para ENEM e vestibulares.')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO turma (nome, codigo, disciplina_id, disciplina_nome, professor_responsavel, periodo, vagas, vagas_ocupadas, status, horario, sala, data_inicio, data_fim, observacoes)
VALUES 
    ('Turma A - Matemática 2025.1', 'MAT001-A', 1, 'Matemática Aplicada', 'Prof. Carlos Santos', '2025.1', 35, 28, 'ATIVA', 'Seg/Qua 14:00-16:00', 'Sala 101 - Bloco A', '2025-02-10', '2025-06-25', 'Turma preparatória focada em exatas.'),
    ('Turma B - Física Vestibular', 'FIS001-B', 2, 'Física Geral', 'Profa. Ana Oliveira', '2025.1', 30, 30, 'ATIVA', 'Ter/Qui 16:00-18:00', 'Laboratório 2', '2025-02-11', '2025-06-26', 'Turma intensiva com lista de espera.')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO matricula (matricula_codigo, aluno_nome, curso, semestre, status, turma_id)
VALUES 
    ('2025001', 'João Silva', 'Engenharia de Software', '2025.1', 'ativo', 1),
    ('2025002', 'Maria Santos', 'Ciência da Computação', '2025.1', 'ativo', 1),
    ('2025003', 'Pedro Oliveira', 'Administração', '2025.1', 'pendente', 2)
ON CONFLICT (matricula_codigo) DO NOTHING;
