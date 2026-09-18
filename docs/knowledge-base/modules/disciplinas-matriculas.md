# Módulo — Disciplinas e Matrículas

**Caminho técnico:** `src/services/disciplinas.service.js`, `src/models/disciplina.model.js`, `src/models/matricula.model.js`, `src/controllers/disciplinas.controller.js`, `src/routes/admin/disciplinas.routes.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md` (`SRC-EP-010` a `SRC-EP-016`, `SRC-ERR-011` a `SRC-ERR-015`) e módulos de autenticação, autorização e alunos.

## Telas

Nenhuma tela identificada. O recorte contém apenas services, models, controller e rotas backend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/admin/disciplinas.routes.js:1-19`, `src/controllers/disciplinas.controller.js:1-48`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:listar-disciplinas | Listar disciplinas | Retornar disciplinas cadastradas. | — | `jornada:consultar-disciplinas` | `regra:lista-disciplinas` | `api:admin-disciplinas-listar` | 0.99 (fato) | `src/services/disciplinas.service.js:7-9` |
| funcionalidade:consultar-disciplina | Consultar disciplina | Retornar disciplina por identificador. | — | `jornada:consultar-disciplina` | `regra:disciplina-existente` | `api:admin-disciplina-detalhe` | 0.99 (fato) | `src/services/disciplinas.service.js:11-15` |
| funcionalidade:cadastrar-disciplina | Cadastrar disciplina | Criar disciplina com nome, código e carga horária opcional, impedindo código duplicado. | — | `jornada:administrar-disciplina` | `regra:campos-disciplina-obrigatorios`; `regra:codigo-disciplina-unico` | `api:admin-disciplinas-criar` | 0.99 (fato) | `src/services/disciplinas.service.js:17-29` |
| funcionalidade:alterar-disciplina | Alterar disciplina | Atualizar parcialmente nome, código ou carga horária. | — | `jornada:administrar-disciplina` | `regra:atualizacao-disciplina-parcial`; `regra:disciplina-existente` | `api:admin-disciplina-atualizar` | 0.98 (fato) | `src/services/disciplinas.service.js:31-40` |
| funcionalidade:remover-disciplina | Remover disciplina | Excluir disciplina existente. | — | `jornada:administrar-disciplina` | `regra:disciplina-existente`; `regra:resposta-sem-conteudo` | `api:admin-disciplina-remover` | 0.99 (fato) | `src/services/disciplinas.service.js:42-45` |
| funcionalidade:matricular-aluno | Matricular aluno em disciplina | Criar vínculo entre aluno e disciplina existentes, se ainda não houver vínculo. | — | `jornada:matricular-aluno` | `regra:aluno-id-obrigatorio`; `regra:aluno-e-disciplina-existentes`; `regra:matricula-unica` | `api:admin-criar-matricula` | 0.99 (fato) | `src/controllers/disciplinas.controller.js:35-43`; `src/services/disciplinas.service.js:47-60` |
| funcionalidade:listar-alunos-disciplina | Listar alunos da disciplina | Retornar alunos associados às matrículas. | — | `jornada:consultar-alunos-disciplina` | `regra:disciplina-existente`; `regra:alunos-via-matriculas`; `regra:senha-nao-exposta` | `api:admin-alunos-disciplina` | 0.99 (fato) | `src/services/disciplinas.service.js:62-67` |
| funcionalidade:verificar-matricula | Verificar matrícula existente | Informar internamente se há vínculo aluno-disciplina. | — | `jornada:verificar-vinculo-matricula` | `regra:consulta-existencia-matricula` | Suporte interno | 0.95 (fato) | `src/services/disciplinas.service.js:69-71` |

## Jornadas

### jornada:consultar-disciplinas — Consultar disciplinas

- **Objetivo:** Listar disciplinas cadastradas.
- **Completude:** Parcial; consumidor HTTP e pipeline global não estão inteiramente no recorte.
- **Funcionalidades relacionadas:** `funcionalidade:listar-disciplinas`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Rota administrativa chama controller, que chama service e consulta todas as disciplinas — `src/routes/admin/disciplinas.routes.js:14`, `src/controllers/disciplinas.controller.js:14-16`, `src/services/disciplinas.service.js:7-9`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/routes/admin/disciplinas.routes.js:14`, `src/services/disciplinas.service.js:7-9`

### jornada:consultar-disciplina — Consultar por identificador

