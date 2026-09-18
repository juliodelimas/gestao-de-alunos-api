# Mapa do Código-Fonte — Gestão de Alunos API

**Caminho do projeto fonte:** `C:\PosGraduacao\Exercicios\api_rest`
**Stack detectada:** Node.js ES Modules, Express, MongoDB/Mongoose, JWT, bcryptjs
**Última mineração:** 2026-09-17
**Categorias mineradas:** rotas/endpoints, validações e regras, modelos/configurações, seletores frontend, erros/exceções, integrações externas e visão de negócio

> Gerado por leitura estática do código-fonte do SUT. Os itens abaixo são rastreáveis às referências indicadas e não substituem testes executados.

## 1. Rotas e endpoints

As rotas administrativas são montadas com `authenticate` e `authorize('admin')` em `src/routes/admin/index.js:10`. As rotas de autoatendimento usam `authenticate` e `authorizeSelfOrAdmin` em `src/routes/aluno.routes.js:10-15`.

### Autenticação e endpoints técnicos

| ID | Método | Path | Handler/montagem | Auth |
|---|---|---|---|---|
| SRC-EP-001 | POST | `/api/auth/login` | `src/routes/auth.routes.js:6`, `src/controllers/auth.controller.js:4` | Público |
| SRC-EP-002 | GET | `/` | `src/app.js:35-41` | Nenhuma |
| SRC-EP-003 | GET | `/api-docs` | `src/app.js:30` | Nenhuma |
| SRC-EP-004 | GET | `/api-docs.yaml` | `src/app.js:31-33` | Nenhuma |

### Administração de alunos

| ID | Método | Path | Handler | Auth |
|---|---|---|---|---|
| SRC-EP-005 | GET | `/api/admin/alunos` | `src/routes/admin/alunos.routes.js:6`, `src/controllers/alunos.controller.js:13` | `authenticate`, `authorize('admin')` |
| SRC-EP-006 | POST | `/api/admin/alunos` | `src/routes/admin/alunos.routes.js:7`, `src/controllers/alunos.controller.js:21` | `authenticate`, `authorize('admin')` |
| SRC-EP-007 | GET | `/api/admin/alunos/:id` | `src/routes/admin/alunos.routes.js:8`, `src/controllers/alunos.controller.js:17` | `authenticate`, `authorize('admin')` |
| SRC-EP-008 | PUT | `/api/admin/alunos/:id` | `src/routes/admin/alunos.routes.js:9`, `src/controllers/alunos.controller.js:25` | `authenticate`, `authorize('admin')` |
| SRC-EP-009 | DELETE | `/api/admin/alunos/:id` | `src/routes/admin/alunos.routes.js:10`, `src/controllers/alunos.controller.js:29` | `authenticate`, `authorize('admin')` |

### Administração de disciplinas e matrículas

| ID | Método | Path | Handler | Auth |
|---|---|---|---|---|
| SRC-EP-010 | GET | `/api/admin/disciplinas` | `src/routes/admin/disciplinas.routes.js:14`, `src/controllers/disciplinas.controller.js:14` | `authenticate`, `authorize('admin')` |
| SRC-EP-011 | POST | `/api/admin/disciplinas` | `src/routes/admin/disciplinas.routes.js:15`, `src/controllers/disciplinas.controller.js:22` | `authenticate`, `authorize('admin')` |
| SRC-EP-012 | GET | `/api/admin/disciplinas/:id` | `src/routes/admin/disciplinas.routes.js:16`, `src/controllers/disciplinas.controller.js:18` | `authenticate`, `authorize('admin')` |
| SRC-EP-013 | PUT | `/api/admin/disciplinas/:id` | `src/routes/admin/disciplinas.routes.js:17`, `src/controllers/disciplinas.controller.js:26` | `authenticate`, `authorize('admin')` |
| SRC-EP-014 | DELETE | `/api/admin/disciplinas/:id` | `src/routes/admin/disciplinas.routes.js:18`, `src/controllers/disciplinas.controller.js:30` | `authenticate`, `authorize('admin')` |
| SRC-EP-015 | POST | `/api/admin/disciplinas/:id/matriculas` | `src/routes/admin/disciplinas.routes.js:19`, `src/controllers/disciplinas.controller.js:36` | `authenticate`, `authorize('admin')` |
| SRC-EP-016 | GET | `/api/admin/disciplinas/:id/alunos` | `src/routes/admin/disciplinas.routes.js:20`, `src/controllers/disciplinas.controller.js:45` | `authenticate`, `authorize('admin')` |

