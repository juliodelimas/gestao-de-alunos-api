# Módulo — Trabalhos

**Caminho técnico:** `src/services/trabalhos.service.js`, `src/models/trabalho.model.js`, `src/controllers/trabalhos.controller.js`, `src/routes/admin/trabalhos.routes.js`, `src/routes/aluno.routes.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md` (`SRC-EP-022` a `SRC-EP-029`, `SRC-ERR-022` a `SRC-ERR-028`) e módulos de autenticação, autorização, alunos, disciplinas/matrículas e notas.

## Telas

Nenhuma tela identificada. O recorte contém somente backend, sem páginas, templates ou componentes frontend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/admin/trabalhos.routes.js:1-10`, `src/routes/aluno.routes.js:1-15`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:listar-trabalhos | Listar trabalhos | Consultar trabalhos administrativos com filtros ou trabalhos de um aluno. | — | `jornada:listar-trabalhos-administrativo`; `jornada:listar-trabalhos-aluno` | `regra:filtros-trabalhos`; regras de acesso | `api:admin-trabalhos-listar`; `api:aluno-trabalhos-listar` | 0.99 (fato) | `src/services/trabalhos.service.js:7-14`; `src/controllers/trabalhos.controller.js:10-12,33-35` |
| funcionalidade:consultar-trabalho | Consultar trabalho | Retornar trabalho por identificador. | — | `jornada:consultar-trabalho` | `regra:trabalho-existente`; acesso admin | `api:admin-trabalho-detalhe` | 0.99 (fato) | `src/services/trabalhos.service.js:16-19` |
| funcionalidade:registrar-entrega | Registrar entrega | Criar entrega vinculada a aluno/disciplina existentes e matrícula prévia. | — | `jornada:registrar-entrega` | campos obrigatórios; entidades; matrícula; status inicial | `api:aluno-trabalhos-criar` | 0.99 (fato) | `src/services/trabalhos.service.js:21-38` |
| funcionalidade:corrigir-trabalho | Corrigir trabalho | Atualizar status, nota e feedback. | — | `jornada:corrigir-trabalho` | status/nota válidos; atualização parcial; admin | `api:admin-trabalho-corrigir` | 0.99 (fato) | `src/services/trabalhos.service.js:40-59` |
| funcionalidade:remover-trabalho | Remover trabalho | Excluir trabalho existente. | — | `jornada:remover-trabalho` | trabalho existente; resposta 204; admin | `api:admin-trabalho-remover` | 0.99 (fato) | `src/services/trabalhos.service.js:61-64` |

## Jornadas

### jornada:listar-trabalhos-administrativo — Listagem administrativa

- **Objetivo:** Consultar trabalhos gerais ou filtrados por aluno, disciplina e status.
- **Completude:** Parcial; tratamento global e consumidor HTTP são externos.
- **Funcionalidades relacionadas:** `funcionalidade:listar-trabalhos`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `GET /api/admin/trabalhos`; controller extrai filtros; service aplica apenas filtros informados e retorna lista — `src/routes/admin/trabalhos.routes.js:6`, `src/controllers/trabalhos.controller.js:10-12`, `src/services/trabalhos.service.js:7-14`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/trabalhos.service.js:7-14`

### jornada:listar-trabalhos-aluno — Consulta de trabalhos do aluno

- **Objetivo:** Permitir ao próprio aluno ou admin consultar trabalhos de um aluno.
- **Completude:** Parcial; autenticação, autorização e erros são dependências.
- **Funcionalidades relacionadas:** `funcionalidade:listar-trabalhos`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Cliente envia `GET /api/alunos/:alunoId/trabalhos`; rota exige token e autorização; controller chama service filtrando `alunoId` — `src/routes/aluno.routes.js:10,14`, `src/controllers/trabalhos.controller.js:33-35`, `src/services/trabalhos.service.js:7-10`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/routes/aluno.routes.js:10,14`, `src/services/trabalhos.service.js:7-10`

### jornada:consultar-trabalho — Consultar por identificador

- **Objetivo:** Obter trabalho específico.
- **Completude:** Parcial; montagem e erros globais externos.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-trabalho`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin solicita `GET /api/admin/trabalhos/:id`; service busca e retorna trabalho ou `404` — `src/routes/admin/trabalhos.routes.js:7`, `src/services/trabalhos.service.js:16-19`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/trabalhos.service.js:16-19`

### jornada:registrar-entrega — Registro de entrega

- **Objetivo:** Registrar trabalho entregue por aluno matriculado.
- **Completude:** Completa no fluxo funcional.
- **Funcionalidades relacionadas:** `funcionalidade:registrar-entrega`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Cliente envia `POST /api/alunos/:alunoId/trabalhos` com `disciplinaId`, `titulo` e descrição opcional; rota autentica/autoriza; service confirma aluno, campos, disciplina e matrícula; cria e retorna `201` — `src/routes/aluno.routes.js:10,15`, `src/services/trabalhos.service.js:21-38`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/trabalhos.service.js:21-38`