- **Objetivo:** Obter disciplina específica.
- **Completude:** Parcial; tratamento global de erros é externo.
- **Funcionalidades relacionadas:** `funcionalidade:consultar-disciplina`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Rota encaminha ID ao service; busca inexistente gera `404`; sucesso retorna disciplina — `src/routes/admin/disciplinas.routes.js:16`, `src/controllers/disciplinas.controller.js:18-20`, `src/services/disciplinas.service.js:11-15`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/disciplinas.service.js:11-15`

### jornada:administrar-disciplina — Criar, alterar ou remover disciplina

- **Objetivo:** Administrar cadastro de disciplinas.
- **Completude:** Parcial; efeitos da remoção sobre matrículas relacionadas não estão confirmados.
- **Funcionalidades relacionadas:** cadastro, alteração e remoção de disciplina.
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Criação exige nome/código, verifica código, persiste; alteração é parcial; remoção verifica existência e responde `204` — `src/services/disciplinas.service.js:17-45`, `src/controllers/disciplinas.controller.js:22-33`.
- **Confiança:** 0.98 (fato)
- **Evidência:** `src/routes/admin/index.js:10-13`, `src/services/disciplinas.service.js:17-45`

### jornada:matricular-aluno — Matricular aluno

- **Objetivo:** Associar aluno existente a disciplina existente.
- **Completude:** Completa para criação do vínculo.
- **Funcionalidades relacionadas:** `funcionalidade:matricular-aluno`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Recebe `alunoId`; valida campo; confirma disciplina e aluno; rejeita vínculo duplicado; cria matrícula e responde `201` — `src/controllers/disciplinas.controller.js:35-43`, `src/services/disciplinas.service.js:47-60`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/disciplinas.service.js:47-60`

### jornada:consultar-alunos-disciplina — Consultar alunos matriculados

- **Objetivo:** Retornar alunos vinculados a uma disciplina.
- **Completude:** Parcial; semântica de disciplina sem matrículas não é explícita.
- **Funcionalidades relacionadas:** `funcionalidade:listar-alunos-disciplina`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Confirma disciplina; busca matrículas; extrai IDs; busca alunos; controller sanitiza senha — `src/services/disciplinas.service.js:62-67`, `src/controllers/disciplinas.controller.js:45-48`.
- **Confiança:** 0.99 (fato)
- **Evidência:** `src/services/disciplinas.service.js:62-67`

### jornada:verificar-vinculo-matricula — Verificar matrícula

- **Objetivo:** Consultar existência de vínculo para outros fluxos acadêmicos.
- **Completude:** Parcial; não há endpoint exposto.
- **Funcionalidades relacionadas:** `funcionalidade:verificar-matricula`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:** Recebe `alunoId` e `disciplinaId`, consulta `Matricula` e retorna booleano — `src/services/disciplinas.service.js:69-71`.
- **Confiança:** 0.95 (fato)
- **Evidência:** `src/services/disciplinas.service.js:69-71`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:campos-disciplina-obrigatorios | Criação exige `nome` e `codigo`. | Ausência gera `400`. | 0.99 (fato) | `src/services/disciplinas.service.js:18-21` |
| regra:codigo-disciplina-unico | Código deve ser único na criação. | Duplicidade gera `409`. | 0.99 (fato) | `src/services/disciplinas.service.js:23-26`; `src/models/disciplina.model.js:17-20` |
| regra:carga-horaria-opcional | Carga horária não é exigida. | Ausência mantém `null`. | 0.99 (fato) | `src/services/disciplinas.service.js:18`, `28`; `src/models/disciplina.model.js:20` |
| regra:atualizacao-disciplina-parcial | Alteração aplica somente campos definidos. | Omitidos permanecem inalterados. | 0.99 (fato) | `src/services/disciplinas.service.js:33-38` |
| regra:disciplina-existente | Operações por disciplina exigem entidade existente. | ID inexistente gera `404`. | 0.99 (fato) | `src/services/disciplinas.service.js:11-15`, `32`, `43`, `48`, `63` |
| regra:aluno-id-obrigatorio | Matrícula exige `alunoId`. | Ausência gera `400`. | 0.99 (fato) | `src/controllers/disciplinas.controller.js:36-40` |
| regra:aluno-e-disciplina-existentes | Matrícula exige aluno e disciplina existentes. | Entidade inexistente interrompe com `404`. | 0.99 (fato) | `src/services/disciplinas.service.js:47-50` |
| regra:matricula-unica | Mesmo aluno não pode ser matriculado duas vezes na mesma disciplina. | Duplicidade gera `409`. | 0.99 (fato) | `src/services/disciplinas.service.js:51-53` |
| regra:alunos-via-matriculas | Alunos são derivados de `Matricula`. | Consulta usa IDs de matrícula e depois alunos. | 0.99 (fato) | `src/services/disciplinas.service.js:64-67` |
| regra:senha-nao-exposta | Listagem de alunos sanitiza senha. | Resposta não inclui `senha`. | 0.99 (fato cruzado) | `src/controllers/disciplinas.controller.js:45-48`; `src/models/aluno.model.js:35-40` |
| regra:identificador-publico | Models convertem `_id` para `id` e removem `versionKey`. | JSON não expõe `_id` nem `__v`. | 0.99 (fato) | `src/models/disciplina.model.js:6-13`; `src/models/matricula.model.js:6-13` |
| regra:resposta-sem-conteudo | Remoção responde sem entidade. | Controller retorna `204`. | 0.99 (fato) | `src/controllers/disciplinas.controller.js:30-33` |
| regra:acesso-administrativo | Rotas exigem autenticação e papel admin. | Usuários sem autorização são rejeitados. | 0.99 (fato cruzado) | `src/routes/admin/index.js:10-13`; módulo de autorização |

