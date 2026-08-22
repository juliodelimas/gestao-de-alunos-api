import request from 'supertest'; // O request é a representação do Supertest
import app from '../src/app.js';
import { expect } from 'chai';

describe('Testes de Login:', () => {
    it('CT01: Deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request(app) // Aqui voce aponta a API
            .post('/api/auth/login') // Aqui voce aponta a rota
            .set('Content-Type', 'application/json') // Aqui voce aponta o cabeçalho
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin123'
            }); // No send é onde colocamos o body

    expect(loginResposta.status).to.equal(200); // Aqui é a resposta que o teste espera
    });

    it('CT02: Deve retornar 400 quando o Email não for informado', async () => {
        const loginResposta = await request(app)
        .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                senha: 'admin123'
            });

    expect(loginResposta.status).to.equal(400);
    expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');

    })

    it('CT03: Deve retornar 400 quando a Senha não for informada', async () => {
        const loginResposta = await request(app)
        .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com'
            });

    expect(loginResposta.status).to.equal(400);
    expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    })

    it('CT04: Deve retornar 401 quando o Email for incorreto', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escolaaaa.com', 
                senha: 'admin123'
            });

    expect(loginResposta.status).to.equal(401);
    expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');
    });

        it('CT05: Deve retornar 401 quando a Senha for incorreta', async () => {
        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: 'admin@escola.com', 
                senha: 'admin1'
            });

    expect(loginResposta.status).to.equal(401);
    expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.');
    });
});