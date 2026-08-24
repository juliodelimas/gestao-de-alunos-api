import request from 'supertest';
import { expect } from 'chai';

describe('Alunos', () => {
  it.only('should sign up a new student', async () => {
    const loginResponse = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 'email': 'admin@escola.com', 'senha': 'admin123' })

    const alunoResponse = await request('http://localhost:3000')
      .post('/api/admin/alunos')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        'nome': 'Ana Souza',
        'email': 'anes.suza@example.com',
        'matricula': '12321321',
        'senha': '123456'
      })
    
    expect(alunoResponse.status).to.equal(201);
    expect(alunoResponse.body).to.have.property('nome', 'Ana Souza');
    expect(alunoResponse.body).to.have.property('role', 'aluno');
  })
});