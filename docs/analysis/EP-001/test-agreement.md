# Acordo de Escopo de Teste — EP-001

## Identificação

- **Endpoint:** `POST /api/auth/login`
- **Escopo:** Backend/API
- **Data:** 2026-09-17
- **Fonte:** `docs/coverage/EP-001-coverage-report.md`
- **Casos existentes:** TC-B001 a TC-B014, cenários de autorização TC-S001 a TC-S007 e jornada TC-W001; detalhamento em `priority-test-design.md`.
- **Execução:** 52 aprovados, zero falhas e dois pendentes de definição de política; [relatório](../../runs/20260917-priorities-run-report.md).

## O que a automação vai cobrir

- Login de administrador: TC-B001 / R-HP-01.
- Login de aluno: TC-B002 / R-HP-02.
- Contrato principal de sucesso: TC-B006 / R-HP-03.
- Campos obrigatórios com `400`: TC-B003 / R-EH-01.
- Credenciais inválidas com `401`: TC-B004 / R-EH-02.
- Não exposição de senha/hash: TC-B005 / R-SE-01.
- Corpos e mensagens de erro: G-EP001-005.
- JSON malformado e content type: G-EP001-006.
- Sanitização de falhas de dependência: G-EP001-007.
- Claims e política JWT: G-EP001-008.
- Proteção contra enumeração: G-EP001-009.
- Rate limiting, bloqueio, replay e reutilização: G-EP001-010.
- Valores nulos, vazios e extras: G-EP001-001.
- Formato e limites de e-mail/senha: G-EP001-002.
- Espaços, Unicode e normalização: G-EP001-003.
- Colisão de e-mail entre perfis: G-EP001-004.
- Latência e throughput: G-EP001-011.
- Concorrência e determinismo: G-EP001-012.
- Headers, tipos e consistência: G-EP001-013.

## Nível de verificação

Todos os casos estão direcionados para **Contrato/API**, pois observam request, response, token, headers, latência, concorrência ou comportamento de segurança HTTP. Não há frontend identificado e nenhum caso é apenas uma regra pura isolada para unidade do dev.

| Caso | Nível | Critério |
|---|---|---|
| G-EP001-001 a G-EP001-013 | Contrato/API | Cada caso precisa observar o comportamento público do endpoint. |

## Fora de escopo, não é gap

- E2E de frontend: não há telas, componentes, templates ou seletores.
- Acessibilidade visual e responsividade: não se aplicam ao backend.
- Entrega de e-mail/SMS: não há provedor externo associado ao login.
- Logs internos como contrato HTTP: permanece em escopo a não exposição de segredos em respostas, tokens e mensagens HTTP.

## O que conta como pronto para QA

- TC-B001 a TC-B006 aprovados.
- TC-B007 com erro sanitizado e sem dados sensíveis.
- TC-B008 a TC-B010 com oráculos definidos.
- G-EP001-001 a G-EP001-013 aprovados ou com decisão explícita registrada.
- Status 200, 400, 401 e 500 com corpo/mensagem definidos.
- Relação `usuario.id`/JWT `sub`, claims, algoritmo, issuer, audience e validade confirmados.
- Política de colisão de e-mail, limites, normalização, abuso e concorrência definida.
- Nenhuma exposição de senha, hash, segredo, stack trace ou detalhe interno.

## Aceite

- Quem concordou: usuário responsável pelo projeto, nesta conversa.
- Quando: 2026-09-17 22:41 (America/Sao_Paulo).
- Evidência: "aceito todas elas", em resposta à explicação das alterações aplicadas e sugestões.
- Escopo: alterações implementadas, escopo de testes e sugestões de continuidade apresentados na auditoria e no relatório das prioridades.
- Definições ainda necessárias: valores e comportamentos que não haviam sido propostos concretamente (limites, normalização, colisão entre perfis, abuso, revogação e SLA) permanecem a definir na [política operacional](../../coverage/EP-001-operational-policy.md). O aceite não preenche esses valores nem comprova os critérios de pronto ainda pendentes.
