# Módulo — Autenticação

**Caminho técnico:** `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`, `src/services/auth.service.js`, `src/middlewares/authenticate.js`, `src/config/jwt.js`, `src/models/admin.model.js`, `src/models/aluno.model.js`  
**Tipo:** Backend  
**Importado em:** 2026-09-17  
**Fonte cruzada:** `docs/source-map.md`, principalmente `SRC-EP-001`, `SRC-ERR-001`, `SRC-ERR-002`, `SRC-ERR-009`, `SRC-ERR-010`, entidades `Administrador` e `Aluno`.

## Telas

Nenhuma tela foi identificada. O recorte contém rotas, controller, serviço, middleware, configuração JWT e modelos backend, sem evidência de componentes ou páginas frontend.

**Confiança:** 0.99 (fato)  
**Evidência:** `src/routes/auth.routes.js:1-7`, `src/controllers/auth.controller.js:1-5`

## Funcionalidades

| ID | Nome | Objetivo | Telas | Jornadas | Regras | APIs | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|---|
| funcionalidade:login-usuario | Autenticar usuário | Validar e-mail e senha de administrador ou aluno e emitir JWT e dados públicos | — | jornada:login-com-credenciais | `regra:credenciais-obrigatorias`; `regra:busca-admin-antes-aluno`; `regra:credenciais-validas`; `regra:senha-hash` | `api:login` | 0.99 (fato) | `src/services/auth.service.js:15-31`, `src/controllers/auth.controller.js:4-5` |
| funcionalidade:validar-token | Validar token de acesso | Verificar Bearer JWT e disponibilizar identidade e papel em `req.user` | — | jornada:validacao-token-requisicao | `regra:token-bearer-obrigatorio`; `regra:token-jwt-valido`; `regra:token-expira-em-oito-horas` | `api:middleware-authenticate` | 0.99 (fato) | `src/middlewares/authenticate.js:5-23` |

## Jornadas

### jornada:login-com-credenciais — Login com credenciais

- **Objetivo:** Autenticar administrador ou aluno e retornar JWT acompanhado dos dados públicos.
- **Completude:** Completa no recorte; o consumo posterior do token não faz parte desta jornada.
- **Funcionalidades relacionadas:** `funcionalidade:login-usuario`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Cliente envia `POST` com `email` e `senha` — `api:login`, `src/routes/auth.routes.js:6`, `src/controllers/auth.controller.js:4`.
  2. Controller encaminha `req.body` para `authService.login` — `src/controllers/auth.controller.js:4-5`.
  3. Serviço valida campos obrigatórios — `regra:credenciais-obrigatorias`, `src/services/auth.service.js:15-17`.
  4. Serviço procura administrador antes de aluno — `regra:busca-admin-antes-aluno`, `src/services/auth.service.js:19-21`.
  5. Serviço compara a senha com hash usando bcrypt — `regra:senha-hash`, `src/services/auth.service.js:23`.
  6. Com credenciais válidas, assina JWT com `sub`, `role` e `nome` — `src/services/auth.service.js:6-9`, `27`.
  7. Retorna `token` e `usuario` com `id`, `nome`, `email` e `role` — `src/services/auth.service.js:27-31`.
- **Confiança (tipo):** 0.99 (fato)
- **Evidência:** `src/routes/auth.routes.js:6`, `src/controllers/auth.controller.js:4-5`, `src/services/auth.service.js:15-31`

### jornada:validacao-token-requisicao — Validação de token em requisição

- **Objetivo:** Validar JWT antes que uma requisição protegida continue.
- **Completude:** Parcial; a validação está neste recorte, mas as rotas protegidas e handlers posteriores pertencem a outros módulos.
- **Funcionalidades relacionadas:** `funcionalidade:validar-token`
- **Telas relacionadas:** — (Backend-only)
- **Etapas:**
  1. Middleware lê `Authorization` — `src/middlewares/authenticate.js:5-6`.
  2. Exige formato `Bearer <token>` — `src/middlewares/authenticate.js:6-9`.
  3. Extrai o token — `src/middlewares/authenticate.js:11`.
  4. Verifica assinatura e validade com `JWT_SECRET` — `src/middlewares/authenticate.js:13`.
  5. Em caso de sucesso, preenche `req.user` e chama `next()` — `src/middlewares/authenticate.js:14-15`.
  6. Em falha ou expiração, interrompe o fluxo com erro `401` — `src/middlewares/authenticate.js:16-18`.
- **Confiança (tipo):** 0.98 (fato)
- **Evidência:** `src/middlewares/authenticate.js:5-23`, `src/config/jwt.js:1-2`

## Regras

