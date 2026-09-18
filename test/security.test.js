import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import Trabalho from '../src/models/trabalho.model.js';
import { JWT_SECRET, JWT_AUDIENCE, JWT_ISSUER } from '../src/config/jwt.js';
import { loginAsAdmin, loginAsUser } from './helpers/auth.js';
import { expectError } from './helpers/assertions.js';
import { testCredentials } from './config.js';

const unauthorized = 'Token de autenticação não informado.';
const forbidden = 'Você não tem permissão para acessar este recurso.';
const notOwn = 'Você só pode acessar os seus próprios dados.';

describe('Autorização e isolamento dos dados', () => {
  let adminToken;
  let studentToken;
  const otherStudent = 'aluno-bruno-lima';
  const ownStudent = 'aluno-ana-souza';

  before(async () => {
    adminToken = (await loginAsAdmin(request(app))).body.token;
    studentToken = (await loginAsUser(request(app), testCredentials.student)).body.token;
  });

  it('TC-S001 - rota administrativa sem token', async () => {
    expectError(await request(app).get('/api/admin/alunos'), 401, unauthorized);
  });

  for (const [label, call] of [
    ['GET', () => request(app).get('/api/admin/alunos')],
    ['POST', () => request(app).post('/api/admin/alunos').send({})],
    ['PUT', () => request(app).put('/api/admin/alunos/nao-existe').send({ nome: 'Alteração' })],
    ['DELETE', () => request(app).delete('/api/admin/alunos/nao-existe')],
  ]) {
    it(`TC-S002 - aluno nao pode executar ${label} administrativo e nao altera dados`, async () => {
      expectError(await call().set('Authorization', `Bearer ${studentToken}`), 403, forbidden);
    });
  }

  for (const route of ['notas', 'disciplinas', 'trabalhos']) {
    it(`TC-S003 - aluno nao consulta ${route} de outro aluno`, async () => {
      expectError(await request(app).get(`/api/alunos/${otherStudent}/${route}`).set('Authorization', `Bearer ${studentToken}`), 403, notOwn);
    });
  }

  it('TC-S004 - aluno nao entrega em nome de outro e nao grava trabalho', async () => {
    const before = await Trabalho.countDocuments({ alunoId: otherStudent });
    expectError(await request(app).post(`/api/alunos/${otherStudent}/trabalhos`).set('Authorization', `Bearer ${studentToken}`)
      .send({ disciplinaId: 'disciplina-historia', titulo: 'Tentativa indevida' }), 403, notOwn);
    expect(await Trabalho.countDocuments({ alunoId: otherStudent })).to.equal(before);
  });

  it('TC-S005 - entrega sem matricula nao persiste', async () => {
    const before = await Trabalho.countDocuments({ alunoId: ownStudent, disciplinaId: 'disciplina-historia' });
    expectError(await request(app).post(`/api/alunos/${ownStudent}/trabalhos`).set('Authorization', `Bearer ${studentToken}`)
      .send({ disciplinaId: 'disciplina-historia', titulo: 'Entrega indevida' }), 409, 'O aluno não está matriculado nesta disciplina.');
    expect(await Trabalho.countDocuments({ alunoId: ownStudent, disciplinaId: 'disciplina-historia' })).to.equal(before);
  });

  it('TC-S006 - proprio aluno e administrador podem consultar dados do aluno', async () => {
    const self = await request(app).get(`/api/alunos/${ownStudent}/trabalhos`).set('Authorization', `Bearer ${studentToken}`);
    const admin = await request(app).get('/api/admin/alunos').set('Authorization', `Bearer ${adminToken}`);
    expect(self.status).to.equal(200);
    expect(admin.status).to.equal(200);
  });

  for (const [label, makeToken] of [
    ['adulterado', () => `${adminToken}x`],
    ['expirado', () => jwt.sign({ sub: 'admin-principal', role: 'admin', nome: 'QA' }, JWT_SECRET, { algorithm: 'HS256', issuer: JWT_ISSUER, audience: JWT_AUDIENCE, expiresIn: -1 })],
    ['sem assinatura', () => `${adminToken.split('.')[0]}.${adminToken.split('.')[1]}.`],
  ]) {
    it(`TC-S007 - rejeita token ${label}`, async () => {
      const token = makeToken();
      expectError(await request(app).get('/api/admin/alunos').set('Authorization', `Bearer ${token}`), 401, 'Token de autenticação inválido ou expirado.');
    });
  }
});
