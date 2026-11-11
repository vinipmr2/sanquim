# Studi+ — Colégio Sanquim (Projeto Integrador - FATEC ADS 4º Semestre)

Sistema integrado de gestão acadêmica e escolar desenvolvido para o **Colégio Sanquim** com foco no atendimento a estudantes e cursinhos comunitários.

Arquitetura moderna baseada em:
- **Back-end:** Java 21, Spring Boot 3.3.5, Spring Security 6 (JWT + RBAC), Spring Data JPA, Hibernate, Springdoc OpenAPI 3 (Swagger UI).
- **Banco de Dados:** PostgreSQL 16 (com fallback automático para H2 em memória caso o Docker/PostgreSQL não esteja ativo).
- **Front-end:** React 18, Vite, React Router DOM, Context API e CSS3 responsivo com suporte completo a tema escuro (*dark mode*).
- **Coleção de Testes:** Postman Collection v2.1 exportada e 7 testes de integração automatizados no JUnit 5.

---

## 👥 Credenciais de Acesso Rápido (Pré-carregadas pelo Seed)

| Perfil | Email | Senha | Acesso / Painel |
| :--- | :--- | :--- | :--- |
| **Gestão / Coordenação** | `admin@sanquim.br` | `admin123` | `/dashboard/coordenador` (Gestão global, KPIs, evasão, turmas, alunos e professores) |
| **Docente (Matemática)** | `carlos.santos@sanquim.br` | `prof123` | `/dashboard/professor` (Chamada em lote, avaliações, lançamento de notas e planos de aula) |
| **Docente (Física)** | `ana.oliveira@sanquim.br` | `prof123` | `/dashboard/professor` (Diário de classe e plano pedagógico) |
| **Discente (Aluno)** | `joao.silva@sanquim.br` | `aluno123` | `/dashboard/aluno` (Boletim com médias ponderadas, frequência e linha do tempo de aulas) |
| **Discente (Aluno)** | `maria.oliveira@sanquim.br` | `aluno123` | `/dashboard/aluno` (Portal acadêmico) |

> 💡 **Dica na Tela Inicial:** A página inicial (`http://localhost:3000`) possui atalhos de 1 clique (*Banca Avaliadora FATEC*) que efetuam o login imediato com cada um dos três perfis sem necessidade de digitação.

---

## 📋 Mapeamento de Requisitos Atendidos (Volere US01 a US23)

| ID | Requisito / História de Usuário | Implementação no Sistema |
| :--- | :--- | :--- |
| **US01** | Cadastro de Alunos | Endpoint `POST /api/admin/alunos` e modal de cadastro no Dashboard do Coordenador. |
| **US02** | Matrícula e Enturmação | Endpoint `POST /api/admin/matriculas` com vinculação de discente à turma e verificação de capacidade de vagas. |
| **US03** | Registro de Frequência em Lote | Endpoint `POST /api/diario/chamada` permitindo registrar presenças e faltas da turma inteira de uma só vez, com justificativas. |
| **US04** | Plano de Aula | Endpoint `POST /api/diario/planos-aula` com registro de data, título, objetivos pedagógicos e materiais de apoio. |
| **US05** | Diário de Aulas / Linha do Tempo | Visualização consolidada no Portal do Professor (`/api/diario/planos-aula`) e Linha do Tempo no Portal do Aluno (`/api/aluno/aulas`). |
| **US06** | Cadastro de Professores Voluntários | Fluxo público em etapas em `/cadastro-professor` (`POST /api/professores/cadastro`) e gestão administrativa em `/api/admin/professores`. |
| **US07** | Dashboard Acadêmico com Indicadores | Endpoint `GET /api/admin/stats` exibindo total de alunos, docentes, turmas ativas, taxa de ocupação e média geral da escola. |
| **US08** | Alertas Preventivos de Evasão Escolar | Endpoint `GET /api/admin/alertas-evasao` identificando alunos com faltas excessivas (assiduidade abaixo de 75%), nível de risco e plano de ação. |
| **US09-US15** | Avaliações, Provas e Notas | Endpoints `POST /api/diario/avaliacoes` e `POST /api/diario/avaliacoes/{id}/notas` para aplicação de provas com peso e lançamento de notas. |
| **US16-US20** | Boletim Ponderado e Frequência | Endpoints `GET /api/aluno/boletim` e `GET /api/aluno/frequencia` calculando média aritmética/ponderada e status de aprovação. |
| **US21-US23** | Segurança, RBAC e OpenAPI | Autenticação stateless via JWT Bearer Token, autorização por perfil (`ROLE_GESTAO`, `ROLE_PROFESSOR`, `ROLE_ALUNO`), OpenAPI 3 Swagger UI e fallback H2/Postgres. |

