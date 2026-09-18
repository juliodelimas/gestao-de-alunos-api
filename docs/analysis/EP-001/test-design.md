# Design de Testes — EP-001

> Design inicial preservado como histórico. A implementação atual, massa isolada e cenários novos estão no [design complementar](priority-test-design.md). As restrições antigas de não criar fixtures se aplicavam às contas seed; as novas fixtures têm propriedade e limpeza próprias.

- **Endpoint:** `POST /api/auth/login`
- **Stack:** Mocha + SuperTest + Chai
- **Execução:** não realizada
- **Fonte:** `test-scenarios.md`
- **Gaps:** `docs/coverage/EP-001-coverage-gaps.md`
- **Massa:** `docs/coverage/EP-001-test-data.md`

> Esboços sem lógica de teste. Cenários `[MANUAL]` permanecem previstos para execução manual. Cenários `[INFERIDO]` e `[NÃO OBSERVADO]` exigem confirmação antes da implementação.

```js
import request from 'supertest';
import { expect } from 'chai';
import app from '../../../src/app.js';

describe('EP-001 — POST /api/auth/login', () => {
  it.skip('TC-B001 — login válido de administrador', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-HP-01
    // Usar administrador seed; confirmar role admin e claims JWT.
  });

  it.skip('TC-B002 — login válido de aluno', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-HP-02
    // Usar aluno seed; confirmar role aluno e claims JWT.
  });

  it.skip('TC-B003 — campos obrigatórios ausentes', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-EH-01
    // Casos: {}, somente email, somente senha; confirmar 400/corpo.
  });

  it.skip('TC-B004 — credenciais inválidas', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-EH-02, G-EP001-009
    // Comparar email inexistente, senha incorreta e ambos incorretos.
  });

  it.skip('TC-B005 — não exposição de senha ou hash', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-SE-01
    // Verificar corpo e token; headers/logs dependem de confirmação.
  });

  it.skip('TC-B006 — contrato de sucesso, token e usuário', async () => {
    // [BACKEND] [AUTOMAÇÃO] — R-HP-03, G-EP001-008, G-EP001-013
    // Confirmar status 200, content type, campos e relação id/sub.
  });

  it.skip('TC-B007 — falha interna sanitizada', async () => {
    // [BACKEND] [MANUAL] [NÃO OBSERVADO] — R-EH-03, G-EP001-005/007
    // Confirmar mecanismo de simulação e contrato 500 antes de implementar.
  });

  it.skip('TC-B008 — valores nulos, vazios e campos extras', async () => {
    // [BACKEND] [MANUAL] [NÃO OBSERVADO] — R-ED-01, G-EP001-001
    // Confirmar se o resultado é 400, 401 ou outro.
  });

  it.skip('TC-B009 — formato, limites, espaços e Unicode', async () => {
    // [BACKEND] [MANUAL] [NÃO OBSERVADO] — R-ED-02/03, G-EP001-002/003
    // Confirmar formatos, limites e normalização.
  });

  it.skip('TC-B010 — abuso, desempenho e concorrência', async () => {
    // [BACKEND] [MANUAL] [NÃO OBSERVADO] — R-SE-04, R-PE-01/02
    // Confirmar rate limiting, latência, throughput e concorrência.
  });
});
```

## Checklist de implementação

1. Reutilizar helpers e cliente SuperTest existentes.
2. Usar a massa seed catalogada.
3. Implementar TC-B001, TC-B002 e TC-B006.
4. Implementar TC-B003, TC-B004 e TC-B005.
5. Confirmar decisões e implementar TC-B008 e TC-B009.
6. Definir simulação e implementar TC-B007.
7. Definir métricas e política operacional antes de TC-B010.
8. Registrar resultados dos cenários manuais separadamente.

## Factories e teardown

Não criar factory ou teardown: as contas seed são massa compartilhada e devem permanecer intactas.

## Contagem direta

- Esboços: 10.
- Cenários manuais: 4 (`TC-B007` a `TC-B010`).
- Automatizáveis após confirmações: 6 (`TC-B001` a `TC-B006`).
- Bloqueados: 0.
- Factories: 0.
- Teardowns: 0.