### Administração de notas

| ID | Método | Path | Handler | Auth |
|---|---|---|---|---|
| SRC-EP-017 | GET | `/api/admin/notas` | `src/routes/admin/notas.routes.js:6`, `src/controllers/notas.controller.js:10` | `authenticate`, `authorize('admin')` |
| SRC-EP-018 | POST | `/api/admin/notas` | `src/routes/admin/notas.routes.js:7`, `src/controllers/notas.controller.js:19` | `authenticate`, `authorize('admin')` |
| SRC-EP-019 | GET | `/api/admin/notas/:id` | `src/routes/admin/notas.routes.js:8`, `src/controllers/notas.controller.js:15` | `authenticate`, `authorize('admin')` |
| SRC-EP-020 | PUT | `/api/admin/notas/:id` | `src/routes/admin/notas.routes.js:9`, `src/controllers/notas.controller.js:24` | `authenticate`, `authorize('admin')` |
| SRC-EP-021 | DELETE | `/api/admin/notas/:id` | `src/routes/admin/notas.routes.js:10`, `src/controllers/notas.controller.js:28` | `authenticate`, `authorize('admin')` |

### Administração de trabalhos

| ID | Método | Path | Handler | Auth |
|---|---|---|---|---|
| SRC-EP-022 | GET | `/api/admin/trabalhos` | `src/routes/admin/trabalhos.routes.js:6`, `src/controllers/trabalhos.controller.js:10` | `authenticate`, `authorize('admin')` |
| SRC-EP-023 | GET | `/api/admin/trabalhos/:id` | `src/routes/admin/trabalhos.routes.js:7`, `src/controllers/trabalhos.controller.js:15` | `authenticate`, `authorize('admin')` |
| SRC-EP-024 | PUT | `/api/admin/trabalhos/:id` | `src/routes/admin/trabalhos.routes.js:8`, `src/controllers/trabalhos.controller.js:19` | `authenticate`, `authorize('admin')` |
| SRC-EP-025 | DELETE | `/api/admin/trabalhos/:id` | `src/routes/admin/trabalhos.routes.js:9`, `src/controllers/trabalhos.controller.js:23` | `authenticate`, `authorize('admin')` |

### Autoatendimento do aluno

| ID | Método | Path | Handler | Auth |
|---|---|---|---|---|
| SRC-EP-026 | GET | `/api/alunos/:alunoId/disciplinas` | `src/routes/aluno.routes.js:12`, `src/controllers/alunos.controller.js:35` | `authenticate`, `authorizeSelfOrAdmin` |
| SRC-EP-027 | GET | `/api/alunos/:alunoId/notas` | `src/routes/aluno.routes.js:13`, `src/controllers/alunos.controller.js:39` | `authenticate`, `authorizeSelfOrAdmin` |
| SRC-EP-028 | GET | `/api/alunos/:alunoId/trabalhos` | `src/routes/aluno.routes.js:14`, `src/controllers/trabalhos.controller.js:33` | `authenticate`, `authorizeSelfOrAdmin` |
| SRC-EP-029 | POST | `/api/alunos/:alunoId/trabalhos` | `src/routes/aluno.routes.js:15`, `src/controllers/trabalhos.controller.js:28` | `authenticate`, `authorizeSelfOrAdmin` |

## 2. Validações e regras de negócio

### Alunos e autenticação

