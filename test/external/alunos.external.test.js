import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';


describe('Cadastro de alunos', () => {

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const alunoEsperado = novoAluno();
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization',  await comTokenDeAdmin())
            .send(alunoEsperado);

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(alunoEsperado.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(alunoEsperado.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(alunoEsperado.matricula);

    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
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

    
});