import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import Administrador from '../src/models/admin.model.js';
import Aluno from '../src/models/aluno.model.js';
import { loginAsAdmin, loginAsUser } from './helpers/auth.js';
import { expectError, expectLogin } from './helpers/assertions.js';
import { testCredentials } from './config.js';

const invalid = 'E-mail ou senha inválidos.';
const internal = 'Erro interno do servidor.';
const post = (credentials) => request(app).post('/api/auth/login').send(credentials);

describe('EP-001 - POST /api/auth/login', () => {
  it('TC-B001 - login valido de administrador com identidade JWT', async () => {
    expectLogin(await loginAsAdmin(request(app)), { email: testCredentials.admin.email, role: 'admin' });
  });

  it('TC-B002 - login valido de aluno com identidade JWT', async () => {
    expectLogin(await loginAsUser(request(app), testCredentials.student), { email: testCredentials.student.email, role: 'aluno' });
  });

  for (const [label, payload] of [
    ['ambos ausentes', {}], ['senha ausente', { email: testCredentials.admin.email }],
    ['email ausente', { senha: testCredentials.admin.senha }],
  ]) {
    it(`TC-B003 - ${label}`, async () => {
      expectError(await post(payload), 400, 'Os campos "email" e "senha" são obrigatórios.');
    });
  }

  for (const [label, credentials] of [
    ['email inexistente', { email: testCredentials.unknownEmail, senha: testCredentials.admin.senha }],
    ['senha admin incorreta', { ...testCredentials.admin, senha: testCredentials.invalidPassword }],
    ['senha aluno incorreta', { ...testCredentials.student, senha: testCredentials.invalidPassword }],
    ['ambos incorretos', { email: testCredentials.unknownEmail, senha: testCredentials.invalidPassword }],
  ]) {
    it(`TC-B004 - ${label} sem identidade nem token na resposta`, async () => {
      const response = await post(credentials);
      expectError(response, 401, invalid);
      expect(response.body).not.to.have.any.keys('token', 'usuario');
    });
  }

  for (const [label, credentials] of [['administrador', testCredentials.admin], ['aluno', testCredentials.student]]) {
    it(`TC-B005 - nao expoe senha/hash no corpo, headers ou JWT de ${label}`, async () => {
      const response = await post(credentials);
      expectLogin(response, { role: label === 'administrador' ? 'admin' : 'aluno' });
      const serialized = JSON.stringify({ body: response.body, headers: response.headers, token: jwt.decode(response.body.token) });
      expect(serialized).not.to.include(credentials.senha);
      expect(serialized).not.to.match(/\$2[aby]\$/);
      expect(response.body.usuario).not.to.have.any.keys('senha', 'password');
    });
  }

  it('TC-B006 - contrato, assinatura, validade e claims coerentes', async () => {
    expectLogin(await loginAsAdmin(request(app)), { email: testCredentials.admin.email, role: 'admin' });
  });

  async function expectInternalFault(replace) {
    const restore = replace();
    const originalError = console.error;
    try {
      console.error = () => {};
      expectError(await post(testCredentials.admin), 500, internal);
    } finally {
      console.error = originalError;
      restore();
    }
    expectLogin(await loginAsAdmin(request(app)), { role: 'admin' });
  }

  it('TC-B007 - falha de consulta admin retorna erro sanitizado e recupera', async () => {
    const original = Administrador.findOne;
    await expectInternalFault(() => { Administrador.findOne = async () => { throw new Error('database password leaked'); }; return () => { Administrador.findOne = original; }; });
  });

  it('TC-B007 - falha de consulta aluno retorna erro sanitizado e recupera', async () => {
    const original = Aluno.findOne;
    await expectInternalFault(() => { Aluno.findOne = async () => { throw new Error('database password leaked'); }; return () => { Aluno.findOne = original; }; });
  });

  it('TC-B007 - falha de bcrypt retorna erro sanitizado e recupera', async () => {
    const original = bcrypt.compareSync;
    await expectInternalFault(() => { bcrypt.compareSync = () => { throw new Error('bcrypt internals'); }; return () => { bcrypt.compareSync = original; }; });
  });

  it('TC-B007 - falha de assinatura JWT retorna erro sanitizado e recupera', async () => {
    const original = jwt.sign;
    await expectInternalFault(() => { jwt.sign = () => { throw new Error('signing key failure'); }; return () => { jwt.sign = original; }; });
  });

  for (const [label, payload] of [
    ['email nulo', { email: null, senha: testCredentials.admin.senha }],
    ['email vazio', { email: '', senha: testCredentials.admin.senha }],
    ['senha nulo', { email: testCredentials.admin.email, senha: null }],
    ['senha vazio', { email: testCredentials.admin.email, senha: '' }],
  ]) {
    it(`TC-B008 - ${label} e obrigatorio`, async () => {
      expectError(await post(payload), 400, 'Os campos "email" e "senha" são obrigatórios.');
    });
  }

  it('TC-B008 - campos extras nao alteram identidade nem perfil', async () => {
    const response = await post({ ...testCredentials.admin, role: 'aluno', id: 'forjado', extra: true });
    expectLogin(response, { email: testCredentials.admin.email, role: 'admin' });
  });

  it('TC-B010 - concorrencia preserva identidade e rejeicao de credenciais', async () => {
    const attempts = Array.from({ length: 12 }, (_, index) => index % 2
      ? { credentials: testCredentials.admin, role: 'admin' }
      : { credentials: testCredentials.student, role: 'aluno' });
    const responses = await Promise.all(attempts.map(({ credentials }) => post(credentials)));
    for (const [index, response] of responses.entries()) expectLogin(response, { role: attempts[index].role });
  });

  it('TC-B011 - erros de credenciais tem mesmo corpo e headers estaveis', async () => {
    const responses = await Promise.all([
      post({ email: testCredentials.unknownEmail, senha: testCredentials.invalidPassword }),
      post({ ...testCredentials.admin, senha: testCredentials.invalidPassword }),
      post({ ...testCredentials.student, senha: testCredentials.invalidPassword }),
      post({ email: testCredentials.unknownEmail, senha: testCredentials.admin.senha }),
    ]);
    for (const response of responses) expectError(response, 401, invalid);
    expect(responses.map((response) => response.body)).to.deep.equal(Array(4).fill({ error: invalid }));
    expect(new Set(responses.map((response) => response.headers['content-type']))).to.have.length(1);
  });

  for (const [field, value, type] of [
    ['email', 7, 'numero'], ['email', true, 'booleano'], ['email', [], 'array'], ['email', {}, 'objeto'], ['email', { $ne: null }, 'operador de consulta'],
    ['senha', 7, 'numero'], ['senha', true, 'booleano'], ['senha', [], 'array'], ['senha', {}, 'objeto'], ['senha', { $ne: null }, 'operador de consulta'],
  ]) {
    it(`TC-B012 - rejeita ${field} com tipo ${type}`, async () => {
      expectError(await post({ ...testCredentials.admin, [field]: value }), 400, 'Os campos "email" e "senha" devem ser strings.');
    });
  }

  it('TC-B013 - JSON malformado retorna erro de cliente sanitizado', async () => {
    const response = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{"email":');
    expectError(response, 400, 'JSON inválido.');
  });

  it('TC-B014 - payload acima do limite do parser retorna 413', async () => {
    const response = await request(app).post('/api/auth/login').set('Content-Type', 'application/json')
      .send(JSON.stringify({ email: testCredentials.admin.email, senha: 'x'.repeat(110 * 1024) }));
    expectError(response, 413, 'Corpo da requisição muito grande.');
  });
});