- Cadastro exige `nome`, `email`, `matricula` e `senha` — `src/services/alunos.service.js:17-21`. Trecho: `"if (!nome || !email || !matricula || !senha)"`.
- Matrícula ou e-mail duplicado retorna `409` — `src/services/alunos.service.js:23-26`.
- Atualização aceita alteração parcial dos quatro campos — `src/services/alunos.service.js:34-40`.
- Busca de aluno inexistente retorna `404` — `src/services/alunos.service.js:11-14`.
- A senha não é exposta nas respostas — `src/models/aluno.model.js:35-40`.
- Login exige `email` e `senha` — `src/services/auth.service.js:15-17`.
- O administrador é procurado primeiro; o aluno só é consultado se não houver admin com o mesmo e-mail — `src/services/auth.service.js:19-21`.
- Credenciais inválidas retornam `401` — `src/services/auth.service.js:23-25`.
- O JWT contém `sub`, `role` e `nome`, com expiração configurada — `src/services/auth.service.js:6-9`.
- O token deve ser enviado no formato Bearer — `src/middlewares/authenticate.js:6-18`.

### Autorização

- Rotas administrativas exigem o papel `admin` — `src/routes/admin/index.js:10` e `src/middlewares/authorize.js:4-9`.
- Um aluno só acessa o próprio `alunoId`; um administrador pode acessar qualquer aluno — `src/middlewares/authorizeSelfOrAdmin.js:4-10`. Trechos: `"req.user?.role === 'admin'"` e `"req.user.id === alunoId"`.

### Disciplinas e matrículas

- Disciplina exige `nome` e `codigo` — `src/services/disciplinas.service.js:17-21`.
- Código de disciplina é único; duplicidade retorna `409` — `src/services/disciplinas.service.js:23-26`.
- Matrícula exige `alunoId` — `src/controllers/disciplinas.controller.js:37-42`.
- Aluno e disciplina precisam existir antes da matrícula — `src/services/disciplinas.service.js:45-48`.
- Matrícula duplicada retorna `409` — `src/services/disciplinas.service.js:50-53`.

### Notas

- Criação exige `alunoId`, `disciplinaId`, `valor` e `tipo` — `src/services/notas.service.js:23-26`.
- `valor` deve ser número entre 0 e 10 — `src/services/notas.service.js:27-29`.
- Tipos permitidos: `prova`, `trabalho` e `participacao` — `src/services/notas.service.js:6` e `30-32`.
- Aluno e disciplina precisam existir, e o aluno deve estar matriculado — `src/services/notas.service.js:34-39`.
- Atualização repete as validações de valor e tipo — `src/services/notas.service.js:48-55`.
- Listagem administrativa aceita filtros `alunoId` e `disciplinaId` — `src/services/notas.service.js:8-13`.

### Trabalhos

- Registro exige `disciplinaId` e `titulo` — `src/services/trabalhos.service.js:25-29`.
- Aluno e disciplina precisam existir, e o aluno deve estar matriculado — `src/services/trabalhos.service.js:21-34`.
- Status permitidos: `entregue`, `em_correcao` e `corrigido` — `src/services/trabalhos.service.js:6` e `44-47`.
- Nota de correção aceita `null` ou número entre 0 e 10 — `src/services/trabalhos.service.js:48-50`.
- Listagem aceita filtros `alunoId`, `disciplinaId` e `status` — `src/services/trabalhos.service.js:8-14`.

## 3. Modelos de dados e configurações

### Entidades

| Modelo | Campos principais | Regras/relacionamentos | Origem |
|---|---|---|---|
| `Administrador` | `id`, `nome`, `email`, `senha`, `role` | E-mail único; role padrão `admin`; timestamps | `src/models/admin.model.js:17-27` |
| `Aluno` | `id`, `nome`, `email`, `matricula`, `senha`, `role` | E-mail e matrícula únicos; role padrão `aluno` | `src/models/aluno.model.js:17-27` |
| `Disciplina` | `id`, `nome`, `codigo`, `cargaHoraria` | Código único; carga horária padrão `null` | `src/models/disciplina.model.js:17-25` |
| `Matricula` | `id`, `alunoId`, `disciplinaId`, `dataMatricula` | Referências lógicas a aluno/disciplina; data padrão atual | `src/models/matricula.model.js:17-24` |
| `Nota` | `id`, `alunoId`, `disciplinaId`, `valor`, `tipo`, `descricao` | Referências lógicas; descrição padrão `null` | `src/models/nota.model.js:17-25` |
| `Trabalho` | `id`, `alunoId`, `disciplinaId`, `titulo`, `descricao`, `status`, `nota`, `feedback`, `dataEntrega` | Status padrão `entregue`; nota/feedback padrão `null` | `src/models/trabalho.model.js:17-28` |

