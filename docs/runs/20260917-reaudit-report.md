# Relatório de Reauditoria — EP-001

**Data:** 2026-09-17  
**Escopo:** `test/ep-001-login.sketch.test.js`, `test/auth.test.js`, `test/aluno-workflow.test.js`, `test/security.test.js`, `test/config.js`  
**Execução:** não realizada  
**Mutation testing:** não realizado

## Sumário

| Severidade | Quantidade |
|---|---:|
| Critical | 0 |
| Warning | 6 |
| Gap | 2 |

## Credenciais hardcoded

**Status: corrigido.** Não foram encontrados valores literais de credenciais nos testes. As credenciais agora são carregadas por `TEST_*` em `test/config.js`, e a massa JSON usa referências `senhaEnv`.

## Warnings

- **W-01:** assertions genéricas de token permanecem em `test/auth.test.js` e `test/aluno-workflow.test.js`.
- **W-02:** TC-B005 não decodifica o JWT para confirmar ausência de hash/claims sensíveis.
- **W-03:** TC-B007 continua skip por falta de mecanismo de simulação de falha interna.
- **W-04:** TC-B008 continua skip por falta de regra para nulos, vazios e extras.
- **W-05:** TC-B009 continua skip por falta de regras de formato, limites e normalização.
- **W-06:** TC-B010 continua skip por falta de política/métricas de abuso, desempenho e concorrência.

## Gaps

- **G-01 — Edge Cases:** TC-B008 e TC-B009 não executados; cobertura 0%.
- **G-02 — Performance/operação:** TC-B010 não executado; latência, throughput, concorrência, rate limiting e replay permanecem sem verificação.

## Divergências de cobertura

- TC-B005 não verifica hash/claims decodificadas do JWT.
- TC-B006 não verifica `sub`, `role` e `nome` dentro do JWT.
- R-SE-02 e R-SE-03 continuam sem cobertura completa.
- Testes legados usam assertions de token menos rigorosas.

## Comparação

| Indicador | Auditoria anterior | Reauditoria | Situação |
|---|---:|---:|---|
| Critical | 3 | 0 | Resolvido |
| Warning | 6 | 6 | Mantido |
| Gap | 2 | 2 | Mantido |

Não foram inventadas dimensões RST: não há `CLAUDE.md` nem tabela formal disponível no projeto.
