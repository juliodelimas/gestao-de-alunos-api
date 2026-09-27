import  request from 'supertest';
import app from '../../src/app.js';
import {expect} from 'chai';
import * as sinon from 'sinon';
import authService  from '../../src/services/auth.service.js'; 

describe('Login internal', () => {
    it('Deve retornar 200 e um token para credenciais válidas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123' 
            });
            
        expect(response.status).to.equal(200);     
        expect(response.body).to.have.property('token');
        expect(response.headers['content-type']).to.include('application/json');
    });

    it('Deve retornar 400 sem senha', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com'
            });

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error', 'Os campos "email" e "senha" são obrigatórios.');
       
    });

    it('Deve retornar 401 para credenciais inválidas', async () => {
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


/*
     it('should return 500 server error for database issues', async () => {

        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Database connection error'));

        const response = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        
        expect(response.status).to.equal(500);
        sinon.restore();
       
    });*/

});
