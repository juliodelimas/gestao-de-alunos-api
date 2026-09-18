import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../src/config/jwt.js';

export function expectError(response, status, message) {
  expect(response.status).to.equal(status);
  expect(response.headers['content-type']).to.match(/^application\/json\b/);
  expect(response.body).to.deep.equal({ error: message });
}

export function expectLogin(response, identity) {
  expect(response.status).to.equal(200);
  expect(response.headers['content-type']).to.match(/^application\/json\b/);
  expect(response.body).to.have.all.keys('token', 'usuario');
  expect(response.body.token).to.be.a('string').and.not.empty;
  expect(response.body.usuario).to.have.all.keys('id', 'nome', 'email', 'role');
  for (const field of ['id', 'nome', 'email', 'role']) {
    expect(response.body.usuario[field], field).to.be.a('string').and.not.empty;
  }
  expect(response.body.usuario).to.include(identity);
  // Current policy: HS256 and eight hours. Independent expected duration.
  const decoded = jwt.verify(response.body.token, JWT_SECRET, { algorithms: ['HS256'], complete: true,
    issuer: 'gestao-de-alunos-api', audience: 'gestao-de-alunos-client' });
  expect(decoded.header.alg).to.equal('HS256');
  expect(decoded.payload).to.have.all.keys('sub', 'role', 'nome', 'iat', 'exp', 'iss', 'aud');
  expect(decoded.payload).to.include({ sub: response.body.usuario.id,
    role: response.body.usuario.role, nome: response.body.usuario.nome });
  expect(decoded.payload.iat).to.be.a('number');
  expect(decoded.payload.exp).to.be.a('number');
  expect(decoded.payload.exp - decoded.payload.iat).to.equal(8 * 60 * 60);
  return decoded.payload;
}
