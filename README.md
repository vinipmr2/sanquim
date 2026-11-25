# Studi+ — Colégio Sanquim
### Projeto Integrador / Programação de Scripts Backend — FATEC Arthur de Azevedo (Mogi Mirim)
**Curso:** Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS) — 4º Semestre  

---

## Integrantes da Equipe
- **Beatriz Mariana Antolini Carvalheiro**
- **Caio Vitor de Souza Torres Morais**
- **Lorran Nascimento Dias**
- **Vinícius Pacheco Marques Ribeiro**

---

## Contexto e Arquitetura do Sistema
Sistema integrado de gestão acadêmica e escolar desenvolvido para o **Colégio Sanquim**, em conformidade com a especificação da disciplina de Programação de Scripts Backend e requisitos de Engenharia de Software (Volere US01 a US23).

- **Linguagem e Plataforma:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.5
- **Segurança e Tokens:** Spring Security 6 com autenticação Stateless via JWT Bearer Token e controle de acesso estrito baseado em papéis (**RBAC**: `ROLE_GESTAO`, `ROLE_PROFESSOR`, `ROLE_ALUNO`).
- **Acesso a Dados e ORM:** Spring Data JPA + Hibernate ORM
- **Validação de Dados:** Jakarta Bean Validation (`@Valid`) utilizando DTOs / Records (sem exposição de `@Entity` nos Controllers).
- **Tratamento Global de Exceções:** `@RestControllerAdvice` com padronização de códigos HTTP (400 com lista de campos inválidos, 401 Unauthorized, 403 Forbidden e 404 Not Found).
- **Criptografia:** Senhas protegidas via `BCryptPasswordEncoder`.
- **Documentação da API:** Springdoc OpenAPI 3 (Swagger UI interativo acessível em `/swagger-ui.html`).
- **Banco de Dados Relacional:** PostgreSQL 16 com fallback automático para H2 em memória caso o banco local não esteja em execução.
- **Carga Inicial de Dados (Seed):** Inicialização de 1 Gestor, 2 Professores com turmas atribuídas, 5 Alunos enturmados, Chamadas em lote e Avaliações com notas.
- **Front-end Web:** React 18, Vite, React Router DOM, Context API e CSS3 com suporte a tema claro e escuro.

---

## Credenciais de Teste (Seed Inicial)

| Perfil | E-mail | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **Gestão / Coordenação (`ROLE_GESTAO`)** | `admin@sanquim.br` | `admin123` | `/dashboard/coordenador` (Gestão de turmas, alunos, professores, disciplinas e matrículas) |
| **Docente Matemática (`ROLE_PROFESSOR`)** | `carlos.santos@sanquim.br` | `prof123` | `/dashboard/professor` (Chamada em lote, avaliações, notas e planos de aula) |
| **Docente Física (`ROLE_PROFESSOR`)** | `ana.oliveira@sanquim.br` | `prof123` | `/dashboard/professor` (Diário de classe e plano pedagógico) |
| **Discente (`ROLE_ALUNO`)** | `joao.silva@sanquim.br` | `aluno123` | `/dashboard/aluno` (Consulta de boletim, frequência acumulada e histórico de aulas) |
| **Discente (`ROLE_ALUNO`)** | `maria.oliveira@sanquim.br` | `aluno123` | `/dashboard/aluno` (Portal acadêmico com médias ponderadas) |

Na tela inicial (`http://localhost:3000`), constam botões de acesso rápido com preenchimento automático para cada perfil.

---

## Endpoints da API

### 1. Autenticação (`/api/auth`)
- `POST /api/auth/login` — Autentica e-mail/senha e emite JWT assinado com expiração e perfil `ROLE_`.

### 2. Gestão Administrativa (`/api/admin`) — Exclusivo `ROLE_GESTAO`
- `POST /api/admin/professores` e `GET /api/admin/professores` — Cadastro e listagem de docentes.
- `POST /api/admin/alunos` e `GET /api/admin/alunos` — Cadastro e listagem de discentes.
- `POST /api/admin/turmas` — Criação de turmas letivas.
- `POST /api/admin/disciplinas` — Cadastro de componentes curriculares.
- `POST /api/admin/matriculas` — Vínculo de enturmação de discentes.
- `GET /api/admin/stats` — Indicadores globais da instituição.
- `GET /api/admin/alertas-evasao` — Indicadores de assiduidade e risco de evasão escolar (frequência < 75%).

### 3. Pedagógico e Diário de Classe (`/api/diario`) — `ROLE_PROFESSOR` e `ROLE_GESTAO`
- `GET /api/diario/minhas-turmas` — Lista turmas e disciplinas sob responsabilidade do docente autenticado.
- `POST /api/diario/chamada` — Registro de frequência em lote (`turmaId`, `disciplinaId`, `dataAula`, `registros: [{alunoId, presente}]`).
- `POST /api/diario/avaliacoes` — Cadastro de atividade avaliativa com peso e nota máxima.
- `POST /api/diario/avaliacoes/{avaliacaoId}/notas` — Lançamento e atualização de notas dos discentes.
- `POST /api/diario/planos-aula` — Registro de planejamento pedagógico e conteúdo ministrado.

### 4. Módulo do Aluno (`/api/aluno`) — Exclusivo `ROLE_ALUNO`
- `GET /api/aluno/boletim` — Consulta discriminada de notas com cálculo de média parcial/ponderada.
- `GET /api/aluno/frequencia` — Consulta de percentual global de presença e faltas por disciplina.
- `GET /api/aluno/aulas` — Histórico cronológico de tópicos lecionados na turma.

---

## Como Executar o Projeto

### Pré-requisitos
- Java 21 (LTS)
- Node.js 18+ e npm
- (Opcional) PostgreSQL 16 (caso ausente, o sistema ativa automaticamente o banco H2 em memória com dados pré-carregados).

---

### Back-end (Spring Boot)
No diretório `sanquim/backend`:

```bash
cd sanquim/backend
./mvnw spring-boot:run
```

Porta padrão: `8085`
- API Base: `http://localhost:8085/api`
- Swagger UI: `http://localhost:8085/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8085/v3/api-docs`
- Console H2: `http://localhost:8085/h2-console` (`jdbc:h2:mem:studi_db`, Usuário: `sa`, Senha em branco)

Testes de integração automatizados:
```bash
./mvnw test
```

---

### Front-end (React + Vite)
No diretório `sanquim/frontend`:

```bash
cd sanquim/frontend
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:3000`

---

## Testes via Swagger e Postman

### Swagger UI
Disponível em `http://localhost:8085/swagger-ui.html`:
1. Execute `POST /api/auth/login` (ex: `admin@sanquim.br` / `admin123`).
2. Copie o `token` gerado na resposta.
3. Clique em **Authorize** no canto superior direito e insira o token.
4. Execute as requisições protegidas diretamente pela interface.

### Coleção Postman
O arquivo da coleção está versionado na raiz do repositório:
- `Colegio_Sanquim_API.postman_collection.json`
- Requisições organizadas por módulo (Autenticação, Gestão, Diário de Classe, Portal do Aluno e Segurança RBAC).
- Scripts automáticos para armazenamento dinâmico de token (`{{token}}`, `{{profToken}}`, `{{alunoToken}}`).
- Validações de segurança com testes para respostas `401 Unauthorized` e `403 Forbidden`.
