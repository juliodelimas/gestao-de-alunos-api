# Resumo de demonstração — qualidade da API

## Objetivo

Demonstrar como uma análise orientada a riscos pode transformar testes básicos de uma API em uma suíte que verifica segurança, contrato, isolamento de dados e comportamento sob condições adversas.

O foco inicial foi o endpoint `POST /api/auth/login` (EP-001), sem perder as relações dele com cadastro de alunos, autorização e entrega de trabalhos.

## O que foi demonstrado

### Análise de risco e desenho de testes

- Foi feita uma leitura crítica do produto usando a mentalidade de Michael Bolton e as oito dimensões de risco do RST.
- Foram mapeados comportamentos conhecidos, lacunas de informação, riscos de segurança e perguntas que exigem decisão de produto.
- A análise produziu cenários, critérios de aceite técnico, massa de testes, rastreabilidade e evidências de execução.

### Segurança e autenticação

- Login de administrador e aluno com contrato público verificável.
- JWT com algoritmo HS256, emissor, audiência, identidade coerente e validade de oito horas.
- Rejeição de token adulterado, expirado, sem assinatura ou com claims incompatíveis.
- Respostas de autenticação que não expõem senha, hash ou detalhes internos.
- Tratamento sanitizado para falhas de banco, bcrypt e assinatura de token.
- Rejeição de JSON malformado, corpo excessivo, tipos indevidos, campos obrigatórios ausentes e mídia inadequada.

### Proteção de identidade e abuso

- Normalização e validação de e-mail.
- Limites de senha em bytes para impedir truncamento pelo bcrypt.
- Unicidade de e-mail entre aluno e administrador, inclusive sob concorrência.
- Limitação de tentativas por conta e por IP, com bloqueio temporário e header `Retry-After`.
- Resposta equivalente para credenciais incorretas e conta inexistente, reduzindo a enumeração de contas.

### Autorização e integridade de dados

- Um aluno não acessa rotas administrativas nem dados de outro aluno.
- Um aluno não envia trabalho em nome de outra pessoa.
- Uma entrega sem matrícula é recusada e não deixa dados persistidos.
- O aluno titular e o administrador continuam acessando os dados permitidos.

### Automação e entrega contínua

- A suíte foi ampliada de 6 para **96 testes automatizados passando**.
- Os testes usam banco dedicado com sufixo `-test`, massa temporária e limpeza controlada.
- A pipeline sobe MongoDB temporário e gera credenciais efêmeras em cada execução; não depende de segredos de teste publicados.
- A pipeline é executada em pushes para `main` e `trabalho-extra`.

## O que ainda pode ser feito

- Definir, com o produto, a política definitiva de formato, normalização e equivalência de e-mails.
- Definir revogação, refresh, logout e blacklist de JWTs.
- Estabelecer SLA de latência, throughput e limites de capacidade antes de criar testes de carga formais.
- Investigar diferenças de tempo entre credenciais inválidas e conta inexistente em ambiente controlado.
- Definir política completa de headers de segurança, CORS, auditoria e retenção de logs.
- Ampliar a análise RST para os demais endpoints: alunos, disciplinas, matrículas, notas e trabalhos.
- Executar testes de integração contra uma infraestrutura equivalente à produção e incluir verificações de observabilidade.
- Criar pull requests menores para levar à `main` apenas as melhorias que tenham aceite técnico e de produto.

## Estado ao encerrar

O trabalho permanece na branch `trabalho-extra`. A branch contém a implementação, os 96 testes, a documentação de análise e os registros de execução. A `main` foi mantida separada, com apenas a melhoria segura da pipeline.
