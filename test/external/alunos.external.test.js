import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';


describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Souza', 
                email: 'ana.souza@example.com', 
                matricula: '2024001',
                senha: '123456'
            });

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Julio de Lima',
                email: 'julio.lima@example.com',
                matricula: '2026-0001',
                senha: '123456'
            });

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Julio de Lima');
        expect(cadastroAlunoResposta.body.email).to.equal('julio.lima@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-0001');

    });
});