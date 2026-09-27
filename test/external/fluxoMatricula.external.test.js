import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import 'dotenv/config'
import { api } from '../helpers/api.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinaFactory.js';

describe('Fluxo matricula de aluno', () => {

    let idAluno;
    let idDisciplina;       

    it('Deve matricular um aluno em uma disciplina', async () => {        

        const responseAluno = await api()
            .post('/api/admin/alunos')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send(novoAluno());          
              
        const responseDisciplina = await api()
            .post('/api/admin/disciplinas')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send(novaDisciplina());             

        idDisciplina = responseDisciplina.body.id;
        idAluno = responseAluno.body.id; 
 
        const responseMatricula = await api()
            .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send({
                    "alunoId": `${idAluno}`
        });     
       
        expect(responseMatricula.status).to.equal(201);
        expect(responseMatricula.body.alunoId).to.equal(idAluno);
        expect(responseMatricula.body.disciplinaId).to.equal(idDisciplina);      
  
    
    });


    after(async function () {           
        
        await api()
            .delete(`/api/admin/disciplinas/${idDisciplina}`)
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json');  
       
 
        await api()
            .delete(`/api/admin/alunos/${idAluno}`)
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json');     
          
   
    });
    
});