---

## 🚀 Como Executar o Sistema

### Pré-requisitos
- **Java 21** instalado (`java -version`)
- **Node.js 18+** e npm (`node -v`)
- *(Opcional)* Docker / Docker Compose para banco PostgreSQL local (caso não esteja rodando, o backend usará automaticamente banco H2 em memória pré-populado).

---

### Passo 1: Iniciar o Back-end (Spring Boot)

Abra um terminal no diretório `sanquim/backend`:

```bash
cd sanquim/backend
./mvnw spring-boot:run
```

O servidor iniciará na porta **`8085`**:
- **API Base:** `http://localhost:8085/api`
- **Swagger OpenAPI 3:** `http://localhost:8085/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8085/v3/api-docs`
- **H2 Console:** `http://localhost:8085/h2-console` (JDBC URL: `jdbc:h2:mem:studi_db`, Usuário: `sa`, Senha: em branco)

*(Para rodar os testes de integração do backend: `./mvnw test`)*

---

### Passo 2: Iniciar o Front-end (React + Vite)

Abra outro terminal no diretório `sanquim/frontend`:

```bash
cd sanquim/frontend
npm install
npm run dev
```

O front-end estará disponível em:
👉 **`http://localhost:3000`**

O proxy reverso do Vite já está configurado para encaminhar qualquer requisição `/api/*` diretamente para o backend na porta `8085`.

---

## 🧪 Como Testar via Swagger e Postman

### 1. Swagger UI Interativo
Acesse **`http://localhost:8085/swagger-ui.html`**:
1. Clique no botão **`Authorize`** (cadeado verde no topo direito).
2. Faça login pelo endpoint `POST /api/auth/login` (ex: `admin@sanquim.br` / `admin123`).
3. Copie o `token` retornado no JSON e cole no campo de autorização do Swagger.
4. Teste qualquer rota administrativa ou do diário diretamente na documentação.

### 2. Coleção Postman Oficial
O arquivo de coleção Postman está disponível na raiz:
- `Colegio_Sanquim_API.postman_collection.json`

A coleção possui:
- **Variáveis dinâmicas de coleção** (`{{token}}`, `{{profToken}}`, `{{alunoToken}}`).
- **Scripts de teste automáticos:** ao executar a requisição de login, o token JWT retornado é automaticamente salvo e reutilizado em todas as requisições subsequentes daquela categoria.
- **Testes de segurança RBAC:** inclui validações de status `401 Unauthorized` e `403 Forbidden` quando um aluno tenta acessar rotas administrativas.

---

## 🎨 Principais Destaques do Front-end

1. **Dashboard do Coordenador / Gestão (`/dashboard/coordenador`):**
   - Cards de KPIs globais (Total Alunos, Professores, Turmas, Média Geral, Taxa de Evasão).
   - Tabela inteligente de **Alertas de Evasão** com classificação por nível de risco (Crítico, Médio, Regular) e recomendação pedagógica de contato imediato.
   - Gerenciamento completo (CRUD com busca e modais) de Alunos, Professores, Turmas, Disciplinas e Matrículas (Enturmação).

2. **Dashboard do Professor (`/dashboard/professor`):**
   - Seletor dinâmico de turma ativa com contagem de alunos enturmados.
   - **Chamada Digital em Lote:** marcação individual de Presença/Ausência, botões de ação rápida (*"Todos Presentes"* / *"Todos Ausentes"*), campo para justificativa e envio em lote para a API.
   - **Avaliações & Lançamento de Notas:** cadastro de provas, trabalhos e simulados com peso e nota máxima, além de tabela de digitação de notas por aluno com feedback instantâneo.
   - **Planos de Aula:** registro de conteúdo ministrado, objetivos e materiais de apoio com linha do tempo visual.
   - Histórico analítico de chamadas realizadas com taxa percentual de assiduidade.

3. **Dashboard do Aluno (`/dashboard/aluno`):**
   - Identificação do discente com matrícula, turma e status.
   - Cards de média ponderada geral e assiduidade calculadas pelo backend.
   - **Boletim Detalhado:** notas de cada prova/trabalho, média final da disciplina e pílula de status (Aprovado / Em Curso).
   - **Relatório de Frequência:** percentual por matéria com barras de progresso indicativas da regra dos 75% da LDB.
   - **Linha do Tempo Pedagógica:** aulas ministradas pelos professores com indicação de presença/falta e materiais didáticos recomendados.
