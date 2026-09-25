import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';

const dataPath = path.join(process.cwd(), 'test', 'data', 'testdata.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const testData = JSON.parse(raw);

export async function login(app, { email, senha }) {
  const res = await request(app).post('/api/auth/login').send({ email, senha });
  return res;
}

export async function loginAsAdmin(app) {
  return login(app, testData.admin);
}

export default { login, loginAsAdmin };
