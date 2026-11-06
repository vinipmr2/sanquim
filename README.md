# Studi+ — Cursinho Gratuito

Plataforma educacional do Colégio Sanquim, estruturada em arquitetura moderna com **Front-end em React**, **Back-end em Java com Spring Boot** e **Banco de Dados PostgreSQL**.

---

## 📁 Estrutura do Projeto

```
.
├── frontend/                 # Front-end (React + Vite + React Router)
│   ├── src/                  # Componentes, contextos e páginas SPA
│   ├── public/               # Imagens e assets estáticos
│   ├── package.json
│   └── vite.config.js        # Configuração com proxy reverso para o backend (/api)
│
├── backend/                  # Back-end API (Java 21 + Spring Boot 3)
│   ├── src/main/java/        # Controllers, Models, DTOs, Repositories e Services
│   ├── src/main/resources/   # application.properties (Conexão PostgreSQL e JPA)
│   ├── pom.xml               # Dependências Maven
│   └── mvnw                  # Maven Wrapper
│
├── db/                       # Banco de Dados (PostgreSQL)
│   ├── init.sql              # Script DDL e DML inicial (Seed)
│   └── docker-compose.yml    # Configuração isolada do PostgreSQL 16
│
├── docs/                     # Documentações do projeto e código legado
│   ├── referencias/          # Material de especificação das aulas
│   └── legacy-php/           # Scripts PHP originais arquivados para referência
│
└── docker-compose.yml        # Orquestração do ambiente completo
```

---

## 🚀 Como Executar o Projeto

### 1. Banco de Dados (PostgreSQL)

Inicie o container PostgreSQL com Docker Compose a partir da raiz:

```bash
docker compose up -d db
```

Isso inicializa o PostgreSQL na porta `5432` com:
- **Banco**: `studi_db`
- **Usuário**: `studi_user`
- **Senha**: `studi_password`
- As tabelas e dados iniciais (`usuario`, `disciplina`, `turma`, `matricula`) serão criados automaticamente através de `db/init.sql`.

---

### 2. Back-end (Java + Spring Boot)

Entre no diretório `backend`:

```bash
cd backend
```

Compile e execute com o Maven Wrapper:

```bash
./mvnw spring-boot:run
```

A API REST estará rodando em: **<http://localhost:8080>**

#### Endpoints Principais:
- `POST /api/auth/login/aluno` - Autenticação de alunos
- `POST /api/auth/login/professor` - Autenticação de professores e coordenadores
- `POST /api/auth/cadastro/aluno` - Cadastro de novos alunos
- `POST /api/auth/esqueci-senha` - Recuperação de senha
- `GET /api/disciplinas` | `POST /api/disciplinas` - CRUD de disciplinas
- `GET /api/turmas` | `POST /api/turmas` - CRUD de turmas
- `GET /api/matriculas` | `POST /api/matriculas` - CRUD de matrículas
- `GET /api/professores` | `POST /api/professores/cadastro` - Gestão e cadastro de professores

---

### 3. Front-end (React + Vite)

Entre no diretório `frontend`:

```bash
cd frontend
```

Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

Acesse a aplicação no navegador em: **<http://localhost:3000>**

Todas as requisições para `/api/*` são roteadas automaticamente para o backend Spring Boot através do proxy configurado no Vite.

---

## 👥 Credenciais Iniciais de Demonstração (Seed)

| Perfil | Usuário / E-mail | Senha | Destino |
| --- | --- | --- | --- |
| **Aluno** | `aluno` ou `aluno@sanquim.edu.br` | `123456` | Portal do Aluno (`/dashboard/aluno`) |
| **Professor** | `professor` ou `professor@sanquim.edu.br` | `123456` | Portal do Professor (`/dashboard/professor`) |
| **Coordenador** | `coordenador` ou `coordenador@sanquim.edu.br` | `123456` | Portal do Coordenador (`/dashboard/coordenador`) |