### jornada:corrigir-trabalho — Correção administrativa

- **Objetivo:** Atualizar estado de correção, nota e feedback.
- **Completude:** Completa no fluxo funcional; não há transição obrigatória entre estados.
- **Funcionalidades relacionadas:** `funcionalidade:corrigir-trabalho`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `PUT /api/admin/trabalhos/:id`; service confirma trabalho, valida status/nota, altera apenas campos presentes e salva — `src/routes/admin/trabalhos.routes.js:8`, `src/services/trabalhos.service.js:40-59`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/trabalhos.service.js:40-59`

### jornada:remover-trabalho — Remoção administrativa

- **Objetivo:** Excluir trabalho existente.
- **Completude:** Completa no fluxo funcional.
- **Funcionalidades relacionadas:** `funcionalidade:remover-trabalho`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Admin envia `DELETE /api/admin/trabalhos/:id`; service confirma e remove; controller responde `204` — `src/routes/admin/trabalhos.routes.js:9`, `src/services/trabalhos.service.js:61-64`, `src/controllers/trabalhos.controller.js:23-26`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/trabalhos.service.js:61-64`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:filtros-trabalhos | Listagem admin aceita `alunoId`, `disciplinaId`, `status`. | Cada filtro informado é aplicado. | 0.99 (fato) | `src/services/trabalhos.service.js:7-14` |
| regra:campos-entrega-obrigatorios | Registro exige `disciplinaId` e `titulo`. | Ausência retorna `400`. | 0.99 (fato) | `src/services/trabalhos.service.js:25-29` |
| regra:aluno-existente | Aluno precisa existir. | Inexistente gera `404`. | 0.99 (fato cruzado) | `src/services/trabalhos.service.js:21`; `src/services/alunos.service.js:10-14` |
| regra:disciplina-existente | Disciplina precisa existir. | Inexistente gera `404`. | 0.99 (fato cruzado) | `src/services/trabalhos.service.js:31`; `src/services/disciplinas.service.js:11-15` |
| regra:matricula-previa | Aluno precisa estar matriculado. | Ausência retorna `409`. | 0.99 (fato) | `src/services/trabalhos.service.js:33-35` |
| regra:status-inicial | Novo trabalho recebe `entregue`. | Status é atribuído por padrão. | 0.99 (fato) | `src/models/trabalho.model.js:22`; `src/services/trabalhos.service.js:37-38` |
| regra:status-valido | Correção aceita `entregue`, `em_correcao`, `corrigido`. | Outro status retorna `400`. | 0.99 (fato) | `src/services/trabalhos.service.js:6,44-46` |
| regra:nota-valida | Nota pode ser `null` ou número entre `0` e `10`. | Valor inválido retorna `400`. | 0.99 (fato) | `src/services/trabalhos.service.js:48-50` |
| regra:atualizacao-correcao-parcial | Correção altera somente campos enviados. | Omitidos permanecem inalterados. | 0.99 (fato) | `src/services/trabalhos.service.js:52-57` |
| regra:trabalho-existente | Consulta, correção e remoção exigem trabalho existente. | ID inexistente retorna `404`. | 0.99 (fato) | `src/services/trabalhos.service.js:16-19,41,61-62` |
| regra:acesso-administrativo | Operações admin exigem papel `admin`. | Acesso indevido recebe `403`. | 0.99 (fato cruzado) | `src/routes/admin/index.js:10-15`; módulo de autorização |
| regra:acesso-proprio-ou-admin | Endpoint de aluno aceita próprio aluno ou admin. | Outro aluno recebe `403`. | 0.99 (fato cruzado) | `src/routes/aluno.routes.js:10,14-15`; módulo de autorização |
| regra:resposta-sem-conteudo | Remoção não retorna entidade. | Sucesso responde `204`. | 0.99 (fato) | `src/controllers/trabalhos.controller.js:23-26` |
| regra:identificador-publico | Model converte `_id` para `id` e remove `versionKey`. | JSON não expõe `_id`/`__v`. | 0.99 (fato) | `src/models/trabalho.model.js:6-14` |
| regra:descricao-opcional | Descrição não é obrigatória; padrão `null`. | Entrega pode ser criada sem descrição. | 0.99 (fato) | `src/models/trabalho.model.js:21`; `src/services/trabalhos.service.js:25-26,37` |
| regra:feedback-opcional | Feedback não é obrigatório; padrão `null`. | Correção pode ser salva sem feedback. | 0.99 (fato) | `src/models/trabalho.model.js:24`; `src/services/trabalhos.service.js:42,56` |
| regra:data-entrega-automatica | `dataEntrega` recebe data atual. | Registro tem data automática. | 0.99 (fato) | `src/models/trabalho.model.js:25` |

