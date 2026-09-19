import request from 'supertest';
import { expect } from 'chai';

import app from '../src/app.js';
import { loginComoAdmin, loginComoAluno } from './helpers/auth.helper.js';
import { comDadosUnicos } from './helpers/dados.helper.js';
import massa from './fixtures/fluxo-aluno-trabalho.json' with { type: 'json' };

describe('Fluxo completo: admin cadastra aluno e o aluno entrega um trabalho', () => {
  let admin;
  // Limpo no final para a suíte poder rodar repetidas vezes sem acumular lixo.
  const criados = { alunos: [], trabalhos: [] };

  before(async () => {
    admin = await loginComoAdmin();
  });

  after(async () => {
    for (const trabalhoId of criados.trabalhos) {
      await request(app)
        .delete(`/api/admin/trabalhos/${trabalhoId}`)
        .set('Authorization', admin.authorization);
    }
    for (const alunoId of criados.alunos) {
      await request(app)
        .delete(`/api/admin/alunos/${alunoId}`)
        .set('Authorization', admin.authorization);
    }
  });

  massa.cenarios.forEach(({ cenario, aluno, disciplinaId, trabalho }) => {
    describe(`Cenário: ${cenario}`, () => {
      const dadosAluno = comDadosUnicos(aluno);
      let alunoId;
      let sessaoAluno;
      let trabalhoCriado;

      it('1) o administrador cadastra o aluno', async () => {
        const resposta = await request(app)
          .post('/api/admin/alunos')
          .set('Authorization', admin.authorization)
          .send(dadosAluno);

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({
          nome: dadosAluno.nome,
          email: dadosAluno.email,
          matricula: dadosAluno.matricula,
          role: 'aluno',
        });
        expect(resposta.body).to.have.property('id').that.is.a('string');
        expect(resposta.body).to.not.have.property('senha');

        alunoId = resposta.body.id;
        criados.alunos.push(alunoId);
      });

      it(`2) o administrador matricula o aluno em "${disciplinaId}"`, async () => {
        const resposta = await request(app)
          .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
          .set('Authorization', admin.authorization)
          .send({ alunoId });

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({ alunoId, disciplinaId });
      });

      it('3) o aluno recém-cadastrado consegue fazer login', async () => {
        sessaoAluno = await loginComoAluno(dadosAluno.email, dadosAluno.senha);

        expect(sessaoAluno.token).to.be.a('string').and.not.be.empty;
        expect(sessaoAluno.usuario).to.include({
          id: alunoId,
          nome: dadosAluno.nome,
          email: dadosAluno.email,
          role: 'aluno',
        });
      });

      it('4) o aluno registra a entrega do trabalho', async () => {
        const resposta = await request(app)
          .post(`/api/alunos/${alunoId}/trabalhos`)
          .set('Authorization', sessaoAluno.authorization)
          .send({ ...trabalho, disciplinaId });

        expect(resposta.status).to.equal(201);
        expect(resposta.body).to.include({
          alunoId,
          disciplinaId,
          titulo: trabalho.titulo,
          status: 'entregue',
        });
        expect(resposta.body).to.have.property('id').that.is.a('string');
        expect(resposta.body).to.have.property('dataEntrega').that.is.a('string');
        expect(resposta.body.nota).to.be.null;
        expect(resposta.body.feedback).to.be.null;

        trabalhoCriado = resposta.body;
        criados.trabalhos.push(trabalhoCriado.id);
      });

      it('5) o trabalho entregue aparece na listagem do próprio aluno', async () => {
        const resposta = await request(app)
          .get(`/api/alunos/${alunoId}/trabalhos`)
          .set('Authorization', sessaoAluno.authorization);

        expect(resposta.status).to.equal(200);
        expect(resposta.body).to.be.an('array');

        const ids = resposta.body.map((t) => t.id);
        expect(ids).to.include(trabalhoCriado.id);
      });
    });
  });

  describe('Cadastro de aluno com dados inválidos', () => {
    massa.cadastrosInvalidos.forEach(({ cenario, payload, statusEsperado, erroEsperado }) => {
      it(`deve retornar ${statusEsperado} no cenário: ${cenario}`, async () => {
        const resposta = await request(app)
          .post('/api/admin/alunos')
          .set('Authorization', admin.authorization)
          .send(payload);

        expect(resposta.status).to.equal(statusEsperado);
        expect(resposta.body.error).to.equal(erroEsperado);
      });
    });
  });

  describe('Registro de trabalho com dados inválidos', () => {
    // Aluno dedicado, matriculado SOMENTE em Matemática, para validar a regra de matrícula.
    const dadosAluno = comDadosUnicos({
      nome: 'Gabriela Rocha',
      emailBase: 'gabriela.rocha',
      matriculaBase: '2025104',
      senha: 'senha-gabriela-321',
    });
    let alunoId;
    let sessaoAluno;

    before(async () => {
      const cadastro = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', admin.authorization)
        .send(dadosAluno);
      expect(cadastro.status).to.equal(201);

      alunoId = cadastro.body.id;
      criados.alunos.push(alunoId);

      const matricula = await request(app)
        .post('/api/admin/disciplinas/disciplina-matematica/matriculas')
        .set('Authorization', admin.authorization)
        .send({ alunoId });
      expect(matricula.status).to.equal(201);

      sessaoAluno = await loginComoAluno(dadosAluno.email, dadosAluno.senha);
    });

    massa.trabalhosInvalidos.forEach(({ cenario, payload, statusEsperado, erroEsperado }) => {
      it(`deve retornar ${statusEsperado} no cenário: ${cenario}`, async () => {
        const resposta = await request(app)
          .post(`/api/alunos/${alunoId}/trabalhos`)
          .set('Authorization', sessaoAluno.authorization)
          .send(payload);

        expect(resposta.status).to.equal(statusEsperado);
        expect(resposta.body.error).to.equal(erroEsperado);
      });
    });

    it('deve retornar 403 quando um aluno tentar entregar um trabalho em nome de outro', async () => {
      const resposta = await request(app)
        .post('/api/alunos/aluno-ana-souza/trabalhos')
        .set('Authorization', sessaoAluno.authorization)
        .send({ disciplinaId: 'disciplina-matematica', titulo: 'Trabalho no nome da Ana' });

      expect(resposta.status).to.equal(403);
      expect(resposta.body.error).to.equal('Você só pode acessar os seus próprios dados.');
    });

    it('deve retornar 403 quando o aluno tentar cadastrar outro aluno pela rota de admin', async () => {
      const resposta = await request(app)
        .post('/api/admin/alunos')
        .set('Authorization', sessaoAluno.authorization)
        .send(comDadosUnicos({
          nome: 'Aluno Criado Por Aluno',
          emailBase: 'aluno.por.aluno',
          matriculaBase: '2025105',
          senha: '123456',
        }));

      expect(resposta.status).to.equal(403);
      expect(resposta.body.error).to.equal('Você não tem permissão para acessar este recurso.');
    });
  });
});
