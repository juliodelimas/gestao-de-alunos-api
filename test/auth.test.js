import { expect } from 'chai';

import { login, loginComoAdmin } from './helpers/auth.helper.js';
import massa from './fixtures/logins.json' with { type: 'json' };

describe('POST /api/auth/login', () => {
  describe('Credenciais válidas', () => {
    massa.validos.forEach(({ cenario, email, senha, roleEsperado, nomeEsperado }) => {
      it(`deve retornar 200 e um token para ${cenario}`, async () => {
        const resposta = await login({ email, senha });

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.have.property('token').that.is.a('string').and.not.be.empty;
        expect(resposta.body.usuario).to.include({
          email,
          role: roleEsperado,
          nome: nomeEsperado,
        });
        expect(resposta.body.usuario).to.not.have.property('senha');
      });
    });
  });

  describe('Credenciais inválidas', () => {
    massa.invalidos.forEach(({ cenario, email, senha, statusEsperado, erroEsperado }) => {
      it(`deve retornar ${statusEsperado} no cenário: ${cenario}`, async () => {
        const resposta = await login({ email, senha });

        expect(resposta.status).to.equal(statusEsperado);
        expect(resposta.body.error).to.equal(erroEsperado);
        expect(resposta.body).to.not.have.property('token');
      });
    });
  });

  describe('Helper de login do administrador', () => {
    it('deve autenticar o admin e devolver token, usuário e o header Authorization pronto', async () => {
      const sessao = await loginComoAdmin();

      expect(sessao.token).to.be.a('string').and.not.be.empty;
      expect(sessao.usuario.role).to.equal('admin');
      expect(sessao.authorization).to.equal(`Bearer ${sessao.token}`);
    });
  });
});
