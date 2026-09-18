# Relatório de Cobertura — EP-001

Atualizado em 2026-09-17 após implementação das prioridades RST. Esta matriz substitui os totais inconsistentes anteriores (8 cobertos no resumo, seis na matriz). Fonte: assertions atuais, [design complementar](../analysis/EP-001/priority-test-design.md) e [execução](../runs/20260917-priorities-run-report.md).

Coberto significa que o requisito delimitado tem verificações executadas. Parcial/observado não entra no numerador. Percentual de requisitos não é percentual de risco eliminado nem cobertura de código. Nenhum resultado encerra automaticamente o aceite do produto.

| Categoria | Requisitos | Cobertos | Parcial | Observado/decisão pendente | Cobertura |
|---|---:|---:|---:|---:|---:|
| Happy Path | 3 | 3 | 0 | 0 | 100% |
| Edge Cases | 4 | 1 | 1 | 2 | 25% |
| Error Handling | 5 | 4 | 1 | 0 | 80% |
| Security | 4 | 1 | 2 | 1 | 25% |
| Performance | 2 | 1 | 0 | 1 | 50% |
| UX Variations para API | 3 | 0 | 3 | 0 | 0% |
| **Total** | **21** | **10** | **7** | **4** | **47,6%** |

A categoria UX em 0% significa que nenhum dos três requisitos amplos está totalmente coberto pelo critério acima, não ausência de assertions de contrato. Consistência cruzada é exercitada diretamente pela jornada, persistência e comparação corpo/JWT; não se deduz ausência dessa dimensão apenas do arredondamento categorial.

| ID | Requisito | Evidência | Situação |
|---|---|---|---|
| R-HP-01 | Admin autentica e recebe JWT | B001, verify HS256 e claims | Coberto |
| R-HP-02 | Aluno autentica e recebe JWT | B002, verify HS256 e claims | Coberto |
| R-HP-03 | Sucesso retorna token/usuário com 200 | B001/B002/B006 | Coberto |
| R-ED-01 | Nulos/vazios rejeitados; extras não alteram identidade | B008: quatro bordas e injeção de role/sub | Coberto |
| R-ED-02 | Formato e limites | B012 valida tipos; sondagens de tamanhos; limites de negócio ausentes | Parcial |
| R-ED-03 | Espaços/Unicode/normalização | Exploração registrou variantes; equivalência ainda não aceita | Observado/decisão pendente |
| R-ED-04 | Colisão de e-mail entre perfis | Exploração com contas próprias e senhas distintas | Observado/decisão pendente |
| R-EH-01 | Ausência retorna 400 | B003, casos separados | Coberto |
| R-EH-02 | Credenciais inválidas retornam 401 | B004 admin/aluno/inexistente | Coberto |
| R-EH-03 | Falha interna sanitizada | B007 consulta admin/aluno, bcrypt, assinatura e recuperação | Coberto |
| R-EH-04 | Contrato de erro 400/401/500 | Corpo exato e content type em B003/B004/B007/B008/B012 | Coberto |
| R-EH-05 | Parser e media type | B013/B014: 400/413; outros media types só explorados | Parcial |
| R-SE-01 | Sem senha/hash em corpo/token | B005 ambos os perfis, hashes reais, claims decodificadas e headers | Coberto |
| R-SE-02 | Claims e política JWT | Identidade, assinatura, oito horas e rejeição de adulterado/expirado; política ampliada pendente | Parcial |
| R-SE-03 | Sem enumeração | B011 corpo/headers; diferença temporal observada, investigação pendente | Parcial |
| R-SE-04 | Abuso/bloqueio/replay | Rajada de 12 e reutilização observadas; política ausente | Observado/decisão pendente |
| R-PE-01 | Metas de latência/throughput | Baseline local sem SLA; não é teste de capacidade | Observado/decisão pendente |
| R-PE-02 | Concorrência preserva identidade e resultados | B010: 12 requisições misturadas, quatro por classe; escopo funcional limitado | Coberto |
| R-UX-01 | Tipos/content type/headers | Sucesso/erros inspecionados; política completa de headers pendente | Parcial |
| R-UX-02 | Payloads variados consistentes | B008/B012/B013; formatos/normalização sem política | Parcial |
| R-UX-03 | Extras/ordem não quebram contrato | Extras cobertos; equivalência entre ordens não tem caso dedicado | Parcial |

## Dimensões RST

Contrato, consistência interna e tratamento de erro: verificações específicas de resposta, JWT e falhas. Integridade e consistência cruzada: persistência, leitura posterior e rejeição sem alteração. Limites: obrigatoriedade, tipos e limite já existente do parser. Determinismo: concorrência funcional. Autorização: ambos os perfis, quatro verbos administrativos, isolamento de leitura/escrita e tokens inválidos. Todas têm investigação implementada, com limites residuais acima.

## Fora de escopo

Frontend, acessibilidade visual, e-mail/SMS e logs internos como contrato público. Ausência de vazamento em logs internos não foi demonstrada. Testes in-process não avaliam proxy, TLS, infraestrutura de produção nem capacidade sob carga sustentada. Os resultados de 52 testes incluem jornada e autorização além deste endpoint; não são 52 requisitos EP-001.