| ID | Regra | Resultado observável | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| regra:credenciais-obrigatorias | Login exige `email` e `senha`. | Ausência gera `400` com mensagem de campos obrigatórios. | 0.99 (fato) | `src/services/auth.service.js:15-17` |
| regra:busca-admin-antes-aluno | Admin é consultado antes do aluno. | Se houver admin com o e-mail, aluno não é consultado. | 0.99 (fato) | `src/services/auth.service.js:19-21` |
| regra:credenciais-validas | Usuário precisa existir e senha corresponder ao hash. | Credenciais inválidas geram `401`. | 0.99 (fato) | `src/services/auth.service.js:23-25` |
| regra:senha-hash | Senhas são armazenadas com bcrypt. | Login compara senha recebida com hash persistido. | 0.99 (fato) | `src/models/admin.model.js:29-32`, `src/models/aluno.model.js:29-32`, `src/services/auth.service.js:23` |
| regra:token-conteudo | JWT contém `sub`, `role` e `nome`. | Middleware usa os dados para preencher `req.user`. | 0.99 (fato) | `src/services/auth.service.js:6-9`, `src/middlewares/authenticate.js:13-15` |
| regra:token-expiracao | JWT possui validade configurada de oito horas. | Token fora da validade é rejeitado. | 0.95 (inferência) | `src/config/jwt.js:1-2`, `src/middlewares/authenticate.js:13-18` |
| regra:token-bearer-obrigatorio | Token deve estar em `Authorization: Bearer <token>`. | Cabeçalho ausente ou formato inválido gera `401`. | 0.99 (fato) | `src/middlewares/authenticate.js:5-9` |
| regra:dados-publicos-login | Login expõe apenas `id`, `nome`, `email` e `role`. | Senha não aparece na resposta. | 0.99 (fato) | `src/services/auth.service.js:27-31` |
| regra:papel-administrador | Admin possui `role` padrão `admin`. | Papel aparece no JWT e na resposta. | 0.98 (fato) | `src/models/admin.model.js:17-27`, `src/services/auth.service.js:6-9`, `27-31` |
| regra:papel-aluno | Aluno possui `role` padrão `aluno`. | Papel aparece no JWT e na resposta. | 0.98 (fato) | `src/models/aluno.model.js:17-27`, `src/services/auth.service.js:6-9`, `27-31` |

## APIs

| ID | Método | Caminho | Tipo de acesso | Entrada | Saída/comportamento | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|---|---|
| api:login | POST | `/api/auth/login` | Público | `{email, senha}` | Sucesso: `{token, usuario: {id, nome, email, role}}`; falhas retornam `400` ou `401` | 0.99 (fato) | `docs/source-map.md` `SRC-EP-001`; `src/routes/auth.routes.js:6`; `src/services/auth.service.js:15-31` |
| api:middleware-authenticate | Middleware | Sem caminho próprio | Protege requisições que o montam | `Authorization: Bearer <token>` | Sucesso preenche `req.user`; falha retorna `401` | 0.99 (fato) | `src/middlewares/authenticate.js:5-23` |

## Entidades

| Entidade | Campos relevantes | Regras de autenticação | Confiança (tipo) | Evidência |
|---|---|---|---|---|
| `Administrador` | `id`, `nome`, `email`, `senha`, `role` | E-mail único; role padrão `admin`; senha hashada | 0.99 (fato) | `src/models/admin.model.js:17-32` |
| `Aluno` | `id`, `nome`, `email`, `matricula`, `senha`, `role` | E-mail e matrícula únicos; role padrão `aluno`; senha hashada | 0.99 (fato) | `src/models/aluno.model.js:17-32` |
| `Token JWT` | `sub`, `role`, `nome`, expiração | Assinado com `JWT_SECRET` e válido por `8h` | 0.99 (fato) | `src/services/auth.service.js:6-9`, `src/config/jwt.js:1-2` |
| `req.user` | `id`, `role`, `nome` | Criado após validação JWT | 0.99 (fato) | `src/middlewares/authenticate.js:13-15` |

## Estados observáveis

| Funcionalidade | Estado | Comportamento | Indistinguível? | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| `funcionalidade:login-usuario` | Sucesso | Retorna token e dados públicos | Não aplicável: não há tela | 0.99 (fato) | `src/services/auth.service.js:27-31` |
| `funcionalidade:login-usuario` | Erro | Campos ausentes retornam `400` | Não aplicável: não há tela | 0.99 (fato) | `src/services/auth.service.js:15-17` |
| `funcionalidade:login-usuario` | Erro | Usuário inexistente ou senha incorreta retornam `401` | Não aplicável: não há tela | 0.99 (fato) | `src/services/auth.service.js:23-25` |
| `funcionalidade:login-usuario` | Carregando/Vazio/Desabilitado | Não aplicável ao backend; comportamento de cliente externo não confirmado | Não confirmável | 0.98 (lacuna) | `src/controllers/auth.controller.js:4-5` |
| `funcionalidade:validar-token` | Sucesso | Preenche `req.user` e chama `next()` | Não aplicável: não há tela | 0.99 (fato) | `src/middlewares/authenticate.js:13-15` |
| `funcionalidade:validar-token` | Erro | Token ausente/malformado retorna `401` | Não aplicável: não há tela | 0.99 (fato) | `src/middlewares/authenticate.js:6-9` |
| `funcionalidade:validar-token` | Erro | Token inválido/expirado retorna `401` | Não aplicável: não há tela | 0.99 (fato) | `src/middlewares/authenticate.js:13-18` |
| `funcionalidade:validar-token` | Carregando/Vazio/Desabilitado | Não aplicável ao middleware; estados de cliente não confirmados | Não confirmável | 0.95 (lacuna) | `src/middlewares/authenticate.js:5-23` |

