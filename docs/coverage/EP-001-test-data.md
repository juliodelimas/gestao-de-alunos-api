# Massa Pré-existente — EP-001

> Atualização: contas seed permanecem intactas no banco `-test`. Autorização/jornada e exploração usam fixtures próprias conforme [design complementar](../analysis/EP-001/priority-test-design.md), sem depender de IDs fixos de Ana/Bruno. A colisão de perfis foi explorada com admin/aluno criados e apagados pelo próprio escopo. A decisão de produto permanece pendente.

Os cenários usam contas seed existentes. Não criar factory nem remover essas contas durante teardown.

| Item | Identificador | Estado | Como obter |
|---|---|---|---|
| Administrador | `admin@escola.com` | Senha seed; role `admin`; id `admin-principal` | Seed em `src/database/seed.js` |
| Ana Souza | `ana.souza@example.com` | Senha seed; role `aluno`; id `aluno-ana-souza` | Seed em `src/database/seed.js` |
| Bruno Lima | `bruno.lima@example.com` | Senha seed; role `aluno`; id `aluno-bruno-lima` | Seed em `src/database/seed.js` |
| Carla Mendes | `carla.mendes@example.com` | Senha seed; role `aluno`; id `aluno-carla-mendes` | Seed em `src/database/seed.js` |

## Restrições

- Confirmar que a execução usa a base MongoDB destinada aos testes.
- O seed popula os dados quando ainda não existe administrador.
- TC-B004 usa e-mail inexistente e senha incorreta, sem criar conta.
- Não há no seed uma colisão de e-mail entre administrador e aluno; para G-EP001-004, a política e a forma de obter essa massa precisam ser confirmadas.
- Nenhuma factory ou teardown deve ser criado para este EP.
