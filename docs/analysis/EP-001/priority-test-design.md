# EP-001 — complemento de cenários e design autorizado

Fonte: auditoria RST de 2026-09-17 e pedido "aplique todas as prioridades". Stack preservada: Mocha/Chai/SuperTest. Este complemento detalha cenários antes agrupados; não define nova política de produto.

| Cenário | Dado / Quando | Então / evidência |
|---|---|---|
| TC-B001/B002/B006 | Admin/aluno válido faz login | Corpo público, JWT verificável HS256, validade 8h e identidade coerente; token admin funciona na rota protegida |
| TC-B003/B004 | Campos ausentes ou credenciais inválidas, incluindo aluno | Status/mensagem e corpo exato sem identidade/token; cada variante é um caso |
| TC-B005 | Login dos dois perfis e hashes reais das respectivas fixtures | Corpo, headers e payload JWT não contêm senha/hash; claims/campos públicos restritos |
| TC-B007 | Falha controlada de consulta admin/aluno, bcrypt ou assinatura | 500 sanitizado; restauração em finally; login posterior funciona |
| TC-B008 | Nulos/vazios ou campos extras de identidade | Obrigatoriedade 400; extras não elevam perfil nem alteram identidade |
| TC-B009 | Formatos, tamanhos, normalização | Exploração separada; aceite depende da política documentada |
| TC-B010 | 12 requisições concorrentes misturam perfis e credenciais | Cada resposta corresponde à identidade/validade da entrada; SLA/abuso continuam separados |
| TC-B011 | Erro de senha admin/aluno versus e-mail inexistente | Corpo e headers estáveis equivalentes; tempo registrado na exploração |
| TC-B012 | Campos email/senha recebem tipos diferentes de string, inclusive operador MongoDB | 400 sem token/identidade; schema LoginInput já exige strings |
| TC-B013/B014 | JSON malformado ou corpo excedendo limite já existente do parser | Erro de cliente sanitizado 400/413, preservando a classificação do parser |
| TC-S001/S002 | Sem token ou aluno autenticado em GET/POST/PUT/DELETE administrativo | 401/403 e dados intactos |
| TC-S003/S004 | Aluno lê/escreve em nome de outro | 403; escrita rejeitada não persiste |
| TC-S005 | Aluno sem matrícula entrega | 409, sem trabalho persistido |
| TC-S006 | Próprio aluno/admin consultam dados permitidos | Sucesso e conteúdo esperado; controle contra negação indiscriminada |
| TC-S007 | Token adulterado, expirado ou sem assinatura | 401 com contrato de erro |
| TC-W001 | Cadastro, matrícula, login e entrega | Dados persistidos e entrega recuperada pela API |

## Massa e isolamento

- `test/setup.cjs` é carregado antes do app; banco padrão local `gestao-de-alunos-test`, substituível por `TEST_MONGODB_URI` com sufixo `-test`. Não usa o banco de desenvolvimento do `.env`.
- Contas seed de login continuam pré-existentes; nunca removidas. FixtureScope cria alunos/disciplinas e, só para exploração, admin com colisão controlada.
- UUID/e-mail são reservados antes de criar. Cleanup por escopo apaga somente registros próprios e filhos; tenta exclusões independentemente e propaga falhas.
- Helpers/client já existentes são reutilizados; assertions e fixtures foram separadas para reuso. `senhaEnv` não é enviado à API.
- Injeções de falha são temporárias em memória, com restauração em finally. Suíte sequencial, sem execução paralela de arquivos que compartilhem esses objetos.

## Medições exploratórias

Variações de tipos/tamanhos/normalização, parser/media type, colisão, seis amostras por classe de login, rajada limitada de 12 tentativas e reutilização de token. Somente metadados e tempos são persistidos. Não é teste de carga de capacidade nem prova de resistência a força bruta.
