# Studi+ — Colégio Sanquim
### Projeto Integrador / Programação de Scripts Backend — FATEC Arthur de Azevedo (Mogi Mirim)
**Curso:** Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (ADS) — 4º Semestre  

---

## 🎓 Integrantes da Equipe:
- **Beatriz Mariana Antolini Carvalheiro**
- **Caio Vitor de Souza Torres Morais**
- **Lorran Nascimento Dias**
- **Vinícius Pacheco Marques Ribeiro**

---

## 📌 Contexto e Arquitetura do Sistema
Sistema integrado de gestão acadêmica e escolar desenvolvido para o **Colégio Sanquim**, em total conformidade com a especificação **"Orientação de Projeto: API REST — Colégio Sanquim"** (`ProjetoSanquin.pdf`) e os requisitos de Engenharia de Software (Volere US01 a US23).

- **Linguagem & Plataforma:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3.5
- **Segurança & Tokens:** Spring Security 6 com autenticação Stateless via JWT Bearer Token e controle de acesso estrito baseado em papéis (**RBAC**: `ROLE_GESTAO`, `ROLE_PROFESSOR`, `ROLE_ALUNO`).
- **Acesso a Dados & ORM:** Spring Data JPA + Hibernate ORM
- **Validação de Dados:** Jakarta Bean Validation (`@Valid`) utilizando exclusivamente DTOs / Records (sem exposição de `@Entity` nos Controllers).
- **Tratamento Global de Exceções:** `@RestControllerAdvice` com padronização de códigos HTTP (400 com lista de campos inválidos, 401 Unauthorized, 403 Forbidden e 404 Not Found).
- **Criptografia:** Senhas protegidas compulsoriamente via `BCryptPasswordEncoder`.
- **Documentação Viva da API:** Springdoc OpenAPI 3 (Swagger UI interativo acessível em `/swagger-ui.html`).
- **Banco de Dados Relacional:** PostgreSQL 16 com **fallback automático para H2 em memória** caso o banco PostgreSQL local/Docker não esteja em execução (permitindo execução imediata sem configurações adicionais).
- **Seed Automático de Dados (`DataLoader`):** Criação imediata de 1 Gestor, 2 Professores com turmas, 5 Alunos enturmados, Chamadas em lote e Avaliações com notas.
- **Front-end Web (Bônus Funcional):** React 18, Vite, React Router DOM, Context API e CSS3 com isolamento 100% escopado e suporte a tema claro e escuro.

---

## 👥 Credenciais Pré-carregadas (Seed Automático)

| Perfil | E-mail | Senha | Painel / Acesso |
| :--- | :--- | :--- | :--- |
| **Gestão / Coordenação (`ROLE_GESTAO`)** | `admin@sanquim.br` | `admin123` | `/dashboard/coordenador` (Gestão total: alunos, professores, turmas, disciplinas, enturmações e KPIs) |
| **Docente Matemática (`ROLE_PROFESSOR`)** | `carlos.santos@sanquim.br` | `prof123` | `/dashboard/professor` (Chamada em lote, avaliações, lançamento de notas e planos de aula) |
| **Docente Física (`ROLE_PROFESSOR`)** | `ana.oliveira@sanquim.br` | `prof123` | `/dashboard/professor` (Diário de classe e plano pedagógico) |
| **Discente (`ROLE_ALUNO`)** | `joao.silva@sanquim.br` | `aluno123` | `/dashboard/aluno` (Consulta de boletim, frequência acumulada e linha do tempo de aulas) |
| **Discente (`ROLE_ALUNO`)** | `maria.oliveira@sanquim.br` | `aluno123` | `/dashboard/aluno` (Portal acadêmico com médias ponderadas) |

> 💡 **Atalho na Tela Inicial:** A interface web (`http://localhost:3000`) possui botões de 1 clique (*Banca Avaliadora FATEC*) para login instantâneo com qualquer um dos perfis.

---

## 📋 Mapeamento Completo de Endpoints (`ProjetoSanquin.pdf`)

