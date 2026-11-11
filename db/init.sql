-- ======================================================
-- Studi+ — Colégio Sanquim (Cursinho Gratuito)
-- Esquema de Banco de Dados PostgreSQL & Dados Iniciais
-- ======================================================

-- 1. Tabela de Usuários (RBAC)
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    usuario VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL, -- ROLE_GESTAO, ROLE_PROFESSOR, ROLE_ALUNO
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Disciplinas
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

-- 3. Tabela de Turmas
CREATE TABLE IF NOT EXISTS turma (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    disciplina_id INT REFERENCES disciplina(id) ON DELETE SET NULL,
    disciplina_nome VARCHAR(150),
    professor_responsavel VARCHAR(150) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    vagas INT NOT NULL DEFAULT 35,
    vagas_ocupadas INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    horario VARCHAR(100),
    sala VARCHAR(100),
    data_inicio DATE,
    data_fim DATE,
    observacoes TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Matrículas
CREATE TABLE IF NOT EXISTS matricula (
    id SERIAL PRIMARY KEY,
    matricula_codigo VARCHAR(50) NOT NULL UNIQUE,
    aluno_nome VARCHAR(150) NOT NULL,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    curso VARCHAR(150) NOT NULL,
    semestre VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo',
    turma_id INT REFERENCES turma(id) ON DELETE SET NULL,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Detalhes dos Professores
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

-- 6. Tabela de Chamada (Diário Pedagógico)
CREATE TABLE IF NOT EXISTS chamada (
    id SERIAL PRIMARY KEY,
    turma_id INT NOT NULL REFERENCES turma(id) ON DELETE CASCADE,
    disciplina_id INT NOT NULL REFERENCES disciplina(id) ON DELETE CASCADE,
    data_aula DATE NOT NULL,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_chamada_turma_disc_data UNIQUE (turma_id, disciplina_id, data_aula)
);

-- 7. Tabela de Registro de Presença Individual
CREATE TABLE IF NOT EXISTS chamada_registro (
    id SERIAL PRIMARY KEY,
    chamada_id INT NOT NULL REFERENCES chamada(id) ON DELETE CASCADE,
    aluno_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    presente BOOLEAN NOT NULL DEFAULT TRUE,
    observacao VARCHAR(255),
    CONSTRAINT uq_chamada_aluno UNIQUE (chamada_id, aluno_id)
);

-- 8. Tabela de Atividades Avaliativas
CREATE TABLE IF NOT EXISTS avaliacao (
    id SERIAL PRIMARY KEY,
    turma_id INT NOT NULL REFERENCES turma(id) ON DELETE CASCADE,
    disciplina_id INT NOT NULL REFERENCES disciplina(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'PROVA',
    peso NUMERIC(4,2) NOT NULL DEFAULT 1.0,
    nota_maxima NUMERIC(4,2) NOT NULL DEFAULT 10.0,
    data_entrega DATE,
    descricao TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Tabela de Lançamento de Notas
CREATE TABLE IF NOT EXISTS nota (
    id SERIAL PRIMARY KEY,
    avaliacao_id INT NOT NULL REFERENCES avaliacao(id) ON DELETE CASCADE,
    aluno_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    valor NUMERIC(4,2) NOT NULL,
    observacao VARCHAR(255),
    data_lancamento TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_avaliacao_aluno UNIQUE (avaliacao_id, aluno_id)
);

-- 10. Tabela de Planos de Aula (Linha do tempo)
CREATE TABLE IF NOT EXISTS plano_aula (
    id SERIAL PRIMARY KEY,
    turma_id INT NOT NULL REFERENCES turma(id) ON DELETE CASCADE,
    disciplina_id INT NOT NULL REFERENCES disciplina(id) ON DELETE CASCADE,
    data_aula DATE NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    topicos TEXT NOT NULL,
    objetivos TEXT,
    materiais_apoio TEXT,
    observacoes TEXT,
    criado_em TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dados Iniciais são gerenciados e populados automaticamente pelo CommandLineRunner do Spring Boot (DataLoader.java).
