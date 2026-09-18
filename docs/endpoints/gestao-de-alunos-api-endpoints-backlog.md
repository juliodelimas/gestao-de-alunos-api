# Backlog de Endpoints — Gestão de Alunos API

**Gerado em:** 2026-09-17  
**Fontes utilizadas:** `docs/source-map.md`, `docs/openapi.yaml` e implementação em `src/`  
**Total de endpoints catalogados:** 29  
**Deduplicação:** método + path efetivo

## Resumo por prioridade

| Prioridade | Quantidade |
|---|---:|
| Alta | 14 |
| Média | 3 |
| Baixa | 12 |

## Convenções

- `JWT/admin`: Bearer JWT válido com papel `admin`.
- `JWT/aluno|admin`: Bearer JWT; aluno somente para o próprio `alunoId`, administrador para qualquer aluno.
- Respostas de erro seguem `{error: string}`.
- Senhas, tokens e valores reais foram omitidos.
- `🔲 Pendente` significa aguardando decisão de automação; nenhum endpoint foi executado nesta catalogação.
- Execução e decisão são dimensões separadas: um endpoint pode ser aprovado para automação e ainda não executado.

## Crosswalk com o mapa do código

Para os endpoints públicos, a numeração é equivalente: `EP-001` corresponde a
`SRC-EP-001` no `docs/source-map.md`. Essa regra vale para todos os itens de
`EP-001` a `EP-029`. Os nomes `api:*` da base de conhecimento são os nomes
semânticos associados aos mesmos endpoints; funções internas e middlewares não
recebem item `EP-*`.

## Backlog completo

| ID | Método | Endpoint | Descrição | Autenticação | Prioridade | Critério | Status |
|---|---|---|---|---|---|---|---|
| EP-001 | POST | `/api/auth/login` | Autentica administrador ou aluno e retorna JWT | Pública | Alta | Autenticação e pré-condição | 🔲 Pendente |
| EP-002 | GET | `/` | Retorna identificação e link da documentação | Nenhuma | Baixa | Leitura técnica simples | 🔲 Pendente |
| EP-003 | GET | `/api-docs` | Disponibiliza Swagger UI | Nenhuma | Baixa | Documentação | 🔲 Pendente |
| EP-004 | GET | `/api-docs.yaml` | Disponibiliza contrato OpenAPI | Nenhuma | Baixa | Documentação | 🔲 Pendente |
| EP-005 | GET | `/api/admin/alunos` | Lista alunos | JWT/admin | Baixa | Leitura simples | 🔲 Pendente |
| EP-006 | POST | `/api/admin/alunos` | Cadastra aluno | JWT/admin | Alta | Escrita e credencial | 🔲 Pendente |
| EP-007 | GET | `/api/admin/alunos/{id}` | Busca aluno | JWT/admin | Baixa | Leitura por parâmetro | 🔲 Pendente |
| EP-008 | PUT | `/api/admin/alunos/{id}` | Atualiza aluno parcialmente | JWT/admin | Alta | Atualização de dados sensíveis | 🔲 Pendente |
| EP-009 | DELETE | `/api/admin/alunos/{id}` | Remove aluno | JWT/admin | Alta | Exclusão de dados | 🔲 Pendente |
| EP-010 | GET | `/api/admin/disciplinas` | Lista disciplinas | JWT/admin | Baixa | Leitura simples | 🔲 Pendente |
| EP-011 | POST | `/api/admin/disciplinas` | Cadastra disciplina | JWT/admin | Alta | Escrita de dados | 🔲 Pendente |
| EP-012 | GET | `/api/admin/disciplinas/{id}` | Busca disciplina | JWT/admin | Baixa | Leitura por parâmetro | 🔲 Pendente |
| EP-013 | PUT | `/api/admin/disciplinas/{id}` | Atualiza disciplina parcialmente | JWT/admin | Alta | Atualização de dados | 🔲 Pendente |
| EP-014 | DELETE | `/api/admin/disciplinas/{id}` | Remove disciplina | JWT/admin | Alta | Exclusão de dados | 🔲 Pendente |
| EP-015 | POST | `/api/admin/disciplinas/{id}/matriculas` | Matricula aluno | JWT/admin | Alta | Pré-condição para notas/trabalhos | 🔲 Pendente |
| EP-016 | GET | `/api/admin/disciplinas/{id}/alunos` | Lista alunos da disciplina | JWT/admin | Baixa | Leitura simples | 🔲 Pendente |
| EP-017 | GET | `/api/admin/notas` | Lista notas com filtros | JWT/admin | Média | Listagem filtrável | 🔲 Pendente |
| EP-018 | POST | `/api/admin/notas` | Lança nota | JWT/admin | Alta | Escrita de dado acadêmico | 🔲 Pendente |
| EP-019 | GET | `/api/admin/notas/{id}` | Busca nota | JWT/admin | Baixa | Leitura por parâmetro | 🔲 Pendente |
| EP-020 | PUT | `/api/admin/notas/{id}` | Atualiza nota | JWT/admin | Alta | Atualização de dado acadêmico | 🔲 Pendente |
| EP-021 | DELETE | `/api/admin/notas/{id}` | Remove nota | JWT/admin | Alta | Exclusão de dado acadêmico | 🔲 Pendente |
| EP-022 | GET | `/api/admin/trabalhos` | Lista trabalhos com filtros | JWT/admin | Média | Filtros e dados acadêmicos | 🔲 Pendente |
| EP-023 | GET | `/api/admin/trabalhos/{id}` | Busca trabalho | JWT/admin | Baixa | Leitura por parâmetro | 🔲 Pendente |
| EP-024 | PUT | `/api/admin/trabalhos/{id}` | Corrige trabalho | JWT/admin | Alta | Atualização de dado acadêmico | 🔲 Pendente |
| EP-025 | DELETE | `/api/admin/trabalhos/{id}` | Remove trabalho | JWT/admin | Alta | Exclusão de dados | 🔲 Pendente |
| EP-026 | GET | `/api/alunos/{alunoId}/disciplinas` | Lista disciplinas do aluno | JWT/aluno\|admin | Baixa | Leitura protegida | 🔲 Pendente |
| EP-027 | GET | `/api/alunos/{alunoId}/notas` | Lista notas do aluno com filtro opcional | JWT/aluno\|admin | Média | Dado sensível e filtro | 🔲 Pendente |
| EP-028 | GET | `/api/alunos/{alunoId}/trabalhos` | Lista trabalhos do aluno | JWT/aluno\|admin | Baixa | Leitura protegida | 🔲 Pendente |
| EP-029 | POST | `/api/alunos/{alunoId}/trabalhos` | Registra trabalho | JWT/aluno\|admin | Alta | Escrita e dependência de matrícula | 🔲 Pendente |

