# Módulo — Notas

**Caminho técnico:** `src/services/notas.service.js`, `src/models/nota.model.js`, `src/controllers/notas.controller.js`, `src/routes/admin/notas.routes.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md` (`SRC-EP-017` a `SRC-EP-021`, `SRC-EP-027`, `SRC-ERR-016` a `SRC-ERR-021`) e módulos de autenticação, autorização, alunos e disciplinas/matrículas.

## Telas

Nenhuma tela identificada. O recorte contém exclusivamente backend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/admin/notas.routes.js:1-10`, `src/controllers/notas.controller.js:1-32`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:listar-notas | Listar notas administrativas | Consultar notas com filtros opcionais de aluno ou disciplina. | — | `jornada:consultar-notas-administrativas` | `regra:filtros-notas-opcionais`; `regra:acesso-administrativo` | `api:admin-notas-listar` | 0.99 (fato) | `src/services/notas.service.js:8-14` |
| funcionalidade:consultar-nota | Consultar nota | Retornar nota por identificador ou informar inexistência. | — | `jornada:consultar-nota` | `regra:nota-existente` | `api:admin-nota-detalhe` | 0.99 (fato) | `src/services/notas.service.js:16-20` |
| funcionalidade:registrar-nota | Registrar nota | Criar nota para aluno matriculado, respeitando valor e tipo. | — | `jornada:registrar-nota` | `regra:campos-nota-obrigatorios`; `regra:valor-nota-valido`; `regra:tipo-nota-valido`; `regra:matricula-previa` | `api:admin-notas-criar` | 0.99 (fato) | `src/services/notas.service.js:22-44` |
| funcionalidade:alterar-nota | Alterar nota | Atualizar parcialmente valor, tipo ou descrição. | — | `jornada:alterar-nota` | `regra:nota-existente`; `regra:atualizacao-nota-parcial`; regras de valor/tipo | `api:admin-nota-atualizar` | 0.99 (fato) | `src/services/notas.service.js:46-63` |
| funcionalidade:remover-nota | Remover nota | Excluir nota existente. | — | `jornada:remover-nota` | `regra:nota-existente`; `regra:resposta-sem-conteudo` | `api:admin-nota-remover` | 0.99 (fato) | `src/services/notas.service.js:65-68` |

A leitura de notas pelo aluno é controlada pelo módulo de alunos e não é duplicada aqui.

## Jornadas

### jornada:consultar-notas-administrativas — Consultar notas

- **Objetivo:** Listar notas gerais ou filtradas por aluno/disciplina.
- **Completude:** Parcial; tratamento global e consumidor HTTP são externos.
- **Funcionalidades relacionadas:** `funcionalidade:listar-notas`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin solicita `GET /api/admin/notas`; controller extrai filtros; service monta filtro apenas com parâmetros informados e consulta notas — `src/routes/admin/notas.routes.js:6`, `src/controllers/notas.controller.js:10-12`, `src/services/notas.service.js:8-14`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/notas.service.js:8-14`

### jornada:consultar-nota — Consultar nota por identificador

- **Objetivo:** Obter uma nota específica.
- **Completude:** Parcial; serialização global de erros externa.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-nota`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin solicita `GET /api/admin/notas/:id`; controller encaminha ID; service busca e retorna nota ou `404` — `src/routes/admin/notas.routes.js:8`, `src/controllers/notas.controller.js:14-16`, `src/services/notas.service.js:16-20`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/notas.service.js:16-20`

### jornada:registrar-nota — Registrar nota de aluno matriculado

