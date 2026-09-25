import { expect } from 'chai';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import app from '../src/app.js';

const dataPath = path.join(process.cwd(), 'test', 'data', 'testdata.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const testData = JSON.parse(raw);

describe('E2E: Admin -> Create Aluno -> Aluno submit trabalho', function () {
  this.timeout(10000);

  let adminToken;
  let aluno;
  let alunoToken;

  it('should login as admin', async () => {
    const res = await request(app).post('/api/auth/login').send(testData.admin);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    adminToken = res.body.token;
  });

  it('should create a new aluno as admin', async () => {
    const res = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(testData.newAluno);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    aluno = res.body;
  });

  it('should matriculate the new aluno in an existing disciplina', async () => {
    const disciplinaId = testData.disciplinaId;
    const res = await request(app)
      .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ alunoId: aluno.id });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('alunoId', aluno.id);
  });

  it('should login as the new aluno', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testData.newAluno.email,
      senha: testData.newAluno.senha,
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    alunoToken = res.body.token;
  });

  it('should register a trabalho as aluno', async () => {
    const trabalhoPayload = Object.assign({}, testData.trabalho);
    const res = await request(app)
      .post(`/api/alunos/${aluno.id}/trabalhos`)
      .set('Authorization', `Bearer ${alunoToken}`)
      .send(trabalhoPayload);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('titulo', trabalhoPayload.titulo);
  });
});