Todos os modelos convertem `_id` em `id` e removem `versionKey` — `src/models/aluno.model.js:7-14`. Senhas são hashadas com bcrypt antes do salvamento — `src/models/admin.model.js:29-32` e `src/models/aluno.model.js:29-32`.

### Variáveis de ambiente e configurações

| Nome | Propósito inferido | Onde é lida |
|---|---|---|
| `MONGODB_URI` | Define a conexão do MongoDB | `src/database/db.js:3-9` |
| `PORT` | Define a porta HTTP | `src/server.js:3-7` |
| `JWT_SECRET` | Define a chave de assinatura dos tokens | `src/config/jwt.js:1` |
| `JWT_EXPIRES_IN` | Define a validade do JWT | `src/config/jwt.js:2` |
| `NODE_ENV` | Não encontrado no código minerado | `[NÃO INFERÍVEL DO CÓDIGO]` |

Valores sensíveis não foram registrados.

## 4. Seletores de frontend

**Resultado:** nenhum seletor frontend encontrado.

O SUT não contém stack frontend nem arquivos JSX, TSX, Vue ou Angular. Não foram encontrados `data-testid`, `data-test` ou `aria-label`. O termo `role` aparece como atributo de autorização JWT, não como seletor de UI — `src/middlewares/authorizeSelfOrAdmin.js:5-6`.

## 5. Erros e exceções explícitos

O middleware `src/middlewares/errorHandler.js:4-12` serializa `ApiError` como `{ "error": mensagem }` e usa `500` com `"Erro interno do servidor."` para erros não classificados.

### Autenticação, autorização e infraestrutura

| ID | Status | Mensagem | Origem |
|---|---:|---|---|
| SRC-ERR-001 | 401 | `Token de autenticação não informado.` | `src/middlewares/authenticate.js:7-9` |
| SRC-ERR-002 | 401 | `Token de autenticação inválido ou expirado.` | `src/middlewares/authenticate.js:14-18` |
| SRC-ERR-003 | 403 | `Você não tem permissão para acessar este recurso.` | `src/middlewares/authorize.js:5-7` |
| SRC-ERR-004 | 403 | `Você só pode acessar os seus próprios dados.` | `src/middlewares/authorizeSelfOrAdmin.js:8-10` |
| SRC-ERR-005 | 404 | `Rota não encontrada: ${req.method} ${req.originalUrl}` | `src/middlewares/notFound.js:3-5` |

### Alunos e login

| ID | Status | Mensagem | Origem |
|---|---:|---|---|
| SRC-ERR-006 | 400 | Campos obrigatórios de aluno | `src/services/alunos.service.js:19-21` |
| SRC-ERR-007 | 404 | `Aluno com id "${id}" não encontrado.` | `src/services/alunos.service.js:12-13` |
| SRC-ERR-008 | 409 | Já existe aluno com matrícula ou e-mail | `src/services/alunos.service.js:24-26` |
| SRC-ERR-009 | 400 | Campos obrigatórios de login | `src/services/auth.service.js:16-17` |
| SRC-ERR-010 | 401 | `E-mail ou senha inválidos.` | `src/services/auth.service.js:23-25` |

### Disciplinas e matrículas

| ID | Status | Mensagem | Origem |
|---|---:|---|---|
| SRC-ERR-011 | 400 | Campos obrigatórios de disciplina | `src/services/disciplinas.service.js:19-21` |
| SRC-ERR-012 | 404 | `Disciplina com id "${id}" não encontrada.` | `src/services/disciplinas.service.js:12-13` |
| SRC-ERR-013 | 409 | Código de disciplina duplicado | `src/services/disciplinas.service.js:24-26` |
| SRC-ERR-014 | 400 | `O campo "alunoId" é obrigatório.` | `src/controllers/disciplinas.controller.js:38-40` |
| SRC-ERR-015 | 409 | Aluno já matriculado | `src/services/disciplinas.service.js:51-53` |

