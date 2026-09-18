# Relatório de Auditoria — 2026-09-17

## Sumário

| Severidade | Quantidade |
|---|---:|
| Critical | 3 |
| Warning | 6 |
| Gap | 2 |

**Escopo:** `test/ep-001-login.sketch.test.js`, `test/auth.test.js`, `test/aluno-workflow.test.js`, `test/security.test.js`.

Todos os testes ativos possuem assertions reais. Não foram executados testes ou mutation testing durante a auditoria.

## Achados críticos

### Credenciais hardcoded em testes de autenticação

- **Arquivos:** `test/ep-001-login.sketch.test.js`, `test/auth.test.js`, `test/security.test.js`.
- **Regra:** credenciais literais no código de teste.
- **Trechos:** valores de senha de fixture literais nos testes (redigidos após a auditoria).
- **Impacto:** acoplamento a dados seed e exposição de credenciais de fixture no repositório.
- **Contexto:** não há evidência de segredo produtivo; são credenciais de teste.

## Warnings

### TC-B007 a TC-B010 permanecem como skips

Os cenários de falha interna, bordas de payload, limites/Unicode e abuso/desempenho continuam manuais/bloqueados, conforme o acordo de cobertura.

### Assertions genéricas de token

`test/auth.test.js` e `test/aluno-workflow.test.js` verificam apenas a existência da propriedade `token` em alguns pontos. O EP-001 implementado possui assertions mais específicas, mas os testes antigos podem aceitar token vazio ou de tipo incorreto.

## Gaps de cobertura

### Edge Cases

Cobertura 0% no relatório de cobertura: TC-B008 e TC-B009 permanecem em skip. Nulos, vazios, extras, formatos, limites, espaços e Unicode não são interrogados.

### Performance

Cobertura 0%: TC-B010 permanece em skip. Latência, throughput, concorrência e determinismo não são investigados.

## Limitação da auditoria RST

O projeto não possui `CLAUDE.md` nem tabela formal de dimensões RST; os gaps foram registrados pelas categorias do relatório de cobertura, sem inventar uma taxonomia adicional.

## Sem achados adicionais

Não foram encontrados `waitForTimeout`, `time.sleep`, XPath, TODO/FIXME/Implementar remanescente ou ações assíncronas de Playwright sem `await`. Mutation testing ficou fora de escopo.

## Remediação posterior

Após esta auditoria, as credenciais de fixture foram removidas dos arquivos de teste e da massa JSON. Os testes agora leem variáveis `TEST_*` via Dotenv; uma busca mecânica posterior não encontrou os valores literais em `test/`. A reauditoria formal desta alteração ainda está pendente.
