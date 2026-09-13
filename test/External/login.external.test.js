import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';

describe('POST /api/auth/login', () => {
  after(async () => {
    await mongoose.connection.close();
  });

  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: 'admin@escola.com', 
        senha: 'admin123' 
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 400 quando não informar o campo email', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        senha: 'admin123'
      });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 400 quando não informar o campo senha', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: 'admin@escola.com'
      });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 400 quando não informar os campos email e senha', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
      });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 401 quando o email informado for inválido', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: 'adminescola.com', 
        senha: 'senha-incorreta' 
      });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: 'admin@escola.com', 
        senha: 'senha-incorreta' 
      });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });

  it('deve retornar 401 quando não informar o email', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: '', 
        senha: 'senha-incorreta' 
      });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 400 quando não informar a senha', async () => {
    const resposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
        email: 'admin@escola.com', 
        senha: '' 
      });

    expect(resposta.status).to.equal(400);
    expect(resposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

});