## Detalhamento dos contratos

| ID | Payload | Resposta principal | Status identificáveis | Observações |
|---|---|---|---|---|
| EP-001 | `{email, senha}` | `{token, usuario: {id, nome, email, role}}` | 200, 400, 401, 500 | Admin é consultado antes do aluno. |
| EP-002 | — | `{nome, descricao, documentacao}` | 200 | Não consta no OpenAPI. |
| EP-003 | — | HTML Swagger | 200 | Endpoint técnico fora do OpenAPI. |
| EP-004 | — | YAML OpenAPI | 200 | Endpoint técnico fora do OpenAPI. |
| EP-005 | — | Array de alunos sem `senha` | 200, 401, 403, 500 | Requer admin. |
| EP-006 | `{nome, email, matricula, senha}` | Aluno sem `senha` | 201, 400, 401, 403, 409, 500 | E-mail/matrícula duplicados geram 409. |
| EP-007 | Path `{id}` | Aluno sem `senha` | 200, 401, 403, 404, 500 | Aluno inexistente gera 404. |
| EP-008 | Subconjunto de `{nome, email, matricula, senha}` | Aluno atualizado sem `senha` | 200, 401, 403, 404, 500 | Atualização parcial. |
| EP-009 | Path `{id}` | Sem corpo | 204, 401, 403, 404, 500 | Exclusão. |
| EP-010 | — | Array de disciplinas | 200, 401, 403, 500 | `cargaHoraria` pode ser nula. |
| EP-011 | `{nome, codigo, cargaHoraria?}` | Disciplina | 201, 400, 401, 403, 409, 500 | Código duplicado gera 409. |
| EP-012 | Path `{id}` | Disciplina | 200, 401, 403, 404, 500 | Disciplina inexistente gera 404. |
| EP-013 | Subconjunto de `{nome, codigo, cargaHoraria}` | Disciplina atualizada | 200, 401, 403, 404, 500 | Implementação parcial; OpenAPI marca nome/código obrigatórios. |
| EP-014 | Path `{id}` | Sem corpo | 204, 401, 403, 404, 500 | Exclusão. |
| EP-015 | `{alunoId}` | `{id, alunoId, disciplinaId, dataMatricula}` | 201, 400, 401, 403, 404, 409, 500 | Exige aluno/disciplina; duplicidade gera 409. |
| EP-016 | Path `{id}` | Array de alunos sem `senha` | 200, 401, 403, 404, 500 | Verifica a disciplina. |
| EP-017 | Query `{alunoId?, disciplinaId?}` | Array de notas | 200, 401, 403, 500 | Filtros opcionais. |
| EP-018 | `{alunoId, disciplinaId, valor, tipo, descricao?}` | Nota | 201, 400, 401, 403, 404, 409, 500 | Valor 0-10; aluno matriculado. |
| EP-019 | Path `{id}` | Nota | 200, 401, 403, 404, 500 | Nota inexistente gera 404. |
| EP-020 | Subconjunto de `{valor, tipo, descricao}` | Nota atualizada | 200, 400, 401, 403, 404, 500 | Revalida valor e tipo. |
| EP-021 | Path `{id}` | Sem corpo | 204, 401, 403, 404, 500 | Exclusão. |
| EP-022 | Query `{alunoId?, disciplinaId?, status?}` | Array de trabalhos | 200, 401, 403, 500 | Sem status, lista todos os estados. |
| EP-023 | Path `{id}` | Trabalho | 200, 401, 403, 404, 500 | Trabalho inexistente gera 404. |
| EP-024 | Subconjunto de `{status, nota, feedback}` | Trabalho atualizado | 200, 400, 401, 403, 404, 500 | Status válido; nota nula ou 0-10. |
| EP-025 | Path `{id}` | Sem corpo | 204, 401, 403, 404, 500 | Exclusão. |
| EP-026 | Path `{alunoId}` | Array de disciplinas | 200, 401, 403, 404, 500 | Aluno só acessa próprio ID. |
| EP-027 | Path + query `{disciplinaId?}` | Array de notas | 200, 401, 403, 404, 500 | Aluno ou admin autorizado. |
| EP-028 | Path `{alunoId}` | Array de trabalhos | 200, 401, 403, 404, 500 | Filtra internamente por aluno. |
| EP-029 | Path `{alunoId}` + `{disciplinaId, titulo, descricao?}` | Trabalho criado | 201, 400, 401, 403, 404, 409, 500 | Exige aluno, disciplina e matrícula. |

