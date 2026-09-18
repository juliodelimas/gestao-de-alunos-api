# Base de Conhecimento — Gestão de Alunos API

**Última consolidação:** 2026-09-17  
**Módulos técnicos consolidados:** autenticação, autorização, alunos, disciplinas/matrículas, notas e trabalhos  
**Fontes:** `docs/source-map.md`, `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md` e `docs/knowledge-base/modules/*.md`

Módulos-fonte usados explicitamente: `autenticacao.md`, `autorizacao.md`, `alunos.md`, `disciplinas-matriculas.md`, `notas.md` e `trabalhos.md`.

> O projeto analisado contém somente backend. Não foram identificadas telas, componentes, templates ou seletores frontend. Fato = evidência direta; inferência = conclusão forte derivada; hipótese = relação ainda não confirmada.

## Resumo funcional

| ID | Módulo | Funcionalidades principais | Telas | Confiança |
|---|---|---|---:|---:|
| `modulo:autenticacao-identidade` | Autenticação e identidade | Login e validação JWT | 0 | 0.99 (fato) |
| `modulo:administracao-cadastro-academico` | Administração acadêmica | Alunos, disciplinas, matrículas, notas e trabalhos | 0 | 0.99 (fato) |
| `modulo:consultas-academicas` | Consultas e autoatendimento | Disciplinas, notas e trabalhos do aluno | 0 | 0.99 (fato) |
| `modulo:avaliacao-academica` | Avaliação acadêmica | Notas e trabalhos | 0 | 0.99 (fato) |

## Funcionalidades consolidadas

| ID | Nome | API(s) relacionada(s) | Confiança | Evidência |
|---|---|---|---|---|
| `funcionalidade:login-usuario` | Autenticar administrador ou aluno | `api:login` | 0.99 (fato) | `src/services/auth.service.js:15-31` |
| `funcionalidade:validar-token` | Validar Bearer JWT | `api:middleware-authenticate` | 0.99 (fato) | `src/middlewares/authenticate.js:5-23` |
| `funcionalidade:autorizacao-administrativa` | Restringir rotas ao papel admin | `api:middleware-authorize` | 0.99 (fato) | `src/routes/admin/index.js:10-16`; `src/middlewares/authorize.js:3-10` |
| `funcionalidade:autorizacao-proprios-dados` | Restringir aluno ao próprio ID | `api:middleware-authorize-self-or-admin` | 0.99 (fato) | `src/routes/aluno.routes.js:10-15`; `src/middlewares/authorizeSelfOrAdmin.js:3-12` |
| `funcionalidade:cadastrar-aluno` | Cadastrar aluno sem duplicidade | `api:admin-alunos-criar` | 0.99 (fato) | `src/services/alunos.service.js:16-29` |
| `funcionalidade:consultar-alunos` | Listar/consultar alunos | `api:admin-alunos-listar`, `api:admin-aluno-detalhe` | 0.99 (fato) | `src/services/alunos.service.js:6-14` |
| `funcionalidade:alterar-aluno` | Alterar aluno parcialmente | `api:admin-aluno-atualizar` | 0.98 (fato) | `src/services/alunos.service.js:32-42` |
| `funcionalidade:remover-aluno` | Remover aluno | `api:admin-aluno-remover` | 0.99 (fato) | `src/services/alunos.service.js:44-47` |
| `funcionalidade:consultar-disciplinas-aluno` | Consultar disciplinas do aluno | `api:aluno-disciplinas` | 0.98 (fato) | `src/services/alunos.service.js:49-54` |
| `funcionalidade:consultar-notas-aluno` | Consultar notas do aluno com filtro | `api:aluno-notas` | 0.98 (fato) | `src/services/alunos.service.js:56-62` |
| `funcionalidade:listar-disciplinas` | Listar disciplinas | `api:admin-disciplinas-listar` | 0.99 (fato) | `src/services/disciplinas.service.js:7-9` |
| `funcionalidade:consultar-disciplina` | Consultar disciplina por ID | `api:admin-disciplina-detalhe` | 0.99 (fato) | `src/services/disciplinas.service.js:11-15` |
| `funcionalidade:cadastrar-disciplina` | Cadastrar disciplina | `api:admin-disciplinas-criar` | 0.99 (fato) | `src/services/disciplinas.service.js:17-29` |
| `funcionalidade:alterar-disciplina` | Alterar disciplina parcialmente | `api:admin-disciplina-atualizar` | 0.98 (fato) | `src/services/disciplinas.service.js:31-40` |
| `funcionalidade:remover-disciplina` | Remover disciplina | `api:admin-disciplina-remover` | 0.99 (fato) | `src/services/disciplinas.service.js:42-45` |
| `funcionalidade:matricular-aluno` | Criar matrícula | `api:admin-criar-matricula` | 0.99 (fato) | `src/services/disciplinas.service.js:47-60` |
| `funcionalidade:listar-alunos-disciplina` | Listar alunos matriculados | `api:admin-alunos-disciplina` | 0.99 (fato) | `src/services/disciplinas.service.js:62-67` |
| `funcionalidade:verificar-matricula` | Verificar vínculo interno | `api:verificar-matricula-interno` | 0.95 (fato) | `src/services/disciplinas.service.js:69-71` |
| `funcionalidade:listar-notas` | Listar notas com filtros | `api:admin-notas-listar` | 0.99 (fato) | `src/services/notas.service.js:8-14` |
| `funcionalidade:consultar-nota` | Consultar nota | `api:admin-nota-detalhe` | 0.99 (fato) | `src/services/notas.service.js:16-20` |
| `funcionalidade:registrar-nota` | Registrar nota de aluno matriculado | `api:admin-notas-criar` | 0.99 (fato) | `src/services/notas.service.js:22-44` |
| `funcionalidade:alterar-nota` | Alterar nota parcialmente | `api:admin-nota-atualizar` | 0.99 (fato) | `src/services/notas.service.js:46-63` |
| `funcionalidade:remover-nota` | Remover nota | `api:admin-nota-remover` | 0.99 (fato) | `src/services/notas.service.js:65-68` |
| `funcionalidade:listar-trabalhos` | Listar trabalhos | `api:admin-trabalhos-listar`, `api:aluno-trabalhos-listar` | 0.99 (fato) | `src/services/trabalhos.service.js:7-14` |
| `funcionalidade:consultar-trabalho` | Consultar trabalho | `api:admin-trabalho-detalhe` | 0.99 (fato) | `src/services/trabalhos.service.js:16-19` |
| `funcionalidade:registrar-entrega` | Registrar entrega | `api:aluno-trabalhos-criar` | 0.99 (fato) | `src/services/trabalhos.service.js:21-38` |
| `funcionalidade:corrigir-trabalho` | Corrigir status, nota e feedback | `api:admin-trabalho-corrigir` | 0.99 (fato) | `src/services/trabalhos.service.js:40-59` |
| `funcionalidade:remover-trabalho` | Remover trabalho | `api:admin-trabalho-remover` | 0.99 (fato) | `src/services/trabalhos.service.js:61-64` |

