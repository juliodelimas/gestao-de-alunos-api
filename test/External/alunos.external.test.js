import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { gerarToken } from '../helpers/auth.helper.js'

describe('Cadastro de Aluno', () => {
  after(async () => { 
    await mongoose.connection.close(); 
  });

  let token;

  beforeEach(async () => {
    token = await gerarToken('admin@escola.com', 'admin123')
  })

  it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Fabio Souza4', 
            email: 'fsouza4@example.com',
            matricula: '202619814', 
            senha: '123456'  
        });
           
    //Validar que ele foi cadastrado
    expect(cadatroAlunoResposta.status).to.equal(201);
    expect(cadatroAlunoResposta.body.nome).to.equal('Fabio Souza4');
    expect(cadatroAlunoResposta.body.email).to.equal('fsouza4@example.com');
    expect(cadatroAlunoResposta.body.matricula).to.equal('202619814');

  });

  it('Não deve cadastrar um aluno quando não passar o token', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer `)
        .send({ 
            nome: 'Fabio Souzaa', 
            email: 'fsouzaa@example.com',
            matricula: '20261981', 
            senha: '123456'  
        });
        
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(401);
    expect(cadatroAlunoResposta.body.error).to.equal('Token de autenticação não informado.');

  });

  it('Não deve cadastrar um aluno quando passar um token inválido', async () => {
    //Obter o token
    const tokenInvalido = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenInvalido}`)
        .send({ 
            nome: 'Fabio Souzaa', 
            email: 'fsouzaa@example.com',
            matricula: '20261981', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(401);
    expect(cadatroAlunoResposta.body.error).to.equal('Token de autenticação inválido ou expirado.');

  });

  it('Não deve cadastrar um aluno quando passar um token expirado', async () => {
    //Obter o token
    const tokenExpirado = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1wcmluY2lwYWwiLCJyb2xlIjoiYWRtaW4iLCJub21lIjoiQWRtaW5pc3RyYWRvciBkbyBTaXN0ZW1hIiwiaWF0IjoxNzg4NTY1MzA5LCJleHAiOjE3ODg1OTQxMDl9.xPMS5AmZzA4D9rxajhcYfXZw85qb9HP3PUwzQ9Jr8qw';

    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenExpirado}`)
        .send({ 
            nome: 'Fabio Souzaa', 
            email: 'fsouzaa@example.com',
            matricula: '20261981', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(401);
    expect(cadatroAlunoResposta.body.error).to.equal('Token de autenticação inválido ou expirado.');

  });

  it('Não deve cadastrar um aluno com a mesma matricula de um outro aluno', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Ana Souza', 
            email: 'anasouza@example.com',
            matricula: '2024001', 
            senha: '123456'  
        });
    
    //Validar que ele foi cadastrado
    expect(cadatroAlunoResposta.status).to.equal(409);
    expect(cadatroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

  });

  it('Não deve cadastrar um aluno com o mesmo email de um outro aluno', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Ana Souza', 
            email: 'ana.souza@example.com',
            matricula: '2024002', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(409);
    expect(cadatroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

  });

  it('Não deve cadastrar um aluno quando não informar o nome', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: '', 
            email: 'teste@example.com',
            matricula: '202400211', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(400);
    expect(cadatroAlunoResposta.body.error).to.equal('Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');

  });

  it('Não deve cadastrar um aluno quando não informar o email', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Bruna Teixeira', 
            email: '',
            matricula: '202400211', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(400);
    expect(cadatroAlunoResposta.body.error).to.equal('Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');

  });

  it('Não deve cadastrar um aluno quando não informar a matricula', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Bruna Teixeira', 
            email: 'bruna.terixeira@example.com',
            matricula: '', 
            senha: '123456'  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(400);
    expect(cadatroAlunoResposta.body.error).to.equal('Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');

  });

  it('Não deve cadastrar um aluno quando não informar a senha', async () => {
    //Cadastrar aluno
    const cadatroAlunoResposta = await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            nome: 'Bruna Teixeira', 
            email: 'bruna.terixeira@example.com',
            matricula: '123456', 
            senha: ''  
        });
    
    //Validações
    expect(cadatroAlunoResposta.status).to.equal(400);
    expect(cadatroAlunoResposta.body.error).to.equal('Os campos "nome", "email", "matricula" e "senha" são obrigatórios.');

  });

});
