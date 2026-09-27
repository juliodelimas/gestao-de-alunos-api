import  request from 'supertest';
import app from '../../src/app.js';
import {expect} from 'chai';
import { api } from '../helpers/api.js';
import 'dotenv/config';

describe('login external', () => {
    it('should return 200 and a token for valid credentials', async () => {  
        const response = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            });
            

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });

    it('should return 400 without password', async () => {
        const response = await api()
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