### 1. Autenticação (`/api/auth`) — Público
- `POST /api/auth/login` — Autentica e-mail/senha e emite JWT assinado com expiração e perfil `ROLE_`.

### 2. Gestão Administrativa (`/api/admin`) — Exclusivo `ROLE_GESTAO`
- `POST /api/admin/professores` e `GET /api/admin/professores` — Cadastro e listagem de docentes.
- `POST /api/admin/alunos` e `GET /api/admin/alunos` — Cadastro e listagem de discentes.
- `POST /api/admin/turmas` — Criação de turmas letivas.
- `POST /api/admin/disciplinas` — Cadastro de componentes curriculares.
- `POST /api/admin/matriculas` — Vínculo de enturmação de discentes.
- `GET /api/admin/stats` — Indicadores globais da escola.
- `GET /api/admin/alertas-evasao` — Alertas preditivos de risco de evasão escolar (assiduidade < 75%).

### 3. Pedagógico e Diário de Classe (`/api/diario`) — `ROLE_PROFESSOR` e `ROLE_GESTAO`
- `GET /api/diario/minhas-turmas` — Lista turmas e disciplinas sob responsabilidade do docente autenticado.
- `POST /api/diario/chamada` — Registro de frequência em lote (`turmaId`, `disciplinaId`, `dataAula`, `registros: [{alunoId, presente}]`).
- `POST /api/diario/avaliacoes` — Cadastro de atividade avaliativa com peso e nota máxima.
- `POST /api/diario/avaliacoes/{avaliacaoId}/notas` — Lançamento e atualização de notas dos alunos.
- `POST /api/diario/planos-aula` — Registro de planejamento pedagógico e conteúdo ministrado.

### 4. Módulo do Aluno (`/api/aluno`) — Exclusivo `ROLE_ALUNO`
- `GET /api/aluno/boletim` — Consulta discriminada de notas com cálculo de média parcial/ponderada.
- `GET /api/aluno/frequencia` — Consulta de percentual global de presença e faltas por componente.
- `GET /api/aluno/aulas` — Linha do tempo cronológica de tópicos lecionados na turma.

---

## 🚀 Como Executar o Sistema

### Pré-requisitos
- **Java 21 (LTS)** instalado (`java -version`)
- **Node.js 18+** e npm (`node -v`)
- *(Opcional)* Docker / PostgreSQL 16 (se o PostgreSQL não estiver rodando, o backend ativa automaticamente o banco H2 em memória com todos os dados de teste).

---

### Passo 1: Executar o Back-end (Spring Boot)
Abra um terminal no diretório `sanquim/backend`:

```bash
cd sanquim/backend
./mvnw spring-boot:run
```

O servidor iniciará na porta **`8085`**:
- **API Base:** `http://localhost:8085/api`
- **Swagger OpenAPI 3 (Documentação Viva):** `http://localhost:8085/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8085/v3/api-docs`
- **Console H2 (em modo desenvolvimento):** `http://localhost:8085/h2-console` (`jdbc:h2:mem:studi_db`, Usuário: `sa`, Senha: em branco)

*(Para rodar os testes de integração automatizados do backend: `./mvnw test`)*

---

### Passo 2: Executar o Front-end (React + Vite)
Abra outro terminal no diretório `sanquim/frontend`:

```bash
cd sanquim/frontend
npm install
npm run dev
```

Acesse no navegador:
👉 **`http://localhost:3000`**

O proxy reverso do Vite já está configurado para redirecionar `/api/*` diretamente para o backend na porta `8085`.

---

## 🧪 Como Testar via Swagger e Postman

### 1. Swagger UI Interativo
Acesse **`http://localhost:8085/swagger-ui.html`**:
1. Execute `POST /api/auth/login` (ex: `admin@sanquim.br` / `admin123`).
2. Copie o `token` retornado.
3. Clique no botão **`Authorize`** (cadeado verde no topo direito) e cole o token.
4. Execute qualquer rota protegida por perfil diretamente na interface.

