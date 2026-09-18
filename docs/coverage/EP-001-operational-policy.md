# EP-001 — contrato observado e decisões operacionais pendentes

Implementação autorizada em 2026-09-17 pelo pedido "aplique todas as prioridades".

## Aceite registrado

Em 2026-09-17 22:41 (America/Sao_Paulo), o usuário declarou "aceito todas elas" nesta conversa. Aceitas as alterações implementadas e as sugestões de continuidade apresentadas. O [acordo de escopo](../analysis/EP-001/test-agreement.md) registra esse aceite.

Os parâmetros e comportamentos da tabela abaixo ainda não haviam sido definidos ou propostos concretamente. Continuam a definir; não foram preenchidos por inferência a partir desse aceite. Os dois skips permanecem até haver critérios verificáveis.

## Oráculos usados agora

- JWT HS256, oito horas, identidade `sub/role/nome` coerente com usuário público: configuração/código atual e design EP-001. São regressões do contrato técnico atual, não nova política de produto.
- Campos obrigatórios nulos/vazios: 400 e mensagem de obrigatoriedade. Tipos diferentes de string recebem 400, conforme schema LoginInput; operadores MongoDB não são aceitos como e-mail.
- JSON malformado: 400 sanitizado. Corpo excedendo o limite existente do parser (100 KiB): 413 sanitizado.
- Campos extras de identidade não podem elevar privilégio; credenciais determinam usuário e perfil.
- Falha interna de dependência: 500 com `{error: "Erro interno do servidor."}`, conforme handler e TC-B007.
- Aluno não opera rotas administrativas nem escreve em nome de outro aluno; rejeições não modificam dados.
- Concorrência preserva identidade e resultado de credenciais. Tempo de emissão pode variar, logo não se exige igualdade de tokens.

## Proposta concreta para decisão — próxima implementação

Status: proposta apresentada após o pedido "ok pode seguir". O aceite anterior se refere às alterações já apresentadas; os parâmetros abaixo são novos. Contexto assumido: API didática, executada localmente, sem promessa de SLA de produção.

