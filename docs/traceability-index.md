# Índice de Rastreabilidade — Gestão de Alunos API

**Gerado em:** 2026-09-17

**Fontes usadas:**
- `docs/knowledge-base.md`
- `docs/source-map.md`
- `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md`

**Fontes não encontradas:**
- `docs/us-index.md`
- `docs/analysis/**/test-scenarios.md`
- `docs/reverse/**/test-scenarios.md`
- `docs/test-catalog.md` ou catálogo equivalente
- `docs/flaky-index.md`

A análise foi somente documental. Nenhum código-fonte foi lido, nenhum teste foi executado e nenhum arquivo de origem foi alterado pelo agente.

## Vínculos confirmados — código x negócio

Os vínculos abaixo são documentais: a base relaciona a funcionalidade à API, e o crosswalk relaciona `SRC-EP-XXX`, `EP-XXX` e o mesmo endpoint.

| Artefato | Tipo | Entidade de negócio | Evidência |
|---|---|---|---|
| `funcionalidade:login-usuario` / `api:login` / `SRC-EP-001` | EXPÕE | `EP-001` — `POST /api/auth/login` | `knowledge-base.md`; `source-map.md`; backlog |
| `funcionalidade:consultar-alunos` / `api:admin-alunos-listar` / `SRC-EP-005` | EXPÕE | `EP-005` — `GET /api/admin/alunos` | Crosswalk e backlog |
| `funcionalidade:cadastrar-aluno` / `api:admin-alunos-criar` / `SRC-EP-006` | EXPÕE | `EP-006` — `POST /api/admin/alunos` | Crosswalk e backlog |
| `funcionalidade:consultar-alunos` / `api:admin-aluno-detalhe` / `SRC-EP-007` | EXPÕE | `EP-007` — `GET /api/admin/alunos/{id}` | Crosswalk e backlog |
| `funcionalidade:alterar-aluno` / `api:admin-aluno-atualizar` / `SRC-EP-008` | EXPÕE | `EP-008` — `PUT /api/admin/alunos/{id}` | Crosswalk e backlog |
| `funcionalidade:remover-aluno` / `api:admin-aluno-remover` / `SRC-EP-009` | EXPÕE | `EP-009` — `DELETE /api/admin/alunos/{id}` | Crosswalk e backlog |
| `funcionalidade:listar-disciplinas` / `api:admin-disciplinas-listar` / `SRC-EP-010` | EXPÕE | `EP-010` — `GET /api/admin/disciplinas` | Crosswalk e backlog |
| `funcionalidade:cadastrar-disciplina` / `api:admin-disciplinas-criar` / `SRC-EP-011` | EXPÕE | `EP-011` — `POST /api/admin/disciplinas` | Crosswalk e backlog |
| `funcionalidade:consultar-disciplina` / `api:admin-disciplina-detalhe` / `SRC-EP-012` | EXPÕE | `EP-012` — `GET /api/admin/disciplinas/{id}` | Crosswalk e backlog |
| `funcionalidade:alterar-disciplina` / `api:admin-disciplina-atualizar` / `SRC-EP-013` | EXPÕE | `EP-013` — `PUT /api/admin/disciplinas/{id}` | Crosswalk e backlog |
| `funcionalidade:remover-disciplina` / `api:admin-disciplina-remover` / `SRC-EP-014` | EXPÕE | `EP-014` — `DELETE /api/admin/disciplinas/{id}` | Crosswalk e backlog |
| `funcionalidade:matricular-aluno` / `api:admin-criar-matricula` / `SRC-EP-015` | EXPÕE | `EP-015` — `POST /api/admin/disciplinas/{id}/matriculas` | Crosswalk e backlog |
| `funcionalidade:listar-alunos-disciplina` / `api:admin-alunos-disciplina` / `SRC-EP-016` | EXPÕE | `EP-016` — `GET /api/admin/disciplinas/{id}/alunos` | Crosswalk e backlog |
| `funcionalidade:listar-notas` / `api:admin-notas-listar` / `SRC-EP-017` | EXPÕE | `EP-017` — `GET /api/admin/notas` | Crosswalk e backlog |
| `funcionalidade:registrar-nota` / `api:admin-notas-criar` / `SRC-EP-018` | EXPÕE | `EP-018` — `POST /api/admin/notas` | Crosswalk e backlog |
| `funcionalidade:consultar-nota` / `api:admin-nota-detalhe` / `SRC-EP-019` | EXPÕE | `EP-019` — `GET /api/admin/notas/{id}` | Crosswalk e backlog |
| `funcionalidade:alterar-nota` / `api:admin-nota-atualizar` / `SRC-EP-020` | EXPÕE | `EP-020` — `PUT /api/admin/notas/{id}` | Crosswalk e backlog |
| `funcionalidade:remover-nota` / `api:admin-nota-remover` / `SRC-EP-021` | EXPÕE | `EP-021` — `DELETE /api/admin/notas/{id}` | Crosswalk e backlog |
| `funcionalidade:listar-trabalhos` / `api:admin-trabalhos-listar` / `SRC-EP-022` | EXPÕE | `EP-022` — `GET /api/admin/trabalhos` | Crosswalk e backlog |
| `funcionalidade:consultar-trabalho` / `api:admin-trabalho-detalhe` / `SRC-EP-023` | EXPÕE | `EP-023` — `GET /api/admin/trabalhos/{id}` | Crosswalk e backlog |
| `funcionalidade:corrigir-trabalho` / `api:admin-trabalho-corrigir` / `SRC-EP-024` | EXPÕE | `EP-024` — `PUT /api/admin/trabalhos/{id}` | Crosswalk e backlog |
| `funcionalidade:remover-trabalho` / `api:admin-trabalho-remover` / `SRC-EP-025` | EXPÕE | `EP-025` — `DELETE /api/admin/trabalhos/{id}` | Crosswalk e backlog |
| `funcionalidade:consultar-disciplinas-aluno` / `api:aluno-disciplinas` / `SRC-EP-026` | EXPÕE | `EP-026` — `GET /api/alunos/{alunoId}/disciplinas` | Crosswalk e backlog |
| `funcionalidade:consultar-notas-aluno` / `api:aluno-notas` / `SRC-EP-027` | EXPÕE | `EP-027` — `GET /api/alunos/{alunoId}/notas` | Crosswalk e backlog |
| `funcionalidade:listar-trabalhos` / `api:aluno-trabalhos-listar` / `SRC-EP-028` | EXPÕE | `EP-028` — `GET /api/alunos/{alunoId}/trabalhos` | Crosswalk e backlog |
| `funcionalidade:registrar-entrega` / `api:aluno-trabalhos-criar` / `SRC-EP-029` | EXPÕE | `EP-029` — `POST /api/alunos/{alunoId}/trabalhos` | Crosswalk e backlog |

