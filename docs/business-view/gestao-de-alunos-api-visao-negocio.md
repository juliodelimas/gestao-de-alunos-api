# Visão de Negócio — Gestão de Alunos API (rascunho)

**Gerado a partir do código-fonte em:** 2026-09-17
**Baseado em:** Categorias 2, 3 e 5 de `docs/source-map.md`
**Status:** Aguardando revisão humana — nunca circular sem aprovação

> Todas as afirmações abaixo são inferências derivadas do código-fonte, não fatos de negócio confirmados. Revisar com alguém que conheça o domínio antes de usar em Confluence, apresentações ou documentação oficial.

## Glossário de domínio

- **Aluno:** pessoa que possui cadastro acadêmico, participa de disciplinas, consulta notas e registra trabalhos.
- **Administrador:** perfil responsável por manter cadastros acadêmicos e corrigir trabalhos.
- **Disciplina:** componente curricular identificado por nome e código, com carga horária opcional.
- **Matrícula:** vínculo que permite a um aluno participar de uma disciplina.
- **Nota:** avaliação de um aluno em uma disciplina, com valor, tipo e descrição.
- **Trabalho:** atividade entregue por um aluno em uma disciplina, que pode receber status, nota e feedback.

## Mapa de módulos

- **Autenticação:** verifica credenciais de administradores e alunos e emite tokens JWT.
- **Administração de alunos:** cadastra, consulta, atualiza e remove alunos.
- **Administração de disciplinas:** mantém disciplinas e cria/lista vínculos de matrícula.
- **Notas:** permite que administradores lancem, consultem, atualizem e removam avaliações.
- **Trabalhos:** permite que alunos registrem entregas e que administradores consultem e corrijam trabalhos.
- **Autoatendimento do aluno:** permite consultar disciplinas, notas e trabalhos do próprio aluno.
- **Banco e seed:** conecta ao MongoDB e carrega dados iniciais quando o banco está vazio.

## Regras de negócio em linguagem simples

- O sistema diferencia administradores e alunos; operações administrativas são reservadas ao perfil administrador. Origem: `SRC-EP-005` a `SRC-EP-025` e `SRC-ERR-003`.
- Um aluno só pode consultar ou registrar informações associadas ao seu próprio cadastro. Origem: `SRC-ERR-004`.
- Para registrar nota ou trabalho, o aluno precisa estar matriculado na disciplina correspondente. Origem: regras de `src/services/notas.service.js:34-39` e `src/services/trabalhos.service.js:21-34`.
- O cadastro de aluno exige nome, e-mail, matrícula e senha; e-mail e matrícula não podem ser duplicados. Origem: regras em `src/services/alunos.service.js:17-26`.
- Uma disciplina é identificada por um código único. Origem: regras em `src/services/disciplinas.service.js:17-26`.
- Notas usam uma escala de 0 a 10 e possuem tipos permitidos de prova, trabalho ou participação. Origem: regras em `src/services/notas.service.js:27-32`.
- Trabalhos podem estar nos estados entregue, em correção ou corrigido. Origem: `STATUS_VALIDOS` em `src/services/trabalhos.service.js:6`.
- A autenticação depende de credenciais válidas e de um token Bearer assinado. Origem: `src/services/auth.service.js:15-25` e `src/middlewares/authenticate.js:6-18`.

## Pontos para confirmação com o negócio

- Confirmar se o aluno deve sempre estar matriculado antes de registrar qualquer trabalho ou nota.
- Confirmar se administradores podem acessar dados de qualquer aluno, conforme a autorização atual.
- Confirmar se os tipos de nota e os estados de trabalho são completos ou apenas os valores atualmente implementados.
- Confirmar a política de validade e renovação dos tokens JWT.
- Confirmar se o seed de demonstração deve ser usado em ambientes de teste ou apenas em desenvolvimento.
