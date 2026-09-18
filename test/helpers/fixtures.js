import { randomUUID } from 'node:crypto';
import Aluno from '../../src/models/aluno.model.js';
import Administrador from '../../src/models/admin.model.js';
import Disciplina from '../../src/models/disciplina.model.js';
import Matricula from '../../src/models/matricula.model.js';
import Trabalho from '../../src/models/trabalho.model.js';
import Nota from '../../src/models/nota.model.js';
import Reservation from '../../src/models/emailReservation.model.js';
import { testCredentials } from '../config.js';

export function createFixtureScope() {
  const alunoIds = [], adminIds = [], disciplinaIds = [], emails = [];
  return {
    alunoPayload(overrides = {}) {
      const unique = randomUUID();
      const payload = { nome: 'QA Automation Aluno', email: `qa-${unique}@example-test.invalid`,
        matricula: `QA-${unique}`, senha: testCredentials.newStudentPassword, ...overrides };
      emails.push(payload.email.trim().toLowerCase()); // Reserve ownership before making a request.
      return payload;
    },
    async aluno(overrides = {}) {
      const payload = this.alunoPayload(overrides);
      const id = randomUUID();
      alunoIds.push(id);
      return Aluno.create({ ...payload, _id: id });
    },
    async admin(overrides = {}) {
      const id = randomUUID();
      adminIds.push(id);
      return Administrador.create({ _id: id, nome: 'QA Automation Admin',
        email: `qa-${id}@example-test.invalid`, senha: testCredentials.admin.senha, ...overrides });
    },
    async disciplina() {
      const id = randomUUID();
      disciplinaIds.push(id);
      return Disciplina.create({ _id: id, nome: 'QA Automation Disciplina', codigo: `QA-${id}`, cargaHoraria: 40 });
    },
    async cleanup() {
      const created = await Aluno.find({ email: { $in: emails } }).select('_id');
      const ids = [...new Set([...alunoIds, ...created.map((item) => item.id)])];
      const outcomes = await Promise.allSettled([
        Trabalho.deleteMany({ alunoId: { $in: ids } }), Matricula.deleteMany({ alunoId: { $in: ids } }),
        Nota.deleteMany({ alunoId: { $in: ids } }), Aluno.deleteMany({ _id: { $in: ids } }),
        Administrador.deleteMany({ _id: { $in: adminIds } }), Disciplina.deleteMany({ _id: { $in: disciplinaIds } }),
      ]);
      const failures = outcomes.filter((result) => result.status === 'rejected');
      if (failures.length) throw new AggregateError(failures.map((result) => result.reason), 'Falha na limpeza da massa QA');
      await Reservation.deleteMany({ owner: { $in: [
        ...ids.map((id) => `Aluno:${id}`), ...adminIds.map((id) => `Administrador:${id}`),
      ] } });
    },
  };
}