## APIs

| ID | Método | Caminho | Acesso | Entrada | Saída/comportamento | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|
| api:admin-disciplinas-listar | GET | `/api/admin/disciplinas` | Admin | — | Lista de disciplinas; pode ser vazia. | 0.99 (fato) | `docs/source-map.md`, `SRC-EP-010`; `src/routes/admin/disciplinas.routes.js:14` |
| api:admin-disciplinas-criar | POST | `/api/admin/disciplinas` | Admin | `nome`, `codigo`, `cargaHoraria?` | `201`; falhas `400` ou `409`. | 0.99 (fato) | `src/services/disciplinas.service.js:17-29` |
| api:admin-disciplina-detalhe | GET | `/api/admin/disciplinas/:id` | Admin | `id` | Disciplina ou `404`. | 0.99 (fato) | `src/routes/admin/disciplinas.routes.js:16`; `src/services/disciplinas.service.js:11-15` |
| api:admin-disciplina-atualizar | PUT | `/api/admin/disciplinas/:id` | Admin | ID e campos parciais | Disciplina ou `404`; conflito de código na atualização não classificado. | 0.95 (fato/inferência) | `src/services/disciplinas.service.js:31-40` |
| api:admin-disciplina-remover | DELETE | `/api/admin/disciplinas/:id` | Admin | `id` | `204` ou `404`. | 0.99 (fato) | `src/services/disciplinas.service.js:42-45` |
| api:admin-criar-matricula | POST | `/api/admin/disciplinas/:id/matriculas` | Admin | ID da disciplina + `{alunoId}` | `201`; `400`, `404` ou `409`. | 0.99 (fato) | `src/controllers/disciplinas.controller.js:35-43` |
| api:admin-alunos-disciplina | GET | `/api/admin/disciplinas/:id/alunos` | Admin | ID da disciplina | Lista de alunos sem senha; `404` se disciplina não existe. | 0.99 (fato) | `src/services/disciplinas.service.js:62-67` |
| api:verificar-matricula-interno | Função de service | Sem rota | Uso interno | `alunoId`, `disciplinaId` | Booleano de existência. | 0.95 (fato) | `src/services/disciplinas.service.js:69-71` |

## Entidades

| Entidade | Campos | Relações/regras | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `Disciplina` | `id`, `nome`, `codigo`, `cargaHoraria`, timestamps | Nome/código obrigatórios; código único; carga padrão `null`. | 0.99 (fato) | `src/models/disciplina.model.js:16-22` |
| `Matricula` | `id`, `alunoId`, `disciplinaId`, `dataMatricula` | Relação lógica aluno-disciplina; data atual por padrão. | 0.99 (fato) | `src/models/matricula.model.js:16-22` |
| `Aluno` | ID e dados acadêmicos | Referenciado por matrícula e sanitizado na listagem. | 0.99 (fato cruzado) | `src/services/disciplinas.service.js:3`, `62-67` |
| `id` da disciplina | String UUID | Usado em buscas e matrículas. | 0.99 (fato) | `src/models/disciplina.model.js:17`; `src/services/disciplinas.service.js:11-71` |
| `alunoId` | String UUID | Identifica aluno da matrícula. | 0.99 (fato) | `src/models/matricula.model.js:17-19` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento backend | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| Listar disciplinas | Sucesso | Retorna lista. | Não aplicável visualmente. | 0.99 (fato) | `src/services/disciplinas.service.js:7-9` |
| Listar disciplinas | Vazio | Pode retornar `[]` sem mensagem específica. | Sim, backend não diferencia base vazia de resultado vazio. | 0.95 (inferência) | `src/services/disciplinas.service.js:7-9` |
| Consultar disciplina | Erro | Disciplina inexistente retorna `404`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/disciplinas.service.js:11-15` |
| Cadastrar disciplina | Validação/conflito | Ausência gera `400`; código duplicado gera `409`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/disciplinas.service.js:18-26` |
| Alterar/remover disciplina | Sucesso/erro | Persiste ou remove; ID inexistente gera `404`; remoção retorna `204`. | Não aplicável visualmente. | 0.99 (fato) | `src/services/disciplinas.service.js:31-45` |
| Matricular aluno | Validação | `alunoId` ausente gera `400`; entidade inexistente gera `404`; duplicidade gera `409`. | Não aplicável visualmente. | 0.99 (fato) | `src/controllers/disciplinas.controller.js:36-40`; `src/services/disciplinas.service.js:47-53` |
| Listar alunos da disciplina | Sucesso/vazio | Retorna alunos sem senha; disciplina sem matrículas pode retornar `[]`. | Sim, sem semântica adicional de vazio. | 0.90 (inferência) | `src/services/disciplinas.service.js:62-67` |
| Módulo inteiro | Carregando/desabilitado | Não há estados modelados no backend. | Não confirmável no cliente. | 0.98 (lacuna) | `src/controllers/disciplinas.controller.js:14-48` |

