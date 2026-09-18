import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import app, { createApp } from '../src/app.js';
import { createLoginProtection } from '../src/services/loginProtection.js';
import Aluno from '../src/models/aluno.model.js';
import Administrador from '../src/models/admin.model.js';
import Reservation from '../src/models/emailReservation.model.js';
import { JWT_SECRET } from '../src/config/jwt.js';
import { createFixtureScope } from './helpers/fixtures.js';
import { expectError, expectLogin } from './helpers/assertions.js';
import { testCredentials } from './config.js';

const invalid = 'E-mail ou senha inválidos.';
const limited = 'Muitas tentativas. Tente novamente mais tarde.';
const signOptions = { algorithm: 'HS256', issuer: 'gestao-de-alunos-api', audience: 'gestao-de-alunos-client', expiresIn: '8h' };
const post = (target, credentials) => request(target).post('/api/auth/login').send(credentials);

describe('EP-001 - politicas aprovadas', () => {
  let scope;
  beforeEach(() => { scope = createFixtureScope(); });
  afterEach(async () => { await scope.cleanup(); });

  it('TC-B009 - normaliza email no cadastro, atualizacao e login', async () => {
    const admin = await post(app, testCredentials.admin);
    expectLogin(admin, { role: 'admin' });
    const payload = scope.alunoPayload();
    const created = await request(app).post('/api/admin/alunos')
      .set('Authorization', `Bearer ${admin.body.token}`)
      .send({ ...payload, email: ` ${payload.email.toUpperCase()} ` });
    expect(created.status).to.equal(201);
    expect(created.body.email).to.equal(payload.email);
    expectLogin(await post(app, { email: ` ${payload.email.toUpperCase()} `, senha: payload.senha }),
      { id: created.body.id, email: payload.email });
    const next = scope.alunoPayload().email;
    const updated = await request(app).put(`/api/admin/alunos/${created.body.id}`)
      .set('Authorization', `Bearer ${admin.body.token}`).send({ email: ` ${next.toUpperCase()} ` });
    expect(updated.status).to.equal(200);
    expect(updated.body.email).to.equal(next);
    expect(await Reservation.findById(payload.email)).to.equal(null);
    expectLogin(await post(app, { email: next, senha: payload.senha }), { id: created.body.id, email: next });
    expectError(await post(app, { email: payload.email, senha: payload.senha }), 401, invalid);
  });

  const maximum = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`;
  for (const [label, email, accepted] of [
    ['minimo do subconjunto', 'a@b.c', true], ['254 caracteres', maximum, true],
    ['255 caracteres', `${maximum}d`, false], ['local 64', `${'a'.repeat(64)}@example.invalid`, true],
    ['local 65', `${'a'.repeat(65)}@example.invalid`, false],
    ['rotulo 64', `a@${'b'.repeat(64)}.invalid`, false],
    ['espaco interno', 'a b@example.invalid', false], ['Unicode', 'á@example.invalid', false],
    ['sem arroba', 'invalid', false], ['dois arrobas', 'a@b@example.invalid', false],
    ['ponto duplicado', 'a..b@example.invalid', false], ['dominio com hifen inicial', 'a@-b.invalid', false],
    ['entre aspas', '"a"@example.invalid', false], ['controle interno', 'a\nb@example.invalid', false],
  ]) {
    it(`TC-B009 - formato email: ${label}`, async () => {
      const response = await post(app, { email, senha: testCredentials.invalidPassword });
      expectError(response, accepted ? 401 : 400, accepted ? invalid : 'E-mail inválido.');
    });
  }
  it('TC-B009 - nao remove pontos ou tag do email', async () => {
    const account = await scope.aluno({ email: `qa.a+${randomUUID()}@example-test.invalid` });
    expectLogin(await post(app, { email: account.email, senha: testCredentials.newStudentPassword }), { id: account.id });
    expectError(await post(app, { email: account.email.replace('+', ''), senha: testCredentials.newStudentPassword }), 401, invalid);
    expectError(await post(app, { email: account.email.replace('qa.a', 'qaa'), senha: testCredentials.newStudentPassword }), 401, invalid);
  });
  for (const [label, senha] of [['1 byte', 'x'], ['72 bytes ASCII', 'x'.repeat(72)], ['72 bytes Unicode', 'é'.repeat(36)]]) {
    it(`TC-B009 - senha ${label} preservada`, async () => {
      const account = await scope.aluno({ senha });
      expectLogin(await post(app, { email: account.email, senha }), { id: account.id });
    });
  }
  for (const [label, senha] of [['73 bytes', 'x'.repeat(73)], ['74 bytes Unicode', 'é'.repeat(37)]]) {
    it(`TC-B009 - rejeita senha ${label} sem truncar`, async () => {
      expectError(await post(app, { ...testCredentials.admin, senha }), 400, 'A senha deve conter de 1 a 72 bytes UTF-8.');
    });
  }
  it('TC-B009 - senha preserva espacos e caixa', async () => {
    const senha = ` ${testCredentials.newStudentPassword} `;
    const account = await scope.aluno({ senha });
    expectLogin(await post(app, { email: account.email, senha }), { id: account.id });
    expectError(await post(app, { email: account.email, senha: senha.trim() }), 401, invalid);
    expectError(await post(app, { email: account.email, senha: senha.toUpperCase() }), 401, invalid);
  });
  for (const contentType of ['text/plain', 'application/x-www-form-urlencoded', null]) {
    it(`TC-B015 - rejeita media type ${contentType ?? 'ausente'}`, async () => {
      const call = request(app).post('/api/auth/login').send(JSON.stringify(testCredentials.admin));
      if (contentType) call.set('Content-Type', contentType); else call.unset('Content-Type');
      expectError(await call, 415, 'Use Content-Type application/json.');
    });
  }
  it('TC-B015 - aceita application/json com charset', async () => {
    expectLogin(await request(app).post('/api/auth/login').set('Content-Type', 'application/json; charset=utf-8')
      .send(testCredentials.admin), { role: 'admin' });
  });

  it('TC-B016 - concorrencia de admin/aluno reserva apenas um email', async () => {
    const email = scope.alunoPayload().email;
    const results = await Promise.allSettled([scope.admin({ email }), scope.aluno({ email })]);
    expect(results.filter(result => result.status === 'fulfilled')).to.have.length(1);
    const failure = results.find(result => result.status === 'rejected');
    expect(failure.reason.statusCode).to.equal(409);
    expect(await Administrador.countDocuments({ email }) + await Aluno.countDocuments({ email })).to.equal(1);
    expect(await Reservation.countDocuments({ _id: email })).to.equal(1);
  });
  it('TC-B016 - cadastro e atualizacao rejeitam email administrativo', async () => {
    const admin = await post(app, testCredentials.admin);
    expectLogin(admin, { role: 'admin' });
    const account = await scope.aluno();
    const collision = await scope.admin();
    const before = await Aluno.findById(account.id).lean();
    const created = await request(app).post('/api/admin/alunos')
      .set('Authorization', `Bearer ${admin.body.token}`)
      .send({ ...scope.alunoPayload(), email: ` ${collision.email.toUpperCase()} ` });
    expectError(created, 409, 'E-mail já utilizado por outro usuário.');
    const updated = await request(app).put(`/api/admin/alunos/${account.id}`)
      .set('Authorization', `Bearer ${admin.body.token}`).send({ email: collision.email });
    expectError(updated, 409, 'E-mail já utilizado por outro usuário.');
    expect(await Aluno.findById(account.id).lean()).to.deep.equal(before);
  });
  it('TC-B016 - falha de gravacao libera reserva de email', async () => {
    const first = await scope.aluno();
    const payload = scope.alunoPayload({ matricula: first.matricula });
    let failure;
    try { await scope.aluno(payload); } catch (error) { failure = error; }
    expect(failure?.statusCode).to.equal(409);
    expect(await Reservation.findById(payload.email)).to.equal(null);
    const admin = await scope.admin({ email: payload.email });
    expect(admin.email).to.equal(payload.email);
  });
  it('TC-B016 - colisao legada recusa ambos e nao modifica registros', async () => {
    const admin = await scope.admin();
    const student = await scope.aluno();
    // Bypass current write policy ONLY to model legacy data; cleanup owns both IDs.
    await Aluno.collection.updateOne({ _id: student.id }, { $set: { email: ` ${admin.email.toUpperCase()} ` } });
    for (const senha of [testCredentials.admin.senha, testCredentials.newStudentPassword]) {
      expectError(await post(app, { email: admin.email, senha }), 401, invalid);
    }
    expect((await Aluno.findById(student.id)).email).to.equal(` ${admin.email.toUpperCase()} `);
  });
  it('TC-B016 - email legado com espacos autentica sem migracao automatica', async () => {
    const student = await scope.aluno();
    await Aluno.collection.updateOne({ _id: student.id }, { $set: { email: ` ${student.email.toUpperCase()} ` } });
    expectLogin(await post(app, { email: student.email, senha: testCredentials.newStudentPassword }), { id: student.id, email: student.email });
    expect((await Aluno.findById(student.id)).email).to.equal(` ${student.email.toUpperCase()} `);
  });
  it('TC-B017 - conta inexistente compara contra hash ficticio de mesmo custo', async () => {
    const original = bcrypt.compareSync;
    const hashes = [];
    try {
      bcrypt.compareSync = (password, hash) => { hashes.push(hash); return original(password, hash); };
      expectError(await post(app, { ...testCredentials.admin, senha: testCredentials.invalidPassword }), 401, invalid);
      expectError(await post(app, { email: `qa-${randomUUID()}@example-test.invalid`, senha: testCredentials.invalidPassword }), 401, invalid);
      expect(hashes).to.have.length(2);
      expect(hashes[0] === hashes[1], 'hash ficticio distinto').to.equal(false);
      expect(bcrypt.getRounds(hashes[0])).to.equal(bcrypt.getRounds(hashes[1]));
    } finally { bcrypt.compareSync = original; }
  });
  it('TC-B016 - normalizar email legado mantem reserva canonica', async () => {
    const student = await scope.aluno();
    await Aluno.collection.updateOne({ _id: student.id }, { $set: { email: ` ${student.email.toUpperCase()} ` } });
    const legacy = await Aluno.findById(student.id);
    legacy.email = student.email;
    await legacy.save();
    expect((await Reservation.findById(student.email)).owner).to.equal(`Aluno:${student.id}`);
  });

  for (const [label, overrides] of [
    ['issuer incorreto', { issuer: 'outro' }], ['audience incorreta', { audience: 'outro' }],
    ['algoritmo diferente', { algorithm: 'HS384' }], ['sem issuer/audience', null],
  ]) {
    it(`TC-B018 - rejeita JWT ${label}`, async () => {
      const options = overrides === null ? { expiresIn: '8h' } : { ...signOptions, ...overrides };
      const token = jwt.sign({ sub: 'admin-principal', role: 'admin', nome: 'QA' }, JWT_SECRET, options);
      expectError(await request(app).get('/api/admin/alunos').set('Authorization', `Bearer ${token}`),
        401, 'Token de autenticação inválido ou expirado.');
    });
  }
  it('TC-B018 - token valido reutilizavel e expira em oito horas', async () => {
    const response = await post(app, testCredentials.admin);
    const claims = expectLogin(response, { role: 'admin' });
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await request(app).get('/api/admin/alunos').set('Authorization', `Bearer ${response.body.token}`);
      expect(result.status).to.equal(200);
      expect(result.body).to.be.an('array');
    }
    expect(() => jwt.verify(response.body.token, JWT_SECRET, { ...signOptions, clockTimestamp: claims.exp }))
      .to.throw(jwt.TokenExpiredError);
  });
});

describe('TC-B010 - limitacao com relogio controlado', () => {
  let time, target;
  beforeEach(() => {
    time = 1_000_000;
    target = createApp({ protection: createLoginProtection({ now: () => time }), logging: false });
  });
  const wrong = () => ({ ...testCredentials.admin, senha: testCredentials.invalidPassword });
  it('quinta falha e 401, sexta e 429, bloqueia senha correta e libera no limite', async () => {
    for (let i = 0; i < 5; i += 1) expectError(await post(target, wrong()), 401, invalid);
    const blocked = await post(target, testCredentials.admin);
    expectError(blocked, 429, limited);
    expect(blocked.headers['retry-after']).to.equal('900');
    time += 899_999;
    const almost = await post(target, testCredentials.admin);
    expectError(almost, 429, limited);
    expect(almost.headers['retry-after']).to.equal('1');
    time += 1;
    expectLogin(await post(target, testCredentials.admin), { role: 'admin' });
  });
  it('sucesso antes do bloqueio zera falhas', async () => {
    for (let i = 0; i < 4; i += 1) expectError(await post(target, wrong()), 401, invalid);
    expectLogin(await post(target, testCredentials.admin), { role: 'admin' });
    for (let i = 0; i < 5; i += 1) expectError(await post(target, wrong()), 401, invalid);
    expectError(await post(target, wrong()), 429, limited);
  });
  it('conta inexistente e variantes canonicas compartilham bloqueio', async () => {
    const credentials = { email: `qa-${randomUUID()}@example-test.invalid`, senha: testCredentials.invalidPassword };
    for (let i = 0; i < 5; i += 1) {
      expectError(await post(target, { ...credentials, email: i % 2 ? ` ${credentials.email.toUpperCase()} ` : credentials.email }), 401, invalid);
    }
    expectError(await post(target, credentials), 429, limited);
    expectLogin(await post(target, testCredentials.student), { role: 'aluno' });
  });
  it('seis falhas simultaneas nao ultrapassam cinco tentativas', async () => {
    const responses = await Promise.all(Array.from({ length: 6 }, () => post(target, wrong())));
    expect(responses.map(response => response.status).sort()).to.deep.equal([401, 401, 401, 401, 401, 429]);
    for (const response of responses) expectError(response, response.status, response.status === 429 ? limited : invalid);
  });
  it('IP permite 30, rejeita 31, nao confia em X-Forwarded-For e expira apos um minuto', async () => {
    for (let i = 0; i < 30; i += 1) {
      expectError(await request(target).post('/api/auth/login').set('X-Forwarded-For', `192.0.2.${i + 1}`).send({}),
        400, 'Os campos "email" e "senha" são obrigatórios.');
    }
    const blocked = await post(target, {});
    expectError(blocked, 429, limited);
    expect(blocked.headers['retry-after']).to.equal('60');
    time += 59_999;
    expectError(await post(target, {}), 429, limited);
    time += 1;
    expectError(await post(target, {}), 400, 'Os campos "email" e "senha" são obrigatórios.');
  });
  it('contador IP atomico sob 31 requisicoes simultaneas', async () => {
    const responses = await Promise.all(Array.from({ length: 31 }, () => post(target, {})));
    expect(responses.filter(response => response.status === 400)).to.have.length(30);
    expect(responses.filter(response => response.status === 429)).to.have.length(1);
  });
});
