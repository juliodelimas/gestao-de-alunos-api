import  request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { getTokenAdmin } from '../helpers/auth.js';


describe('Alunos', () => {
    let token;
    let idAluno;

    beforeEach(async () => {        
        token = await getToken('admin@escola.com', 'admin123');        
    });

    it('Deve cadastrar um novo aluno', async () => {  
        
        const alunoNovo = novoAluno(); // Gera um novo aluno com dados aleatórios

        const respAlunoNovo = await request("http://localhost:3000")
            .post('/api/admin/alunos')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send(alunoNovo);      
            
            
        
        expect(respAlunoNovo.status).to.equal(201);
        expect(respAlunoNovo.body.nome).to.equal(alunoNovo.nome);
        expect(respAlunoNovo.body.email).to.equal(alunoNovo.email);

        idAluno = respAlunoNovo.body.id; 
    
    });


    it('Não deve cadastrar aluno que já exista', async () => {        

        const response = await request("http://localhost:3000")
            .post('/api/admin/alunos')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send({
                    nome:  'Ana Souza',
                    email: 'ana.souza@example.com',
                    matricula: '2024001',
                    senha: '123456'
        });
            
        
        expect(response.status).to.equal(409);
        expect(response.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
              
    
    });


    after(async function () {        
                               
     
        await request("http://localhost:3000")
            .delete(`/api/admin/alunos/${idAluno}`)
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json');    
                     
        });

});