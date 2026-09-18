# Gaps de Cobertura — EP-001

Atualizado após prioridades em 2026-09-17. Evidência: [execução](../runs/20260917-priorities-run-report.md), [matriz](EP-001-coverage-report.md) e [política pendente](EP-001-operational-policy.md). IDs preservados. Cobertura técnica não representa aceite formal de produto.

| ID | Estado atual | Evidência e pendência residual |
|---|---|---|
| G-EP001-001 | Coberto no escopo definido | B008: nulos/vazios, extras de identidade; B012 amplia tipos |
| G-EP001-002 | Parcial | Tipos rejeitados; tamanhos 1/256/4096 explorados. Falta limite/formato de negócio e suas fronteiras |
| G-EP001-003 | Explorado, política pendente | Espaços, maiúsculas e Unicode registrados. Definir equivalência/canonicalização |
| G-EP001-004 | Explorado, política pendente | E-mail coincidente: admin autentica, senha distinta do aluno recebe 401. Definir unicidade/precedência |
| G-EP001-005 | Coberto no contrato atual | 400/401/500 têm corpo exato, JSON e ausência de token/identidade |
| G-EP001-006 | Parcial | B013/B014 verificam 400/413 sanitizados; sem content type/text/plain explorados, ainda sem política completa |
| G-EP001-007 | Coberto nos pontos injetados | Quatro falhas B007 sanitizadas e recuperação. Não simula indisponibilidade real de rede/MongoDB |
| G-EP001-008 | Parcial | HS256, assinatura, sub/role/nome, 8h e tokens adulterados/expirados/sem assinatura. Decidir issuer/audience/revogação conforme contexto |
| G-EP001-009 | Parcial, sinal temporal encontrado | B011 iguala corpo/headers; baseline mostra diferença de tempo. Requer investigação temporal controlada |
| G-EP001-010 | Explorado, política pendente | 12 tentativas simultâneas tiveram 401, token reutilizado duas vezes com 200. Não demonstra ausência de proteção em outros volumes/camadas |
| G-EP001-011 | Medido, SLA pendente | Seis amostras por classe, mediana/p95 e throughput de rajada. Amostra pequena, ambiente local |
| G-EP001-012 | Coberto no escopo funcional limitado | 12 requisições concorrentes com perfis/credenciais misturados; todas mantiveram identidade e resultado esperado. Não é capacidade sob carga |
| G-EP001-013 | Parcial | Tipos/estrutura pública, erros e headers estáveis. Faltam política completa de headers e caso dedicado de reordenação |

## Pendências executáveis

- TC-B009: aceite de formatos, tamanhos e normalização continua skip até existir regra de negócio.
- TC-B010: apenas a parte de aceite operacional continua skip; concorrência funcional foi implementada e executada.
- `npm run test:explore` investiga as áreas acima e gera evidência sem inventar aprovação.

Não há 13 riscos completamente intocados nem apenas dois riscos porque sobraram dois skips. O estado de cada requisito está na matriz. As decisões necessárias estão concentradas na política operacional.
