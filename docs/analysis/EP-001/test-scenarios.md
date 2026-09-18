# Cenários de Teste — EP-001

> Atualização 2026-09-17: o texto abaixo preserva a análise original. O [complemento de cenários](priority-test-design.md) registra desdobramento e implementação autorizados, incluindo B007/B008, concorrência B010 e B011–B014. Resultados em [execução das prioridades](../../runs/20260917-priorities-run-report.md). As marcações históricas de não observado não descrevem mais o estado integral atual.

## Identificação

- **Endpoint:** `POST /api/auth/login`
- **Escopo:** Backend
- **Fonte:** EP-001, backlog de endpoints
- **Origem:** Descoberta técnica (`/qa-descoberta-endpoints`)
- **Execução:** [NÃO OBSERVADO]
- **Padrões:** `docs/test-standards.md` não encontrado

## Leitura crítica

A fonte informa: “Autentica administrador ou aluno e retorna JWT”, payload “`{email, senha}`”, resposta “`{token, usuario: {id, nome, email, role}}`” e status `200, 400, 401, 500`.

- **[INFERIDO]** `usuario.role` distingue `admin` e `aluno`, sustentado pelo contrato de usuário e pela descrição de autenticação dos dois perfis.
- **[INFERIDO]** O JWT carrega identidade para autorização posterior, sustentado por “JWT contém `sub`, `role` e `nome`”.
- **[INFERIDO]** Senha e hash não devem aparecer na resposta, sustentado por “Senhas são comparadas contra hash bcrypt e nunca retornadas”.
- **[NÃO OBSERVADO]** Campos vazios, nulos, extras, formatos, limites, rate limiting, concorrência e desempenho.

## Comportamentos observados cobertos

| Comportamento | Cenário |
|---|---|
| Login de administrador | TC-B001 |
| Login de aluno | TC-B002 |
| Campos obrigatórios | TC-B003 |
| Credenciais inválidas | TC-B004 |
| Não exposição de senha | TC-B005 |
| Token e resposta | TC-B006 |
| Erro interno | TC-B007 |
| Valores nulos/vazios/extras | TC-B008 |
| Limites/formato | TC-B009 |
| Segurança operacional/desempenho | TC-B010 |

## Cenários Gherkin

### TC-B001 — (Funcional) [AUTOMAÇÃO] Login bem-sucedido de administrador

```gherkin
Cenário: Autenticar um administrador com credenciais válidas
  Dado que existe um administrador com credenciais válidas
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então a resposta deve representar a autenticação bem-sucedida do administrador
  E deve retornar um token
  E deve retornar usuario com id, nome, email e role
  E usuario.role deve identificar o perfil admin
```

Base: “Autentica administrador ou aluno e retorna JWT”; “`{token, usuario: {id, nome, email, role}}`”. Status `200` catalogado, não executado.

### TC-B002 — (Funcional) [AUTOMAÇÃO] Login bem-sucedido de aluno

```gherkin
Cenário: Autenticar um aluno com credenciais válidas
  Dado que existe um aluno com credenciais válidas
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então a resposta deve representar a autenticação bem-sucedida do aluno
  E deve retornar um token
  E deve retornar usuario com id, nome, email e role
  E usuario.role deve identificar o perfil aluno
```

Base: “Autentica administrador ou aluno e retorna JWT”; “`{token, usuario: {id, nome, email, role}}`”.

### TC-B003 — (Negativo) [AUTOMAÇÃO] Campos obrigatórios ausentes

```gherkin
Esquema do cenário: Rejeitar login sem campo obrigatório
  Quando o cliente envia POST para "/api/auth/login" com <payload>
  Então a resposta deve indicar falha de validação
  E o status deve ser 400

Exemplos:
  | payload |
  | {} |
  | {"email": "..."} |
  | {"senha": "..."} |
```

Base: “Login exige e-mail e senha”; status `400` catalogado. Corpo/mensagem não observados.

### TC-B004 — (Negativo) [AUTOMAÇÃO] Credenciais inválidas

```gherkin
Esquema do cenário: Rejeitar credenciais inválidas
  Dado que o email ou a senha não corresponde a uma conta válida
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então a autenticação deve ser rejeitada
  E o status deve ser 401

Exemplos:
  | situação |
  | email inexistente |
  | senha incorreta |
  | email e senha incorretos |
```

Base: “Credenciais inválidas retornam `401`”; mensagem catalogada: “E-mail ou senha inválidos.”

### TC-B005 — (Segurança) [AUTOMAÇÃO] Não exposição de senha ou hash

```gherkin
Cenário: Não expor senha após login
  Dado que existe uma conta com credenciais válidas
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então a resposta não deve conter a senha em texto puro
  E a resposta não deve conter o hash da senha
  E o token não deve conter a senha nem o hash da senha
```

Base: “Senhas são comparadas contra hash bcrypt e nunca retornadas”. Headers e logs não observados nesta fonte.

### TC-B006 — (Funcional/Contrato) [AUTOMAÇÃO] Token e estrutura da resposta

```gherkin
Cenário: Retornar o contrato principal após autenticação
  Dado que existem credenciais válidas
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então a resposta deve conter token
  E deve conter usuario
  E usuario deve conter id, nome, email e role
  E o status deve ser 200
```

Base: “`{token, usuario: {id, nome, email, role}}`”; status `200` catalogado. Tipos, nulos, extras e headers não observados.

