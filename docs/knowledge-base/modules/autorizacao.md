# Módulo — Autorização

**Caminho técnico:** `src/middlewares/authorize.js`, `src/middlewares/authorizeSelfOrAdmin.js`, `src/routes/admin/index.js`, `src/routes/admin/*.routes.js`, `src/routes/aluno.routes.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md` (`SRC-EP-005` a `SRC-EP-029`, `SRC-ERR-003`, `SRC-ERR-004`) e `docs/knowledge-base/modules/autenticacao.md`.

## Telas

Nenhuma tela identificada. O recorte contém somente middlewares, rotas e controllers backend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/admin/index.js:1-16`, `src/routes/aluno.routes.js:1-15`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:autorizacao-administrativa | Autorizar acesso administrativo | Permitir acesso às rotas administrativas somente para usuários autenticados com papel `admin`. | — | `jornada:acesso-administrativo-protegido` | `regra:papel-admin-obrigatorio`; `regra:autenticacao-antes-autorizacao`; `regra:negacao-por-papel` | `api:admin-recursos-protegidos` | 0.99 (fato) | `src/routes/admin/index.js:10-16`; `src/middlewares/authorize.js:3-10` |
| funcionalidade:autorizacao-proprios-dados | Autorizar acesso aos dados do aluno | Permitir que aluno acesse apenas o próprio `alunoId`, enquanto admin acessa qualquer aluno. | — | `jornada:acesso-autosservico-aluno` | `regra:proprio-aluno`; `regra:admin-acessa-qualquer-aluno`; `regra:negacao-por-identidade` | `api:aluno-dados-protegidos` | 0.99 (fato) | `src/routes/aluno.routes.js:10-15`; `src/middlewares/authorizeSelfOrAdmin.js:3-12` |

## Jornadas

### jornada:acesso-administrativo-protegido — Acesso a recurso administrativo

- **Objetivo:** Validar identidade e papel antes de encaminhar requisição administrativa.
- **Completude:** Completa no recorte.
- **Funcionalidades relacionadas:** `funcionalidade:autorizacao-administrativa`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Cliente envia requisição para rota sob `/api/admin` — `src/routes/index.js:10-11`, `src/app.js:43`.
  2. Router aplica `authenticate` — `src/routes/admin/index.js:10`.
  3. Autenticação disponibiliza `req.user` — `docs/knowledge-base/modules/autenticacao.md`, `src/middlewares/authenticate.js:13-15`.
  4. `authorize('admin')` verifica o papel — `src/routes/admin/index.js:10`, `src/middlewares/authorize.js:3-6`.
  5. Com autorização, segue para alunos, disciplinas, notas ou trabalhos — `src/routes/admin/index.js:12-15`.
  6. Sem autorização, retorna `403` — `src/middlewares/authorize.js:5-7`.
- **Confiança (tipo):** 0.99 (fato)
- **Evidência:** `src/routes/admin/index.js:10-15`, `src/middlewares/authorize.js:3-10`

### jornada:acesso-autosservico-aluno — Acesso a dados próprios ou administrativo

- **Objetivo:** Permitir consulta ou registro relacionado ao aluno autorizado.
- **Completude:** Completa no recorte.
- **Funcionalidades relacionadas:** `funcionalidade:autorizacao-proprios-dados`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Cliente envia requisição para `/api/alunos/:alunoId/...` — `src/routes/index.js:11`, `src/app.js:43`.
  2. Router exige autenticação — `src/routes/aluno.routes.js:10`.
  3. Middleware lê `req.params.alunoId` — `src/middlewares/authorizeSelfOrAdmin.js:4`.
  4. Admin é autorizado independentemente do ID — `src/middlewares/authorizeSelfOrAdmin.js:5-9`.
  5. Aluno é autorizado somente com IDs iguais — `src/middlewares/authorizeSelfOrAdmin.js:6-9`.
  6. Controller consulta ou registra o recurso — `src/routes/aluno.routes.js:12-15`.
  7. Identidade incompatível retorna `403` — `src/middlewares/authorizeSelfOrAdmin.js:8-10`.
- **Confiança (tipo):** 0.99 (fato)
- **Evidência:** `src/routes/aluno.routes.js:10-15`, `src/middlewares/authorizeSelfOrAdmin.js:3-12`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:papel-admin-obrigatorio | Rotas administrativas exigem `admin`. | Papéis não autorizados recebem `403`. | 0.99 (fato) | `src/routes/admin/index.js:10`, `src/middlewares/authorize.js:4-7` |
| regra:autenticacao-antes-autorizacao | Autenticação ocorre antes da autorização administrativa. | `authorize` usa a identidade produzida por `authenticate`. | 0.99 (fato) | `src/routes/admin/index.js:10`; módulo de autenticação |
| regra:proprio-aluno | Aluno só acessa o `alunoId` correspondente ao próprio `req.user.id`. | IDs diferentes recebem `403`. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:4-10` |
| regra:admin-acessa-qualquer-aluno | Admin acessa qualquer `alunoId` no autoatendimento. | Não exige igualdade de IDs para admin. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:5-9` |
| regra:negacao-por-papel | Identidade ausente ou papel não permitido é rejeitado. | `403` com mensagem de permissão. | 0.99 (fato) | `src/middlewares/authorize.js:4-7` |
| regra:negacao-por-identidade | Usuário que não é admin nem o próprio aluno é rejeitado. | `403` com mensagem de próprios dados. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:5-10` |
| regra:autorizacao-sem-consulta-de-recurso | Middleware decide por `req.user` e parâmetros, sem consultar recurso. | Existência, matrícula e validação ficam nos services. | 0.95 (fato) | `src/middlewares/authorize.js:3-10`, `src/middlewares/authorizeSelfOrAdmin.js:3-12` |