- **Objetivo:** Persistir nota vinculada a aluno e disciplina válidos.
- **Completude:** Completa no fluxo funcional.
- **Funcionalidades relacionadas:** `funcionalidade:registrar-nota`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `POST /api/admin/notas`; valida campos, valor `0-10`, tipo permitido, aluno/disciplina existentes e matrícula prévia; salva e responde `201` — `src/services/notas.service.js:22-44`, `src/controllers/notas.controller.js:18-21`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/notas.service.js:22-44`

### jornada:alterar-nota — Alterar nota

- **Objetivo:** Atualizar parcialmente nota existente.
- **Completude:** Completa no fluxo funcional.
- **Funcionalidades relacionadas:** `funcionalidade:alterar-nota`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `PUT /api/admin/notas/:id`; service busca nota, revalida valor/tipo quando presentes, altera campos e salva — `src/routes/admin/notas.routes.js:9`, `src/services/notas.service.js:46-63`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/notas.service.js:46-63`

### jornada:remover-nota — Remover nota

- **Objetivo:** Excluir nota existente.
- **Completude:** Completa no fluxo funcional.
- **Funcionalidades relacionadas:** `funcionalidade:remover-nota`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `DELETE /api/admin/notas/:id`; service confirma existência e remove; controller responde `204` — `src/routes/admin/notas.routes.js:10`, `src/services/notas.service.js:65-68`, `src/controllers/notas.controller.js:27-30`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/notas.service.js:65-68`

### jornada:consultar-notas-do-aluno — Consulta no autoatendimento

- **Objetivo:** Consultar notas de aluno com filtro opcional de disciplina.
- **Completude:** Parcial; implementação principal está no módulo de alunos.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-notas-aluno` em `alunos.md`.
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Rota exige autenticação/autorização; service de alunos confirma aluno e consulta por aluno/disciplina — `src/routes/aluno.routes.js:10-13`, `src/services/alunos.service.js:56-62`.
- **Confiança:** 0.98 (fato cruzado)
- **Evidência:** `docs/source-map.md`, `SRC-EP-027`; `src/services/alunos.service.js:56-62`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:campos-nota-obrigatorios | Criação exige `alunoId`, `disciplinaId`, `valor`, `tipo`. | Ausência gera `400`. | 0.99 (fato) | `src/services/notas.service.js:23-26` |
| regra:valor-nota-valido | Valor numérico entre `0` e `10`, inclusive. | Ausência na criação, tipo inválido ou faixa inválida gera `400`. | 0.99 (fato) | `src/services/notas.service.js:27-29`, `50-51` |
| regra:tipo-nota-valido | Tipos: `prova`, `trabalho`, `participacao`. | Tipo inválido gera `400`. | 0.99 (fato) | `src/services/notas.service.js:6`, `30-32`, `53-55` |
| regra:entidades-relacionadas-existentes | Aluno e disciplina devem existir. | Entidade inexistente interrompe com `404`. | 0.99 (fato) | `src/services/notas.service.js:34-35` |
| regra:matricula-previa | Aluno precisa estar matriculado. | Ausência de matrícula gera `409`. | 0.99 (fato) | `src/services/notas.service.js:37-39` |
| regra:atualizacao-nota-parcial | Atualização altera somente campos enviados. | IDs relacionados não são alterados. | 0.99 (fato) | `src/services/notas.service.js:48-59` |
| regra:nota-existente | Consulta, alteração e remoção exigem nota existente. | ID inexistente gera `404`. | 0.99 (fato) | `src/services/notas.service.js:16-20`, `47`, `66` |
| regra:filtros-notas-opcionais | Listagem aceita `alunoId` e `disciplinaId` independentes. | Cada filtro informado entra na consulta. | 0.99 (fato) | `src/services/notas.service.js:8-14` |
| regra:descricao-opcional | Descrição não é obrigatória e padrão é `null`. | Nota pode ser salva sem descrição. | 0.99 (fato) | `src/services/notas.service.js:22-43`; `src/models/nota.model.js:21-24` |
| regra:identificador-publico | Model converte `_id` para `id` e remove `versionKey`. | JSON não expõe `_id`/`__v`. | 0.99 (fato) | `src/models/nota.model.js:6-14` |
| regra:acesso-administrativo | CRUD de notas exige autenticação e papel admin. | Acesso indevido é interrompido antes do controller. | 0.99 (fato cruzado) | `src/routes/admin/index.js:10-14`; módulos de autenticação/autorização |
| regra:resposta-sem-conteudo | Remoção responde sem entidade. | Sucesso retorna `204`. | 0.99 (fato) | `src/controllers/notas.controller.js:27-30` |

