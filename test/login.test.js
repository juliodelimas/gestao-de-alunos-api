import request from 'supertest';
import app from '../src/app.js';
import { expect } from 'chai';

describe('Suite de Testes de Login:', () => {
    it('CT01: Deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 'email': 'admin@escola.com', 'senha': 'admin123'});

    expect(loginResposta.status).to.equal(200);

    });
});