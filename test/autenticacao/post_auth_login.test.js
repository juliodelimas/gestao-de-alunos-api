import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import 'dotenv/config';

describe('POST /api/auth/login', () => {
  after(async () => {
    await mongoose.connection.close();
  });

  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {    
    const resposta = await request(process.env.BASE_URL)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
          email: process.env.ADMIN_EMAIL,
          senha: process.env.ADMIN_SENHA
      });

    expect(resposta.status).to.equal(200);
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await request(process.env.BASE_URL)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: process.env.ADMIN_EMAIL,
        senha: 'senha-incorreta' });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });

  it('deve retornar 200 e um token quando o aluno informar e-mail e senha corretos', async () => {    
    const resposta = await request(process.env.BASE_URL)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
          email: process.env.ALUNO_EMAIL,
          senha: process.env.ALUNO_SENHA
      });

    expect(resposta.status).to.equal(200);
  });
});
