import request from 'supertest';
import app from '../../src/app.js';

const ROTA_LOGIN = '/api/auth/login';

/** Login cru, sem asserções — para os testes que precisam checar 400/401. */
export function login(credenciais) {
  return request(app).post(ROTA_LOGIN).send(credenciais);
}

// Falha alto e com contexto: um erro de setup vira uma mensagem clara aqui, em vez de um
// 401 confuso vários passos adiante.
async function autenticar(email, senha, descricao) {
  const resposta = await login({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha ao autenticar ${descricao} (${email}): esperado 200, recebido ${resposta.status}. ` +
        `Corpo: ${JSON.stringify(resposta.body)}`,
    );
  }

  return {
    token: resposta.body.token,
    usuario: resposta.body.usuario,
    authorization: `Bearer ${resposta.body.token}`,
  };
}

/** Helper de login do administrador. Credenciais vêm do .env, com o admin do seed como padrão. */
export function loginComoAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@escola.com';
  const senha = process.env.ADMIN_SENHA || 'admin123';
  return autenticar(email, senha, 'o administrador');
}

/** Helper de login do aluno. Recebe credenciais porque cada teste usa um aluno diferente. */
export function loginComoAluno(email, senha) {
  return autenticar(email, senha, 'o aluno');
}

export default { login, loginComoAdmin, loginComoAluno };
