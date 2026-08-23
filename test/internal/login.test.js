import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import authService from '../../src/services/auth.service.js';

describe('Login', () => {
    it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
        const authServiceMock = stub(authService, 'login');
        authServiceMock.throws(new Error('Erro catastrófico!'));

        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin123'
            });
        
        expect(loginResposta.status).to.equal(500);
        expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

        restore();
    });

    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin123'
            });
        
        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: ''
            });
        
        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });

    it('deve retornar 401 quando o usuário estiver correto mas a senha for incorreta', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin1234'
            });
        
        expect(loginResposta.status).to.equal(401);
    });
});