## APIs

| ID | Método | Caminho | Acesso | Entrada | Saída/comportamento | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|
| api:admin-trabalhos-listar | GET | `/api/admin/trabalhos` | Admin | Query `alunoId?`, `disciplinaId?`, `status?` | Lista filtrada ou vazia. | 0.99 (fato) | `src/services/trabalhos.service.js:7-14` |
| api:admin-trabalho-detalhe | GET | `/api/admin/trabalhos/:id` | Admin | `id` | Trabalho ou `404`. | 0.99 (fato) | `src/services/trabalhos.service.js:16-19` |
| api:admin-trabalho-corrigir | PUT | `/api/admin/trabalhos/:id` | Admin | `status?`, `nota?`, `feedback?` | Trabalho atualizado; `400`/`404` em falhas conhecidas. | 0.99 (fato) | `src/services/trabalhos.service.js:40-59` |
| api:admin-trabalho-remover | DELETE | `/api/admin/trabalhos/:id` | Admin | `id` | `204` ou `404`. | 0.99 (fato) | `src/services/trabalhos.service.js:61-64` |
| api:aluno-trabalhos-listar | GET | `/api/alunos/:alunoId/trabalhos` | Próprio aluno/admin | `alunoId` | Lista de trabalhos. | 0.99 (fato) | `src/routes/aluno.routes.js:10,14`; `src/services/trabalhos.service.js:7-10` |
| api:aluno-trabalhos-criar | POST | `/api/alunos/:alunoId/trabalhos` | Próprio aluno/admin | `disciplinaId`, `titulo`, `descricao?` | `201`; falhas `400`, `404`, `409`. | 0.99 (fato) | `src/services/trabalhos.service.js:21-38` |

## Entidades

| Entidade | Campos | Relações/regras | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `Trabalho` | `id`, `alunoId`, `disciplinaId`, `titulo`, `descricao`, `status`, `nota`, `feedback`, `dataEntrega`, timestamps | Ligado logicamente a aluno/disciplina; status e nota validados. | 0.99 (fato) | `src/models/trabalho.model.js:16-28` |
| `Aluno` | ID em `Trabalho.alunoId` | Precisa existir e acesso depende da identidade. | 0.99 (fato cruzado) | `src/services/trabalhos.service.js:21`; módulo autorização |
| `Disciplina` | ID em `Trabalho.disciplinaId` | Precisa existir e ter matrícula do aluno. | 0.99 (fato cruzado) | `src/services/trabalhos.service.js:31-35` |
| `Matricula` | `alunoId`, `disciplinaId` | Define elegibilidade para entrega. | 0.99 (fato cruzado) | `src/services/trabalhos.service.js:33-35` |
| `status de trabalho` | `entregue`, `em_correcao`, `corrigido` | Catálogo validado; padrão inicial `entregue`. | 0.99 (fato) | `src/services/trabalhos.service.js:6,44-46`; `src/models/trabalho.model.js:22` |
| `nota de trabalho` | `0-10` ou `null` | Validada na correção. | 0.99 (fato) | `src/services/trabalhos.service.js:48-50` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento backend | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| Listar trabalhos | Sucesso/vazio | Retorna array conforme filtros ou `[]`. | Sim, não distingue base vazia de filtro sem resultado. | 0.95 (inferência) | `src/services/trabalhos.service.js:7-14` |
| Listar trabalhos | Erro auth/autorização | `401` para token inválido/ausente e `403` para acesso incompatível. | Não; status/mensagens distinguem. | 0.99 (fato cruzado) | `src/middlewares/authenticate.js:5-18`; autorização |
| Consultar trabalho | Sucesso/erro | Retorna entidade ou `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/trabalhos.service.js:16-19` |
| Registrar entrega | Sucesso | Retorna `201`; status inicial `entregue`. | Não aplicável visualmente. | 0.99 (fato) | `src/models/trabalho.model.js:22`; controller |
| Registrar entrega | Validação | Campos ausentes `400`; entidades/matrícula inválidas `404`/`409`. | Não; status distinguem. | 0.99 (fato) | `src/services/trabalhos.service.js:21-35` |
| Corrigir trabalho | Sucesso/validação | Atualiza campos; status/nota inválidos `400`. | Não; status distinguem. | 0.99 (fato) | `src/services/trabalhos.service.js:40-59` |
| Remover trabalho | Sucesso/erro | Remove e retorna `204`; inexistente `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/trabalhos.service.js:61-64` |
| Módulo inteiro | Carregando/desabilitado | Não há estados modelados no backend. | Não confirmável no cliente. | 0.98 (lacuna) | Rotas/controllers do módulo |

