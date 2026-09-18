# Gate de Análise — EP-001

## Identificação

- **Fonte:** Endpoint técnico catalogado
- **ID:** EP-001
- **Crosswalk:** SRC-EP-001
- **Método:** `POST`
- **Endpoint:** `/api/auth/login`
- **Escopo:** Backend
- **Origem:** Descoberta técnica (`/qa-descoberta-endpoints`)
- **Execução da API:** Não realizada
- **Fonte principal:** `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md`
- **Contexto:** `docs/knowledge-base.md` e `docs/source-map.md`
- **Padrões:** `docs/test-standards.md` não encontrado

## Comportamento observado

- “Autentica administrador ou aluno e retorna JWT”.
- Payload catalogado: “`{email, senha}`”.
- Resposta principal: “`{token, usuario: {id, nome, email, role}}`”.
- Status identificáveis: “200, 400, 401, 500”.
- Observação: “Admin é consultado antes do aluno.”
- O source-map classifica `SRC-EP-001` como público.
- A base registra que credenciais inválidas retornam `401` e senhas não são retornadas.

Essas informações são observações catalogadas, não resultados de execução.

## Avaliação do gate

| Dimensão | Nota | Classificação | Justificativa |
|---|---:|---|---|
| Coerência do observado | 8/10 | Bom | Método, rota, payload, resposta e finalidade são compatíveis; a relação entre `usuario.id` e JWT `sub` precisa ser confirmada. |
| Completude da observação | 5/10 | Parcial | Não há execução, exemplos de respostas, limites, expiração, rate limiting ou falhas de infraestrutura observadas. |
| Testabilidade | 5/10 | Parcial | Status principais permitem testes objetivos, mas corpo dos erros, claims completas e limites precisam de confirmação. |

## Veredito

**CONDITIONAL**

O endpoint permite iniciar testes funcionais básicos, mas possui lacunas no contrato de erro, segurança, limites e comportamento operacional.

## Findings

- **F-EP001-001 — missing-criteria — High:** os status `200, 400, 401, 500` não têm corpos/mensagens observados. Confirmar contrato de cada erro.
- **F-EP001-002 — ambiguity — Medium:** não está explícita a relação entre `usuario.id` e JWT `sub`. Confirmar payload de identidade.
- **F-EP001-003 — missing-criteria — High:** a precedência admin antes de aluno não define colisão de e-mail. Confirmar unicidade global e identidade prevalente.
- **F-EP001-004 — untestable — High:** “senhas nunca retornadas” não define inspeção de corpo, headers, logs, mensagens e token. Confirmar fronteira de não exposição.
- **F-EP001-005 — missing-criteria — Medium:** não há algoritmo, issuer, audience, validade observada ou regra para token expirado. Confirmar claims e política.
- **F-EP001-006 — dependency-gap — Medium:** o status `500` não define falhas de banco/hash/assinatura nem corpo sanitizado. Confirmar tratamento.
- **F-EP001-007 — missing-criteria — Medium:** não há formato, tamanho, normalização ou tratamento de campos vazios/nulos/extras. Confirmar regras.
- **F-EP001-008 — missing-criteria — High:** não há observação de rate limiting, bloqueio, auditoria, replay, concorrência ou enumeração de contas. Confirmar proteções.

## Limites não observados

Campos nulos/vazios/extras; formato e limites de e-mail/senha; normalização; rate limiting; força bruta; concorrência; latência/throughput; expiração/revogação/refresh/blacklist; algoritmo/issuer/audience; falhas de MongoDB/bcrypt/assinatura; relação entre `usuario.id` e `sub`.

## Requer decisão humana

1. Claims obrigatórias e relação entre `usuario.id` e `sub`.
2. Corpo/mensagem exatos para `400`, `401` e `500`.
3. Unicidade de e-mails entre administrador e aluno.
4. Regras de tamanho, formato e normalização.
5. Rate limiting, bloqueio e proteção contra enumeração.
6. Tratamento público de falhas de banco, hash e assinatura.
7. Expiração, revogação, refresh e reutilização do token.
8. Limites de latência e throughput.