## Jornadas consolidadas

### Matriz funcionalidade -> jornada

As funcionalidades abaixo apontam para as jornadas que as exercitam; cada jornada detalhada mantém a relação inversa na seção correspondente.

| Funcionalidade | Jornadas |
|---|---|
| `funcionalidade:login-usuario` | `jornada:login-com-credenciais` |
| `funcionalidade:validar-token` | `jornada:validacao-token-requisicao` |
| `funcionalidade:autorizacao-administrativa` | `jornada:acesso-administrativo-protegido` |
| `funcionalidade:autorizacao-proprios-dados` | `jornada:acesso-autosservico-aluno` |
| `funcionalidade:cadastrar-aluno`, `consultar-alunos`, `alterar-aluno`, `remover-aluno` | Jornadas administrativas de aluno correspondentes |
| `funcionalidade:consultar-disciplinas-aluno`, `consultar-notas-aluno` | `jornada:consultar-dados-academicos` |
| `funcionalidade:matricular-aluno`, `verificar-matricula` | `jornada:matricular-aluno`, `jornada:verificar-vinculo-matricula` |
| `funcionalidade:listar-notas`, `consultar-nota`, `registrar-nota`, `alterar-nota`, `remover-nota` | Jornadas administrativas de notas correspondentes |
| `funcionalidade:listar-trabalhos`, `consultar-trabalho`, `registrar-entrega`, `corrigir-trabalho`, `remover-trabalho` | Jornadas administrativas/de aluno de trabalhos correspondentes |

### `jornada:login-com-credenciais`
1. Cliente envia `POST /api/auth/login` com e-mail e senha.
2. Serviço valida campos, procura admin antes de aluno e compara senha com hash.
3. JWT recebe `sub`, `role` e `nome`.
4. Resposta retorna token e dados públicos do usuário.

**Confiança:** 0.99 (fato). **Evidência:** `src/services/auth.service.js:15-31`.

### `jornada:validacao-token-requisicao`
1. Middleware lê `Authorization`.
2. Exige `Bearer <token>`.
3. Verifica JWT e preenche `req.user`.
4. Token ausente, inválido ou expirado retorna `401`.