## Inconsistências identificadas

1. O source-map registra paths efetivos com `/api`, enquanto o OpenAPI usa `servers: /api` e paths sem esse prefixo.
2. `/`, `/api-docs` e `/api-docs.yaml` existem no código, mas não aparecem como paths do OpenAPI.
3. O OpenAPI afirma que toda a API, exceto login, exige JWT, mas os três endpoints técnicos são públicos.
4. `PUT /api/admin/disciplinas/{id}` aceita atualização parcial no código, enquanto o OpenAPI reutiliza schema com nome e código obrigatórios.
5. Atualizações de aluno podem alterar campos únicos sem tratamento explícito de duplicidade equivalente ao cadastro.
6. O resumo do OpenAPI descreve trabalhos entregues, mas o código lista todos os status quando `status` não é informado.
7. A implementação permite `nota: null` na correção, mas o schema OpenAPI não declara `nullable: true`.
8. O middleware pode responder `500` para erros não classificados; isso não aparece individualmente no contrato.
9. O OpenAPI contém exemplos de credenciais, tokens e IDs que devem ser tratados como dados demonstrativos, não como massa segura de teste.

## Endpoints não documentados no OpenAPI

| Endpoint | Fonte |
|---|---|
| `GET /` | Código/source-map |
| `GET /api-docs` | Código/source-map |
| `GET /api-docs.yaml` | Código/source-map |

Não foram identificados endpoints funcionais presentes exclusivamente no OpenAPI. Nenhum endpoint está marcado como deprecated.

## Status de automação

Todos os endpoints permanecem `🔲 Pendente`. A decisão de marcar `✅ Automatizar`, `⏸ Adiar`, `❌ Não automatizar` ou `🔍 Investigar` pertence ao time.

## Próximo passo sugerido

Apresentar o backlog para decisão de cobertura. Para a primeira leva, considerar `EP-001`, `EP-006`, `EP-015`, `EP-018`, `EP-024` e `EP-029`, pois cobrem autenticação, cadastro, matrícula, notas, correção e entrega de trabalho.