## APIs

| ID | Método | Caminho | Acesso | Entrada | Saída/comportamento | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|
| api:admin-notas-listar | GET | `/api/admin/notas` | Admin | Query `alunoId?`, `disciplinaId?` | Lista filtrada; pode ser vazia. | 0.99 (fato) | `src/services/notas.service.js:8-14` |
| api:admin-notas-criar | POST | `/api/admin/notas` | Admin | `{alunoId, disciplinaId, valor, tipo, descricao?}` | `201`; falhas de validação, existência ou matrícula. | 0.99 (fato) | `src/services/notas.service.js:22-44` |
| api:admin-nota-detalhe | GET | `/api/admin/notas/:id` | Admin | `id` | Nota ou `404`. | 0.99 (fato) | `src/services/notas.service.js:16-20` |
| api:admin-nota-atualizar | PUT | `/api/admin/notas/:id` | Admin | `id` + `{valor?, tipo?, descricao?}` | Nota atualizada ou erro. | 0.99 (fato) | `src/services/notas.service.js:46-63` |
| api:admin-nota-remover | DELETE | `/api/admin/notas/:id` | Admin | `id` | `204` ou `404`. | 0.99 (fato) | `src/services/notas.service.js:65-68` |
| api:aluno-notas | GET | `/api/alunos/:alunoId/notas` | Próprio aluno/admin | `alunoId`, `disciplinaId?` | Lista de notas; implementada em `alunos.service.js`. | 0.98 (fato cruzado) | `src/services/alunos.service.js:56-62`; `src/routes/aluno.routes.js:10-13` |

## Entidades

| Entidade | Campos | Relações/regras | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `Nota` | `id`, `alunoId`, `disciplinaId`, `valor`, `tipo`, `descricao`, timestamps | Relaciona aluno/disciplina; valor 0-10; tipos fechados. | 0.99 (fato) | `src/models/nota.model.js:16-25` |
| `Aluno` | ID referenciado por `Nota.alunoId` | Deve existir na criação. | 0.99 (fato cruzado) | `src/services/notas.service.js:34`; `src/services/alunos.service.js:10-14` |
| `Disciplina` | ID referenciado por `Nota.disciplinaId` | Deve existir na criação. | 0.99 (fato cruzado) | `src/services/notas.service.js:35`; `src/services/disciplinas.service.js:11-15` |
| `Matricula` | `alunoId`, `disciplinaId` | Determina elegibilidade para nota. | 0.99 (fato cruzado) | `src/services/notas.service.js:37-39` |
| `tipo de nota` | `prova`, `trabalho`, `participacao` | Catálogo fechado. | 0.99 (fato) | `src/services/notas.service.js:6`, `30-32` |
| `valor de nota` | Número de `0` a `10` | Faixa validada na criação/alteração. | 0.99 (fato) | `src/services/notas.service.js:27-29`, `50-51` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento backend | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| Listar notas | Sucesso/vazio | Retorna array filtrado ou vazio. | Sim, não diferencia base sem notas de filtro sem resultados. | 0.95 (inferência) | `src/services/notas.service.js:8-14` |
| Listar notas | Erro de acesso | Sem autenticação/papel admin gera `401`/`403`. | Não; status/mensagem distinguem. | 0.99 (fato cruzado) | `src/routes/admin/index.js:10-14` |
| Consultar nota | Sucesso/erro | Retorna nota ou `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/notas.service.js:16-20` |
| Registrar nota | Sucesso | Persiste e retorna `201`. | Não aplicável visualmente. | 0.99 (fato) | `src/controllers/notas.controller.js:18-21` |
| Registrar nota | Validação/conflito | Campos/valor/tipo inválidos geram `400`; falta de matrícula gera `409`. | Não; status/mensagem distinguem. | 0.99 (fato) | `src/services/notas.service.js:23-39` |
| Alterar nota | Sucesso/erro | Atualiza campos; `404` para nota inexistente; `400` para valor/tipo inválidos. | Não; status/mensagem distinguem. | 0.99 (fato) | `src/services/notas.service.js:46-63` |
| Remover nota | Sucesso/erro | Remove e retorna `204`; inexistente gera `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/notas.service.js:65-68` |
| Módulo inteiro | Carregando/desabilitado | Não há estados modelados no backend. | Não confirmável no cliente. | 0.98 (lacuna) | `src/controllers/notas.controller.js:10-30` |

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Evidência |
|---|---|---|---|
| `mongoose`/MongoDB | Persistência | Armazenar notas. | `src/models/nota.model.js:2-4`, `16-27` |
| `node:crypto` | Biblioteca nativa | Gerar UUID da nota. | `src/models/nota.model.js:1`, `10-11` |
| `express.Router` | Biblioteca | Montar rotas administrativas. | `src/routes/admin/notas.routes.js:1-10` |
| `asyncHandler` | Utilitário local | Encaminhar erros assíncronos. | `src/controllers/notas.controller.js:1`, `10-30` |
| `ApiError` | Utilitário local | Representar erros HTTP classificados. | `src/services/notas.service.js:2`, `17-55` |
| `alunos.service.js` | Serviço local | Confirmar aluno. | `src/services/notas.service.js:3`, `34` |
| `disciplinas.service.js` | Serviço local | Confirmar disciplina/matrícula. | `src/services/notas.service.js:4`, `35-39` |
| `authenticate`/`authorize` | Middlewares locais | Proteger rotas admin. | `src/routes/admin/index.js:6-10` |
| `errorHandler` | Middleware local | Serializar erros. | `src/middlewares/errorHandler.js:4-12` |