| Tema | Regra proposta |
|---|---|
| E-mail | Remover espaços externos e converter para minúsculas no cadastro, atualização e login. Aceitar até 254 caracteres ASCII após normalização, com parte local de até 64, um único @ e domínio com rótulos válidos separados por ponto. Rejeitar espaços internos, controles, endereços entre aspas e Unicode nesta versão com 400. Não remover pontos nem sufixos +tag. São escolhas de produto para um subconjunto simples, não suporte a todos os e-mails válidos |
| Senha no login | Aceitar string não vazia até 72 bytes UTF-8, preservando caixa, espaços e Unicode. Rejeitar excesso com 400, sem truncar. Não impor novo mínimo de criação no login; contas seed atuais continuam acessíveis |
| Criação/alteração de senha | Tratar fortalecimento de senha como mudança separada de cadastro. Esta proposta de login não redefine mínimo de cadastro nem declara senhas seed adequadas para produção |
| Colisão entre perfis | E-mail canônico único entre admin e aluno. Cadastro/atualização conflitante retorna 409. Se dados legados tiverem colisão, login retorna 401 genérico até correção dos dados; não selecionar perfil silenciosamente. Conferir dados existentes antes de normalizar; nenhuma exclusão/fusão automática. Garantia sob concorrência exige reserva única compartilhada ou desenho equivalente, não apenas duas consultas |
| Content type | Login aceita application/json, inclusive charset. Ausência ou outro media type retorna 415 com erro sanitizado; JSON inválido continua 400 e limite de corpo permanece 100 KiB/413 |
| Tentativas | Permitir até cinco falhas por e-mail canônico em janela fixa de 15 minutos. A quinta falha ainda retorna 401; da sexta tentativa em diante, 429 até expirar a janela, mesmo com senha correta. Sucesso antes do bloqueio zera o contador. Aplicar também a e-mails inexistentes, sem revelar existência |
| Limite por IP | Permitir até 30 requisições de login por IP em janela fixa de um minuto; da 31ª em diante, 429. Aplicar antes do trabalho caro de autenticação. Retornar Retry-After com segundos restantes. Contadores com atualização atômica; testes com relógio controlado, sem esperar 15 minutos. Não confiar em X-Forwarded-For sem proxy explicitamente configurado |
| Tradeoff do bloqueio | O bloqueio por e-mail reduz tentativas distribuídas, mas permite indisponibilidade temporária provocada contra uma conta conhecida. Aceitar esse tradeoff apenas no contexto didático; reavaliar com uso real |
| JWT | Manter HS256 e oito horas nesta etapa, adicionando issuer gestao-de-alunos-api e audience gestao-de-alunos-client, conferidos na emissão e no consumo. Token pode ser reutilizado até expirar; expirado/adulterado/sem assinatura/issuer ou audience incorretos retorna 401. Sem refresh/logout/revogação imediata nesta etapa. Tokens antigos sem as novas claims exigirão novo login |
| Enumeração | Mesmo corpo/status para senha errada, e-mail inexistente ou colisão. Executar comparação bcrypt contra hash fictício pré-calculado de mesmo custo quando não houver conta, sem geração de hash por requisição. Verificar execução desse caminho e medir tempos; não exigir igualdade exata nem declarar ausência de canal temporal apenas por testes locais |
| Desempenho local | Meta inicial proposta, não resultado já comprovado: aquecer com 20 logins e medir 100 logins válidos, concorrência 5; p95 até 1 segundo, throughput pelo menos 5 requisições/s e zero 5xx. Registrar máquina, Node e MongoDB. Nesse ensaio isolar os limitadores e validá-los em cenários separados; não confundir 429 esperado com defeito de capacidade. Não usar essa meta como gate obrigatório em CI compartilhado antes de calibrar |

Os números de tentativas e desempenho são propostas de engenharia para este exercício, não limites prescritos pela OWASP. O limite de senha em bytes reflete o bcrypt atual e restringe a quantidade possível de caracteres multibyte; migrar o algoritmo seria uma mudança distinta.

Referências consultadas: [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) (respostas genéricas, timing e throttling) e [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) (limite de entrada do bcrypt).

Após a decisão, os casos B009/B010 devem ser desdobrados em testes específicos de fronteira, relógio, respostas 429/415 e medição local. O desempenho não pode ser marcado aprovado antes de medir no ambiente definido.

## Decisões que não foram inventadas

| Tema | O que falta para um teste de aceite |
|---|---|
| Formato/tamanho | Tamanhos mínimo/máximo de negócio; diferenciar cadastro de senha de login. Tipos inválidos já definidos como 400 |
| Normalização | Equivalência de e-mail com espaços/caixa/Unicode; senha não é normalizada por suposição |
| Colisão admin/aluno | Unicidade global ou precedência explicitamente aceita |
| Parser e media type | Política completa para media type incompatível; JSON inválido e corpo excessivo já tratados como 400/413 |
| Abuso | Janela, número de tentativas, chave de limitação (conta/IP), resposta e recuperação |
| Tokens | Necessidade de issuer/audience, revogação e reutilização; bearer reutilizável não é defeito por si só |
| Desempenho | Ambiente/carga alvo e metas de p95, throughput e taxa de erro |
| Enumeração temporal | Ameaça relevante, método/amostragem e tolerância aceitável; seis amostras locais não decidem segurança |

`npm run test:explore` executa sondagens limitadas dessas áreas e produz JSON sem credenciais/tokens/corpos crus. Registra observações, sem transformar resultados atuais em critérios de aprovação. A suíte mantém dois skips explícitos para aceite de formatos/normalização e política operacional. Não é necessário aguardar essas decisões para executar os demais testes.
