// Observations, not acceptance tests: no invented business limits or SLA.
import request from 'supertest';
import { performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import Aluno from '../src/models/aluno.model.js';
import { testCredentials } from './config.js';
import { createFixtureScope } from './helpers/fixtures.js';
import { expectLogin, expectError } from './helpers/assertions.js';

const scope = createFixtureScope();
const app = createApp({ protection: null, logging: false });
const guardedApp = createApp({ logging: false });
const rows = [];
const originalLog = console.error;
let internalErrors = 0;
console.error = () => { internalErrors += 1; }; // Never copy raw exception payloads to artifacts.
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const measure = async (label, send) => {
  const start = performance.now();
  const response = await send();
  rows.push({ label, status: response.status, durationMs: +(performance.now() - start).toFixed(2),
    contentType: response.headers['content-type'], fields: Object.keys(response.body || {}),
    tokenReturned: typeof response.body?.token === 'string', role: response.body?.usuario?.role });
  return response;
};
const login = (payload) => request(app).post('/api/auth/login').send(payload);
try {
  expectLogin(await login(testCredentials.admin), { email: testCredentials.admin.email, role: 'admin' });
  for (const field of ['email', 'senha']) {
    for (const [label, value] of [
      ['numero', 123], ['booleano', true], ['array', []], ['objeto', {}],
      ['operador MongoDB', { $ne: null }], ['um caractere', 'x'],
      ['256 caracteres', 'x'.repeat(256)], ['4096 caracteres', 'x'.repeat(4096)],
    ]) {
      await measure(`${field}: ${label}`, () => login({ ...testCredentials.admin, [field]: value }));
    }
  }
  for (const [label, email] of [
    ['email com espacos', ` ${testCredentials.admin.email} `],
    ['email maiusculo', testCredentials.admin.email.toUpperCase()],
    ['email Unicode inexistente', 'qa-á漢@example-test.invalid'],
    ['email formato invalido', 'qa-sem-arroba'],
  ]) await measure(label, () => login({ ...testCredentials.admin, email }));
  await measure('JSON malformado', () => request(app).post('/api/auth/login')
    .set('Content-Type', 'application/json').send('{"email":'));
  await measure('text/plain', () => request(app).post('/api/auth/login')
    .set('Content-Type', 'text/plain').send(JSON.stringify(testCredentials.admin)));
  await measure('sem content type', () => request(app).post('/api/auth/login')
    .send(JSON.stringify(testCredentials.admin)).unset('Content-Type'));
  await measure('payload acima de 100 KiB', () => login({ ...testCredentials.admin, extra: 'x'.repeat(110 * 1024) }));

  // Collision observations use exclusively owned accounts and distinct passwords.
  const admin = await scope.admin();
  const collisionPassword = randomUUID();
  const student = await scope.aluno({ senha: collisionPassword });
  // Legacy collision only: deliberately bypass write policy in an owned fixture.
  await Aluno.collection.updateOne({ _id: student.id }, { $set: { email: admin.email } });
  await measure('colisao: credencial admin', () => login({ email: admin.email, senha: testCredentials.admin.senha }));
  await measure('colisao: credencial aluno', () => login({ email: admin.email, senha: collisionPassword }));

  const samples = { valid: [], wrongPassword: [], unknownEmail: [] };
  const inputs = {
    valid: testCredentials.admin,
    wrongPassword: { ...testCredentials.admin, senha: testCredentials.invalidPassword },
    unknownEmail: { email: testCredentials.unknownEmail, senha: testCredentials.invalidPassword },
  };
  for (let round = 0; round < 6; round += 1) {
    // Rotate ordering to reduce systematic warm-up/order bias; not a statistical proof.
    const keys = Object.keys(inputs);
    for (const key of [...keys.slice(round % 3), ...keys.slice(0, round % 3)]) {
      const response = await measure(`baseline ${key} ${round + 1}`, () => login(inputs[key]));
      if (key === 'valid') expectLogin(response, { email: testCredentials.admin.email });
      else expectError(response, 401, 'E-mail ou senha inválidos.');
      samples[key].push(rows.at(-1).durationMs);
    }
  }
  const percentiles = Object.fromEntries(Object.entries(samples).map(([key, values]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return [key, { count: values.length, medianMs: (sorted[2] + sorted[3]) / 2,
      p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1] }];
  }));
  const burstStart = performance.now();
  const burst = await Promise.all(Array.from({ length: 12 }, () =>
    request(guardedApp).post('/api/auth/login').send(inputs.wrongPassword)));
  const burstMs = performance.now() - burstStart;
  const tokenResponse = await login(testCredentials.admin);
  expectLogin(tokenResponse, { email: testCredentials.admin.email });
  const reuse = [];
  for (let i = 0; i < 2; i += 1) {
    const result = await measure(`reutilizacao token ${i + 1}`, () => request(app).get('/api/admin/alunos')
      .set('Authorization', `Bearer ${tokenResponse.body.token}`));
    reuse.push(result.status);
  }
  const report = {
    timestamp: new Date().toISOString(), mode: 'exploracao-sem-veredito-de-SLA',
    environment: 'SuperTest in-process; MongoDB exclusivo de teste; caracterizacao sem limitadores, rajada com limitadores',
    rows, percentiles, internalErrors,
    burst: { requests: 12, concurrency: 12, durationMs: +burstMs.toFixed(2),
      requestsPerSecond: +(12 / (burstMs / 1000)).toFixed(2), statuses: burst.map((result) => result.status) },
    reuse, limitations: 'Amostra pequena/local; sem prova de seguranca temporal, capacidade ou ausencia de rate limiting em outros volumes/camadas.',
  };
  const file = `docs/runs/${stamp}-exploration.json`;
  await writeFile(file, JSON.stringify(report, null, 2) + '\n');
  console.log(`Exploracao salva em ${file}`);
} finally {
  console.error = originalLog;
  try { await scope.cleanup(); } finally { await mongoose.disconnect(); }
}
