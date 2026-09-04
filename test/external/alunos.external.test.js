import request from 'supertest';
import { expect } from 'chai';

describe('Testes de Cadastro de Aluno', () => {
    it('CT01: Deve cadastrar um aluno quando informar dados válidos', async () => {
        // Obter o Token:
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123' 
            })
        
        const token = loginResposta.body.token;

        // Cadastrar o Aluno:
        const cadastroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: 'Jasminy Proença',
            email: 'jasminy.proenca@example.com',
            matricula: '2026-0001',
            senha: '123456'
        });

        // Validar que o Aluno foi Cadastrado:
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Jasminy Proença');
        expect(cadastroAlunoResposta.body.email).to.equal('jasminy.proenca@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-0001');

    });

});