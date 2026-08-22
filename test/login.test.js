import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Login', () => {
  it('deve retornar status 200 quando informo um usuário com credenciais válidas', async () => {
    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com',
        senha: 'admin123'
      });

    expect(loginResposta.status).to.equal(200);
  });
});
