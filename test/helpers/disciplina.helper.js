import { api } from './api.helper.js'
import { comTokenAdmin } from './auth.helper.js'
import { novaDisciplina } from '../factories/disciplina.factory.js';

export async function criarDisciplina(dadosDisciplina) {
    const resposta = await api()
      .post('/api/admin/disciplinas')
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send(dadosDisciplina);

    return resposta;

}

export async function criarDisciplinaFactory() {
    const resposta = await api()
      .post('/api/admin/disciplinas')
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send(novaDisciplina());

    return resposta;
}

export async function matricularAlunoDisciplina(idDisciplina, idAluno) {
    const resposta = await api()
      .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
      .set('Content-Type', 'application/json')
      .set('Authorization', await comTokenAdmin())
      .send({ 
          alunoId: `${idAluno}`
      });

    return resposta;

}

export default { criarDisciplina, criarDisciplinaFactory, matricularAlunoDisciplina };