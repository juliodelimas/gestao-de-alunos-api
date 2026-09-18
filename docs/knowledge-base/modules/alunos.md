# Módulo — Alunos

**Caminho técnico:** `src/services/alunos.service.js`, `src/models/aluno.model.js`, `src/controllers/alunos.controller.js`, `src/routes/admin/alunos.routes.js`, `src/routes/aluno.routes.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md` (`SRC-EP-005` a `SRC-EP-009`, `SRC-EP-026`, `SRC-EP-027`), `docs/knowledge-base/modules/autenticacao.md` e `autorizacao.md`.

## Telas

Nenhuma tela identificada. O recorte contém services, model, controller e rotas backend, sem componentes, páginas ou templates frontend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/admin/alunos.routes.js:1-13`, `src/routes/aluno.routes.js:1-15`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:cadastrar-aluno | Cadastrar aluno | Criar aluno com nome, e-mail, matrícula e senha, impedindo duplicidade. | — | `jornada:administrar-cadastro-aluno` | `regra:campos-obrigatorios`; `regra:unicidade-aluno`; `regra:senha-hash` | `api:admin-alunos-criar` | 0.99 (fato) | `src/services/alunos.service.js:16-29` |
| funcionalidade:consultar-alunos | Consultar alunos | Listar alunos ou consultar por identificador. | — | `jornada:administrar-consulta-aluno` | `regra:aluno-inexistente-404`; `regra:senha-nao-exposta` | `api:admin-alunos-listar`; `api:admin-aluno-detalhe` | 0.99 (fato) | `src/services/alunos.service.js:6-14` |
| funcionalidade:alterar-aluno | Alterar dados do aluno | Atualizar parcialmente nome, e-mail, matrícula ou senha. | — | `jornada:administrar-alteracao-aluno` | `regra:aluno-existente`; `regra:atualizacao-parcial`; `regra:senha-hash` | `api:admin-aluno-atualizar` | 0.98 (fato) | `src/services/alunos.service.js:32-42` |
| funcionalidade:remover-aluno | Remover aluno | Excluir aluno existente pelo identificador. | — | `jornada:administrar-remocao-aluno` | `regra:aluno-existente`; `regra:resposta-sem-conteudo` | `api:admin-aluno-remover` | 0.99 (fato) | `src/services/alunos.service.js:44-47` |
| funcionalidade:consultar-disciplinas-aluno | Consultar disciplinas do aluno | Retornar disciplinas associadas às matrículas do aluno. | — | `jornada:consultar-dados-academicos` | `regra:aluno-existente`; `regra:disciplinas-via-matriculas`; `regra:acesso-proprio-ou-admin` | `api:aluno-disciplinas` | 0.98 (fato) | `src/services/alunos.service.js:49-54` |
| funcionalidade:consultar-notas-aluno | Consultar notas do aluno | Retornar notas, com filtro opcional por disciplina. | — | `jornada:consultar-dados-academicos` | `regra:aluno-existente`; `regra:filtro-disciplina-opcional`; `regra:acesso-proprio-ou-admin` | `api:aluno-notas` | 0.98 (fato) | `src/services/alunos.service.js:56-62` |

## Jornadas

### jornada:administrar-cadastro-aluno — Cadastro administrativo

- **Objetivo:** Criar aluno e retornar dados públicos.
- **Completude:** Parcial; montagem global e tratamento de erros são externos ao recorte.
- **Funcionalidades relacionadas:** `funcionalidade:cadastrar-aluno`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Admin envia `POST /api/admin/alunos` — `docs/source-map.md`, `src/routes/admin/alunos.routes.js:6-7`.
  2. Controller envia `req.body` ao service — `src/controllers/alunos.controller.js:21-23`.
  3. Service exige `nome`, `email`, `matricula`, `senha` — `src/services/alunos.service.js:17-21`.
  4. Service verifica duplicidade — `src/services/alunos.service.js:23-26`.
  5. Model salva com senha hashada — `src/services/alunos.service.js:28-29`, `src/models/aluno.model.js:29-32`.
  6. Controller responde `201` sem senha — `src/controllers/alunos.controller.js:21-23`, `src/models/aluno.model.js:35-40`.
- **Confiança:** 0.98 (fato)
- **Evidência:** `src/services/alunos.service.js:16-29`, `src/controllers/alunos.controller.js:21-23`

### jornada:administrar-consulta-aluno — Consulta administrativa

- **Objetivo:** Listar alunos ou consultar um aluno.
- **Completude:** Parcial; pipeline global de erros é externo.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-alunos`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Admin solicita `GET /api/admin/alunos` ou `GET /api/admin/alunos/:id` — `src/routes/admin/alunos.routes.js:6-8`.
  2. Service lista ou busca pelo ID — `src/services/alunos.service.js:6-14`.
  3. ID inexistente gera `404` — `src/services/alunos.service.js:10-14`.
  4. Controller sanitiza resultado — `src/controllers/alunos.controller.js:13-19`, `src/models/aluno.model.js:35-40`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/alunos.service.js:6-14`, `src/controllers/alunos.controller.js:13-19`

### jornada:administrar-alteracao-aluno — Alteração administrativa

- **Objetivo:** Alterar parcialmente dados existentes.
- **Completude:** Completa no recorte funcional.
- **Funcionalidades relacionadas:** `funcionalidade:alterar-aluno`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Admin envia `PUT /api/admin/alunos/:id` — `src/routes/admin/alunos.routes.js:9`.
  2. Controller encaminha ID e corpo — `src/controllers/alunos.controller.js:25-27`.
  3. Service busca aluno ou retorna `404` — `src/services/alunos.service.js:33-35`.
  4. Apenas campos presentes são alterados — `src/services/alunos.service.js:36-40`.
  5. Model salva e aplica hash se senha mudar — `src/services/alunos.service.js:41`, `src/models/aluno.model.js:29-32`.
  6. Controller retorna aluno sanitizado — `src/controllers/alunos.controller.js:25-27`.
- **Confiança:** 0.98 (fato)
- **Evidência:** `src/services/alunos.service.js:32-42`

### jornada:administrar-remocao-aluno — Remoção administrativa

- **Objetivo:** Remover aluno existente.
- **Completude:** Completa no recorte funcional.
- **Funcionalidades relacionadas:** `funcionalidade:remover-aluno`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Admin envia `DELETE /api/admin/alunos/:id` — `src/routes/admin/alunos.routes.js:10`.
  2. Controller encaminha ID — `src/controllers/alunos.controller.js:29-32`.
  3. Service confirma existência e remove — `src/services/alunos.service.js:44-46`.
  4. Controller responde `204` — `src/controllers/alunos.controller.js:30-32`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/alunos.service.js:44-47`