Nenhum estado visualmente indistinguível pode ser confirmado, pois não há telas. A única ambiguidade backend é a lista vazia para diferentes causas.

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Evidência |
|---|---|---|---|
| `mongoose`/MongoDB | Persistência | Persistir e consultar trabalhos. | `src/models/trabalho.model.js:2-4,29-30`; `src/database/db.js:3-9` |
| `node:crypto` | Biblioteca nativa | Gerar UUID. | `src/models/trabalho.model.js:1,11` |
| `express.Router` | Biblioteca | Montar rotas HTTP. | `src/routes/admin/trabalhos.routes.js:1-4`; `src/routes/aluno.routes.js:1,8` |
| `asyncHandler` | Utilitário local | Encaminhar rejeições assíncronas. | `src/controllers/trabalhos.controller.js:1,10-35` |
| `ApiError` | Utilitário local | Representar erros HTTP. | `src/services/trabalhos.service.js:2,17-50` |
| `alunos.service.js` | Serviço local | Confirmar aluno. | `src/services/trabalhos.service.js:3,21` |
| `disciplinas.service.js` | Serviço local | Confirmar disciplina/matrícula. | `src/services/trabalhos.service.js:4,31-35` |
| `authenticate`/`authorize` | Middlewares locais | Proteger rotas. | `src/routes/admin/index.js:10`; `src/routes/aluno.routes.js:10` |
| `errorHandler` | Middleware global | Serializar erros. | `src/app.js:45-46`; `src/middlewares/errorHandler.js:4-12` |

## Lacunas

- Não foi confirmado upload/armazenamento de arquivo; registro aceita apenas título/descrição.
- Não foi confirmada transição ordenada entre `entregue`, `em_correcao` e `corrigido`.
- Não foi confirmado que só trabalhos `entregue` podem entrar em correção.
- Não foi confirmada exigência de nota/feedback quando status é `corrigido`.
- Não foi confirmada validação de tamanho/formato/conteúdo de título, descrição e feedback.
- Não foi confirmada unicidade de trabalho por aluno, disciplina ou título.
- Não foram confirmadas paginação, ordenação, cascatas, edição pelo aluno ou estados do cliente.
- Nenhuma requisição ou teste foi executado nesta importação.

## Hipóteses

- `Trabalho` representa entrega acadêmica de aluno em disciplina — `src/models/trabalho.model.js:16-25`.
- Matrícula prévia define elegibilidade para registrar entrega — `src/services/trabalhos.service.js:33-35`.
- `corrigido` provavelmente é etapa posterior à nota/feedback, mas o código não impõe relação — `src/services/trabalhos.service.js:6,44-57`.
- Data de entrega é automática no momento da criação — `src/models/trabalho.model.js:25`.
- Admin mantém/corrige e aluno consulta/registra — rotas admin e aluno do módulo.

## Resumo

| Item | Quantidade |
|---|---:|
| Funcionalidades | 5 |
| Jornadas | 6 |
| Regras | 17 |
| APIs | 6 |
| Entidades | 6 |
| Estados observáveis | 8 grupos |
| Dependências listadas | 9 |
| Lacunas | 8 grupos |
| Hipóteses | 5 |

Este arquivo é um rascunho modular para posterior consolidação pelo `/qa-consolidacao-conhecimento`.

**Próximo passo:** acionar `/qa-consolidacao-conhecimento` para consolidar autenticação, autorização, alunos, disciplinas/matrículas, notas e trabalhos em `docs/knowledge-base.md`.
