import { novoAluno } from '../factories/alunosFactory.js';
import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenAluno, comTokenDeAdmin, getToken } from '../helpers/auth.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';

describe('Resgista uma entrega de trabalho', () => {

    it.only('deve registrar a entrega quando o aluno for cadastrado e campos obrigatórios', async () => {
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization',  await comTokenDeAdmin())
            .send(novoAluno());
        const alunoId = cadastroAlunoResposta.body.id;
        const alunoEmail = cadastroAlunoResposta.body.email;
        const alunoSenha = cadastroAlunoResposta.body.senha;
        
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina());
        const disciplinaId = cadastroDisciplinaResposta.body.id;

        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId
            });

        const tituloTrabalho = `Lista de Exercícios ${Date.now()}`;
        const entregaTrabalhoResposta = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenAluno(alunoEmail, alunoSenha))
            .send({
                disciplinaId: disciplinaId,
                titulo: tituloTrabalho,
                descricao: 'Lista de exercícios de matemática'
        });
            
        expect(entregaTrabalhoResposta.status).to.equal(201);
        expect(entregaTrabalhoResposta.body.disciplinaId).to.equal(disciplinaId);
        expect(entregaTrabalhoResposta.body.titulo).to.equal(tituloTrabalho);
    
    });
});