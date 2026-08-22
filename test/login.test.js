import request from 'supertest';
import app from '../src/app.js'; 
import { expect } from 'chai';

describe('POST /login', () => {
  it('should return 200 and a token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
            email: 'admin@escola.com', 
            senha: 'admin123' 
        });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

    it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
            email: 'invalid@escola.com', 
            senha: 'invalid123' 
        });
    
    expect(res.status).to.equal(401);
  });

  it('should return 400 for missing email or password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ 
            email: '', 
            senha: 'admin123' 
        });
    
    expect(res.status).to.equal(400);
  });
});