Não há estados visualmente indistinguíveis de telas porque o módulo é backend-only.

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Evidência |
|---|---|---|---|
| `mongoose`/MongoDB | Persistência | Armazenar disciplinas, matrículas e alunos. | `src/models/disciplina.model.js:2-4`, `25-26`; `src/models/matricula.model.js:2-4`, `25-26` |
| `node:crypto` | Biblioteca nativa | Gerar UUIDs. | Models de disciplina e matrícula |
| `express.Router` | Biblioteca | Montar endpoints administrativos. | `src/routes/admin/disciplinas.routes.js:1`, `11-20` |
| `asyncHandler` | Utilitário local | Encaminhar erros assíncronos. | `src/controllers/disciplinas.controller.js:1`, `13-48` |
| `ApiError` | Utilitário local | Representar erros HTTP. | `src/services/disciplinas.service.js:4`, `12-26`, `52` |
| `Aluno`/`alunos.service` | Módulo local | Confirmar e buscar alunos. | `src/services/disciplinas.service.js:3`, `5`, `49`, `66` |
| `sanitizeAluno` | Função local | Remover senha da representação. | `src/controllers/disciplinas.controller.js:11`, `45-48` |
| `authenticate`/`authorize` | Middlewares locais | Proteger rotas admin. | `src/routes/admin/index.js:6-10` |
| `errorHandler` | Middleware local | Serializar erros. | `src/middlewares/errorHandler.js:4-12` |

## Lacunas

- Não foi confirmado se remover disciplina remove ou preserva matrículas relacionadas.
- Não foi confirmada remoção em cascata de matrículas ao remover aluno.
- Não foi confirmado índice composto ou restrição física de unicidade para `{alunoId, disciplinaId}`.
- Unicidade de código é verificada na criação, não no início da atualização.
- Código duplicado na atualização pode atravessar como erro não classificado/`500`.
- Não há validação explícita de tipo, faixa ou valor positivo para `cargaHoraria`.
- Não há validação explícita de formato/existência dos IDs antes das consultas.
- Não foram confirmados paginação, ordenação, filtros, cancelamento ou alteração de matrícula.
- Não foi confirmada semântica de listas vazias ou estados de cliente.
- Não foi confirmado consumidor de `estaMatriculado`.
- Não foram executados testes nesta importação.

## Hipóteses

- `estaMatriculado` é usada por notas e trabalhos para exigir matrícula prévia — `src/services/disciplinas.service.js:69-71`.
- Remover disciplina pode deixar matrículas órfãs, pois `remover` não as exclui visivelmente — `src/services/disciplinas.service.js:42-45`.
- Disciplina sem matrículas resulta em lista vazia — `src/services/disciplinas.service.js:64-67`.
- A relação aluno-disciplina é lógica por IDs string, sem referência Mongoose declarada — `src/models/matricula.model.js:17-19`.

## Resumo

| Item | Quantidade |
|---|---:|
| Funcionalidades | 8 |
| Jornadas | 6 |
| Regras | 13 |
| APIs | 8 |
| Entidades | 5 |
| Estados observáveis | 8 grupos |
| Dependências listadas | 9 |
| Lacunas | 11 grupos |
| Hipóteses | 4 |

Este arquivo é um rascunho modular para posterior consolidação pelo `/qa-consolidacao-conhecimento`.

**Próximo módulo sugerido:** notas, começando por `src/services/notas.service.js`, `src/models/nota.model.js`, `src/controllers/notas.controller.js` e `src/routes/admin/notas.routes.js`.
