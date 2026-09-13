import { api } from './api.helper.js'
import { comTokenAdmin } from './auth.helper.js'

export async function cadastrarNota(dadosNota) {
    const resposta = await api()
      .post('/api/admin/notas')
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send(dadosNota);

    return resposta;

}

export default { cadastrarNota };

