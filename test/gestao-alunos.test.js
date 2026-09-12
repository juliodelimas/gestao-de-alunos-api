import { createRequire } from 'module';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAsAdmin } from './helpers/adminHelper.js';
import { loginAsAluno } from './helpers/alunoHelper.js';

const require = createRequire(import.meta.url);
const { admin, cenarios } = require('./fixtures/data.json');

describe('Fluxo Principal: Admin cadastra aluno → aluno entrega trabalho', () => {
  cenarios.forEach((cenario) => {
    describe(`Cenário: ${cenario.descricao}`, () => {
      const ctx = {};

      before(async () => {
        ctx.adminToken = await loginAsAdmin(admin);

        const { body: alunos } = await request(app)
          .get('/api/admin/alunos')
          .set('Authorization', `Bearer ${ctx.adminToken}`);

        const existente = alunos.find((a) => a.email === cenario.aluno.email);
        if (existente) {
          await request(app)
            .delete(`/api/admin/alunos/${existente.id}`)
            .set('Authorization', `Bearer ${ctx.adminToken}`);
        }
      });

      it('1. Admin faz login com sucesso', async () => {
        expect(ctx.adminToken).to.be.a('string').and.not.be.empty;
      });

      it('2. Admin cadastra um novo aluno', async () => {
        const resposta = await request(app)
          .post('/api/admin/alunos')
          .set('Authorization', `Bearer ${ctx.adminToken}`)
          .send(cenario.aluno);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('id');
        ctx.alunoId = resposta.body.id;
      });

      it('3. Admin matricula o aluno na disciplina', async () => {
        const resposta = await request(app)
          .post(`/api/admin/disciplinas/${cenario.disciplinaId}/matriculas`)
          .set('Authorization', `Bearer ${ctx.adminToken}`)
          .send({ alunoId: ctx.alunoId });

        expect(resposta.status).to.equal(201);
      });

      it('4. Aluno faz login com sucesso', async () => {
        ctx.alunoToken = await loginAsAluno(cenario.aluno);
        expect(ctx.alunoToken).to.be.a('string').and.not.be.empty;
      });

      it('5. Aluno registra a entrega de um trabalho', async () => {
        const resposta = await request(app)
          .post(`/api/alunos/${ctx.alunoId}/trabalhos`)
          .set('Authorization', `Bearer ${ctx.alunoToken}`)
          .send({
            disciplinaId: cenario.disciplinaId,
            ...cenario.trabalho,
          });

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.have.property('id');
        expect(resposta.body.titulo).to.equal(cenario.trabalho.titulo);
        expect(resposta.body.status).to.equal('entregue');
      });
    });
  });
});
