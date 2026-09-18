# Auditoria anterior à execução das políticas aprovadas

Escopo: auth.test.js, aluno-workflow.test.js, ep-001-login.sketch.test.js, security.test.js e policies.test.js; auxiliares de massa/assertions/setup. Aprovação: usuário respondeu "sim" à proposta concreta do documento operacional.

Revisão estrutural: assertions de corpo/status/JWT e estado; relógio injetado para 15 minutos/um minuto; requisições concorrentes para reservas e limites; limite em bytes e variantes Unicode; hash fictício instrumentado e restaurado em finally. Senhas artificiais de fronteira são massa intencional, não credenciais reais literais. Zero esperas fixas e zero skips ativos. Reset dos contadores entre casos preserva independência; dentro de cada caso os contadores reais permanecem ativos.

Medição de desempenho será executada separadamente com limitadores isolados por construção do app. Não conta como aprovação até produzir medidas. Reserva MongoDB usa chave única compartilhada entre perfis; limites de login em memória são atômicos em uma instância Node, não distribuídos. Sem nova dependência instalada.

Checagem de dados legados em modo somente leitura registrada em `20260917-policy-legacy-audit.json`; nenhum registro foi mesclado, apagado ou normalizado em lote.

Critérios: B009 — normalização/formato/bytes; B010 — 5 falhas/15 min, 30 chamadas/IP/min e concorrência; B015 — 415/charset; B016 — unicidade e colisão legada; B017 — hash fictício; B018 — issuer/audience/reuso/expiração. Fonte: política aprovada. Os cenários prévios continuam como regressão. Sem achados críticos estruturais nesta revisão; execução necessária para concluir.
