import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAsAdmin } from './helpers/auth.js';
import { testCredentials } from './config.js';

describe('POST /api/auth/login', () => {
  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await loginAsAdmin(request(app));

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({ ...testCredentials.admin, senha: testCredentials.invalidPassword });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });
});