### jornada:consultar-dados-academicos — Consulta de disciplinas e notas

- **Objetivo:** Permitir ao próprio aluno ou admin consultar disciplinas e notas.
- **Completude:** Parcial; matrículas, disciplinas e notas são módulos externos.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-disciplinas-aluno`, `funcionalidade:consultar-notas-aluno`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Cliente envia requisição autenticada para `/api/alunos/:alunoId/disciplinas` ou `/notas` — `src/routes/aluno.routes.js:10-13`.
  2. `authenticate` valida JWT e `authorizeSelfOrAdmin` valida identidade — módulos de autenticação/autorização.
  3. Service confirma existência do aluno — `src/services/alunos.service.js:50`, `57`.
  4. Disciplinas são buscadas pelos IDs das matrículas — `src/services/alunos.service.js:51-54`.
  5. Notas são buscadas por aluno e filtro opcional de disciplina — `src/services/alunos.service.js:58-62`.
  6. Controller retorna dados — `src/controllers/alunos.controller.js:35-41`.
- **Confiança:** 0.98 (fato)
- **Evidência:** `src/routes/aluno.routes.js:10-13`, `src/services/alunos.service.js:49-62`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:campos-obrigatorios | Cadastro exige `nome`, `email`, `matricula`, `senha`. | Ausência gera `400`. | 0.99 (fato) | `src/services/alunos.service.js:17-21` |
| regra:unicidade-aluno | E-mail ou matrícula não podem duplicar. | Duplicidade gera `409`. | 0.99 (fato) | `src/services/alunos.service.js:23-26` |
| regra:aluno-inexistente-404 | Operações por ID exigem aluno existente. | Ausência gera `404`. | 0.99 (fato) | `src/services/alunos.service.js:10-14`, `33-35`, `44-45`, `50`, `57` |
| regra:atualizacao-parcial | Alteração modifica apenas campos enviados. | Campos omitidos são preservados. | 0.99 (fato) | `src/services/alunos.service.js:36-40` |
| regra:senha-hash | Senha é hashada antes do salvamento. | Senha persistida não é texto puro. | 0.99 (fato) | `src/models/aluno.model.js:29-32` |
| regra:senha-nao-exposta | Senha é removida das representações públicas. | Respostas não incluem `senha`. | 0.99 (fato) | `src/models/aluno.model.js:35-40` |
| regra:papel-aluno-padrao | Novo aluno recebe `role: aluno`. | Papel padrão é persistido. | 0.98 (fato) | `src/models/aluno.model.js:17-27` |
| regra:identificador-publico | `_id` é exposto como `id` e `versionKey` removido. | Respostas não usam `_id` ou `__v`. | 0.99 (fato) | `src/models/aluno.model.js:7-14` |
| regra:acesso-proprio-ou-admin | Consultas acadêmicas exigem próprio ID ou admin. | Usuário incompatível recebe `403`. | 0.99 (fato cruzado) | `src/routes/aluno.routes.js:10-13`; módulo de autorização |
| regra:filtro-disciplina-opcional | Consulta de notas aceita `disciplinaId` opcional. | Filtro restringe o resultado. | 0.99 (fato) | `src/services/alunos.service.js:58-62` |
| regra:disciplinas-via-matriculas | Disciplinas derivam dos registros de matrícula. | Retorno depende dos `disciplinaId` encontrados. | 0.99 (fato) | `src/services/alunos.service.js:51-54` |
| regra:resposta-sem-conteudo | Remoção responde sem entidade. | Controller retorna `204`. | 0.99 (fato) | `src/controllers/alunos.controller.js:29-32` |

## APIs

| ID | Método | Caminho | Acesso | Entrada | Saída/comportamento | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|
| api:admin-alunos-listar | GET | `/api/admin/alunos` | Admin | — | Lista de alunos sanitizados. | 0.99 (fato cruzado) | `src/routes/admin/alunos.routes.js:6`; `docs/source-map.md` |
| api:admin-alunos-criar | POST | `/api/admin/alunos` | Admin | `nome`, `email`, `matricula`, `senha` | `201` com aluno sem senha. | 0.99 (fato cruzado) | `src/routes/admin/alunos.routes.js:7`; `src/controllers/alunos.controller.js:21-23` |
| api:admin-aluno-detalhe | GET | `/api/admin/alunos/:id` | Admin | `id` | Aluno sem senha ou `404`. | 0.99 (fato cruzado) | `src/routes/admin/alunos.routes.js:8`; `src/controllers/alunos.controller.js:17-19` |
| api:admin-aluno-atualizar | PUT | `/api/admin/alunos/:id` | Admin | `id` + campos parciais | Aluno atualizado sem senha ou `404`. | 0.99 (fato cruzado) | `src/routes/admin/alunos.routes.js:9`; `src/controllers/alunos.controller.js:25-27` |
| api:admin-aluno-remover | DELETE | `/api/admin/alunos/:id` | Admin | `id` | `204` ou `404`. | 0.99 (fato cruzado) | `src/routes/admin/alunos.routes.js:10`; `src/controllers/alunos.controller.js:29-32` |
| api:aluno-disciplinas | GET | `/api/alunos/:alunoId/disciplinas` | Próprio aluno/admin | `alunoId` | Disciplinas via matrículas. | 0.99 (fato) | `src/routes/aluno.routes.js:10-12`; `src/controllers/alunos.controller.js:35-37` |
| api:aluno-notas | GET | `/api/alunos/:alunoId/notas` | Próprio aluno/admin | `alunoId`, `disciplinaId?` | Notas filtráveis. | 0.99 (fato) | `src/routes/aluno.routes.js:10-13`; `src/controllers/alunos.controller.js:39-41` |

## Entidades

| Entidade | Campos | Relações/regras | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `Aluno` | `id`, `nome`, `email`, `matricula`, `senha`, `role`, timestamps | E-mail/matrícula únicos; role aluno; senha hashada. | 0.99 (fato) | `src/models/aluno.model.js:17-32` |
| `Matricula` | `alunoId`, `disciplinaId` | Relaciona aluno e disciplina; modelo externo. | 0.99 (fato parcial) | `src/services/alunos.service.js:51-54` |
| `Disciplina` | Consultada por IDs derivados das matrículas | Criação/alteração externas. | 0.99 (fato parcial) | `src/services/alunos.service.js:3`, `51-54` |
| `Nota` | Consultada por `alunoId` e `disciplinaId` | Criação/alteração externas. | 0.99 (fato parcial) | `src/services/alunos.service.js:4`, `56-62` |
| `req.user` | `id`, `role` | Protege consultas acadêmicas. | 0.99 (fato cruzado) | Módulo de autorização; `src/routes/aluno.routes.js:10-13` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento backend | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| Cadastro | Sucesso | Persiste e retorna `201` sem senha. | Não aplicável visualmente. | 0.99 (fato) | `src/controllers/alunos.controller.js:21-23` |
| Cadastro | Validação/conflito | Campos ausentes geram `400`; duplicidade gera `409`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/alunos.service.js:17-26` |
| Consulta administrativa | Sucesso/vazio | Lista pode ser vazia; não há mensagem específica. | Sim, sem semântica visual definida. | 0.95 (inferência) | `src/services/alunos.service.js:6-8` |
| Consulta administrativa | Erro | ID inexistente gera `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/alunos.service.js:10-14` |
| Alteração | Sucesso/erro | Retorna atualizado; ID inexistente gera `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/alunos.service.js:32-42` |
| Remoção | Sucesso/erro | Retorna `204`; ID inexistente gera `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/controllers/alunos.controller.js:29-32`; `src/services/alunos.service.js:44-47` |
| Disciplinas | Sucesso/vazio | Lista disciplinas via matrículas; pode retornar vazia. | Sim, backend não distingue ausência de matrícula de lista vazia. | 0.90 (inferência) | `src/services/alunos.service.js:51-54` |
| Notas | Sucesso/vazio | Lista notas com filtro opcional; pode retornar vazia. | Sim, não distingue aluno sem notas de filtro sem resultados. | 0.95 (inferência) | `src/services/alunos.service.js:58-62` |
| Consultas acadêmicas | Autorização negada | Usuário incompatível recebe `403`. | Não aplicável visualmente. | 0.99 (fato cruzado) | `src/routes/aluno.routes.js:10-13`; módulo de autorização |

