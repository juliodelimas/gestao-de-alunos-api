import { expect } from 'chai';
import { getTokenAdmin } from '../helpers/auth.js';
import { getToken } from '../helpers/auth.js';
import 'dotenv/config'
import { api } from '../helpers/api.js';
import alunoData from '../fixtures/aluno.json'  with { type: 'json' };
import disciplinaData from '../fixtures/disciplina.json'  with { type: 'json' };


describe('Registrar entrega de trabalho', () => {

    let idAluno;
    let idDisciplina;       

    it('Admin deve cadastrar um aluno e aluno deve conseguir entregar trabalho', async () => {        

       
        //admin loga e cadastra novo aluno por json
        const responseAluno = await api()
            .post('/api/admin/alunos')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send(alunoData.aluno);          
          
        
        //admin loga e cadastra nova disciplina por json
        const responseDisciplina = await api()
            .post('/api/admin/disciplinas')
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send(disciplinaData.matematica);             

        idDisciplina = responseDisciplina.body.id;
        idAluno = responseAluno.body.id; 


        //admin loga a faz matricula de aluno na disciplina
        const responseMatricula = await api()
            .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
            .set('Authorization', await getTokenAdmin())
            .set('Content-Type', 'application/json')
            .send({
                    "alunoId": `${idAluno}`
        });  
        
        
        //aluno loga e faz entrega de trabalho
        const responseEntrega = await api()
            .post(`/api/alunos/${idAluno}/trabalhos`)
            .set('Authorization', await getToken(alunoData.aluno.email, alunoData.aluno.senha))
            .set('Content-Type', 'application/json')
            .send({
                "disciplinaId": `${idDisciplina}`,
                "titulo": `Entrega do trabalho de ${disciplinaData.matematica.nome}`,
                "descricao": `Trabalho final da disciplina de ${disciplinaData.matematica.nome}`,
            });

            expect(responseEntrega.status).to.equal(201);
            expect(responseEntrega.body.alunoId).to.equal(idAluno);
            expect(responseEntrega.body.disciplinaId).to.equal(idDisciplina); 
            expect(responseEntrega.body.titulo).to.equal(`Entrega do trabalho de ${disciplinaData.matematica.nome}`);
            expect(responseEntrega.body.descricao).to.equal(`Trabalho final da disciplina de ${disciplinaData.matematica.nome}`);
            expect(responseEntrega.body.status).to.equal("entregue");   
           
  
    
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