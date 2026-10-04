import { novoAluno } from '../factories/alunosFactory.js';
import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';

describe('Login administrador', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                   email: process.env.ADMIN_EMAIL, 
                   senha: process.env.ADMIN_SENHA
            });
        
        expect(loginResposta.status).to.equal(200);
    });

    it('deve retornar 400 quando a senha não for informada', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: process.env.ADMIN_EMAIL,
                senha: ''
            });
        
        expect(loginResposta.status).to.equal(400);
        expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
    });

    it('deve retornar 401 quando o usuário estiver correto mas a senha for incorreta', async () => {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: process.env.ADMIN_EMAIL,
                senha: 'admin1234'
            });
        
        expect(loginResposta.status).to.equal(401);
    });
});

describe('Login aluno', () => {
    it('deve retornar 200 quando o aluno cadastrado e senha forem corretos', async () => {
        const alunoCadastradoEsperado = novoAluno();
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                nome: alunoCadastradoEsperado.nome, 
                email: alunoCadastradoEsperado.email, 
                matricula: alunoCadastradoEsperado.matricula,
                senha: alunoCadastradoEsperado.senha
            });
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                   email: alunoCadastradoEsperado.email,
                   senha: alunoCadastradoEsperado.senha
            });
        
        expect(loginResposta.status).to.equal(200);
    });
});