## APIs

| ID | Métodos e caminhos | Proteção | Comportamento posterior | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| api:admin-alunos | `GET/POST /api/admin/alunos`; `GET/PUT/DELETE /api/admin/alunos/:id` | `authenticate` + `authorize('admin')` | Operações administrativas de alunos. | 0.99 (fato) | `src/routes/admin/index.js:10-12`; `src/routes/admin/alunos.routes.js:5-10` |
| api:admin-disciplinas | Rotas de disciplinas, matrículas e alunos da disciplina | `authenticate` + `authorize('admin')` | Operações administrativas de disciplinas. | 0.99 (fato) | `src/routes/admin/index.js:10-13`; `src/routes/admin/disciplinas.routes.js:14-20` |
| api:admin-notas | Rotas administrativas de notas | `authenticate` + `authorize('admin')` | Operações administrativas de notas. | 0.99 (fato) | `src/routes/admin/index.js:10-14`; `src/routes/admin/notas.routes.js:5-10` |
| api:admin-trabalhos | Rotas administrativas de trabalhos | `authenticate` + `authorize('admin')` | Consulta, correção e remoção. | 0.99 (fato) | `src/routes/admin/index.js:10-15`; `src/routes/admin/trabalhos.routes.js:5-9` |
| api:aluno-dados-protegidos | Rotas `/api/alunos/:alunoId/...` | `authenticate` + `authorizeSelfOrAdmin` | Consulta dados ou registra trabalho autorizado. | 0.99 (fato) | `src/routes/aluno.routes.js:10-15` |
| api:middleware-authorize | Middleware de papéis permitidos | Requer `req.user.role` compatível. | Chama `next()` ou `ApiError(403)`. | 0.99 (fato) | `src/middlewares/authorize.js:3-10` |
| api:middleware-authorize-self-or-admin | Middleware para `:alunoId` | Admin ou aluno com ID igual. | Chama `next()` ou `ApiError(403)`. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:3-12` |

## Entidades

| Entidade | Campos/contrato | Relação com autorização | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `req.user` | `id`, `role` | Identidade usada pelos middlewares. | 0.99 (fato) | `src/middlewares/authorize.js:4`; `src/middlewares/authorizeSelfOrAdmin.js:5-6` |
| `Administrador` | `role: admin` | Acessa rotas admin e qualquer aluno protegido. | 0.98 (fato) | Middlewares e `docs/source-map.md` |
| `Aluno` | `id`, `role: aluno` | Acessa somente o próprio `alunoId`. | 0.98 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:4-9` |
| `alunoId` de rota | Parâmetro textual | Comparado diretamente com `req.user.id`. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:4-6` |
| `ApiError` | `statusCode`, `message` | Transporta recusas de autorização. | 0.99 (fato) | `src/middlewares/authorize.js:1,5-7`; `src/middlewares/authorizeSelfOrAdmin.js:1,8-10` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento backend | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| `funcionalidade:autorizacao-administrativa` | Autorizado | Chama `next()` e libera subrota. | Não aplicável visualmente. | 0.99 (fato) | `src/middlewares/authorize.js:8-9` |
| `funcionalidade:autorizacao-administrativa` | Não autorizado | Retorna `403` sem papel permitido. | Não aplicável visualmente; status/mensagem distinguem. | 0.99 (fato) | `src/middlewares/authorize.js:4-7` |
| `funcionalidade:autorizacao-proprios-dados` | Próprio aluno autorizado | Chama `next()` quando IDs coincidem. | Não aplicável visualmente. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:6-12` |
| `funcionalidade:autorizacao-proprios-dados` | Admin autorizado | Chama `next()` sem igualdade de IDs. | Não aplicável visualmente. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:5-12` |
| `funcionalidade:autorizacao-proprios-dados` | Outro aluno | Retorna `403` com mensagem de próprios dados. | Não aplicável visualmente; status/mensagem distinguem. | 0.99 (fato) | `src/middlewares/authorizeSelfOrAdmin.js:6-10` |
| Ambas | Carregando/Vazio/Desabilitado | Não modelados pelos middlewares; cliente externo não confirmado. | Não confirmável. | 0.98 (lacuna) | `src/middlewares/authorize.js:3-10`; `src/middlewares/authorizeSelfOrAdmin.js:3-12` |

Não há estados visualmente indistinguíveis confirmáveis porque o módulo não contém telas.

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Onde é usado | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| `authenticate` | Middleware local | Validar JWT e preencher `req.user`. | `src/routes/admin/index.js:5,10`; `src/routes/aluno.routes.js:4,10` | 0.99 (fato cruzado) | Módulo de autenticação e rotas |
| `ApiError` | Utilitário local | Representar recusas `403`. | Nos dois middlewares. | 0.99 (fato) | Middlewares de autorização |
| `errorHandler` | Middleware local | Serializar `ApiError` como `{error}`. | Pipeline global. | 0.99 (fato cruzado) | `src/app.js:45-46`; `src/middlewares/errorHandler.js:4-6` |
| Controllers de recursos | Controllers locais | Executar capacidade após autorização. | Rotas admin e aluno. | 0.99 (fato) | `src/routes/admin/*.routes.js`; `src/routes/aluno.routes.js:12-15` |
| `express.Router` | Biblioteca | Montar routers e middlewares. | Rotas admin e aluno. | 0.99 (fato) | `src/routes/admin/index.js:1,8`; `src/routes/aluno.routes.js:1,8` |

## Lacunas

- Nenhuma requisição foi executada; resultados vêm de leitura estática.
- Não foi confirmado comportamento quando `req.user.id` tem tipo diferente do `alunoId` textual.
- Não foi confirmado se existem outras rotas protegidas fora dos arquivos analisados.
- Não foi confirmada autorização mais granular que o papel `admin`.
- Não foram identificadas regras de revogação, bloqueio ou alteração dinâmica de papéis.
- Middleware não verifica existência do aluno/recurso; isso fica fora do recorte.
- Não foram confirmados loading, vazio, retry ou desabilitação no cliente consumidor.
- Não foi confirmado se haverá exceções futuras à política administrativa global.

## Hipóteses

- `req.user.id` representa o mesmo identificador usado como `:alunoId`. **Confiança:** 0.90 (hipótese). Evidência: `src/middlewares/authorizeSelfOrAdmin.js:4-6`.
- `admin` é amplo o suficiente para todas as operações administrativas. **Confiança:** 0.95 (inferência). Evidência: `src/routes/admin/index.js:10-15`.
- A distinção entre `403` e erros de existência/validação é responsabilidade dos services posteriores. **Confiança:** 0.90 (inferência). Evidência: middlewares e controllers de recursos.

## Resumo

| Item | Valor |
|---|---:|
| Módulo importado | Autorização |
| Tipo | Backend |
| Telas | 0 |
| Funcionalidades | 2 |
| Jornadas | 2 |
| Estados backend | 6 grupos |
| Dependências externas ao recorte | 5 |
| Lacunas | 8 |
| Hipóteses | 3 |

Este módulo é um rascunho para posterior consolidação pelo `/qa-consolidacao-conhecimento`.

**Próximo módulo sugerido:** alunos, começando por `src/services/alunos.service.js`, `src/models/aluno.model.js` e controllers/rotas de alunos.
