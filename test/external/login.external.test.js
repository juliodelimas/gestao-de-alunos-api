import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';

describe('Testes de Login External', () => {
    it('CT01: Deve retornar 200 e um token para credenciais válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123' 
            });


        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });

    it('should return 400 without password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com'
            });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error', 'Os campos "email" e "senha" são obrigatórios.');

    });

    it('should return 401 for invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'wrongpassword'
            });

        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('error', 'E-mail ou senha inválidos.');

    });

});