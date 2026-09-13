import { api } from './api.helper.js'
import 'dotenv/config'

let tokenEmCache = null

export async function comTokenAdmin() {
  if (!tokenEmCache) { 
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: process.env.ADMIN_EMAIL,
          senha: process.env.ADMIN_SENHA
        });

      tokenEmCache = loginResposta.body.token;
  }
  return `Bearer ${tokenEmCache}`;

}

export async function gerarToken(dados) {
    const loginResposta = await api()
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send(dados);

    return loginResposta.body.token;

}

export default { comTokenAdmin, gerarToken };