**Confiança:** 0.98 (fato). **Evidência:** `src/middlewares/authenticate.js:5-23`.

### `jornada:acesso-administrativo-protegido`
1. Requisição entra em `/api/admin/*`.
2. `authenticate` valida identidade.
3. `authorize('admin')` verifica papel.
4. Rotas autorizadas seguem para alunos, disciplinas, notas ou trabalhos; demais recebem `403`.

**Confiança:** 0.99 (fato). **Evidência:** `src/routes/admin/index.js:10-16`; `src/middlewares/authorize.js:3-10`.

### `jornada:acesso-autosservico-aluno`
1. Requisição entra em `/api/alunos/:alunoId/*`.
2. Token é validado.
3. Admin pode acessar qualquer aluno; aluno somente o próprio ID.
4. Identidade incompatível recebe `403`.

**Confiança:** 0.99 (fato). **Evidência:** `src/routes/aluno.routes.js:10-15`; `src/middlewares/authorizeSelfOrAdmin.js:3-12`.

### Jornadas acadêmicas

- `jornada:administrar-cadastro-aluno`: exige campos, verifica duplicidade, salva senha hashada e retorna `201` sem senha. Evidência: `src/services/alunos.service.js:16-29`.
- `jornada:administrar-consulta-aluno`: lista ou busca aluno; ID inexistente retorna `404`; senha é sanitizada. Evidência: `src/services/alunos.service.js:6-14`.
- `jornada:administrar-alteracao-aluno`: busca, aplica campos presentes, salva e retorna entidade sanitizada. Evidência: `src/services/alunos.service.js:32-42`.
- `jornada:administrar-remocao-aluno`: confirma existência, remove e responde `204`. Evidência: `src/services/alunos.service.js:44-47`.
- `jornada:consultar-dados-academicos`: autentica/autorização, confirma aluno e consulta disciplinas via matrículas ou notas com filtro. Evidência: `src/services/alunos.service.js:49-62`.
- `jornada:consultar-disciplinas`: admin lista disciplinas; resultado pode ser vazio. Evidência: `src/services/disciplinas.service.js:7-9`.
- `jornada:consultar-disciplina`: busca disciplina ou retorna `404`. Evidência: `src/services/disciplinas.service.js:11-15`.
- `jornada:administrar-disciplina`: cria, altera parcialmente ou remove disciplina. Evidência: `src/services/disciplinas.service.js:17-45`.
- `jornada:matricular-aluno`: valida aluno, disciplina, duplicidade e cria vínculo. Evidência: `src/services/disciplinas.service.js:47-60`.
- `jornada:consultar-alunos-disciplina`: consulta matrículas, busca alunos e remove senhas. Evidência: `src/services/disciplinas.service.js:62-67`.
- `jornada:verificar-vinculo-matricula`: retorna booleano de existência de vínculo para outros services. Evidência: `src/services/disciplinas.service.js:69-71`.
- `jornada:consultar-notas-administrativas`: lista notas com filtros opcionais. Evidência: `src/services/notas.service.js:8-14`.
- `jornada:consultar-nota`: busca nota ou retorna `404`. Evidência: `src/services/notas.service.js:16-20`.
- `jornada:registrar-nota`: valida campos, faixa 0-10, tipo, entidades e matrícula; salva nota. Evidência: `src/services/notas.service.js:22-44`.
- `jornada:alterar-nota`: revalida valor/tipo, aplica campos parciais e salva. Evidência: `src/services/notas.service.js:46-63`.
- `jornada:remover-nota`: confirma, remove e responde `204`. Evidência: `src/services/notas.service.js:65-68`.
- `jornada:listar-trabalhos-administrativo`: lista trabalhos com filtros de aluno, disciplina e status. Evidência: `src/services/trabalhos.service.js:7-14`.
- `jornada:listar-trabalhos-aluno`: autentica, autoriza e lista trabalhos por aluno. Evidência: `src/routes/aluno.routes.js:10,14`; `src/services/trabalhos.service.js:7-10`.
- `jornada:consultar-trabalho`: busca trabalho ou retorna `404`. Evidência: `src/services/trabalhos.service.js:16-19`.
- `jornada:registrar-entrega`: valida aluno, disciplina, título e matrícula; cria trabalho com status `entregue`. Evidência: `src/services/trabalhos.service.js:21-38`.
- `jornada:corrigir-trabalho`: valida status/nota, atualiza campos e salva. Evidência: `src/services/trabalhos.service.js:40-59`.
- `jornada:remover-trabalho`: confirma, remove e responde `204`. Evidência: `src/services/trabalhos.service.js:61-64`.

