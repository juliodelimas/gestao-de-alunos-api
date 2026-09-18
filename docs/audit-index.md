# Índice de Auditoria de Testes

## EP-001 — 2026-09-17

- **Relatório:** [20260917-ep001-audit-report.md](runs/20260917-ep001-audit-report.md)
- **Escopo:** `test/ep-001-login.sketch.test.js`, `test/auth.test.js`, `test/aluno-workflow.test.js`, `test/security.test.js`
- **Critical:** 3 achados contextuais de credenciais seed hardcoded.
- **Warning:** 6, incluindo quatro cenários manuais/skipped e assertions genéricas em testes antigos.
- **Gap:** 2 categorias com cobertura 0%: Edge Cases e Performance.
- **Mutation testing:** não executado.

## Remediação posterior

- O achado crítico de credenciais hardcoded foi corrigido em 2026-09-17.
- Testes e massa Data-Driven agora usam variáveis `TEST_*` carregadas pelo Dotenv.
- Verificação mecânica posterior: nenhuma credencial literal encontrada em `test/`.
- Suíte após a correção: `12 passing`, `4 pending`.
- Reauditoria formal ainda não executada.

## Reauditoria — 2026-09-17

- **Relatório:** [20260917-reaudit-report.md](runs/20260917-reaudit-report.md)
- **Critical:** 0.
- **Warning:** 6.
- **Gap:** 2.
- **Resultado:** o achado de credenciais hardcoded foi confirmado como resolvido; os quatro skips e gaps de Edge Cases/Performance permanecem.