Não há estados de loading, retry ou disabled no backend. O comportamento do cliente consumidor não foi analisado.

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Onde usado | Evidência |
|---|---|---|---|---|
| `mongoose`/MongoDB | Persistência | Operações de armazenamento. | Model e services. | `src/models/aluno.model.js:3-27`; `src/services/alunos.service.js:6-62` |
| `bcryptjs` | Biblioteca | Hash de senha. | Hook do model. | `src/models/aluno.model.js:2`, `29-32` |
| `node:crypto` | Biblioteca nativa | UUID do aluno. | Schema. | `src/models/aluno.model.js:1`, `11` |
| `express.Router` | Biblioteca | Montagem de endpoints. | Rotas de alunos. | `src/routes/admin/alunos.routes.js:1-4`; `src/routes/aluno.routes.js:1-8` |
| `asyncHandler` | Utilitário local | Encaminhar erros assíncronos. | Controllers. | `src/controllers/alunos.controller.js:1`, `13-41` |
| `ApiError` | Utilitário local | Erros HTTP classificados. | Service. | `src/services/alunos.service.js:5`, `12-26` |
| `authenticate` | Middleware local | Validar JWT. | Rotas de autoatendimento. | `src/routes/aluno.routes.js:3`, `10` |
| `authorizeSelfOrAdmin` | Middleware local | Autorizar próprio aluno/admin. | Consultas acadêmicas. | `src/routes/aluno.routes.js:4`, `12-13` |
| `Matricula` | Modelo externo | Vínculos aluno-disciplina. | `listarDisciplinas`. | `src/services/alunos.service.js:2`, `51-52` |
| `Disciplina` | Modelo externo | Dados das disciplinas. | `listarDisciplinas`. | `src/services/alunos.service.js:3`, `54` |
| `Nota` | Modelo externo | Notas do aluno. | `listarNotas`. | `src/services/alunos.service.js:4`, `58-62` |