Todas as jornadas são Backend-only; não há telas relacionadas.

## Regras de negócio consolidadas

### Identidade e acesso

- Login exige e-mail e senha; credenciais inválidas retornam `401` (`auth.service.js:15-25`).
- Senhas são comparadas contra hash bcrypt e nunca retornadas (`auth.service.js:23`; `admin.model.js:29-32`; `aluno.model.js:29-32`).
- JWT contém `sub`, `role` e `nome`, com validade configurada em `JWT_EXPIRES_IN` (`auth.service.js:6-9`; `config/jwt.js:1-2`).
- Rotas administrativas exigem `admin`; aluno só acessa próprio ID (`authorize.js:4-7`; `authorizeSelfOrAdmin.js:4-10`).

### Alunos

- Cadastro exige nome, e-mail, matrícula e senha; e-mail/matrícula duplicados geram `409` (`alunos.service.js:17-26`).
- Alteração é parcial; consulta, alteração, remoção e consulta acadêmica exigem aluno existente (`alunos.service.js:32-47`).
- Respostas sanitizam senha e expõem `_id` como `id` (`aluno.model.js:7-14,35-40`).

### Disciplinas e matrículas

- Disciplina exige nome e código; código é único; carga horária é opcional (`disciplinas.service.js:17-29`).
- Matrícula exige `alunoId`, aluno/disciplina existentes e não pode duplicar (`disciplinas.controller.js:35-43`; `disciplinas.service.js:47-60`).
- Disciplinas do aluno são derivadas de matrículas (`alunos.service.js:51-54`).

### Notas

- Nota exige aluno, disciplina, valor e tipo; valor deve estar entre 0 e 10 (`notas.service.js:23-32`).
- Tipos permitidos: `prova`, `trabalho`, `participacao` (`notas.service.js:6,30-32`).
- Aluno e disciplina devem existir e o aluno deve estar matriculado (`notas.service.js:34-39`).
- Alteração valida novamente valor e tipo, mas não foi confirmada nova checagem de matrícula (`notas.service.js:46-63`).

### Trabalhos

- Entrega exige disciplina e título; aluno/disciplina precisam existir e o aluno deve estar matriculado (`trabalhos.service.js:21-35`).
- Status inicial é `entregue`; estados aceitos são `entregue`, `em_correcao`, `corrigido` (`trabalho.model.js:22`; `trabalhos.service.js:6,44-46`).
- Nota de correção pode ser nula ou entre 0 e 10; feedback é opcional (`trabalhos.service.js:48-50`; `trabalho.model.js:24`).
- Não há transição obrigatória entre estados nem exigência de nota/feedback para `corrigido` confirmada no código.

## APIs consolidadas

As 29 rotas catalogadas estão detalhadas no [backlog de endpoints](endpoints/gestao-de-alunos-api-endpoints-backlog.md) e no [source-map](source-map.md). Principais grupos:

| Grupo | APIs |
|---|---:|
| Login e técnicas | 4 endpoints + 3 middlewares |
| Alunos | 7 endpoints |
| Disciplinas/matrículas | 7 endpoints + 1 função interna |
| Notas | 5 endpoints |
| Trabalhos | 6 endpoints |

Rotas técnicas públicas: `/`, `/api-docs`, `/api-docs.yaml`. Não foram identificadas telas frontend.

### Crosswalk de identificadores

Para endpoints públicos, os identificadores numéricos são equivalentes: `SRC-EP-001` corresponde a `EP-001`, e ambos são representados pelo `api:*` descrito na tabela de APIs abaixo. Essa equivalência vale para `001` a `029`.

| Namespace | Faixa | Significado |
|---|---|---|
| `SRC-EP-001` a `SRC-EP-029` | 29 itens | Rota extraída do código-fonte |
| `EP-001` a `EP-029` | 29 itens | Item correspondente no backlog de endpoints |
| `api:*` | 29 itens de rota + contratos de suporte | Nome semântico usado nesta base |

Além das 29 rotas, esta base registra 7 contratos de suporte: 3 middlewares (`authenticate`, `authorize`, `authorizeSelfOrAdmin`), 1 função interna (`estaMatriculado`), 2 grupos de rotas protegidas e 1 contrato do pipeline global de erros. Portanto, o total reproduzível é **36 contratos técnicos = 29 endpoints + 7 contratos de suporte**. `api:verificar-matricula-interno` é suporte interno, não endpoint público.

## Entidades e relacionamentos

