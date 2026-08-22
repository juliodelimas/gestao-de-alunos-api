import request from 'supertest';
import app from '../src/app.js'; 
import { expect } from 'chai';
import { accessToken } from './utils.js';

describe('POST /disciplinas', () => {
  it('should create a new discipline', async () => {
    const token = await accessToken();
    const res = await request(app)
      .post('/api/admin/disciplinas')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({
        nome: 'Testes de API',
        codigo: 'API101',
        cargaHoraria: 60,
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });
});

describe('GET /disciplinas', () => {
  it('should return a list of disciplines', async () => {
    const token = await accessToken();
    const res = await request(app)
      .get('/api/admin/disciplinas')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    // console.log(res.body);
  });
});

describe('GET /disciplinas/:id', () => {
  it('should return a discipline by ID', async () => {
    const id = 'disciplina-programacao-web';
    const token = await accessToken();
    const res = await request(app)
      .get(`/api/admin/disciplinas/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id');
  });
});