## Lacunas

- Não foi confirmado o tratamento global completo de erros no recorte.
- Não foi confirmada validação de formato/existência de IDs antes das consultas.
- Não foi confirmada unicidade para `alunoId`, `disciplinaId` e `tipo`; notas repetidas podem ser aceitas.
- Não foi confirmada verificação de matrícula durante alteração de nota.
- Não foram confirmadas paginação, ordenação, limite ou filtros por tipo/período.
- Não foi confirmada remoção em cascata de notas ao excluir aluno/disciplina.
- Não foram confirmados estados de cliente, loading, vazio visual ou desabilitado.
- Não foram observadas respostas em execução nem testes nesta importação.

## Hipóteses

- Nota representa avaliação de aluno em disciplina; `tipo` diferencia natureza — `src/models/nota.model.js:17-22`, `src/services/notas.service.js:6`, `30-32`.
- Consulta do aluno usa a mesma entidade persistida pelo CRUD admin — `src/services/alunos.service.js:4`, `56-62`.
- Ausência de notas é lista vazia — `src/services/notas.service.js:8-14`.
- Admin mantém notas e aluno apenas consulta — `src/routes/admin/index.js:10-14`, `src/routes/aluno.routes.js:10-13`.

## Resumo

| Item | Quantidade |
|---|---:|
| Funcionalidades principais | 5 |
| Jornadas | 6 |
| Regras | 12 |
| APIs | 6 |
| Entidades | 6 |
| Estados observáveis | 8 grupos |
| Dependências listadas | 9 |
| Lacunas | 8 |
| Hipóteses | 4 |

Este arquivo é um rascunho modular para posterior consolidação pelo `/qa-consolidacao-conhecimento`.

**Próximo módulo sugerido:** trabalhos, começando por `src/services/trabalhos.service.js`, `src/models/trabalho.model.js`, `src/controllers/trabalhos.controller.js` e `src/routes/admin/trabalhos.routes.js`.
