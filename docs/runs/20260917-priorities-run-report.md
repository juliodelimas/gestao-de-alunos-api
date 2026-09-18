# Execução das prioridades RST — 2026-09-17

## Resultado

| Rodada | Resultado | Evidência |
|---|---|---|
| Ampliação inicial | 40 aprovados, 0 falhas, 2 pendentes | [log](20260917-priorities-test-output.txt) |
| Regressões antes da correção | 0 aprovados, 12 falhas | [log](20260917-priorities-regression-before.txt) |
| Suíte completa após correção | **52 aprovados, 0 falhas, 2 pendentes**, aproximadamente 3 s | [log](20260917-priorities-final-test-output.txt) |

Ambiente: Node 24.21.0, Mocha/Chai/SuperTest in-process, MongoDB local `gestao-de-alunos-test`. Comando final: `npm.cmd test` (no PowerShell desta máquina o wrapper npm.ps1 é bloqueado pela ExecutionPolicy; npm.cmd funciona sem alterá-la). Banco de desenvolvimento preservado. Pipeline passa TEST_MONGODB_URI explicitamente. Não executada pipeline remota.

Todos os títulos/resultados individuais estão no log completo. A contagem aumentou também porque variantes antes agrupadas agora são casos separados; não é multiplicação proporcional da cobertura de risco.

## O que mudou

- JWT: assinatura HS256, claims, oito horas, identidade pública e ausência de senha/hash nos dois perfis.
- Autorização: GET/POST/PUT/DELETE administrativo por aluno, isolamento de leitura/escrita, controles positivos, token adulterado/expirado/sem assinatura.
- Integridade: cadastro/matrícula/entrega persistidos, consulta posterior e estado intacto nas rejeições.
- Robustez: falhas de consulta/bcrypt/assinatura, restauração garantida, recuperação após erro, nulos/vazios/extras e tipos.
- Concorrência: 12 requisições misturam perfis e credenciais; resultados e identidades corretos.
- Massa: fixtures próprias, UUIDs, limpeza por escopo após falhas, sem enviar senhaEnv no payload e sem dependência de Ana/Bruno no teste de isolamento.
- Aplicação: valida tipos antes do MongoDB/bcrypt; traduz erros de parsing para 400 e excesso de corpo para 413, sem expor detalhes. As doze regressões foram observadas falhando antes e aprovadas depois.

## Exploração e triagem

Evidência anterior: [JSON](2026-09-18T01-30-59-088Z-exploration.json). Evidência posterior: [JSON](2026-09-18T01-33-14-872Z-exploration.json). Metadados sem credenciais/tokens/corpos de resposta completos.

1. **Defeito de validação confirmado e corrigido:** email com operador de consulta foi interpretado como filtro MongoDB e autenticou quando combinado com a senha correta da conta encontrada. Não houve demonstração de bypass de senha. Campos senha de tipos indevidos também geravam 500. Fonte esperada: LoginInput exige strings. Dimensões: Contrato/Promessa, Limites, Consistência interna. Regressões B012.
2. **Defeito de classificação de erro confirmado e corrigido:** parser já identifica JSON inválido como 400 e excesso de corpo como 413; handler transformava ambos em 500. Mensagens agora sanitizadas, limite do parser preservado. Dimensão: Tratamento de erro. Regressões B013/B014.
3. **Investigação pendente:** antes da correção, mediana de senha incorreta ~70 ms versus e-mail inexistente ~3,4 ms, seis amostras por classe. Compatível com caminhos diferentes de comparação de senha; não demonstra explorabilidade remota ou limiar de segurança aceitável. Correções de tipos/parser não pretendem eliminar esse sinal.
4. **Decisão de produto pendente:** colisão de e-mail privilegia admin; credencial distinta do aluno não autentica. Exploração usa contas próprias, apagadas no final.
5. **Observação operacional:** rajada limitada de 12 tentativas não recebeu 429; token válido foi reutilizado. Não implica bug de replay nem prova ausência de rate limiting em outras camadas/volumes.

## Auditoria e limpeza

[Auditoria anterior à execução](20260917-priorities-pre-audit-report.md): zero CRITICAL/WARNING novos, seis achados estruturais anteriores tratados. Revisão dos testes adicionais B012–B014 incluída antes de executá-los.

[Checagem posterior](20260917-priorities-residue.json): zero alunos/admins/disciplinas com prefixo QA Automation e zero matrículas/notas/trabalhos órfãos. Não foi registrada uma contagem anterior à primeira execução; não se afirma limpeza prévia comprovada. Nenhum registro antigo foi apagado em lote.

## Dois skips remanescentes

- TC-B009: limites/formato/normalização aguardam regra de negócio.
- TC-B010 operacional: abuso, revogação e SLA aguardam contexto/política. A parte funcional de concorrência está aprovada.

Esses assuntos foram investigados pelo script separado, mas não receberam critérios de aceite inventados. Não se registra aceite de produto nem conclusão de EP-001.

## Limites

Sem frontend/Allure configurado, sem varredura de segurança abrangente, sem carga sustentada, sem prova de confidencialidade de logs internos. Injeções em memória não equivalem a desligar MongoDB/rede. Node local difere do Node 20 configurado no CI; pipeline remota não validada nesta rodada.
