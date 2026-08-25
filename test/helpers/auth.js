import request from 'supertest';

export async function loginUser(app, email, senha) {
  return await request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });
}