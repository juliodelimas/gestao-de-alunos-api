import request from 'supertest';
import { performance } from 'node:perf_hooks';
import os from 'node:os';
import { writeFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { createApp } from '../src/app.js';
import { testCredentials } from './config.js';
import { expectLogin } from './helpers/assertions.js';

// Dedicated local capacity sample. Limiters are tested separately in policies.test.js.
// There is no HTTP header/env bypass for the production app.
const app = createApp({ protection: null, logging: false });
const durations = [], statuses = [];
let assertionFailures = 0;
const login = () => request(app).post('/api/auth/login').send(testCredentials.admin);
try {
  for (let warmup = 0; warmup < 20; warmup += 1) {
    expectLogin(await login(), { email: testCredentials.admin.email, role: 'admin' });
  }
  const started = performance.now();
  await Promise.all(Array.from({ length: 5 }, async () => {
    for (let sample = 0; sample < 20; sample += 1) {
      const before = performance.now();
      const response = await login();
      durations.push(performance.now() - before);
      statuses.push(response.status);
      try { expectLogin(response, { email: testCredentials.admin.email, role: 'admin' }); }
      catch { assertionFailures += 1; }
    }
  }));
  const elapsed = performance.now() - started;
  durations.sort((a, b) => a - b);
  const p95Ms = durations[Math.ceil(durations.length * 0.95) - 1];
  const throughput = durations.length / (elapsed / 1000);
  const serverErrors = statuses.filter(status => status >= 500).length;
  const passed = p95Ms <= 1000 && throughput >= 5 && serverErrors === 0 && assertionFailures === 0;
  const report = {
    timestamp: new Date().toISOString(), environment: { node: process.version, os: os.platform(),
      cpu: os.cpus()[0].model, logicalCpus: os.cpus().length, memoryGB: +(os.totalmem() / 1024 ** 3).toFixed(1),
      database: 'MongoDB local exclusivo -test', execution: 'SuperTest in-process', limiters: 'isolados nesta medicao' },
    warmup: 20, requests: durations.length, concurrency: 5, elapsedMs: +elapsed.toFixed(2),
    p95Ms: +p95Ms.toFixed(2), requestsPerSecond: +throughput.toFixed(2), serverErrors, assertionFailures,
    statuses: Object.fromEntries([...new Set(statuses)].map(status => [status, statuses.filter(value => value === status).length])),
    thresholds: { maxP95Ms: 1000, minRequestsPerSecond: 5, maxServerErrors: 0 }, passed,
    limitation: 'Meta local aprovada, nao SLA de producao nem gate de CI compartilhado.',
  };
  const file = `docs/runs/${report.timestamp.replace(/[:.]/g, '-')}-performance.json`;
  await writeFile(file, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ file, ...report }));
  if (!passed) process.exitCode = 1;
} finally { await mongoose.disconnect(); }
