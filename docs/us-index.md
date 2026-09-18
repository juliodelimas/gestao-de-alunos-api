# Índice de Análises

## Índice

| ID | Título | Escopo | Estágio | Gate | Artefatos |
|---|---|---|---|---|---|
| EP-001 | Login de administrador ou aluno | Backend | 🟡 Em execução | CONDITIONAL | [gate](analysis/EP-001/gate.md), [cenários](analysis/EP-001/test-scenarios.md), [design](analysis/EP-001/test-design.md) |

## Detalhamento

### EP-001 — Login de administrador ou aluno

- **Escopo:** Backend
- **Método:** `POST`
- **Endpoint:** `/api/auth/login`
- **Descrição catalogada:** Autentica administrador ou aluno e retorna JWT.
- **Origem:** Descoberta técnica (`/qa-descoberta-endpoints`)
- **Fonte observada:** `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md`
- **Crosswalk:** `SRC-EP-001`, conforme `docs/source-map.md`
- **Payload:** `{email, senha}`
- **Resposta:** `{token, usuario: {id, nome, email, role}}`
- **Status identificáveis:** `200`, `400`, `401`, `500`
- **Status do backlog:** 🔲 Pendente
- **Resultado do gate:** CONDITIONAL
- **Testes executados:** Sim; suíte ampliada com 52 aprovados e 2 pendentes. [Resultado](runs/20260917-priorities-run-report.md).
- **Limitações:** Aceite de limites/formato/normalização, colisão de perfis, rate limiting, revogação e SLA pendentes; exploração registrada. Sem conclusão automática do endpoint.
- **Análise:** [docs/analysis/EP-001/gate.md](analysis/EP-001/gate.md)
- **Cenários:** [docs/analysis/EP-001/test-scenarios.md](analysis/EP-001/test-scenarios.md)
- **Testes vinculados:** `test/ep-001-login.sketch.test.js`, `test/auth.test.js`, `test/security.test.js`, `test/aluno-workflow.test.js`. Design: `docs/analysis/EP-001/priority-test-design.md`.
- **Massa de teste:** `docs/coverage/EP-001-test-data.md`
- **Status do design:** Cenários originais desdobrados; B007/B008 e concorrência B010 implementados, B011–B014 e S/W adicionados; dois skips de aceite permanecem.

## Rastreabilidade

| Item | Relação |
|---|---|
| EP-001 | `SRC-EP-001` no source-map |
| EP-001 | `api:login` na base de conhecimento |
| EP-001 | `funcionalidade:login-usuario` na base de conhecimento |
| EP-001 | `jornada:login-com-credenciais` na base de conhecimento |
| EP-001 | `TC-B001` a `TC-B010` nos cenários |

## Relações propostas, aguardando confirmação

- EP-001 pode ser relacionado à `funcionalidade:validar-token`, pois produz o JWT usado pelas rotas protegidas.
- EP-001 pode ser relacionado às rotas administrativas e de autoatendimento que consomem o JWT.

## Observação

Esta entrada não representa uma User Story formal. O estágio permanece `🟡 Em execução` e o gate `CONDITIONAL`; houve execução, mas as políticas residuais não foram aprovadas.