### TC-B007 — (Negativo) [MANUAL] Falha interna durante autenticação

```gherkin
Cenário: Tratar erro interno durante o login
  Dado que ocorre uma falha interna durante a autenticação
  Quando o cliente envia POST para "/api/auth/login" com email e senha
  Então o status deve ser 500
  E a resposta não deve expor detalhes internos, senha ou hash
```

Resultado: [NÃO OBSERVADO]. **NEEDS DEV CONFIRMATION:** corpo e mensagem em erro interno.

### TC-B008 — (Borda) [MANUAL] Valores nulos, vazios e campos extras

```gherkin
Esquema do cenário: Avaliar variações não documentadas do payload
  Quando o cliente envia POST para "/api/auth/login" com <payload>
  Então o comportamento deve ser confirmado pelo desenvolvimento antes da execução formal

Exemplos:
  | payload |
  | {"email": null, "senha": "..."} |
  | {"email": "", "senha": "..."} |
  | {"email": "...", "senha": null} |
  | {"email": "...", "senha": ""} |
  | {"email": "...", "senha": "...", "x": 1} |
```

**NEEDS DEV CONFIRMATION:** campos nulos/vazios/extras produzem `400`, `401` ou outro resultado?

### TC-B009 — (Borda) [MANUAL] Formato e limites dos campos

```gherkin
Esquema do cenário: Avaliar limites e formatos do payload
  Quando o cliente envia POST para "/api/auth/login" com <payload>
  Então o resultado deve ser confirmado pelo desenvolvimento antes da execução formal

Exemplos:
  | payload |
  | email com formato inválido |
  | email no tamanho mínimo/máximo |
  | senha no tamanho mínimo/máximo |
  | senha acima do limite |
```

**NEEDS DEV CONFIRMATION:** quais formatos e limites de `email` e `senha` são aceitos?

### TC-B010 — (Segurança/Concorrência) [MANUAL] Resistência a abuso e desempenho

```gherkin
Cenário: Avaliar comportamento operacional sob repetição de tentativas
  Dado que o endpoint recebe tentativas repetidas de login
  Quando múltiplas requisições são enviadas em sequência ou concorrentemente
  Então o comportamento de rate limiting, bloqueio, latência e disponibilidade deve ser confirmado pelo desenvolvimento
```

Resultado: [NÃO OBSERVADO]. **NEEDS DEV CONFIRMATION:** limites de tentativa, rate limiting, latência e throughput.

## Oráculos Bolton/Bach

- Consistência interna: método, rota, payload e resposta são compatíveis; confirmar `usuario.id` versus JWT `sub`.
- Consistência com produto: endpoint público e token deve servir às rotas protegidas.
- Propósito: credenciais válidas autenticam; inválidas falham sem revelar existência da conta; senha não retorna.
- Normas: não exposição de segredo/detalhes internos, minimização de dados, proteção contra força bruta; acessibilidade não se aplica diretamente a API.
- Consistência entre regras: role, claims e status `400`/`401`/`500` devem ser coerentes.

## Riscos não cobertos

Enumeração de contas; força bruta/rate limiting; replay/revogação de JWT; segredo fraco; exposição em logs/headers; divergência `id`/`sub`; falhas de dependência; normalização de e-mail; Unicode/espaços; latência, throughput, concorrência e payloads excessivos.

## Missões exploratórias

1. Explore variações de payload para descobrir regras não documentadas.
2. Explore credenciais admin/aluno e colisões de e-mail para descobrir ambiguidades de identidade.
3. Explore corpo, headers e claims para descobrir exposição de dados.
4. Explore repetição e concorrência para descobrir rate limiting e degradação.
5. Explore falhas de banco/hash/assinatura para avaliar sanitização de erros.

## Perguntas antes de testar

1. Qual o corpo exato de sucesso para admin e aluno?
2. `usuario.id` e JWT `sub` são o mesmo identificador?
3. Quais claims são obrigatórias?
4. Qual validade, revogação e refresh do token?
5. Quais corpos de `400`, `401` e `500`?
6. E-mail inexistente e senha incorreta têm mesma resposta?
7. Como tratar nulos, vazios, espaços, formato e campos extras?
8. Quais limites de tamanho?
9. Há normalização de e-mail?
10. E-mails admin/aluno podem coincidir?
11. Há rate limiting/bloqueio?
12. Como falhas de banco/hash são sanitizadas?
13. Quais metas de latência/throughput?
14. Quais limites de concorrência?

## Rastreabilidade

| Comportamento observado | Cenário |
|---|---|
| Autenticar administrador | TC-B001 |
| Autenticar aluno | TC-B002 |
| Payload e campos obrigatórios | TC-B001, TC-B002, TC-B003 |
| Credenciais inválidas | TC-B004 |
| Não retorno de senha | TC-B005 |
| Token e resposta | TC-B001, TC-B002, TC-B006 |
| Erro interno | TC-B007 |
| Nulos/vazios/extras | TC-B008 — [NÃO OBSERVADO] |
| Limites/formato | TC-B009 — [NÃO OBSERVADO] |
| Segurança operacional/desempenho | TC-B010 — [NÃO OBSERVADO] |

## Cobertura residual

Os comportamentos catalogados possuem cenário correspondente. TC-B008 a TC-B010 aguardam confirmação de desenvolvimento antes de receber resultado esperado definitivo.
