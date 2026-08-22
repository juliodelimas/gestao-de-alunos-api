import request from 'supertest';
import app from '../src/app.js'; 
import { expect } from 'chai';
import { accessToken } from './utils.js';

describe('POST /alunos', () => {
  it('should create a new student', async () => {
    const token = await accessToken();
    const res = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        nome: 'Joana Damasceno',
        email: 'joana.damasceno@escola.com',
        matricula: '2026001',
        senha: 'joana123',
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });
});

describe('GET /alunos', () => {
  it('should return a list of students', async () => {
    const token = await accessToken();
    const res = await request(app)
      .get('/api/admin/alunos')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    // console.log(res.body);
  });
});

describe('GET /alunos/:id', () => {
  it('should return a student by ID', async () => {
    const id = 'aluno-bruno-lima';
    const token = await accessToken();
    const res = await request(app)
      .get(`/api/admin/alunos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
  });
});