### Notas

| ID | Status | Mensagem | Origem |
|---|---:|---|---|
| SRC-ERR-016 | 400 | Campos obrigatórios | `src/services/notas.service.js:25-26` |
| SRC-ERR-017 | 400 | Valor fora de 0 a 10 | `src/services/notas.service.js:28-29` |
| SRC-ERR-018 | 400 | Tipo fora da lista permitida | `src/services/notas.service.js:31-32` |
| SRC-ERR-019 | 404 | Nota não encontrada | `src/services/notas.service.js:16-17` |
| SRC-ERR-020 | 409 | Aluno não matriculado na disciplina | `src/services/notas.service.js:38-39` |
| SRC-ERR-021 | 400 | Validações de valor e tipo na atualização | `src/services/notas.service.js:50-54` |

### Trabalhos

| ID | Status | Mensagem | Origem |
|---|---:|---|---|
| SRC-ERR-022 | 400 | Campos obrigatórios | `src/services/trabalhos.service.js:27-28` |
| SRC-ERR-023 | 404 | Trabalho não encontrado | `src/services/trabalhos.service.js:17-18` |
| SRC-ERR-024 | 409 | Aluno não matriculado | `src/services/trabalhos.service.js:32-33` |
| SRC-ERR-025 | 400 | Status inválido | `src/services/trabalhos.service.js:46-47` |
| SRC-ERR-026 | 400 | Nota inválida | `src/services/trabalhos.service.js:49-50` |
| SRC-ERR-027 | 500 | `Erro interno do servidor.` para erro não classificado | `src/middlewares/errorHandler.js:9-12` |
| SRC-ERR-028 | conexão | Erro de conexão é registrado no console | `src/database/db.js:5-7` |

## 6. Integrações externas

### SRC-INT-001 — MongoDB via Mongoose

- **Propósito inferido:** persistir administradores, alunos, disciplinas, matrículas, notas e trabalhos.
- **Trecho literal:** `"await mongoose.connect(MONGODB_URI);"` — `src/database/db.js:9`.
- **Configuração:** a URI é lida de `MONGODB_URI` — `src/database/db.js:3`.
- **Timeout, retry e circuit breaker:** não identificados no código de chamada.

Não foram encontradas chamadas externas via `fetch`, Axios, `http.request`, SDKs de cloud, filas, Redis, OAuth/OIDC ou gateways de pagamento. Swagger, CORS e Morgan foram tratados como dependências locais de documentação, CORS e logging, não como integrações de negócio.

## 7. Achados propostos para `docs/project-memory.md`

Nenhum registro foi criado automaticamente. Propostas para confirmação:

- **MEM-001:** O sistema possui dois perfis (`admin` e `aluno`); o aluno é limitado ao próprio `alunoId`.
- **MEM-002:** Notas e trabalhos dependem de matrícula prévia na disciplina.
- **MEM-003:** A carga inicial só ocorre quando não existe administrador, o que pode afetar isolamento e repetibilidade — trecho: `"if (jaSeedado) return;"`, `src/database/seed.js:126-127`.
- **MEM-004:** O JWT depende de `JWT_SECRET` e tem validade fixa configurada no código; expiração e segredo ausente merecem cenários específicos.
- **MEM-005:** Existem dados seed e administrador pré-cadastrado; ambientes de teste devem controlar explicitamente o banco utilizado.

## Consumo pelos agentes

- Rotas: `/qa-descoberta-endpoints` e `/qa-analise-sem-demanda`.
- Validações e modelos: `/qa-analise-demanda`, `/qa-desenho-teste` e `/qa-montagem-suite`.
- Erros: `/qa-analise-sem-demanda` e `/qa-triagem-falha`.
- Integração MongoDB: `/qa-triagem-falha` e análise de ambiente.
- Ausência de frontend: `/qa-engenharia-reversa` não se aplica a este SUT.
- Propostas de memória: dependem de confirmação humana antes de serem registradas.
