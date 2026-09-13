import { api } from './api.helper.js'
import { comTokenAdmin } from './auth.helper.js'
import { novoAluno } from '../factories/alunos.Factory.js';

export async function criarAluno(dadosAluno) {
    const resposta = await api()
      .post('/api/admin/alunos')
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send(dadosAluno);

    return resposta;

}

export async function criarAlunoFactory() {
    const resposta = await api()
      .post('/api/admin/alunos')
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send(novoAluno());

    return resposta;

}

export default { criarAluno, criarAlunoFactory };

