import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import Aluno from '../src/models/aluno.model.js';
import Matricula from '../src/models/matricula.model.js';
import Trabalho from '../src/models/trabalho.model.js';
import testData from './data/aluno.json' with { type: 'json' };
import { loginAsAdmin, loginAsUser } from './helpers/auth.js';
import { testCredentials } from './config.js';

describe('Fluxo de cadastro e entrega do aluno', () => {
  let aluno;
  let trabalho;

  after(async () => {
    if (trabalho) await Trabalho.deleteOne({ _id: trabalho.id });
    if (aluno) await Matricula.deleteMany({ alunoId: aluno.id });
    if (aluno) await Aluno.deleteOne({ _id: aluno.id });
  });

  for (const alunoData of testData.alunos) {
    it('admin cadastra aluno, aluno faz login e registra uma entrega', async () => {
      const client = request(app);
      const adminLogin = await loginAsAdmin(client, testCredentials.admin);
      expect(adminLogin.status).to.equal(200);
      expect(adminLogin.body).to.have.property('token');

      const adminToken = adminLogin.body.token;
      const alunoDataUnico = {
        ...alunoData,
        senha: process.env[alunoData.senhaEnv],
        email: `${Date.now()}-${alunoData.email}`,
        matricula: `${alunoData.matricula}-${Date.now()}`,
      };

      const cadastro = await client
        .post('/api/admin/alunos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(alunoDataUnico);

      expect(cadastro.status).to.equal(201);
      expect(cadastro.body).to.include({
        nome: alunoData.nome,
        email: alunoDataUnico.email,
        matricula: alunoDataUnico.matricula,
      });
      expect(cadastro.body).to.not.have.property('senha');
      aluno = cadastro.body;

      const matricula = await client
        .post(`/api/admin/disciplinas/${testData.disciplina.id}/matriculas`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ alunoId: aluno.id });

      expect(matricula.status).to.equal(201);

      const alunoLogin = await loginAsUser(client, {
        email: alunoDataUnico.email,
        senha: testCredentials.newStudentPassword,
      });

      expect(alunoLogin.status).to.equal(200);
      expect(alunoLogin.body).to.have.property('token');
      expect(alunoLogin.body.usuario).to.include({ id: aluno.id, role: 'aluno' });

      const entrega = await client
        .post(`/api/alunos/${aluno.id}/trabalhos`)
        .set('Authorization', `Bearer ${alunoLogin.body.token}`)
        .send({ disciplinaId: testData.disciplina.id, ...testData.trabalho });

      expect(entrega.status).to.equal(201);
      expect(entrega.body).to.include({
        alunoId: aluno.id,
        disciplinaId: testData.disciplina.id,
        titulo: testData.trabalho.titulo,
        status: 'entregue',
      });
      trabalho = entrega.body;
    });
  }
});