Não foram identificados estados visualmente indistinguíveis porque o módulo não contém telas.

## Dependências externas ao módulo

| Nome | Tipo | O que parece fazer | Onde é usado | Confiança (tipo) | Evidência |
|---|---|---|---|---|---|
| `express` | Biblioteca | Fornecer `Router` para endpoint HTTP | `src/routes/auth.routes.js` | 0.99 (fato) | `src/routes/auth.routes.js:1-3` |
| `jsonwebtoken` | Biblioteca | Assinar e verificar JWT | Serviço e middleware | 0.99 (fato) | `src/services/auth.service.js:1,6-9`, `src/middlewares/authenticate.js:1,13` |
| `bcryptjs` | Biblioteca | Comparar e gerar hashes | Serviço e hooks dos modelos | 0.99 (fato) | `src/services/auth.service.js:2,23`, `src/models/admin.model.js:2,29-32`, `src/models/aluno.model.js:2,29-32` |
| `mongoose` via `src/database/db.js` | Persistência externa ao recorte | Fornecer conexão e modelos MongoDB | Modelos de admin e aluno | 0.98 (fato) | `src/models/admin.model.js:3`, `src/models/aluno.model.js:3` |
| `asyncHandler` | Utilitário local | Encaminhar rejeições assíncronas ao pipeline de erros | Controller | 0.95 (inferência) | `src/controllers/auth.controller.js:1,4` |
| `ApiError` | Utilitário local | Representar erros HTTP classificados | Serviço e middleware | 0.99 (fato) | `src/services/auth.service.js:5,16-17,24`, `src/middlewares/authenticate.js:2,7-9,17-18` |
| `node:crypto` | Biblioteca nativa | Gerar UUID dos modelos | Modelos de admin e aluno | 0.99 (fato) | `src/models/admin.model.js:1,11`, `src/models/aluno.model.js:1,11` |

## Lacunas

- O arquivo que monta `auth.routes.js` no prefixo `/api/auth` não foi incluído no recorte; o caminho completo foi confirmado pelo source-map (`SRC-EP-001`).
- O formato HTTP final dos erros depende do middleware global, não lido nesta rodada.
- Não foram confirmados refresh token, logout, revogação ou blacklist.
- Não foi confirmado tratamento de conta desativada, bloqueada ou expirada.
- Não foi confirmada normalização de e-mail.
- Não foi confirmada limitação de tentativas, rate limiting, auditoria ou registro de login.
- Não foi confirmada a configuração efetiva de `JWT_SECRET` em produção; existe fallback de desenvolvimento em `src/config/jwt.js:1`.
- Não foi confirmado o comportamento do cliente consumidor em loading, vazio, erro ou desabilitado.

## Hipóteses

- `req.user` provavelmente é consumido por middlewares de autorização e handlers de rotas protegidas. **Confiança:** 0.90 (hipótese). Evidência indireta: `src/middlewares/authenticate.js:14-15` e `docs/source-map.md`, `SRC-EP-005` a `SRC-EP-029`.
- `role` provavelmente determina permissões posteriores entre administradores e alunos. **Confiança:** 0.90 (hipótese). Evidência indireta: `src/services/auth.service.js:6-9`, `src/models/admin.model.js:25`, `src/models/aluno.model.js:25`.
- A mensagem única para usuário inexistente e senha incorreta parece reduzir exposição sobre a existência de contas. **Confiança:** 0.80 (inferência). Evidência: `src/services/auth.service.js:23-25`.

## Resumo

| Item | Valor |
|---|---:|
| Módulo importado | Autenticação |
| Tipo | Backend |
| Telas | 0 |
| Funcionalidades | 2 |
| Jornadas | 2 |
| Estados observáveis | 8 grupos; nenhum visual indistinguível confirmado |
| Dependências externas listadas | 7 |
| Lacunas | 8 |
| Próximo passo | Importar autorização, começando por `src/middlewares/authorize.js`, `src/middlewares/authorizeSelfOrAdmin.js` e suas rotas protegidas |