| Entidade | Relação principal | Evidência |
|---|---|---|
| `Administrador` | Identidade com `role: admin` | `src/models/admin.model.js:17-32` |
| `Aluno` | Referenciado por matrículas, notas e trabalhos | `src/models/aluno.model.js:17-32` |
| `Disciplina` | Referenciada por matrículas, notas e trabalhos | `src/models/disciplina.model.js:16-26` |
| `Matricula` | Liga aluno e disciplina; habilita nota/trabalho | `src/models/matricula.model.js:16-26`; services de notas/trabalhos |
| `Nota` | Liga aluno/disciplina a avaliação | `src/models/nota.model.js:16-25` |
| `Trabalho` | Liga aluno/disciplina a entrega/correção | `src/models/trabalho.model.js:16-28` |
| `Token JWT` | Produz `req.user` para autorização | `src/services/auth.service.js:6-9`; `authenticate.js:13-15` |

Relacionamentos confirmados: aluno-matrícula, disciplina-matrícula, aluno/nota, disciplina/nota, aluno/trabalho, disciplina/trabalho, matrícula-nota, matrícula-trabalho, JWT-req.user e req.user-autorização.

## Relacionamentos candidatos

- Verificar matrícula é dependência de registrar nota e registrar entrega; confirmar chamada direta entre services.
- Remoção de aluno ou disciplina pode exigir cascata para matrículas, notas e trabalhos; política não confirmada.
- Correção de trabalho pode ter transição ordenada e exigir nota/feedback em `corrigido`; não imposto pelo código.
- Atualização de aluno e disciplina pode precisar tratar conflitos de campos únicos como `409`; não confirmado.
- APIs de autoatendimento podem ter consumidor frontend; nenhum foi encontrado neste SUT.
- Listagem padrão de trabalhos pode divergir da descrição do OpenAPI, que sugere apenas trabalhos entregues.

## Lacunas abertas

1. Nenhum frontend, tela, seletor ou estado visual foi identificado.
2. Nenhuma requisição foi executada durante a consolidação; status são estáticos.
3. Não foram confirmados refresh token, logout, revogação, blacklist, contas bloqueadas ou rate limiting.
4. Não foi confirmada configuração de produção do `JWT_SECRET`.
5. Não foi confirmado índice composto de matrícula nem unicidade de notas.
6. Não foram confirmadas cascatas ao excluir aluno/disciplina.
7. Não há validação explícita de formato de IDs, carga horária, tamanho de textos ou upload de arquivos.
8. Não foram confirmadas paginação, ordenação, limites ou filtros adicionais.
9. Não foi confirmada revalidação de matrícula na alteração de nota.
10. Não foram confirmadas transições obrigatórias de status de trabalhos.
11. Não foi confirmada exigência de nota/feedback quando status é `corrigido`.
12. Não foi confirmada semântica de listas vazias além de arrays vazios.
13. Não foi confirmado o arquivo agregador completo dos routers de autenticação/admin.
14. O seed e o isolamento de ambientes de teste precisam de decisão explícita.

## Inconsistências entre código e OpenAPI

- Prefixo `/api`: código usa paths efetivos com `/api`; OpenAPI usa `servers: /api` e paths sem prefixo.
- `/`, `/api-docs` e `/api-docs.yaml` são públicos no código, mas não aparecem como paths OpenAPI.
- OpenAPI sugere JWT global exceto login, mas endpoints técnicos são públicos.
- Atualização de disciplina é parcial no código, enquanto o schema OpenAPI exige nome/código.
- Atualização de aluno não trata duplicidade explicitamente como o cadastro.
- Listagem de trabalhos sem filtro retorna todos os status, embora a descrição OpenAPI sugira trabalhos entregues.
- Implementação permite `nota: null`, mas o schema OpenAPI não declara `nullable: true`.
- Erros não classificados podem resultar em `500`, sem detalhamento individual no contrato.
- Exemplos OpenAPI de credenciais/tokens/IDs não devem ser usados como massa segura.

## Resumo e próximo passo

| Item | Valor |
|---|---:|
| Módulos técnicos | 6 |
| Módulos funcionais | 4 |
| Telas | 0 |
| Funcionalidades | 27 |
| Jornadas | 24 |
| APIs/contratos técnicos | 36 (29 endpoints + 7 suportes) |
| Entidades/contratos | 12 |
| Regras | 56 |
| Relacionamentos confirmados | 10 |
| Relacionamentos candidatos | 13 |
| Lacunas | 27 |
| Inconsistências | 9 |
| Testes executados | 0 |
| API executada | Não |

**Próximo passo:** executar `/qa-revisao-referencia` para validar IDs, referências, duplicidades e organização desta base consolidada.
