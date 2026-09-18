# Auditoria anterior à execução — prioridades RST

Escopo exato: `test/auth.test.js`, `test/aluno-workflow.test.js`, `test/ep-001-login.sketch.test.js`, `test/security.test.js`; auxiliares `assertions.js`, `fixtures.js`, configuração e setup. Leitura e varredura de padrões realizadas antes da execução completa. O script de exploração é separado e não entra na contagem de testes.

- Assertions de JWT agora verificam assinatura, claims, tipos, validade e identidade. B005 cobre os dois perfis, o hash efetivo e o token decodificado; valores sensíveis não são argumentos de assertions de conteúdo.
- Negativos de autorização incluem controles positivos e verificação de estado intacto. Jornada verifica persistência e consulta posterior.
- Falhas de dependência são restauradas em finally e seguidas de login de recuperação. Não executar esses casos com Mocha paralelo.
- Limpeza registra propriedade antes das requisições, usa todas as linhas da massa e agrega erros. Contas seed não são apagadas.
- Dois skips são decisões de política pendentes; não são implementação aprovada. As demais variantes têm assertions específicas, sem esperas artificiais nem testes vazios ativos.
- As categorias antigas de cobertura não são reutilizadas como percentuais atuais; a matriz será reconciliada com resultados da execução.

Achados formais anteriores AUD-001 a AUD-004 corrigidos na estrutura. AUD-005/AUD-006 agora possuem investigação implementada (bordas básicas e concorrência), com cobertura residual explicitada na política. Zero CRITICAL e zero WARNING novos nesta leitura. Isso não é veredito de execução nem fechamento de todos os gaps de produto.

Revisão adicional antes das regressões TC-B012–B014: dez variações de tipo e dois erros de parser, com status e corpo exatos sem token; fonte LoginInput e classificação do parser. Sem credenciais literais, esperas ou assertions genéricas. Esses testes serão executados primeiro contra a aplicação anterior para documentar falhas reais, depois contra a correção.