## Lacunas

- Não foi confirmado o arquivo que monta o router administrativo no prefixo `/api/admin`; o caminho completo veio do source-map.
- Não foi confirmado o formato HTTP final de todos os erros.
- Não foi confirmado se atualização de e-mail/matrícula duplicados retorna explicitamente `409`; o model declara unicidade, mas o service não verifica previamente.
- Não foram confirmadas normalização de e-mail/matrícula/nome, cascatas ao remover aluno, semântica da lista vazia ou estados da interface.
- Services/controllers completos de disciplinas, notas e trabalhos não foram expandidos nesta rodada.

## Hipóteses

- A autorização administrativa ocorre globalmente antes das rotas de alunos — `docs/source-map.md`, `src/routes/admin/alunos.routes.js:1-13`.
- O ID textual de `:alunoId` é compatível com o `id` exposto pelo model — `src/models/aluno.model.js:11-14`, módulo de autorização.
- Consultas acadêmicas representam somente vínculos existentes; criação/manutenção ocorre em módulos externos — `src/services/alunos.service.js:49-62`.
- Ausência de notas/disciplinas é resultado vazio, não erro de negócio — `src/services/alunos.service.js:51-54`, `58-62`.

## Resumo

| Item | Quantidade |
|---|---:|
| Módulo | Alunos |
| Tipo | Backend |
| Telas | 0 |
| Funcionalidades | 6 |
| Jornadas | 5 |
| Regras | 12 |
| APIs | 7 |
| Entidades | 5 |
| Estados observáveis | 9 grupos |
| Dependências listadas | 10 |
| Lacunas | 5 grupos |
| Hipóteses | 4 |

Este arquivo é um rascunho modular para posterior consolidação pelo `/qa-consolidacao-conhecimento`.

**Próximo módulo sugerido:** disciplinas e matrículas, começando por `src/services/disciplinas.service.js`, `src/models/disciplina.model.js`, `src/controllers/disciplinas.controller.js` e `src/routes/admin/disciplinas.routes.js`.
