import app from '../../src/app.js';
import { expect } from 'chai';
import * as sinon from 'sinon';
import authService from '../../src/services/auth.service.js';
import { loginUser } from '../helpers/auth.js';

describe('Login', () => {
  it('should return a valid token for valid credentials', async () => {
    const response = await loginUser(app, 'admin@escola.com', 'admin123');
    expect(response.status).to.equal(200);
  });

  it('should return an error for invalid credentials - empty fields', async () => {
    const response = await loginUser(app, 'admin@escola.com', null);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Os campos "email" e "senha" são obrigatórios.');
  });

  it('should return an error for invalid credentials - wrong password', async () => {
    const response = await loginUser(app, 'admin@escola.com', 'wrongpassword');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error', 'E-mail ou senha inválidos.');
  });

  it('should return an error for invalid credentials - wrong email', async () => {
    const response = await loginUser(app, 'wrong@escola.com', 'admin123');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error', 'E-mail ou senha inválidos.');
  });

  it('should return an 500 error for connection issues', async () => {
    const authServiceMocker = sinon.stub(authService, 'login')
    authServiceMocker.throws(new Error('Conection error'));
    const response = await loginUser(app, 'admin@escola.com', 'admin123');
    expect(response.status).to.equal(500);
    sinon.restore();
  });

});