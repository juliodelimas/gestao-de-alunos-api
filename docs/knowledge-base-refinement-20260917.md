# Refinamento do Material de Referência — 2026-09-17

## Arquivos revisados nesta rodada

- [x] `docs/knowledge-base.md`
- [x] `docs/source-map.md`
- [x] `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md`
- [ ] `docs/project-memory.md` — não encontrado
- [ ] `docs/us-index.md` — não encontrado
- [ ] `docs/reverse/index.md` — não encontrado
- [ ] `docs/bugs-index.md` — não encontrado

Não foram relidos código-fonte, módulos importados ou OpenAPI nesta auditoria.

## `docs/knowledge-base.md`

### Inconsistência crítica resolvida: KB-QA-001

A base informava `APIs/contratos técnicos: 36`, mas não explicava a composição. A base agora registra explicitamente: 29 endpoints + 3 middlewares + 1 função interna + 2 grupos de rotas + 1 contrato de erro = 36.

### Lacunas resolvidas

- **KB-QA-003 / SM-QA-001 / BL-QA-001:** o crosswalk `SRC-EP-001..029` ↔ `EP-001..029` ↔ `api:*` foi documentado na base e no backlog.
- `funcionalidade:verificar-matricula` foi explicitamente classificada como suporte interno, não endpoint público.

### Lacunas pendentes

- **KB-QA-002:** resolvida com a matriz explícita de funcionalidade -> jornada na base consolidada.
- **KB-QA-004:** resolvida; a base agora lista explicitamente os seis módulos usados.
- **SM-QA-002:** propostas `MEM-001` a `MEM-005` continuam aguardando confirmação; `docs/project-memory.md` não existe.
- **BL-QA-002:** resolvida; o backlog agora separa decisão de automação e execução.
- **BL-QA-003:** as fontes externas ao escopo desta revisão continuam sem nova validação.

### IDs e idade

Não foram encontrados IDs duplicados ou referências explícitas a IDs inexistentes. A base e as fontes estão datadas de 2026-09-17; não há evidência suficiente para sinalizar desatualização.

### Fusões sugeridas

Nenhuma fusão segura.

## `docs/source-map.md`

### Inconsistências críticas

Nenhuma inconsistência interna identificada.

### Lacunas

- **SM-QA-001:** ausência de tabela ligando `SRC-EP-*` a `EP-*`.
- **SM-QA-002:** propostas `MEM-001` a `MEM-005` dependem de confirmação, mas `docs/project-memory.md` não existe.

Os IDs `SRC-EP-001..029`, `SRC-ERR-001..028`, integrações e propostas não apresentam duplicidade visível.

## `docs/endpoints/gestao-de-alunos-api-endpoints-backlog.md`

### Inconsistências críticas

Nenhuma inconsistência interna identificada.

### Lacunas resolvidas e pendentes

- **BL-QA-001:** resolvida; o crosswalk `EP-001..029` ↔ `SRC-EP-001..029` está no backlog.
- **BL-QA-002:** resolvida; o significado de `🔲 Pendente` está documentado no backlog.
- **BL-QA-003:** o backlog cita OpenAPI e `src/`, mas essas fontes não foram revalidadas nesta auditoria.

Os IDs `EP-001..029` são sequenciais e o total declarado de 29 é coerente.

## Referências cruzadas

- Source-map e backlog catalogam os mesmos 29 endpoints.
- A correspondência numérica `SRC-EP-001..029` ↔ `EP-001..029` é provável, mas não formalizada.
- A base referencia corretamente o source-map e o backlog.
- Não foram encontradas jornadas sem etapas, telas órfãs ou APIs/regras claramente órfãs.
- A função interna de verificação de matrícula deve permanecer marcada como suporte interno.

## Resumo

| Categoria | Quantidade |
|---|---:|
| Arquivos revisados | 3 de 7 |
| Arquivos ausentes | 4 |
| Inconsistências críticas pendentes | 0 |
| Lacunas pendentes | 2 |
| IDs duplicados | 0 |
| Referências a IDs inexistentes | 0 |
| Jornadas sem etapas | 0 |
| Referências reversas reparadas | 0 |
| Possivelmente desatualizadas | 0 |
| Fusões sugeridas | 0 |
| Endpoints no source-map | 29 |
| Endpoints no backlog | 29 |

## Conclusão

A documentação é coerente entre source-map e backlog. O principal ponto de atenção é formalizar os crosswalks entre namespaces de IDs e explicar a contagem de APIs/contratos técnicos da base consolidada. Nenhuma correção automática foi aplicada.