## Vínculos propostos — código x negócio

| Artefato | Tipo | Entidade candidata | Confiança | O que falta confirmar |
|---|---|---|---:|---|
| `api:middleware-authenticate` | VALIDA | Endpoints protegidos `EP-005` a `EP-029` | 0.90 (inferência) | Registrar middleware individualmente em cada endpoint |
| `api:middleware-authorize` | VALIDA | Endpoints administrativos `EP-005` a `EP-025` | 0.90 (inferência) | Registrar a funcionalidade em cada endpoint |
| `api:middleware-authorize-self-or-admin` | VALIDA | Autoatendimento `EP-026` a `EP-029` | 0.90 (inferência) | Registrar a funcionalidade em cada endpoint |
| `api:verificar-matricula-interno` | VALIDA | `EP-015`, `EP-018` e `EP-029` | 0.80 (inferência) | Confirmar chamada direta entre a função e cada endpoint |

## Vínculos AC x cenário x teste implementado

**Não executado.** Não existem fontes de critérios de aceite, cenários com `TC-ID`, catálogo de testes ou índice de testes em quarentena. Nenhum vínculo foi inventado.

## Lacunas de rastreabilidade

| Item sem correspondência | Lado que falta | Observação |
|---|---|---|
| `EP-002` — `GET /` | Funcionalidade de negócio | Endpoint técnico sem funcionalidade correspondente |
| `EP-003` — `GET /api-docs` | Funcionalidade de negócio | Endpoint técnico de documentação |
| `EP-004` — `GET /api-docs.yaml` | Funcionalidade de negócio | Endpoint técnico de contrato OpenAPI |
| `api:middleware-authenticate` | Endpoint individual | Middleware transversal, sem `EP-*` próprio |
| `api:middleware-authorize` | Endpoint individual | Middleware transversal, sem `EP-*` próprio |
| `api:middleware-authorize-self-or-admin` | Endpoint individual | Middleware transversal, sem `EP-*` próprio |
| `api:verificar-matricula-interno` | Endpoint individual | Função interna, não rota pública |
| Requisitos formais/US/AC | Fonte de negócio | `docs/us-index.md` e cenários não existem |
| AC x cenário x teste | Cenários e catálogo | P-37 não executado por ausência das fontes |
| Testes órfãos de especificação | Catálogo de testes | Nenhum catálogo foi encontrado |

## Classificação

- Vínculos confirmados são correspondências documentais, não prova de comportamento correto.
- Vínculos propostos aguardam confirmação humana.
- Nenhum critério de aceite foi considerado atendido.
- Nenhum teste foi considerado executado, vigente ou confiável.

## Resumo

| Item | Valor |
|---|---:|
| Fontes de código catalogado | 2 |
| Fontes de negócio | 1 backlog de endpoints |
| Endpoints catalogados | 29 |
| Vínculos confirmados código x negócio | 26 |
| Vínculos propostos código x negócio | 4 |
| Vínculos confirmados AC x cenário x teste | 0 |
| Vínculos propostos AC x cenário x teste | 0 |
| Lacunas de rastreabilidade | 10 |
| Endpoints sem funcionalidade correspondente | 3 |
| Testes executados | 0 |

**Próximo passo:** criar requisitos/cenários formais ou seguir para a decisão de cobertura dos endpoints.