### 2. Coleção do Postman Oficial
O arquivo exportado da coleção está disponível na raiz do repositório:
- **`Colegio_Sanquim_API.postman_collection.json`**
- Contém todas as pastas organizadas por módulo (`01 - Autenticacao`, `02 - Gestao Administrativa`, `03 - Diario de Classe & Docencia`, `04 - Portal do Aluno`, `05 - Testes de Seguranca RBAC`).
- Possui scripts de teste que salvam automaticamente os tokens JWT nas variáveis `{{token}}`, `{{profToken}}` e `{{alunoToken}}`.
- Inclui testes assertivos de segurança validando status `401 Unauthorized` e `403 Forbidden` quando discentes tentam acessar rotas da gestão.

---

## 🎤 Roteiro de Apresentação Técnica para a Banca / Professor (12 a 15 Minutos)

Seguindo rigorosamente a dinâmica do **Item 6.3 do ProjetoSanquin.pdf**:

### ⏱️ Parte 1: Arquitetura, Modelo de Dados e Pacotes (3 minutos)
1. **Apresentar a Arquitetura em Camadas:**
   - Mostrar a estrutura de pacotes: `config`, `controller`, `dto`, `exception`, `model`, `repository`, `service`, `seed`.
   - Ressaltar que os Controllers utilizam apenas **DTOs** (nenhuma `@Entity` é exposta diretamente) e validação `@Valid`.
   - Mostrar o `@RestControllerAdvice` (`GlobalExceptionHandler`) padronizando respostas de erro com códigos HTTP semânticos (400, 401, 403, 404).
2. **Segurança e Persistência:**
   - Explicar o `SecurityConfig` stateless com JWT Bearer Token e `BCryptPasswordEncoder`.
   - Mostrar a resiliência do `DataSourceConfig` que faz fallback transparente entre PostgreSQL e H2.

### ⏱️ Parte 2: Demonstração Prática ao Vivo (7 minutos)
1. **Cenário Gestão (`ROLE_GESTAO`):**
   - No Swagger ou Postman, autenticar com `admin@sanquim.br` / `admin123`.
   - Demonstrar a listagem de professores e alunos (`GET /api/admin/professores`, `GET /api/admin/alunos`).
   - Mostrar a criação de uma nova turma ou matrícula (`POST /api/admin/turmas`).
2. **Cenário Professor (`ROLE_PROFESSOR`):**
   - Autenticar com `carlos.santos@sanquim.br` / `prof123`.
   - Consultar as turmas atribuídas (`GET /api/diario/minhas-turmas`).
   - Enviar uma **chamada em lote** (`POST /api/diario/chamada`) com presenças e faltas da turma.
   - Criar uma avaliação (`POST /api/diario/avaliacoes`) e lançar notas (`POST /api/diario/avaliacoes/{id}/notas`).
3. **Cenário Aluno (`ROLE_ALUNO`):**
   - Autenticar com `joao.silva@sanquim.br` / `aluno123`.
   - Consultar o boletim com notas e média ponderada (`GET /api/aluno/boletim`).
   - Consultar a assiduidade e percentual de frequência (`GET /api/aluno/frequencia`).
4. **Cenário Prova de Segurança (RBAC - Bloqueio 403):**
   - Com o token do **aluno**, tentar fazer uma requisição para `POST /api/admin/turmas` ou `GET /api/admin/professores`.
   - Demonstrar o retorno com código **`403 Forbidden`**, comprovando o bloqueio de segurança em camadas do Spring Security.
5. **(Opcional / Destaque Visual):**
   - Abrir o navegador em `http://localhost:3000` e mostrar como o front-end consome exatamente essa mesma API REST em tempo real.

### ⏱️ Parte 3: Perguntas e Considerações do Professor (3 a 5 minutos)
- A equipe demonstra domínio do código-fonte, respondendo às dúvidas da banca com o código aberto no VS Code / IntelliJ.
